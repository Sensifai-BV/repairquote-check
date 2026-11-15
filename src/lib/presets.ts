export interface QuoteLineItem {
  id: string;
  category: "labor" | "materials" | "permits_fees" | "diagnostic" | "misc";
  description: string;
  quotedPrice: number;
  fairPriceLow: number;
  fairPriceHigh: number;
  fairPriceMedian: number;
  status: "fair" | "padded" | "unnecessary_upsell" | "duplicate";
  confidence: number;
  notes: string;
}

export interface NegotiationQuestion {
  question: string;
  rationale: string;
  expectedAnswer: string;
}

export interface RepairQuotePreset {
  id: string;
  title: string;
  trade: "HVAC" | "Plumbing" | "Roofing" | "Electrical" | "General Contracting";
  city: string;
  state: string;
  contractorName: string;
  quoteDate: string;
  damagePhotoUrl: string;
  quoteDocumentType: "PDF Estimate" | "Photo Invoice" | "Digital Proposal";
  totalQuoted: number;
  fairTotalLow: number;
  fairTotalHigh: number;
  fairTotalMedian: number;
  potentialSavings: number;
  fairnessScore: number; // 0 - 100
  verdictTone: "fair" | "warning" | "alert";
  verdictHeadline: string;
  visibleScopeAnalysis: {
    photoEvidenceObserved: string;
    verifiedDefect: string;
    unwarrantedWorkDetected: string;
    confidenceScore: number;
  };
  lineItems: QuoteLineItem[];
  paddedFlags: {
    title: string;
    severity: "low" | "medium" | "high";
    explanation: string;
  }[];
  negotiationScript: {
    recommendedCounterOffer: number;
    openingLine: string;
    questionsToAsk: NegotiationQuestion[];
    secondQuoteRecommended: boolean;
  };
  secondQuoteGuidance: {
    recommended: boolean;
    reason: string;
    targetQuotesCount: number;
  };
}

export const REPAIR_PRESETS: RepairQuotePreset[] = [
  {
    id: "case-hvac-compressor",
    title: "Residential Heat Pump Compressor Replacement",
    trade: "HVAC",
    city: "Dallas",
    state: "TX",
    contractorName: "Lone Star Express Air Heating & Cooling",
    quoteDate: "2026-11-12",
    damagePhotoUrl: "/images/feature-1.jpg",
    quoteDocumentType: "PDF Estimate",
    totalQuoted: 4850,
    fairTotalLow: 2100,
    fairTotalHigh: 2800,
    fairTotalMedian: 2450,
    potentialSavings: 2400,
    fairnessScore: 38,
    verdictTone: "alert",
    verdictHeadline: "Severely Inflated Labor & Redundant Line Flush",
    visibleScopeAnalysis: {
      photoEvidenceObserved:
        "External condenser unit shows minor contactor pitting and capacitor bulge. Hermetic compressor terminals show normal resistance readings without terminal blowout or ground burn.",
      verifiedDefect: "Run capacitor failure (45/5 MFD) and pitted contactor switch preventing compressor startup.",
      unwarrantedWorkDetected:
        "Full compressor replacement ($1,400 unit + $1,800 labor) quoted despite compressor windings testing intact. Dual line-set flush quoted for a closed R-410A system that suffered no motor burnout.",
      confidenceScore: 0.96,
    },
    lineItems: [
      {
        id: "li-1",
        category: "materials",
        description: "3-Ton Scroll Compressor OEM Replacement Part",
        quotedPrice: 1400,
        fairPriceLow: 750,
        fairPriceHigh: 950,
        fairPriceMedian: 850,
        status: "unnecessary_upsell",
        confidence: 0.94,
        notes: "OEM wholesale cost is $680. Quoted part markup exceeds 105% and existing compressor is likely functional.",
      },
      {
        id: "li-2",
        category: "labor",
        description: "Refrigerant Recovery, Brazing & Compressor Installation Labor (8 hrs)",
        quotedPrice: 1800,
        fairPriceLow: 700,
        fairPriceHigh: 1100,
        fairPriceMedian: 900,
        status: "padded",
        confidence: 0.95,
        notes: "Standard trade labor book specifies 3.5 to 4.5 hours for single-technician condenser compressor swap.",
      },
      {
        id: "li-3",
        category: "labor",
        description: "Liquid & Suction Line Chemical Acid Flush & Nitrogen Purge",
        quotedPrice: 650,
        fairPriceLow: 150,
        fairPriceHigh: 250,
        fairPriceMedian: 200,
        status: "duplicate",
        confidence: 0.92,
        notes: "Acid flush is only required after catastrophic motor burnout with oil contamination. Visual tests show oil is clear.",
      },
      {
        id: "li-4",
        category: "materials",
        description: "EPA Refrigerant Reclamation Fee & R-410A Top-Up (6 lbs)",
        quotedPrice: 400,
        fairPriceLow: 120,
        fairPriceHigh: 200,
        fairPriceMedian: 160,
        status: "padded",
        confidence: 0.93,
        notes: "Refrigerant billed at $66/lb; regional wholesale price is $14/lb and clean refrigerant can be reclaimed and reused.",
      },
      {
        id: "li-5",
        category: "permits_fees",
        description: "Same-Day Emergency Dispatch & Diagnostic Surcharge",
        quotedPrice: 600,
        fairPriceLow: 0,
        fairPriceHigh: 150,
        fairPriceMedian: 95,
        status: "padded",
        confidence: 0.98,
        notes: "Dispatch occurred during regular weekday operating hours (1:45 PM). Surcharge should be waived against approved repairs.",
      },
    ],
    paddedFlags: [
      {
        title: "Unverified Compressor Replacement",
        severity: "high",
        explanation:
          "Photo diagnostics demonstrate contactor and dual capacitor failure. The $3,200 compressor overhaul is unwarranted before testing a $180 capacitor and contactor replacement.",
      },
      {
        title: "Labor Hours Inflated by 80%",
        severity: "high",
        explanation:
          "Eight labor hours quoted at $225 per hour. Regional Dallas HVAC journeyman rate ranges from $115 to $150 per hour for 4 hours maximum.",
      },
      {
        title: "Redundant Chemical Flush Charge",
        severity: "medium",
        explanation:
          "Line flush billed at $650 is redundant when nitrogen purging is already integrated into the standard evacuation and vacuum procedure.",
      },
    ],
    negotiationScript: {
      recommendedCounterOffer: 2450,
      openingLine:
        "Thank you for the estimate. I had our engineering team benchmark the line items against Dallas regional trade averages and would like to clarify three specific items before authorizing work.",
      questionsToAsk: [
        {
          question: "Can you provide the megohmmeter winding insulation test reading confirming the compressor has shorted to ground?",
          rationale: "If the compressor windings are not grounded, replacing the $180 capacitor will resolve the issue without replacing the compressor.",
          expectedAnswer: "Technician should show multimeter resistance readings across common, run, and start terminals.",
        },
        {
          question: "Your estimate lists 8 labor hours for installation. Standard RSMeans and ACCA labor guidelines allocate 4 hours for this unit. Can you itemize the additional 4 hours?",
          rationale: "Contractors frequently pad flat-rate labor. Asking for an itemized breakdown forces them into realistic hourly billing.",
          expectedAnswer: "Adjusting labor down to actual 4.5 hours with a savings of $800 to $1,000.",
        },
        {
          question: "Can we apply the $600 diagnostic dispatch fee toward the labor total as customary for repairs over $1,000?",
          rationale: "Standard home services practice credits dispatch fees when major work is accepted.",
          expectedAnswer: "Full or 75% credit of the dispatch surcharge.",
        },
      ],
      secondQuoteRecommended: true,
    },
    secondQuoteGuidance: {
      recommended: true,
      reason: "Potential savings of $2,400 exceed 45% of total quote value. High probability of misdiagnosis.",
      targetQuotesCount: 2,
    },
  },
  {
    id: "case-plumbing-waterheater",
    title: "50-Gallon Atmospheric Gas Water Heater Replacement",
    trade: "Plumbing",
    city: "Seattle",
    state: "WA",
    contractorName: "Cascade Premier Plumbing & Drains",
    quoteDate: "2026-11-14",
    damagePhotoUrl: "/images/feature-2.jpg",
    quoteDocumentType: "Photo Invoice",
    totalQuoted: 3200,
    fairTotalLow: 1650,
    fairTotalHigh: 2150,
    fairTotalMedian: 1850,
    potentialSavings: 1350,
    fairnessScore: 52,
    verdictTone: "warning",
    verdictHeadline: "Marked-Up Municipal Permit & Duplicate Haul-Away Fee",
    visibleScopeAnalysis: {
      photoEvidenceObserved:
        "Tank base reveals rust streaks along lower burner door. TPR valve drain tube shows active water scale discharge. Existing thermal expansion tank appears structurally sound with no bladder deflation.",
      verifiedDefect: "Internal tank glass lining failure causing base condensation and weeping tank seam.",
      unwarrantedWorkDetected:
        "Replacement thermal expansion tank billed at $450 when existing tank tests at 55 PSI matching household water supply. Municipal permit fee marked up 310% above King County fee schedule.",
      confidenceScore: 0.95,
    },
    lineItems: [
      {
        id: "li-10",
        category: "materials",
        description: "Bradford White 50-Gal Atmospheric Natural Gas Water Heater",
        quotedPrice: 1250,
        fairPriceLow: 780,
        fairPriceHigh: 950,
        fairPriceMedian: 850,
        status: "fair",
        confidence: 0.94,
        notes: "Wholesale contractor cost is approximately $740. Retail mark-up is within acceptable plumbing trade tolerances.",
      },
      {
        id: "li-11",
        category: "labor",
        description: "Plumbing Removal, Gas Line Connection & Vent Flue Assembly (4 hrs)",
        quotedPrice: 950,
        fairPriceLow: 550,
        fairPriceHigh: 750,
        fairPriceMedian: 650,
        status: "padded",
        confidence: 0.91,
        notes: "Standard replacement in an accessible ground-floor utility room requires 2.5 to 3 hours.",
      },
      {
        id: "li-12",
        category: "materials",
        description: "Thermal Expansion Tank 2.1 Gallon & Brass Tee Assembly",
        quotedPrice: 450,
        fairPriceLow: 140,
        fairPriceHigh: 210,
        fairPriceMedian: 175,
        status: "unnecessary_upsell",
        confidence: 0.93,
        notes: "Current expansion tank is intact and holding factory air charge; replacement is discretionary.",
      },
      {
        id: "li-13",
        category: "permits_fees",
        description: "City of Seattle Municipal Plumbing Permit Processing & Inspection",
        quotedPrice: 350,
        fairPriceLow: 85,
        fairPriceHigh: 120,
        fairPriceMedian: 95,
        status: "padded",
        confidence: 0.99,
        notes: "Actual Seattle DCI residential water heater permit fee is $85.00 online. Contractor padded fee by $265.",
      },
      {
        id: "li-14",
        category: "misc",
        description: "Old Water Heater Tank Draining, Removal & Metal Recycling Disposal",
        quotedPrice: 200,
        fairPriceLow: 40,
        fairPriceHigh: 80,
        fairPriceMedian: 60,
        status: "duplicate",
        confidence: 0.92,
        notes: "Scrap metal recyclers pay for copper and steel tanks in Seattle; disposal fee is routinely waived or capped at $50.",
      },
    ],
    paddedFlags: [
      {
        title: "City Permit Fee Inflated by 310%",
        severity: "high",
        explanation:
          "The City of Seattle Department of Construction and Inspections charges $85 for residential mechanical tank swaps. The contractor billed $350 for administrative processing.",
      },
      {
        title: "Discretionary Expansion Tank Replacement",
        severity: "medium",
        explanation:
          "Your current Amtrol expansion tank is functional and holds 55 PSI. Unless the rubber diaphragm has ruptured, this $450 item can be omitted.",
      },
    ],
    negotiationScript: {
      recommendedCounterOffer: 1850,
      openingLine:
        "I have reviewed the proposal and verified Seattle DCI permit fees and standard Bradford White wholesale costs. I am ready to award the job at $1,850 with two adjustments.",
      questionsToAsk: [
        {
          question: "The City of Seattle published fee for a water heater mechanical permit is $85. Will you adjust line item 4 to reflect actual municipal pass-through costs?",
          rationale: "Pass-through municipal fees cannot legally be disguised as contractor overhead without customer disclosure.",
          expectedAnswer: "Immediate adjustment of permit charge down to $85-$100.",
        },
        {
          question: "We tested the existing expansion tank valve stem and measured 55 PSI with no water leakage. Can we retain the existing tank and deduct the $450 replacement charge?",
          rationale: "Reusing functional expansion tanks saves significant money without compromising safety.",
          expectedAnswer: "Contractor will agree to inspect and retain if verified dry.",
        },
      ],
      secondQuoteRecommended: false,
    },
    secondQuoteGuidance: {
      recommended: false,
      reason: "Adjusting permit fee and expansion tank brings quote directly into the competitive median range of $1,850.",
      targetQuotesCount: 1,
    },
  },
  {
    id: "case-roof-leak-flashing",
    title: "Chimney Flashing & Wind Damage Shingle Repair",
    trade: "Roofing",
    city: "Atlanta",
    state: "GA",
    contractorName: "PeachState Exterior Restoration LLC",
    quoteDate: "2026-11-13",
    damagePhotoUrl: "/images/feature-3.jpg",
    quoteDocumentType: "Digital Proposal",
    totalQuoted: 1850,
    fairTotalLow: 650,
    fairTotalHigh: 950,
    fairTotalMedian: 780,
    potentialSavings: 1070,
    fairnessScore: 41,
    verdictTone: "alert",
    verdictHeadline: "Complete Tear-Out Quoted for Minor Counter-Flashing Sealant Void",
    visibleScopeAnalysis: {
      photoEvidenceObserved:
        "Close-up inspection of chimney saddle shows step flashing is tightly embedded under shingles with zero crease or puncture. The mortar joint holding the counter-flashing has deteriorated caulk over a 14-inch span.",
      verifiedDefect: "Weathered polyurethane sealant bead along brick mortar joint above chimney step flashing.",
      unwarrantedWorkDetected:
        "Quote specifies full tear-off of 3 shingle courses, custom fabrication of copper step-flashing, and scaffolding setup for a single-story 4:12 pitch roof easily serviceable from a ladder.",
      confidenceScore: 0.97,
    },
    lineItems: [
      {
        id: "li-20",
        category: "materials",
        description: "Custom 16-oz Copper Step Flashing & Reglet Fabrication",
        quotedPrice: 950,
        fairPriceLow: 180,
        fairPriceHigh: 300,
        fairPriceMedian: 240,
        status: "unnecessary_upsell",
        confidence: 0.96,
        notes: "Existing step flashing is undamaged galvanized steel; tearing out intact shingles creates unnecessary leak vulnerability.",
      },
      {
        id: "li-21",
        category: "misc",
        description: "Multi-Tier Roof Safety Scaffolding & Fall Arrest Rigging",
        quotedPrice: 400,
        fairPriceLow: 0,
        fairPriceHigh: 100,
        fairPriceMedian: 50,
        status: "unnecessary_upsell",
        confidence: 0.98,
        notes: "Roof has a walkable 4:12 pitch with single-story eave height (9.5 feet). Heavy scaffolding is completely non-standard.",
      },
      {
        id: "li-22",
        category: "materials",
        description: "Architectural Shingle Matching Bundle (3 bundles) & Underlayment",
        quotedPrice: 350,
        fairPriceLow: 90,
        fairPriceHigh: 150,
        fairPriceMedian: 120,
        status: "padded",
        confidence: 0.92,
        notes: "Repair requires less than half a bundle of shingles for collar tie trim.",
      },
      {
        id: "li-23",
        category: "labor",
        description: "Chimney Reglet Mortar Grinding, Polyurethane Joint Sealing & Cleanup",
        quotedPrice: 150,
        fairPriceLow: 120,
        fairPriceHigh: 220,
        fairPriceMedian: 160,
        status: "fair",
        confidence: 0.91,
        notes: "Grinding out mortar and applying high-grade Solar Seal or polyurethane caulk is the exact required repair.",
      },
    ],
    paddedFlags: [
      {
        title: "Inappropriate Scaffolding Surcharge",
        severity: "high",
        explanation:
          "Single-story walkable roof pitches do not mandate $400 scaffolding setups. OSHA residential fall protection requirements can be satisfied with a standard anchor harness.",
      },
      {
        title: "Invasive Copper Replacement for Minor Sealant Void",
        severity: "high",
        explanation:
          "Photographs clearly demonstrate that step flashing beneath the shingles is completely watertight. Only the surface counter-flashing mortar joint needs re-pointing.",
      },
    ],
    negotiationScript: {
      recommendedCounterOffer: 550,
      openingLine:
        "We reviewed the drone and roof inspection photos. The step flashing under the architectural shingles is intact and undamaged. We only require counter-flashing reglet grinding and sealant resealing.",
      questionsToAsk: [
        {
          question: "Can you confirm why full shingle tear-out and copper replacement was quoted when the photo shows zero interior decking water staining or step flashing failure?",
          rationale: "Forces roofer to acknowledge they quoted an invasive rebuild when a simple targeted seal is appropriate.",
          expectedAnswer: "Contractor will agree to offer a targeted reseal and inspection warranty.",
        },
        {
          question: "Can we remove the scaffolding line item since the roof pitch is 4:12 with direct ladder standoff access?",
          rationale: "Removes an unnecessary $400 line item directly.",
          expectedAnswer: "Elimination of the $400 fee.",
        },
      ],
      secondQuoteRecommended: true,
    },
    secondQuoteGuidance: {
      recommended: true,
      reason: "Significant scope inflation. A reputable local roofing repair specialist will complete the reglet reseal for $450 to $650.",
      targetQuotesCount: 2,
    },
  },
  {
    id: "case-electrical-panel",
    title: "200-Amp Main Service Electrical Panel Modernization",
    trade: "Electrical",
    city: "Denver",
    state: "CO",
    contractorName: "Mile High Master Electricians Inc.",
    quoteDate: "2026-11-10",
    damagePhotoUrl: "/images/feature-1.jpg",
    quoteDocumentType: "PDF Estimate",
    totalQuoted: 4200,
    fairTotalLow: 3800,
    fairTotalHigh: 4600,
    fairTotalMedian: 4150,
    potentialSavings: 50,
    fairnessScore: 92,
    verdictTone: "fair",
    verdictHeadline: "Accurate & Fairly Priced Electrical Proposal",
    visibleScopeAnalysis: {
      photoEvidenceObserved:
        "Outdated 100-Amp Zinsco split-bus panel with evidence of bus bar aluminum oxidation and scorched breaker clips. Grounding electrode conductor is undersized 8 AWG bare copper.",
      verifiedDefect: "Obsolete hazard panel requiring full upgrade to 200-Amp service with dual 8-foot ground rods and whole-home SPD.",
      unwarrantedWorkDetected: "None. All line items are compliant with NEC 2023 code requirements and Xcel Energy utility regulations.",
      confidenceScore: 0.98,
    },
    lineItems: [
      {
        id: "li-30",
        category: "materials",
        description: "Square D QO 200-Amp 42-Circuit Main Breaker Load Center & Breakers",
        quotedPrice: 850,
        fairPriceLow: 750,
        fairPriceHigh: 950,
        fairPriceMedian: 840,
        status: "fair",
        confidence: 0.96,
        notes: "High quality commercial-grade copper bus load center with branch breakers.",
      },
      {
        id: "li-31",
        category: "materials",
        description: "Type 2 Whole-Home Surge Protective Device (SPD) 50kA",
        quotedPrice: 350,
        fairPriceLow: 280,
        fairPriceHigh: 420,
        fairPriceMedian: 340,
        status: "fair",
        confidence: 0.95,
        notes: "Mandated under National Electrical Code (NEC) Article 242.",
      },
      {
        id: "li-32",
        category: "materials",
        description: "Dual 5/8-inch x 8-foot Copper-Clad Ground Rods & Acorn Clamps",
        quotedPrice: 450,
        fairPriceLow: 350,
        fairPriceHigh: 500,
        fairPriceMedian: 420,
        status: "fair",
        confidence: 0.94,
        notes: "Required 6-foot spacing and 4 AWG grounding conductor installation.",
      },
      {
        id: "li-33",
        category: "labor",
        description: "Licensed Master Electrician & Apprentice Installation (8 hrs)",
        quotedPrice: 1800,
        fairPriceLow: 1600,
        fairPriceHigh: 2100,
        fairPriceMedian: 1850,
        status: "fair",
        confidence: 0.93,
        notes: "Denver metro prevailing master electrician rates range from $160-$190/hr with apprentice.",
      },
      {
        id: "li-34",
        category: "permits_fees",
        description: "Denver Community Planning Permit, Utility Disconnect & Inspection",
        quotedPrice: 750,
        fairPriceLow: 600,
        fairPriceHigh: 850,
        fairPriceMedian: 700,
        status: "fair",
        confidence: 0.97,
        notes: "Includes utility disconnect meter fee and city electrical inspection coordination.",
      },
    ],
    paddedFlags: [],
    negotiationScript: {
      recommendedCounterOffer: 4000,
      openingLine:
        "The estimate is thoroughly detailed and matches Denver NEC standards. We are ready to proceed with a 10% milestone completion holdback.",
      questionsToAsk: [
        {
          question: "Will the contractor provide the written city permit certificate and electrical utility meter seal sign-off upon completion?",
          rationale: "Ensures permit closure before final payment is released.",
          expectedAnswer: "Yes, final payment upon city inspector signature tag.",
        },
      ],
      secondQuoteRecommended: false,
    },
    secondQuoteGuidance: {
      recommended: false,
      reason: "Pricing is in the 48th percentile of Denver metropolitan electrical contractor rates. Highly competitive.",
      targetQuotesCount: 1,
    },
  },
];
