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

// Calculate Qualification Score (Mayank & Tarun Scorecard)
function calculateQualificationScore(demandKW, billINR, hasFile, role) {
  let score = 0;

  // Demand within 100 kW - 5 MW target range
  if (demandKW >= 100 && demandKW <= 5000) {
    score += 40;
  } else if (demandKW > 0) {
    score += 20;
  } else {
    score += 15;
  }

  // Monthly Bill Spend
  if (billINR >= 25) score += 30;
  else if (billINR >= 10) score += 20;
  else if (billINR > 0) score += 10;
  else score += 5;

  // 12-Month Bills Upload Provided
  if (hasFile) score += 20;

  // Buyer Role Fit
  if (role === "Facilities Head" || role === "Plant Head" || role === "CFO / Finance Director") {
    score += 10;
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
  const qualScore = calculateQualificationScore(contractedDemandKW, monthlyBillINR, !!uploadedFileName, buyerRole);

  // Construct JSON object adhering strictly to Aman Khatana's CRM schema contract
  const crmPayload = {
    Submission_Ref: subRef,
    beachhead: "C&I Open Access & Renewable Procurement Advisory",
    Account: {
      Name: accountName,
      BillingState: stateLocation,
      IndustrySector: sectorType
    },
    Contact: {
      FullName: contactName,
      Role: buyerRole,
      Email: contactEmail,
      Phone: contactPhone
    },
    Opportunity: {
      Name: `${accountName} - Open Access Eligibility Check`,
      ContractedDemand_kW: contractedDemandKW,
      MonthlySpend_INR_Lakhs: monthlyBillINR,
      BillAttachmentRef: uploadedFileName || "None uploaded",
      PrivacyConsentAccepted: consentAccepted,
      StageName: "Staging Shell Eligibility Intake Received",
      QualificationScore: qualScore,
      NextStep: "Mayank / Tarun Initial Eligibility Screening & Savings Bandwidth Check",
      Owner: "Mayank Bhola / Tarun Tiwari",
      Source: "Staging Shell v2.0 Intake Form"
    },
    StagingReplyStatus: {
      Status: "Staging Shell READY (held)",
      FormRoute: "Functional",
      PlaceholderCalculatorStatus: "Verified",
      ApprovalPending: "Ashish QA + Owner GO"
    },
    SystemMeta: {
      SubmissionTimestamp: new Date().toISOString(),
      SpecVersion: "Mayank 1 Sep 2026 Handoff"
    }
  };

  // Hide form & render result box
  document.getElementById("diagnosticForm").style.display = "none";
  document.getElementById("generatedRef").innerText = subRef;
  document.getElementById("payloadJsonDisplay").innerText = JSON.stringify(crmPayload, null, 2);
  document.getElementById("submissionResult").classList.add("active");
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
  document.getElementById("fileNameDisplay").innerText = "📎 Click to attach 12-Month Bills (.pdf)";
  document.getElementById("fileNameDisplay").style.color = "var(--text-main)";
}

// Toggle QA Inspector Drawer
function toggleQADrawer() {
  const drawer = document.getElementById("qaDrawer");
  drawer.classList.toggle("active");
}
