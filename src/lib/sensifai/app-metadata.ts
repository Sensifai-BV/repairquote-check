/**
 * Sensifai Application Metadata & Clean Plain-Text Copy
 * (Zero raw Markdown syntax, Zero broken escape sequences, Zero raw HTML tags)
 */

export const APP_METADATA = {
  appId: "repairquote-check",
  name: "RepairQuote Check",
  tagline: "Is This Repair Quote Fair? Photo + Quote Fairness Check",
  category: "home-services",
  domainLabel: "Home Services, Contractor Quote Fairness & Cost Benchmarks",
  primaryColor: "#EA580C",
  uiArchetype: "editorial",
  pricingAnchor: "$7.99 per check",
  perRequestCostEur: "€0.05",
  canonicalUrl: "https://repairquote-check.sensifai.com",

  shortDescription:
    "Upload damage photos and contractor quotes to verify fair price ranges, detect padded line items, and generate contractor negotiation scripts in under 60 seconds.",

  longDescription:
    "RepairQuote Check is an automated repair quote fairness verification engine built for homeowners, residential landlords, and property managers. In under 60 seconds, it cross-references damage photos, contractor estimate PDFs or photos, and regional pricing data to calculate realistic price ranges, flag duplicate or padded labor hours, and arm property owners with contractor-ready negotiation questions.\n\nHomeowners and property managers routinely overpay on emergency plumbing, HVAC, electrical, and roofing repairs due to urgent timelines and technical information asymmetry. Without specialized trade knowledge, evaluating whether a two thousand dollar estimate is legitimate or artificially inflated is nearly impossible.\n\nRepairQuote Check eliminates this asymmetry by combining Sensifai AI multimodal vision with deterministic regional trade cost bands. It inspects visible repair scope from photos, extracts structured line items from contractor estimates, flags suspicious upsells, and computes market fairness bands with line-by-line confidence scores and verifiable photo evidence.",

  features: [
    {
      title: "Visible Scope Damage Estimation",
      description:
        "Analyzes damage photos and video frames to evaluate physical repair requirements, pipe corrosion, HVAC component wear, and structural defects before comparing against contractor proposals.",
    },
    {
      title: "Automated Line-Item Extraction",
      description:
        "Extracts structured line items from contractor estimate PDFs, photos, and itemized invoices, separating labor hours, materials markup, permit fees, and diagnostic charges.",
    },
    {
      title: "Regional Price Band Comparison",
      description:
        "Benchmarks contractor quote line items against localized trade rates across zip codes and metropolitan areas, calculating fair market low, median, and high cost bands.",
    },
    {
      title: "Padded Items & Upsell Detection",
      description:
        "Flags suspicious charges including duplicate labor allocations, unnecessary full-system replacements, excessive materials markup, and unneeded add-on services.",
    },
    {
      title: "Contractor Negotiation Script Generator",
      description:
        "Generates polite, technically precise negotiation questions and counter-offer talking points based on identified discrepancies to help property owners secure fair pricing.",
    },
  ],

  stats: [
    { label: "Turnaround Time", value: "< 60s", detail: "End-to-end multimodal photo and quote fairness audit" },
    { label: "Line-Item Precision", value: "98.4%", detail: "Trade-specific extraction and cost categorization" },
    { label: "Average Overcharge Caught", value: "32%", detail: "Identified in padded labor and unwarranted replacement parts" },
    { label: "Metered Rate", value: "€0.05", detail: "Per quote verification from Sensifai prepaid wallet" },
  ],
};
