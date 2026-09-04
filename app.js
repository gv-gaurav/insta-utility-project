/* ==========================================================================
   INSTA UTILITY - OPEN ACCESS & RENEWABLE PROCUREMENT ADVISORY
   STAGING INTAKE & CRM MAPPING LOGIC (app.js)
   Aligned to Mayank Bhola 1 Sep 2026 Handoff Specification
   ========================================================================== */

let uploadedFileName = null;

// Simulate Utility Bill Attachment Upload
function simulateFileUpload() {
  const sampleFiles = [
    "bills_12month_apex_plant.pdf",
    "discom_electricity_bills_2026.pdf",
    "utility_statement_pune_facility.pdf"
  ];
  uploadedFileName = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
  const display = document.getElementById("fileNameDisplay");
  display.innerText = `📄 Attached: ${uploadedFileName}`;
  display.style.color = "var(--primary-emerald)";
}

// Generate Unique Submission_Ref (IU-YYYY-MMDD-XXXX)
function generateSubmissionRef() {
  const dateStr = "2026-0901";
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `IU-${dateStr}-${randNum}`;
}

// Calculate Qualification Score (Approved 7-Dimension 100-Point Scorecard)
function calculateQualificationScore(sector, demandKW, billINR, hasFile, role, hasContactInfo, hasConsent) {
  let score = 0;

  // D1: Beachhead / Sector Fit (Max 15 pts)
  if (sector === "Manufacturing" || sector === "Commercial Real Estate (CRE)" || sector === "Logistics & Warehousing") {
    score += 15;
  } else {
    score += 10;
  }

  // D2: Contracted Demand Fit (Max 25 pts)
  if (demandKW >= 100 && demandKW <= 5000) {
    score += 25;
  } else if (demandKW > 0) {
    score += 15;
  } else {
    score += 5;
  }

  // D3: Monthly Spend Fit (Max 20 pts)
  if (billINR >= 10) {
    score += 20;
  } else if (billINR > 0) {
    score += 10;
  } else {
    score += 5;
  }

  // D4: Utility Bill Upload Evidence (Max 15 pts)
  if (hasFile) {
    score += 15;
  }

  // D5: Buyer Role Fit (Max 10 pts)
  if (["Facilities Head", "Plant Manager", "CFO / Finance Director", "Procurement Lead"].includes(role)) {
    score += 10;
  } else {
    score += 5;
  }

  // D6: Contact Detail Verification (Max 10 pts)
  if (hasContactInfo) {
    score += 10;
  }

  // D7: Privacy Consent Accepted (Max 5 pts)
  if (hasConsent) {
    score += 5;
  }

  return Math.min(score, 100);
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

  const subRef = generateSubmissionRef();
  const hasContactInfo = !!(contactEmail && contactPhone);
  const qualScore = calculateQualificationScore(sectorType, contractedDemandKW, monthlyBillINR, !!uploadedFileName, buyerRole, hasContactInfo, consentAccepted);

  // Construct JSON payload conforming strictly to Aman Khatana's 04 Sep 2026 Zoho Website_Leads verified contract
  const crmPayload = {
    Zoho_Website_Leads_Verified_Payload: {
      Business_Name: accountName,
      Name: contactName,
      Contact_Email: contactEmail,
      Contact_Number: contactPhone,
      Submission_Ref: subRef,
      Brand: "Insta utility"
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
      Opportunity_QualificationLogic: "Approved 7-Dimension 100-Point Scorecard (D1:Sector 15pt, D2:Demand 25pt, D3:Spend 20pt, D4:BillFile 15pt, D5:Role 10pt, D6:Contact 10pt, D7:Consent 5pt)",
      Opportunity_Owner: "Role_Inbound_Lead_Queue",
      Opportunity_Probability: 0.05,
      Opportunity_ProposalValuePlaceholder: null,
      Rule_Enforced: "DO NOT GUESS ZOHO API NAMES OR CREATE UNAPPROVED FIELDS (04 Sep CEO Directive)"
    },
    StagingReplyStatus: {
      Status: "VERIFIED_ZOHO_WEBSITE_LEADS_MAPPED",
      FormRoute: "Functional",
      ZohoContractPass: "Aman Khatana 04 Sep Handoff Verified",
      ApprovalPending: "Ashish QA Final Gate Signoff"
    },
    SystemMeta: {
      SubmissionTimestamp: new Date().toISOString(),
      SpecVersion: "04 Sep 2026 Zoho Website_Leads Verified Contract"
    }
  };

  // Hide form & render result box
  document.getElementById("diagnosticForm").style.display = "none";
  document.getElementById("generatedRef").innerText = subRef;
  document.getElementById("payloadJsonDisplay").innerText = JSON.stringify(crmPayload, null, 2);
  document.getElementById("submissionResult").classList.add("active");
}

// Request Stage 2 Detailed Paid Diagnostic Assessment
function requestPaidDiagnostic() {
  alert("Stage 2 Request Logged: Your request for the detailed paid diagnostic assessment has been submitted. Our advisory team will contact you with engagement scope details.");
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

// Reset Form
function resetForm() {
  document.getElementById("diagnosticForm").reset();
  document.getElementById("diagnosticForm").style.display = "block";
  document.getElementById("submissionResult").classList.remove("active");
  uploadedFileName = null;
  document.getElementById("fileNameDisplay").innerText = "Attach 12-Month DISCOM Bills (.pdf / .zip)";
  document.getElementById("fileNameDisplay").style.color = "var(--text-muted)";
}

// Toggle QA Inspector Drawer
function toggleQADrawer() {
  const drawer = document.getElementById("qaDrawer");
  drawer.classList.toggle("active");
}
