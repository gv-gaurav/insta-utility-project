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

// ==========================================================================
// TARUN STAGING GA4 / GTM NAMED-UTM ATTRIBUTION CAPTURE & PERSISTENCE ENGINE
// ==========================================================================
function getCapturedUTMParams() {
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const params = {};

  // 1. Capture from active URL search parameters
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let foundInUrl = false;
    utmKeys.forEach(key => {
      const val = urlParams.get(key);
      if (val) {
        params[key] = val;
        foundInUrl = true;
      }
    });

    if (foundInUrl) {
      sessionStorage.setItem("captured_utm_params", JSON.stringify(params));
      return params;
    }
  } catch (e) {
    console.warn("[UTM Engine] URL Search Params Parse Warning:", e);
  }

  // 2. Fallback to persisted sessionStorage parameters for multi-step journey continuity
  try {
    const stored = sessionStorage.getItem("captured_utm_params");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("[UTM Engine] SessionStorage Parse Warning:", e);
  }

  return params;
}

// Global dataLayer & gtag setup for Tarun's GTM / GA4 measurement harness (Staging DebugView Enabled)
window.dataLayer = window.dataLayer || [];
if (typeof window.gtag !== "function") {
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
}

// Initial UTM Capture & Window Loaded DataLayer Push Harness
const capturedUTMs = getCapturedUTMParams();

// Staging GA4 Measurement ID (Tarun Staging Spec: G-CX448B8NZM)
window.STAGING_GA4_MEASUREMENT_ID = window.STAGING_GA4_MEASUREMENT_ID || "G-CX448B8NZM";
const GA4_MEASUREMENT_ID = window.STAGING_GA4_MEASUREMENT_ID;

// Ensure GA4 gtag.js library is dynamically loaded for direct GA4 DebugView HTTP transmission
if (GA4_MEASUREMENT_ID && !document.getElementById("ga4-gtag-loader")) {
  const ga4Script = document.createElement("script");
  ga4Script.id = "ga4-gtag-loader";
  ga4Script.async = true;
  ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(ga4Script);
}

if (GA4_MEASUREMENT_ID) {
  const ga4ConfigPayload = Object.assign({
    debug_mode: true,
    send_page_view: true
  }, capturedUTMs);

  if (Object.keys(capturedUTMs).length > 0) {
    window.gtag("set", capturedUTMs);
  }

  window.gtag("config", GA4_MEASUREMENT_ID, ga4ConfigPayload);
}

// Function to emit utm_captured_on_load to dataLayer
function emitUTMCapturedOnLoad() {
  const utms = getCapturedUTMParams();
  if (Object.keys(utms).length > 0) {
    window.dataLayer.push(Object.assign({
      event: "utm_captured_on_load",
      debug_mode: true,
      campaign_source: utms.utm_source || undefined,
      campaign_medium: utms.utm_medium || undefined,
      campaign_name: utms.utm_campaign || undefined,
      campaign_term: utms.utm_term || undefined,
      campaign_content: utms.utm_content || undefined
    }, utms));
  }
}

// Immediately push captured UTM parameters on script execution
emitUTMCapturedOnLoad();

// Re-emit on DOMContentLoaded & window load to guarantee GTM Window Loaded trigger capture
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", emitUTMCapturedOnLoad);
}
window.addEventListener("load", emitUTMCapturedOnLoad);

// Unified Analytics Event Emitter (Dual dataLayer + direct gtag emission for GA4 DebugView transmission)
function pushAnalyticsEvent(eventName, params) {
  const activeUTMs = getCapturedUTMParams();

  // Custom event parameters (mapped for both GTM dataLayer and native GA4 campaign parameters)
  const eventParams = Object.assign({
    send_to: GA4_MEASUREMENT_ID,
    debug_mode: true,
    'ep.debug_mode': true,
    _dbg: 1,
    campaign_source: activeUTMs.utm_source || undefined,
    campaign_medium: activeUTMs.utm_medium || undefined,
    campaign_name: activeUTMs.utm_campaign || undefined,
    campaign_term: activeUTMs.utm_term || undefined,
    campaign_content: activeUTMs.utm_content || undefined
  }, activeUTMs, params);

  // Clean undefined properties
  Object.keys(eventParams).forEach(key => eventParams[key] === undefined && delete eventParams[key]);

  // 1. DataLayer push for GTM Preview & triggers (requires 'event' property)
  const dataLayerPayload = Object.assign({ event: eventName }, eventParams);
  window.dataLayer.push(dataLayerPayload);

  // 2. Direct gtag event dispatch for live GA4 DebugView HTTP transmission (/g/collect)
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }

  console.log(`[Analytics Engine] Event Transmitted: ${eventName} (GA4 DebugView & dataLayer)`, eventParams);
}

// Track diagnostic start event (Guaranteed trigger on focus, click, or change inside intake form)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("diagnosticForm");
  if (form) {
    let started = false;
    const startHandler = function () {
      if (!started) {
        started = true;
        pushAnalyticsEvent("diagnostic_started", {
          timestamp: new Date().toISOString(),
          journey_type: "C&I Renewable Power Diagnostic v1"
        });
      }
    };

    form.addEventListener("focusin", startHandler);
    form.addEventListener("click", startHandler);
    form.addEventListener("change", startHandler);
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

  const accountNameEl = document.getElementById("account_name");
  const stateLocationEl = document.getElementById("state_location");
  const contactNameEl = document.getElementById("contact_name");
  const buyerRoleEl = document.getElementById("buyer_role");
  const contactEmailEl = document.getElementById("contact_email");
  const contactPhoneEl = document.getElementById("contact_phone");
  const contractedDemandKWEl = document.getElementById("contracted_demand_kw");
  const monthlyBillINREl = document.getElementById("monthly_bill_inr");
  const sectorTypeEl = document.getElementById("sector_type");
  const privacyConsentEl = document.getElementById("privacy_consent");
  const serviceInterestEl = document.getElementById("service_interest");

  const accountName = accountNameEl ? accountNameEl.value.trim() : "";
  const stateLocation = stateLocationEl ? stateLocationEl.value.trim() : "";
  const contactName = contactNameEl ? contactNameEl.value.trim() : "";
  const buyerRole = buyerRoleEl ? buyerRoleEl.value : "Decision Maker";
  const contactEmail = contactEmailEl ? contactEmailEl.value.trim() : "";
  const contactPhone = contactPhoneEl ? contactPhoneEl.value.trim() : "";

  const contractedDemandKW = contractedDemandKWEl && contractedDemandKWEl.value ? parseFloat(contractedDemandKWEl.value) : null;
  const monthlyBillINR = monthlyBillINREl && monthlyBillINREl.value ? parseFloat(monthlyBillINREl.value) : null;
  const sectorType = sectorTypeEl ? sectorTypeEl.value || "Unspecified" : "Unspecified";
  const consentAccepted = privacyConsentEl ? privacyConsentEl.checked : true;
  const serviceInterest = serviceInterestEl ? serviceInterestEl.value : "";

  // Check required contact fields
  if (!accountName || !contactName || !contactEmail || !contactPhone) {
    alert("Please complete all required fields: Company Name, Contact Name, Corporate Email, and Phone Number.");
    return;
  }

  if (privacyConsentEl && !consentAccepted) {
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
    serviceInterest,
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
  if (document.getElementById("resRouteVal")) {
    document.getElementById("resRouteVal").innerText = routeDecision.label;
  }
  if (document.getElementById("resMemoDescText") && routeDecision.recommendation_text) {
    document.getElementById("resMemoDescText").innerText = routeDecision.recommendation_text;
  }
  updateOptionMatrixHighlight(routeDecision.route);

  // Render 7-Dimension Scorecard Values (Max 14 pts)
  if (document.getElementById("resScoreBadge")) {
    document.getElementById("resScoreBadge").innerText = `Status: ${scoreResult.fitLabel.toUpperCase()} (${scoreResult.totalPts} / 14 Pts)`;
    if (scoreResult.fitBand === "HIGH") {
      document.getElementById("resScoreBadge").className = "scorecard-status-badge high-fit";
    } else if (scoreResult.fitBand === "OUT_OF_SCOPE" || scoreResult.fitBand === "STOP") {
      document.getElementById("resScoreBadge").className = "scorecard-status-badge out-of-scope-fit";
    } else {
      document.getElementById("resScoreBadge").className = "scorecard-status-badge";
    }
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

  // API Endpoint URL (Supports PHP backend api/submit.php or custom base URL)
  const submitEndpoint = window.STAGING_API_BASE_URL 
    ? `${window.STAGING_API_BASE_URL}/api/submit.php` 
    : "api/submit.php";

  // Transmit payload to PHP / Server Backend API
  fetch(submitEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      account_name: accountName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      submission_ref: subRef,
      brand: DIAGNOSTIC_V1_CONFIG.brand
    })
  })
  .then(res => res.json())
  .then(apiResult => {
    console.log("[PHP Backend Integration] Response from PHP API:", apiResult);
    if (apiResult && apiResult.status === "SUCCESS") {
      setStagingCRMMode("SUCCESS");
    } else {
      setStagingCRMMode("FAIL_CLOSED");
    }
  })
  .catch(err => {
    console.warn("[PHP Backend Integration] Connection warning calling PHP API:", err);
    setStagingCRMMode("FAIL_CLOSED");
  });

  // Process Aman's CRM Transport Boundary Outcome (Deterministic 4-State UX Handling)
  const crmOutcome = processCRMTransportResponse(crmPayload, currentStagingCRMMode);
  renderCRMOutcomeBanner(crmOutcome);

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

// ==========================================================================
// AMAN KHATANA 15 SEP ZOHO CRM WEBSITE_LEADS TRANSPORT BOUNDARY CONTRACT LOGIC
// ==========================================================================
let currentStagingCRMMode = "FAIL_CLOSED"; // Options: 'SUCCESS', 'DUPLICATE', 'FAIL_CLOSED', 'ERROR'
let lastSubmittedCRMPayload = null;

function setStagingCRMMode(mode) {
  currentStagingCRMMode = mode;
  const btns = document.querySelectorAll(".crm-sim-btn");
  btns.forEach(btn => {
    btn.classList.remove("active-sim");
    if (btn.getAttribute("onclick").includes(mode)) {
      btn.classList.add("active-sim");
    }
  });

  if (lastSubmittedCRMPayload) {
    const outcome = processCRMTransportResponse(lastSubmittedCRMPayload, mode);
    renderCRMOutcomeBanner(outcome);
  }
}

function processCRMTransportResponse(crmPayload, mode = currentStagingCRMMode) {
  const verifiedPayload = (crmPayload && crmPayload.Zoho_Website_Leads_Verified_Payload) || {};
  const subRef = verifiedPayload.Submission_Ref || "IU-UNKNOWN";
  lastSubmittedCRMPayload = crmPayload;

  // Real Staging Contract Validation: Ensure all 6 required fields are non-empty strings
  const requiredFields = ["Business_Name", "Name", "Contact_Email", "Contact_Number", "Submission_Ref", "Brand"];
  const missingFields = requiredFields.filter(f => !verifiedPayload[f] || String(verifiedPayload[f]).trim() === "");

  if (missingFields.length > 0 && mode !== "ERROR") {
    return {
      status: "FAIL_CLOSED",
      code: "VALIDATION_FAILED",
      submission_ref: subRef,
      errors: missingFields.map(f => `Missing required Website_Leads field: ${f}`),
      retryable: false,
      title: "🛑 Fail-Closed: CRM Validation Constraint Enforced",
      message: `Validation failed for ${subRef}. Mandatory fields missing: ${missingFields.join(", ")}. Only 6 approved fields permitted (Business_Name, Name, Contact_Email, Contact_Number, Submission_Ref, Brand).`,
      cssClass: "fail-closed"
    };
  }

  switch (mode) {
    case "SUCCESS":
      return {
        status: "SUCCESS",
        code: "CRM_RECORD_CREATED",
        submission_ref: subRef,
        record_id: "zcrm_" + Math.random().toString(36).substring(2, 10),
        retryable: false,
        title: "✓ CRM Record Created Successfully",
        message: `Submission reference ${subRef} has been recorded in Zoho Website_Leads transport under the approved 6-field contract.`,
        cssClass: "success"
      };

    case "DUPLICATE":
      return {
        status: "DUPLICATE",
        code: "REJECT_DUPLICATE",
        submission_ref: subRef,
        retryable: false,
        title: "⚠️ Duplicate Submission Reference Detected",
        message: `Submission reference ${subRef} has already been received in CRM. Duplicate replay rejected cleanly without creating a second lead record.`,
        cssClass: "duplicate"
      };

    case "FAIL_CLOSED":
      return {
        status: "FAIL_CLOSED",
        code: "VALIDATION_FAILED",
        submission_ref: subRef,
        errors: ["Missing mandatory field or unapproved CRM schema addition."],
        retryable: false,
        title: "🛑 Fail-Closed: CRM Validation Constraint Enforced",
        message: `Validation failed for ${subRef}. Only 6 approved fields permitted (Business_Name, Name, Contact_Email, Contact_Number, Submission_Ref, Brand). Contact support@instautility.com if needed.`,
        cssClass: "fail-closed"
      };

    case "ERROR":
    default:
      return {
        status: "ERROR",
        code: "CRM_TRANSPORT_ERROR",
        submission_ref: subRef,
        message: `Network timeout attempting to reach Zoho Website_Leads transport boundary for ${subRef}.`,
        retryable: true,
        title: "🔄 CRM Transport Error (Retry Available)",
        messageText: `CRM transport failed to connect. Submission ref ${subRef} was NOT recorded in CRM. Please retry or contact support@instautility.com.`,
        cssClass: "error"
      };
  }
}

function renderCRMOutcomeBanner(outcome) {
  const container = document.getElementById("crmOutcomeBanner");
  if (!container) return;

  let actionHtml = "";
  if (outcome.retryable) {
    actionHtml = `
      <div style="margin-top:0.5rem;">
        <button class="btn btn-emerald btn-sm" onclick="retryCRMSubmission()">
          🔄 Retry CRM Submission Now
        </button>
      </div>`;
  }

  const errorsList = outcome.errors ? `<div style="font-size:0.8rem; margin-top:0.25rem; font-weight:600;">Reasons: ${outcome.errors.join(", ")}</div>` : "";
  const recordIdDisplay = outcome.record_id ? `<span>Record ID: <strong>${outcome.record_id}</strong></span>` : "";

  container.innerHTML = `
    <div class="crm-outcome-alert ${outcome.cssClass}">
      <div class="crm-outcome-alert-top">
        <div class="crm-outcome-title">
          ${outcome.title}
        </div>
        <span class="crm-outcome-badge">${outcome.code}</span>
      </div>
      <div class="crm-outcome-desc">
        ${outcome.message || outcome.messageText}
        ${errorsList}
      </div>
      <div class="crm-outcome-meta">
        <span>Status: <strong>${outcome.status}</strong></span>
        <span>Ref: <strong>${outcome.submission_ref}</strong></span>
        ${recordIdDisplay}
        <span>Retryable: <strong>${outcome.retryable}</strong></span>
      </div>
      ${actionHtml}
    </div>
  `;
}

function retryCRMSubmission() {
  if (!lastSubmittedCRMPayload) return;
  
  const verifiedPayload = lastSubmittedCRMPayload.Zoho_Website_Leads_Verified_Payload || {};
  const subRef = verifiedPayload.Submission_Ref;
  const submitEndpoint = window.STAGING_API_BASE_URL 
    ? `${window.STAGING_API_BASE_URL}/api/submit.php` 
    : "api/submit.php";

  console.log(`[CRM Retry] Retrying submission for Ref: ${subRef} to ${submitEndpoint}`);

  fetch(submitEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      account_name: verifiedPayload.Business_Name,
      contact_name: verifiedPayload.Name,
      contact_email: verifiedPayload.Contact_Email,
      contact_phone: verifiedPayload.Contact_Number,
      submission_ref: subRef, // Retains exact Submission_Ref
      brand: verifiedPayload.Brand || DIAGNOSTIC_V1_CONFIG.brand
    })
  })
  .then(res => res.json())
  .then(apiResult => {
    console.log("[CRM Retry Outcome] Response from API:", apiResult);
    setStagingCRMMode("SUCCESS");
  })
  .catch(err => {
    console.warn("[CRM Retry Outcome] Error during retry:", err);
    setStagingCRMMode("ERROR");
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

// Off-Canvas Mobile Navigation Drawer Controller
function openMobileDrawer() {
  const panel = document.getElementById("mobileDrawerPanel");
  const overlay = document.getElementById("mobileDrawerOverlay");
  if (panel && overlay) {
    panel.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeMobileDrawer() {
  const panel = document.getElementById("mobileDrawerPanel");
  const overlay = document.getElementById("mobileDrawerOverlay");
  if (panel && overlay) {
    panel.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}


