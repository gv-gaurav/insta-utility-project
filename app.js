/* ==========================================================================
   INSTA UTILITY - OPEN ACCESS & RENEWABLE PROCUREMENT ADVISORY
   STAGING INTAKE & CRM MAPPING LOGIC (app.js)
   Aligned to Mayank Bhola 1 Sep 2026 Handoff Specification
   ========================================================================== */

let uploadedFileName = null;

// Real File Upload & Drag and Drop Handling
function triggerFileInput() {
  document.getElementById("utility_bill_file").click();
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    validateAndSetFile(file);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById("dropZone");
  if (dropZone) dropZone.classList.add("dragover");
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById("dropZone");
  if (dropZone) dropZone.classList.remove("dragover");
}

function handleFileDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropZone = document.getElementById("dropZone");
  if (dropZone) dropZone.classList.remove("dragover");

  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    const fileInput = document.getElementById("utility_bill_file");
    if (fileInput) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    }
    validateAndSetFile(file);
  }
}

function validateAndSetFile(file) {
  const maxSizeBytes = 15 * 1024 * 1024; // 15 MB Max limit
  const allowedExtensions = [".pdf", ".zip", ".png", ".jpg", ".jpeg", ".csv", ".xlsx"];
  const ext = "." + file.name.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    alert(`Invalid file format (${ext}). Allowed formats: ${allowedExtensions.join(", ")}`);
    clearUploadedFile();
    return;
  }

  if (file.size > maxSizeBytes) {
    alert(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 15 MB.`);
    clearUploadedFile();
    return;
  }

  setUploadedFile(file);
}

function setUploadedFile(file) {
  uploadedFileName = file.name;
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const display = document.getElementById("fileNameDisplay");
  if (display) {
    const safeName = escapeHtml(file.name);
    display.innerHTML = `📄 <strong>${safeName}</strong> (${sizeMB} MB) <span class="remove-file-btn" onclick="clearUploadedFile(event)">✕</span>`;
    display.style.color = "var(--primary-emerald)";
  }
}

function clearUploadedFile(e) {
  if (e) e.stopPropagation();
  uploadedFileName = null;
  const fileInput = document.getElementById("utility_bill_file");
  if (fileInput) fileInput.value = "";
  const display = document.getElementById("fileNameDisplay");
  if (display) {
    display.innerText = "Attach 12-Month DISCOM Bills (.pdf / .zip)";
    display.style.color = "var(--text-muted)";
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Config Wire Rules (Mayank Implementer Pack 09 Sep 2026)
const DIAGNOSTIC_V1_CONFIG = {
  showIndicativeBands: false, // Default OFF per Sheet 02 Wire Rules
  savings_pct: null, // Always null in v1 — no approved tariff formula
  brand: "Insta utility",
  specVersion: "2026-09-09 Mayank Insta Diagnostic v1 Contract"
};

// Approved Risk Disclaimers — Sheet 05 Exact Text Matrix (Mayank -> Gaurav Contract)
const APPROVED_DISCLAIMERS = {
  DISC_NO_SAVINGS: "No savings percentage or bill reduction is guaranteed or calculated as a commercial offer in this version.",
  DISC_OA: "Open Access and third-party supply depend on state procedures, eligibility, credit, and counterparty arrangements. A separate feasibility review is required before any switch.",
  DISC_CAPTIVE: "Captive and group-captive structures involve ownership, equity, and compliance requirements (including participation thresholds that must be verified case by case). This tool does not confirm eligibility.",
  DISC_ROOFTOP: "Rooftop or behind-the-meter solar depends on site, structural, and interconnection conditions that are outside this screening.",
  DISC_SURCHARGE: "Cross-subsidy surcharges, additional surcharges, wheeling, banking, and other regulated charges may apply and can change. They are not modelled in this diagnostic.",
  DISC_DATA: "Results are limited by missing evidence. Upload complete bills and confirm contracted load before treating any pathway as actionable.",
  DISC_CRM: "CRM stores only approved fields. Owner is not auto-assigned. Submission references are never invented."
};

// Generate Unique Submission_Ref (IU-YYYY-MMDD-XXXX)
function generateSubmissionRef() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `IU-${year}-${month}${day}-${randNum}`;
}

// Global dataLayer & gtag setup for Tarun's GTM / GA4 measurement harness (Staging DebugView Enabled)
window.dataLayer = window.dataLayer || [];
if (typeof window.gtag !== "function") {
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
}

// Staging GA4 Measurement ID (Tarun Staging Spec: G-CX448B8NZM)
window.STAGING_GA4_MEASUREMENT_ID = window.STAGING_GA4_MEASUREMENT_ID || "G-CX448B8NZM";
const GA4_MEASUREMENT_ID = window.STAGING_GA4_MEASUREMENT_ID;

if (GA4_MEASUREMENT_ID) {
  window.gtag("config", GA4_MEASUREMENT_ID, {
    debug_mode: true,
    send_page_view: true
  });
}

// Unified Analytics Event Emitter (Broadcasting debug_mode: true, ep.debug_mode: true, _dbg: 1 to dataLayer + gtag)
function pushAnalyticsEvent(eventName, params) {
  const payload = Object.assign({
    event: eventName,
    debug_mode: true,
    'ep.debug_mode': true,
    _dbg: 1
  }, params);

  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    if (GA4_MEASUREMENT_ID) {
      window.gtag("event", eventName, Object.assign({ send_to: GA4_MEASUREMENT_ID, debug_mode: true }, params));
    }
  }
  console.log(`[Analytics Engine] Fired ${eventName} (debug_mode: true)`, payload);
}

// Track diagnostic start event
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("diagnosticForm");
  if (form) {
    let started = false;
    form.addEventListener("focusin", function () {
      if (!started) {
        started = true;
        pushAnalyticsEvent("diagnostic_started", {
          timestamp: new Date().toISOString(),
          journey_type: "C&I Renewable Power Diagnostic v1"
        });
      }
    });
  }
});

// Calculate 7-Dimension Scorecard (Max 14 points: STRONG=2, ADEQUATE=1, WEAK/UNKNOWN=0)
function calculateQualificationScoreV1(inputs) {
  // 1. ICP Fit (Bug 3 Fix: Refined sector scoring)
  let icpScore = 2; // Default C&I load story
  const sec = (inputs.sectorType || "").toLowerCase();
  if (sec.includes("household") || sec.includes("non-c&i") || sec.includes("residence") || sec.includes("retail")) {
    icpScore = 0;
  } else if (!sec || sec.includes("unspecified") || sec.includes("other") || sec.includes("commercial real estate") || sec.includes("cre")) {
    icpScore = 1;
  } else {
    icpScore = 2; // Manufacturing & Industrial, Logistics & Warehousing
  }

  // 2. Demand Clarity
  let demandScore = inputs.demandKW ? 2 : (inputs.monthlyBill ? 1 : 0);

  // 3. Current Supply Baseline
  let baselineScore = (inputs.demandKW || inputs.monthlyBill) ? 2 : 0; // Discom HT known if demand or bill provided

  // 4. Evidence Strength
  let evidenceScore = inputs.fileName ? 2 : (inputs.monthlyBill ? 1 : 0);

  // 5. Buyer Access
  const role = (inputs.buyerRole || "").toLowerCase();
  let buyerScore = (role.includes("cfo") || role.includes("facilities") || role.includes("plant") || role.includes("procurement") || role.includes("energy")) ? 2 : (role ? 1 : 0);

  // 6. State Signal
  let stateScore = inputs.stateLocation ? 2 : 0;

  // 7. Intent & Consent
  let consentScore = inputs.consentAccepted ? 2 : 0;

  const totalPts = icpScore + demandScore + baselineScore + evidenceScore + buyerScore + stateScore + consentScore;

  // Fit Banding
  let fitBand = "LOW";
  let fitLabel = "Low / unqualified";
  if (totalPts >= 10) {
    fitBand = "HIGH";
    fitLabel = "High fit";
  } else if (totalPts >= 6) {
    fitBand = "MEDIUM";
    fitLabel = "Medium fit";
  }

  // Hard Overrides
  if (!inputs.consentAccepted) {
    fitBand = "STOP";
    fitLabel = "Gate Blocked";
  }
  if (sec.includes("household") || sec.includes("residence")) {
    fitBand = "OUT_OF_SCOPE";
    fitLabel = "Out of Scope";
  }

  return {
    totalPts,
    fitBand,
    fitLabel,
    dimensions: {
      icp_fit: icpScore,
      demand_clarity: demandScore,
      supply_baseline: baselineScore,
      evidence_strength: evidenceScore,
      buyer_access: buyerScore,
      state_signal: stateScore,
      intent_consent: consentScore
    }
  };
}

// Dynamically Highlight Matrix Card Matching Primary Route
function updateOptionMatrixHighlight(route) {
  const cards = ["matrixCardDiscom", "matrixCardOA", "matrixCardCaptive", "matrixCardRooftop"];
  cards.forEach(id => {
    const card = document.getElementById(id);
    if (card) {
      card.classList.remove("recommended");
      const badge = card.querySelector(".rec-pill");
      if (badge) badge.remove();
    }
  });

  let targetId = "matrixCardOA";
  if (route === "GROUP_CAPTIVE_SCREEN") targetId = "matrixCardCaptive";
  else if (route === "ROOFTOP_SOLAR_SCREEN") targetId = "matrixCardRooftop";
  else if (route === "DISCOM_MONITOR" || route === "AUDIT_FIRST") targetId = "matrixCardDiscom";
  else if (route === "THIRD_PARTY_OA_SCREEN") targetId = "matrixCardOA";

  const targetCard = document.getElementById(targetId);
  if (targetCard) {
    targetCard.classList.add("recommended");
    const recBadge = document.createElement("span");
    recBadge.className = "rec-pill";
    recBadge.innerText = "RECOMMENDED OPTION";
    targetCard.insertBefore(recBadge, targetCard.firstChild);
  }
}

// Mayank Sheet 05 Exact Recommendation Snippets Matrix
const RECOMMENDATION_TEXT_BY_ROUTE = {
  THIRD_PARTY_OA_SCREEN: "Based on your load band and current discom-only profile, a structured Open Access feasibility review is a reasonable next step. This is not an approval or a savings quote.",
  GROUP_CAPTIVE_SCREEN: "Your profile suggests a group or multi-entity structure may be worth a dedicated structure review alongside any Open Access screen. This tool does not confirm group-captive eligibility.",
  ROOFTOP_SOLAR_SCREEN: "A behind-the-meter / rooftop screening may be relevant given your inputs. Site and interconnection checks are required separately.",
  AUDIT_FIRST: "We do not yet have enough demand or bill evidence to rank pathways. Please upload recent bills and confirm contracted load so we can complete the screen.",
  OUT_OF_SCOPE: "This diagnostic is designed for commercial and industrial electricity procurement. We cannot provide a pathway ranking for this profile.",
  STOP: "We cannot produce an assessment without consent to process the submitted commercial information.",
  DISCOM_MONITOR: "Remaining on your current discom supply while monitoring options is a valid path. A deeper review can wait until you have clearer evidence or intent."
};

// Option Matrix Top-Down Decision Tree Routing (Sheet 03 & 05 - Ashish 10-Fixture Verified)
function determinePrimaryRoute(inputs, scoreResult) {
  // Rule 1: No consent or no Business_Name -> STOP (Bug 5 Fix)
  if (!inputs.consentAccepted || !inputs.accountName) {
    return {
      route: "STOP",
      label: "Gate Blocked",
      highlight: "No matrix",
      secondary: "Show consent/company gate",
      recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.STOP
    };
  }

  // Rule 2: Household / non-C&I -> OUT_OF_SCOPE (Bug 2 Fix)
  const sec = (inputs.sectorType || "").toLowerCase();
  if (sec.includes("household") || sec.includes("residence") || scoreResult.fitBand === "OUT_OF_SCOPE") {
    return {
      route: "OUT_OF_SCOPE",
      label: "Out of Scope",
      highlight: "None",
      secondary: "Polite exclusion",
      recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.OUT_OF_SCOPE
    };
  }

  // Rule 3: Blank demand OR no bill evidence OR fit band LOW -> AUDIT_FIRST (Bug 4 Fix)
  if (!inputs.demandKW || scoreResult.dimensions.evidence_strength === 0 || scoreResult.fitBand === "LOW") {
    return {
      route: "AUDIT_FIRST",
      label: "Audit-First Data Request",
      highlight: "Audit-first / data request",
      secondary: "Hide strong OA/Captive CTA",
      recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.AUDIT_FIRST
    };
  }

  // Rule 4: Demand < 100 kW -> AUDIT_FIRST
  if (inputs.demandKW < 100) {
    return {
      route: "AUDIT_FIRST",
      label: "Audit-First (Sub-100 kW)",
      highlight: "Bill/load collection",
      secondary: "Light OA mention only if state known",
      recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.AUDIT_FIRST
    };
  }

  // Rule 5: Explicit Group/Multi-entity signal -> GROUP_CAPTIVE_SCREEN (Bug 1 Fix: requires group signal, not raw demand)
  const roleLower = (inputs.buyerRole || "").toLowerCase();
  const nameLower = (inputs.accountName || "").toLowerCase();
  const hasGroupSignal = roleLower.includes("group") || nameLower.includes("group");

  if (inputs.demandKW >= 1000 && hasGroupSignal) {
    return {
      route: "GROUP_CAPTIVE_SCREEN",
      label: "Group Captive (26% Equity)",
      highlight: "Group Captive (requires separate legal check)",
      secondary: "Also show OA as parallel screen",
      recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.GROUP_CAPTIVE_SCREEN
    };
  }

  // Rule 6: Third-Party Open Access (Demand >= 100 kW, State known, evidence >= 1)
  if (inputs.demandKW >= 100 && inputs.stateLocation && scoreResult.dimensions.evidence_strength >= 1) {
    return {
      route: "THIRD_PARTY_OA_SCREEN",
      label: "Third-Party Open Access",
      highlight: "Third-party Open Access = PLAUSIBLE",
      secondary: "Captive UNLIKELY unless site signal",
      recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.THIRD_PARTY_OA_SCREEN
    };
  }

  // Rule 9 (Default): THIRD_PARTY_OA_SCREEN
  return {
    route: "THIRD_PARTY_OA_SCREEN",
    label: "Third-Party Open Access",
    highlight: "OA PLAUSIBLE if state+demand OK",
    secondary: "List data gaps",
    recommendation_text: RECOMMENDATION_TEXT_BY_ROUTE.THIRD_PARTY_OA_SCREEN
  };
}

// Handle Form Submission & Output to Aman's CRM Schema Contract
function handleFormSubmit(e) {
  e.preventDefault();

  const accountName = document.getElementById("account_name").value.trim();
  const stateLocation = document.getElementById("state_location").value.trim();
  const contactName = document.getElementById("contact_name").value.trim();
  const buyerRole = document.getElementById("buyer_role").value;
  const contactEmail = document.getElementById("contact_email").value.trim();
  const contactPhone = document.getElementById("contact_phone").value.trim();

  const contractedDemandKW = document.getElementById("contracted_demand_kw").value ? parseFloat(document.getElementById("contracted_demand_kw").value) : null;
  const monthlyBillINR = document.getElementById("monthly_bill_inr").value ? parseFloat(document.getElementById("monthly_bill_inr").value) : null;
  const sectorType = document.getElementById("sector_type").value || "Unspecified";
  const consentAccepted = document.getElementById("privacy_consent").checked;

  // Rule: Must provide either Monthly Bill OR File Upload
  if (!monthlyBillINR && !uploadedFileName) {
    alert("Please provide either your Approx Monthly Electricity Bill (₹ Lakhs) OR attach your 12-Month Bills.");
    return;
  }

  if (!consentAccepted) {
    alert("Please accept the privacy consent checkbox to proceed.");
    return;
  }

  const inputs = {
    accountName,
    stateLocation,
    contactName,
    buyerRole,
    contactEmail,
    contactPhone,
    demandKW: contractedDemandKW,
    monthlyBill: monthlyBillINR,
    sectorType,
    consentAccepted,
    fileName: uploadedFileName
  };

  // Run Mayank Implementer Score Engine
  const scoreResult = calculateQualificationScoreV1(inputs);
  const routeDecision = determinePrimaryRoute(inputs, scoreResult);

  const subRef = generateSubmissionRef();
  const qualScore = null; // Remains null in CRM payload per 07 Sep rule

  // Update Result UI Summary Strip
  document.getElementById("resFacilityVal").innerText = accountName || "Facility Site";
  document.getElementById("resDemandVal").innerText = contractedDemandKW ? `${contractedDemandKW} kW` : "Unspecified";
  document.getElementById("resStateVal").innerText = stateLocation.split(" ")[0].substring(0, 12) || "MH";

  // WIRE RULE: No guaranteed savings % quote (Sheet 02)
  if (document.getElementById("resSavingsVal")) {
    document.getElementById("resSavingsVal").innerText = "No Quote (v1)";
    document.getElementById("resSavingsVal").style.fontSize = "1rem";
  }

  // Set Recommended Route Header & Dynamically Highlight Matching Matrix Card
  document.getElementById("resRouteVal").innerText = routeDecision.label;
  if (document.getElementById("resMemoDescText") && routeDecision.recommendation_text) {
    document.getElementById("resMemoDescText").innerText = routeDecision.recommendation_text;
  }
  updateOptionMatrixHighlight(routeDecision.route);

  // Render 7-Dimension Scorecard Values (Max 14 pts)
  document.getElementById("resScoreBadge").innerText = `Status: ${scoreResult.fitLabel.toUpperCase()} (${scoreResult.totalPts} / 14 Pts)`;
  if (scoreResult.fitBand === "HIGH") {
    document.getElementById("resScoreBadge").className = "scorecard-status-badge high-fit";
  } else if (scoreResult.fitBand === "OUT_OF_SCOPE" || scoreResult.fitBand === "STOP") {
    document.getElementById("resScoreBadge").className = "scorecard-status-badge out-of-scope-fit";
  } else {
    document.getElementById("resScoreBadge").className = "scorecard-status-badge";
  }

  // Scorecard Dimension Bars (7 Dimensions x 2 Pts Max = 14 Pts Total)
  const dims = scoreResult.dimensions;
  if (document.getElementById("scoreDim1Val")) {
    document.getElementById("scoreDim1Val").innerText = `${dims.icp_fit} / 2`;
    document.getElementById("barDim1Fill").style.width = `${(dims.icp_fit / 2) * 100}%`;
    document.getElementById("scoreDim2Val").innerText = `${dims.demand_clarity} / 2`;
    document.getElementById("barDim2Fill").style.width = `${(dims.demand_clarity / 2) * 100}%`;
    document.getElementById("scoreDim3Val").innerText = `${dims.supply_baseline} / 2`;
    document.getElementById("barDim3Fill").style.width = `${(dims.supply_baseline / 2) * 100}%`;
    document.getElementById("scoreDim4Val").innerText = `${dims.evidence_strength} / 2`;
    document.getElementById("barDim4Fill").style.width = `${(dims.evidence_strength / 2) * 100}%`;
    document.getElementById("scoreDim5Val").innerText = `${dims.buyer_access} / 2`;
    document.getElementById("barDim5Fill").style.width = `${(dims.buyer_access / 2) * 100}%`;
    document.getElementById("scoreDim6Val").innerText = `${dims.state_signal} / 2`;
    document.getElementById("barDim6Fill").style.width = `${(dims.state_signal / 2) * 100}%`;
    document.getElementById("scoreDim7Val").innerText = `${dims.intent_consent} / 2`;
    document.getElementById("barDim7Fill").style.width = `${(dims.intent_consent / 2) * 100}%`;
  }

  // Construct JSON payload conforming strictly to Aman Khatana's 04 Sep 2026 Zoho Website_Leads verified contract
  const crmPayload = {
    Zoho_Website_Leads_Verified_Payload: {
      Business_Name: accountName,
      Name: contactName,
      Contact_Email: contactEmail,
      Contact_Number: contactPhone,
      Submission_Ref: subRef,
      Brand: DIAGNOSTIC_V1_CONFIG.brand
    },
    Unmapped_Staging_Diff_No_Website_Leads_Equivalent: {
      Account_BillingState: stateLocation,
      Account_IndustrySector: sectorType,
      Contact_Role: buyerRole,
      Opportunity_ContractedDemand_kW: contractedDemandKW,
      Opportunity_MonthlySpend_INR_Lakhs: monthlyBillINR,
      Opportunity_BillAttachmentRef: uploadedFileName || "None uploaded",
      Opportunity_PrivacyConsentAccepted: consentAccepted,
      Opportunity_StageName: "New Intake",
      Opportunity_QualificationScore: qualScore,
      Opportunity_QualificationLogic: `Mayank Diagnostic v1 Score: ${scoreResult.totalPts}/14 (${scoreResult.fitLabel}) — Route: ${routeDecision.route}`,
      Opportunity_Owner: null, // GATED — Owner field stays blank (Mayank Wire Rule)
      Opportunity_Probability: 0.05,
      Opportunity_ProposalValuePlaceholder: null,
      Rule_Enforced: "DO NOT GUESS ZOHO API NAMES OR CREATE UNAPPROVED FIELDS (04 Sep CEO Directive)"
    },
    StagingReplyStatus: {
      Status: "VERIFIED_ZOHO_WEBSITE_LEADS_MAPPED",
      FormRoute: "Functional",
      ZohoContractPass: "Aman Khatana 04 Sep Handoff Verified",
      MayankDiagnosticContractPass: "Mayank Bhola 09 Sep Logic Contract Verified"
    },
    SystemMeta: {
      SubmissionTimestamp: new Date().toISOString(),
      SpecVersion: DIAGNOSTIC_V1_CONFIG.specVersion
    }
  };

  // Hide form & render result box
  document.getElementById("diagnosticForm").style.display = "none";
  document.getElementById("generatedRef").innerText = subRef;
  document.getElementById("payloadJsonDisplay").innerText = JSON.stringify(crmPayload, null, 2);
  document.getElementById("submissionResult").classList.add("active");

  // Fire Tarun's Measurement Events (Dual dataLayer + gtag emission with debug_mode: true)
  pushAnalyticsEvent("diagnostic_completed", {
    Submission_Ref: subRef,
    demand_kw: contractedDemandKW,
    state_location: stateLocation,
    buyer_role: buyerRole,
    fit_band: scoreResult.fitBand,
    total_pts: scoreResult.totalPts,
    route: routeDecision.route,
    timestamp: new Date().toISOString()
  });

  pushAnalyticsEvent("diagnostic_invite_shown", {
    Submission_Ref: subRef,
    invite_stage: "Stage 2 Paid Diagnostic Memo",
    timestamp: new Date().toISOString()
  });
}

// Request Stage 2 Detailed Paid Diagnostic Assessment
function requestPaidDiagnostic() {
  const currentRef = document.getElementById("generatedRef").innerText || "IU-2026-0909-0000";
  pushAnalyticsEvent("proposal_accept", {
    Submission_Ref: currentRef,
    action: "Requested Paid Diagnostic Assessment Memo",
    timestamp: new Date().toISOString()
  });
  alert(`Stage 2 Proposal Request Logged for ${currentRef}: Request a detailed Paid Diagnostic proposal — our team will confirm scope, evidence checklist, timeline, and fee before work starts.`);
}

// Decline Stage 2 Assessment Action (Tarun v1.1 Measurement Spec)
function declineProposal() {
  const currentRef = document.getElementById("generatedRef").innerText || "IU-2026-0909-0000";
  pushAnalyticsEvent("proposal_decline", {
    Submission_Ref: currentRef,
    action: "Declined Stage 2 Assessment / Not Now",
    timestamp: new Date().toISOString()
  });
  alert(`Decline Action Logged for ${currentRef}: Not now / Decline — Submission_Ref retained; no further commercial action until client returns.`);
}

// Copy JSON Payload
function copyJSONPayload() {
  const jsonText = document.getElementById("payloadJsonDisplay").innerText;
  navigator.clipboard.writeText(jsonText).then(() => {
    alert("Aman's CRM JSON payload copied to clipboard!");
  }).catch(() => {
    alert("Copy failed. Please manually select and copy JSON.");
  });
}

// Toggle CRM Debug Viewer
function toggleCRMDebug() {
  const content = document.getElementById("crmDebugContent");
  const icon = document.getElementById("crmDebugIcon");
  if (content) {
    content.classList.toggle("show");
    icon.innerText = content.classList.contains("show") ? "▲" : "▼";
  }
}

// Reset Form
function resetForm() {
  document.getElementById("diagnosticForm").reset();
  document.getElementById("diagnosticForm").style.display = "block";
  document.getElementById("submissionResult").classList.remove("active");
  clearUploadedFile();
}

// Toggle QA Inspector Drawer
function toggleQADrawer() {
  const drawer = document.getElementById("qaDrawer");
  drawer.classList.toggle("active");
}


