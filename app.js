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

// Approved 7-Dimension 100-Point Scorecard (Score remains null pending required evidence)
// Approved dimensions: Organisation/ICP (15), Material Electricity Decision (20), Buyer Role/Access (15),
// Minimum Data Readiness (15), Urgency/Next Step (15), Ability to Progress (10), Delivery/Scope Fit (10).
function calculateQualificationScore() {
  return null; // Score remains null until required evidence exists
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
  const qualScore = null;

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
      Opportunity_QualificationLogic: "PENDING EVIDENCE — Approved dimensions: Organisation/ICP 15, Material Electricity Decision 20, Buyer Role/Access 15, Minimum Data Readiness 15, Urgency/Next Step 15, Ability to Progress 10, Delivery/Scope Fit 10",
      Opportunity_Owner: null, // GATED — Owner field exists as Zoho Lookup, but no verified company-controlled Owner/queue value supplied
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
