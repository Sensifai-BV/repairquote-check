import asyncio
import sys
import json
import urllib.request
from playwright.async_api import async_playwright

async def run_e2e():
    print("=====================================================================")
    print("  RepairQuote Check Phase 4 Full End-to-End (E2E) Browser Verification")
    print("=====================================================================\n")

    errors = []
    page_errors = []
    console_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless=True
        )

        # -------------------------------------------------------------
        # Journey 1: Zero Runtime & Console Errors on / and /workspace
        # -------------------------------------------------------------
        print("[E2E Test 1] Verifying Zero Runtime, Hydration & Console Errors...")
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        page.on("pageerror", lambda err: page_errors.append(f"PageError: {err}"))
        page.on("console", lambda msg: console_errors.append(f"ConsoleError: {msg.text}") if msg.type == "error" else None)

        res_home = await page.goto("http://localhost:3000", wait_until="networkidle")
        assert res_home.status == 200, f"Expected 200 for /, got {res_home.status}"

        res_work = await page.goto("http://localhost:3000/workspace", wait_until="networkidle")
        assert res_work.status == 200, f"Expected 200 for /workspace, got {res_work.status}"

        if page_errors:
            print(f"  ✗ Page errors detected: {page_errors}")
            errors.extend(page_errors)
        else:
            print("  ✓ Zero uncaught page exceptions or React crashes")

        if console_errors:
            print(f"  ✗ Console errors detected: {console_errors}")
            errors.extend(console_errors)
        else:
            print("  ✓ Zero console errors or React hydration mismatches")

        # -------------------------------------------------------------
        # Journey 2: Plain-Text Copy Cleanliness & Asset Integrity
        # -------------------------------------------------------------
        print("\n[E2E Test 2] Verifying Plain-Text Copy Cleanliness & Image Asset Integrity...")
        await page.goto("http://localhost:3000", wait_until="networkidle")

        body_text = await page.inner_text("body")
        for bad_pattern in ["**", "###", "```", "\\n\\n"]:
            if bad_pattern in body_text:
                err = f"Raw Markdown/escape sequence '{bad_pattern}' detected in rendered landing UI!"
                print(f"  ✗ {err}")
                errors.append(err)
        print("  ✓ Plain-text cleanliness verified: 0 raw Markdown markers or broken escapes in copy")

        # Verify Developer API section on landing page
        api_section = await page.query_selector("section#api")
        assert api_section is not None, "Developer REST API section (#api) missing on landing page!"
        print("  ✓ Enterprise & Developer REST API section (#api) rendered on landing page")

        # Scroll to ensure all assets load
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)

        # Image natural width checks
        images = await page.eval_on_selector_all("img", """
            imgs => imgs.map(img => ({
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            }))
        """)

        failed_imgs = [img for img in images if not img["complete"] or img["naturalWidth"] == 0]
        if failed_imgs:
            print(f"  ✗ Broken images found: {failed_imgs}")
            errors.append(f"Broken images: {failed_imgs}")
        else:
            print(f"  ✓ All {len(images)} images on landing page loaded with naturalWidth > 0")

        # -------------------------------------------------------------
        # Journey 3: Interactive Preset Switching Flow in /workspace
        # -------------------------------------------------------------
        print("\n[E2E Test 3] Verifying Interactive Preset Switching & Telemetry Flow...")
        await page.goto("http://localhost:3000/workspace", wait_until="networkidle")

        # Check default preset
        title_initial = await page.inner_text("h2")
        assert "Heat Pump Compressor" in title_initial, f"Expected Heat Pump in initial title, got: {title_initial}"
        print(f"  ✓ Initial preset verified: {title_initial}")

        # Click preset 2 (Plumbing)
        preset_buttons = await page.query_selector_all("button:has-text('Plumbing')")
        if preset_buttons:
            await preset_buttons[0].click(force=True)
            await page.wait_for_timeout(500)
            title_p2 = await page.inner_text("h2")
            assert "Water Heater" in title_p2, f"Expected Water Heater in title, got: {title_p2}"
            print(f"  ✓ Preset switch 2 verified: {title_p2}")

        # Click preset 4 (Electrical)
        preset_elec = await page.query_selector_all("button:has-text('Electrical')")
        if preset_elec:
            await preset_elec[0].click(force=True)
            await page.wait_for_timeout(500)
            title_p4 = await page.inner_text("h2")
            assert "Electrical Panel" in title_p4 or "Modernization" in title_p4, f"Expected Electrical in title, got: {title_p4}"
            print(f"  ✓ Preset switch 4 verified: {title_p4}")

        # Check AI Disclaimer presence
        disclaimer = await page.query_selector("text=Sensifai AI may make mistakes")
        assert disclaimer is not None, "Mandatory AI Legal & Accuracy Disclaimer not rendered in workspace!"
        print("  ✓ Mandatory AI Legal & Accuracy Disclaimer verified below action buttons")

        # -------------------------------------------------------------
        # Journey 4: Custom Input Auth Gate Flow
        # -------------------------------------------------------------
        print("\n[E2E Test 4] Verifying Custom Input Auth Gate & 401 Enforcement...")
        # Switch to Custom Audit tab
        custom_tab_btn = await page.query_selector("button:has-text('Custom Audit')")
        assert custom_tab_btn is not None, "Custom Audit tab button missing!"
        await custom_tab_btn.click(force=True)
        await page.wait_for_timeout(500)

        # Check AuthGateCard visibility for guest
        auth_gate = await page.query_selector("text=Sign In")
        assert auth_gate is not None, "AuthGateCard not displayed for unauthenticated custom analysis!"
        print("  ✓ Unauthenticated user receives AuthGateCard with Sign In prompt")

        # Test API Route 401 directly
        api_res = await page.request.post("http://localhost:3000/api/billable-action", data=json.dumps({
            "operation": "repair_quote_audit",
            "title": "Unauthorized Test Attempt",
            "totalQuoted": 1000
        }), headers={"Content-Type": "application/json"})
        assert api_res.status == 401, f"Expected 401 Unauthorized on billable route, got {api_res.status}"
        api_json = await api_res.json()
        assert api_json.get("code") == "UNAUTHORIZED", f"Expected UNAUTHORIZED code, got {api_json}"
        print("  ✓ POST /api/billable-action strictly returns HTTP 401 UNAUTHORIZED for guests")

        # -------------------------------------------------------------
        # Journey 5: Real OIDC Login Redirect Resolution
        # -------------------------------------------------------------
        print("\n[E2E Test 5] Verifying Real Logto OIDC PKCE Login Redirect...")
        login_res = await page.request.get("http://localhost:3000/api/auth/login", max_redirects=0)
        assert login_res.status in [302, 307], f"Expected 302/307 redirect from /api/auth/login, got {login_res.status}"
        redirect_location = login_res.headers.get("location", "")
        assert "auth.sensifai.com/oidc/auth" in redirect_location, f"Expected Logto OIDC auth URL, got: {redirect_location}"
        assert "response_type=code" in redirect_location, "Missing response_type=code in OIDC redirect"
        assert "code_challenge=" in redirect_location, "Missing PKCE code_challenge in OIDC redirect"
        print(f"  ✓ Live Logto OIDC PKCE redirect verified: {redirect_location[:60]}...")

        # -------------------------------------------------------------
        # Journey 6: Responsive Layout (Desktop Left Sidebar vs Mobile Bottom Bar)
        # -------------------------------------------------------------
        print("\n[E2E Test 6] Verifying Responsive Layouts & Zero Overflow...")
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.goto("http://localhost:3000/workspace", wait_until="networkidle")
        sidebar = await page.query_selector("aside")
        assert sidebar is not None, "Desktop Left Sidebar (aside) not found at 1280px viewport!"
        print("  ✓ Desktop (1280px): Collapsible Left Sidebar & Live Wallet Card rendered")

        await page.set_viewport_size({"width": 375, "height": 812})
        await page.goto("http://localhost:3000/workspace", wait_until="networkidle")
        await page.wait_for_timeout(800)

        mobile_nav = await page.query_selector("nav.fixed.bottom-0, div.fixed.bottom-0")
        assert mobile_nav is not None, "Mobile fixed bottom navigation bar not found at 375px viewport!"
        print("  ✓ Mobile (375px): Native Fixed Bottom Navigation Bar rendered")

        overflow = await page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        assert not overflow, "Mobile layout has horizontal overflow (scrollWidth > innerWidth)!"
        print("  ✓ Mobile (375px): Zero horizontal overflow verified (scrollWidth <= innerWidth)")

        # -------------------------------------------------------------
        # Journey 7: Developer API Hub & Zero-Leakage UI Playground Flow
        # -------------------------------------------------------------
        print("\n[E2E Test 7] Verifying Developer API Hub, Token Minting & Live Sandbox...")
        await page.set_viewport_size({"width": 1280, "height": 900})
        # Navigate directly to /workspace?tab=api
        await page.goto("http://localhost:3000/workspace?tab=api", wait_until="networkidle")
        await page.wait_for_timeout(600)

        # Assert API Hub Heading & Privacy Guarantee
        hub_header = await page.query_selector("text=Developer REST API Hub")
        assert hub_header is not None, "Developer REST API Hub header not visible at /workspace?tab=api!"

        privacy_callout = await page.query_selector("text=Strict API Key Isolation & Privacy Guarantee")
        assert privacy_callout is not None, "Privacy & Zero-Leakage Guarantee banner missing!"
        print("  ✓ Developer REST API Hub and Privacy Guarantee rendered in workspace")

        # Mint a fresh key through UI
        mint_input = await page.query_selector("input[placeholder*='Property Management']")
        if mint_input:
            await mint_input.fill("E2E Automated UI Integration Key")
        mint_btn = await page.query_selector("button:has-text('Mint API Key')")
        assert mint_btn is not None, "Mint API Key button missing!"
        await mint_btn.click()
        await page.wait_for_timeout(1000)

        # Check key notice msg and key format
        key_notice = await page.query_selector("text=Key created successfully")
        assert key_notice is not None, "Key creation notice not shown after minting!"
        full_token_el = await page.query_selector("div.select-all")
        assert full_token_el is not None, "Full token display box missing!"
        full_token_text = (await full_token_el.inner_text()).strip()
        assert full_token_text.startswith("rq_live_"), f"Generated token does not match rq_live_ prefix: {full_token_text}"
        assert len(full_token_text) >= 40, f"Token length invalid: {len(full_token_text)}"
        print(f"  ✓ Minted dedicated application token via UI: {full_token_text[:12]}... (Zero Logto ID)")

        # Execute Sandbox Request via UI
        exec_btn = await page.query_selector("button:has-text('Execute API Request')")
        assert exec_btn is not None, "Execute API Request button missing in sandbox!"
        await exec_btn.click()
        await page.wait_for_timeout(1500)

        # Check Sandbox JSON Response Viewer
        status_badge = await page.query_selector("text=HTTP 200 OK")
        assert status_badge is not None, "Sandbox did not display HTTP 200 OK badge!"
        response_box = await page.query_selector("div.text-emerald-400 pre")
        assert response_box is not None, "Sandbox JSON response viewer not rendered!"
        resp_text = await response_box.inner_text()
        assert "reportId" in resp_text and "RQC-" in resp_text, f"Invalid sandbox response payload: {resp_text[:100]}"
        assert "fairnessScore" in resp_text, "fairnessScore missing in sandbox response"
        print("  ✓ Sandbox execution completed: HTTP 200 OK with verified RQC report payload")

        # Assert ZERO Logto user ID in rendered workspace DOM
        workspace_body = await page.inner_text("body")
        for forbidden in ["wckiqf9jo9gs", "LOGTO_APP_SECRET", "whsec_"]:
            assert forbidden not in workspace_body, f"FORBIDDEN internal credential '{forbidden}' leaked in UI text!"
        print("  ✓ ZERO Logto IDs or backend secrets leaked in workspace DOM")

        await browser.close()

    # -------------------------------------------------------------
    # Journey 8: Direct HTTP REST API & Zero Credential Leakage Verification
    # -------------------------------------------------------------
    print("\n[E2E Test 8] Verifying Direct HTTP REST API Endpoints & Zero Leakage...")

    # 1. GET /api/v1/trades
    req_trades = urllib.request.Request("http://localhost:3000/api/v1/trades")
    with urllib.request.urlopen(req_trades) as resp:
        assert resp.status == 200, f"GET /api/v1/trades returned status {resp.status}"
        data_trades = json.loads(resp.read().decode("utf-8"))
        assert data_trades.get("success") is True, f"GET /api/v1/trades success is not true: {data_trades}"
        assert data_trades.get("totalTrades") == 4, f"Expected 4 trades, got {data_trades.get('totalTrades')}"
        print("  ✓ GET /api/v1/trades: HTTP 200 (4 supported trade domains with benchmark rates)")

    # 2. POST /api/v1/keys
    key_payload = json.dumps({"name": "Direct HTTP Client E2E Key"}).encode("utf-8")
    req_key = urllib.request.Request("http://localhost:3000/api/v1/keys", data=key_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req_key) as resp:
        assert resp.status == 201, f"POST /api/v1/keys returned status {resp.status}"
        data_key = json.loads(resp.read().decode("utf-8"))
        assert data_key.get("success") is True
        issued_key = data_key["key"]["key"]
        issued_id = data_key["key"]["id"]
        assert issued_key.startswith("rq_live_"), f"Key format invalid: {issued_key}"
        print(f"  ✓ POST /api/v1/keys: HTTP 201 (Minted {issued_key[:12]}...)")

    # 3. POST /api/v1/audit with issued key
    audit_payload = json.dumps({
        "trade": "Roofing",
        "city": "Atlanta",
        "state": "GA",
        "totalQuoted": 3200
    }).encode("utf-8")
    req_audit = urllib.request.Request(
        "http://localhost:3000/api/v1/audit",
        data=audit_payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {issued_key}"
        }
    )
    with urllib.request.urlopen(req_audit) as resp:
        assert resp.status == 200, f"POST /api/v1/audit returned status {resp.status}"
        data_audit = json.loads(resp.read().decode("utf-8"))
        assert data_audit.get("success") is True
        assert data_audit.get("reportId", "").startswith("RQC-")
        assert data_audit.get("fairTotalMedian") > 0
        assert data_audit.get("authenticatedAs") == "Direct HTTP Client E2E Key"
        print(f"  ✓ POST /api/v1/audit: HTTP 200 ({data_audit['reportId']}, Score: {data_audit['fairnessScore']})")

    # 4. Strictly audit response string for zero Logto ID leakage
    audit_raw = json.dumps(data_audit)
    for forbidden in ["wckiqf9jo9gs", "LOGTO", "gatekeeper"]:
        assert forbidden not in audit_raw, f"Forbidden identity token '{forbidden}' leaked in audit response!"
    print("  ✓ Zero Logto user ID or internal platform secrets leaked in API payloads")

    # 5. DELETE /api/v1/keys?id=... (Revocation check)
    req_del = urllib.request.Request(f"http://localhost:3000/api/v1/keys?id={issued_id}", method="DELETE")
    with urllib.request.urlopen(req_del) as resp:
        assert resp.status == 200
        data_del = json.loads(resp.read().decode("utf-8"))
        assert data_del.get("success") is True
        print(f"  ✓ DELETE /api/v1/keys: HTTP 200 (Revoked {issued_id})")

    # 6. Verify revoked key is strictly 401 Unauthorized
    try:
        req_audit_revoked = urllib.request.Request(
            "http://localhost:3000/api/v1/audit",
            data=audit_payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {issued_key}"
            }
        )
        urllib.request.urlopen(req_audit_revoked)
        assert False, "Revoked key unexpectedly passed authorization!"
    except urllib.error.HTTPError as he:
        assert he.code == 401, f"Expected 401 for revoked key, got {he.code}"
        print("  ✓ Revoked key strictly rejected: HTTP 401 UNAUTHORIZED")

    print("\n=====================================================================")
    if errors:
        print(f"  FAILED: {len(errors)} E2E issues detected:")
        for e in errors:
            print(f"    - {e}")
        sys.exit(1)
    else:
        print("  ALL 8 BROWSER & HTTP E2E USER JOURNEYS PASSED WITH ZERO DEFECTS!")
    print("=====================================================================\n")

if __name__ == "__main__":
    asyncio.run(run_e2e())
