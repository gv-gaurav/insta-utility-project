# Executive Work Submission & QA Review Package — Gaurav Pal

**Contributor Name:** Gaurav Pal  
**Role:** MVP Conversion Journey / Staging Lead (Priority P1)  
**Venture Builder:** VoltOS Greenfield Venture Build  
**Business Unit:** Insta Utility — Open Access & Renewable Procurement Advisory (India C&I)  
**Flagship Entry Offer:** Open Access Eligibility & Savings Assessment  
**Execution Cycle Date:** 1 September 2026 (Updated Handoff Applied)  
**Deliverable Status:** `SUBMITTED FOR QA REVIEW (Pending Ashish Gill QA & CEO Approval)`  
**Staging Status Reply:** `Staging Shell READY FOR QA | Form Route Functional | Calculator Status Verified`  

---

## 1. Executive Summary

As assigned under **Priority P1** of the VoltOS CEO Execution Workflow and Mayank Bhola's 1 Sep 2026 handoff document, I have completed and submitted the **Staging Conversion Journey Landing Page**, **Diagnostic Intake Form Specification**, and **CRM Data Field Map** for Insta Utility.

The landing page is constructed as a **claim-safe, modular staging shell** in an **Executive Light Theme System** using **Outfit & Inter** Google Fonts. It integrates the official logo URL (`https://www.instautility.com/assets/img/logo/insta-utility-logo.png`), 11 modular claim-safe sections, an 8-field intake form, an automatic `Submission_Ref` generator, and a 1:1 CRM schema payload builder for Aman Khatana's pipeline contract.

> [!NOTE]  
> **QA Governance Boundary**: All deliverables are submitted as **Ready for Review**. Final QA gate status (`PASS` / `PASS WITH CONDITIONS` / `HOLD`) remains strictly under the authority of **Ashish Gill (Venture QA Guard)** and the **VoltOS CEO**.

---

## 2. Deliverables Inventory & Review Package

### 📁 Staging Assets in Project Repository (`insta-utility-project/`)

| Asset File | Purpose & Function | Self-Check Verification | QA Gate Target |
| :--- | :--- | :---: | :---: |
| [`index.html`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/index.html) | Main Staging Landing Journey featuring official logo (`https://www.instautility.com/assets/img/logo/insta-utility-logo.png`), 11 claim-safe sections, 8 intake form fields, top staging banner, and QA schema inspector drawer. | Structure Complete | **Pending Ashish QA** |
| [`styles.css`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/styles.css) | Custom Executive Light Theme CSS system (`#f8fafc` canvas, `#ffffff` card modules, `#46a340` emerald green logo accents) using Google Fonts `Outfit` & `Inter`. | Layout Verified | **Pending Ashish QA** |
| [`app.js`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/app.js) | Interactive step routing, field validation, `Submission_Ref` generator (`IU-2026-0901-XXXX`), preliminary qualification scorer, and live CRM payload display. | Functional | **Pending Ashish QA** |
| [`form_field_map.json`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/form_field_map.json) | JSON Schema field dictionary mapping all 8 intake inputs 1:1 to Aman Khatana's CRM schema (`Account`, `Contact`, `Opportunity`, `Submission_Ref`). | Schema Aligned | **For Aman & Ashish** |
| [`staging_handover_guide.md`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/staging_handover_guide.md) | Technical integration guide for Mayank (copy injection), Aman (CRM contract), and Ashish (QA compliance checklist). | Documentation Ready | **For Team Review** |

---

## 3. Flagged Strategic & Commercial Boundaries for QA Attention

During the build process, one key commercial alignment delta was identified between the original CEO directive and Mayank's 1 Sep 2026 update. This is explicitly flagged for **Ashish Gill (QA)** and **Tarun Tiwari (Economics Lead)**:

### ⚠️ Flagged Item 1: "Free Top-of-Funnel Eligibility Check" vs "Paid Diagnostic Entry Product"
- **CEO Baseline (Page 3 & Page 7):** Positioned entry product as a *"Paid fixed-fee diagnostic"* with *"No binding price to be issued until management approves pricing boundaries."*
- **Mayank 1 Sep Handoff (Section 1):** Positioned top-of-funnel entry offer as a *"Free or nominal Open Access Eligibility & Savings Assessment (pipeline tool, not profit centre)."*
- **Staging Engineering Action Taken:** The staging page has been built **modularly**. It currently displays the process language for the free/nominal eligibility screen as instructed by Mayank, but the layout and copy structure are fully capable of switching to a fixed-fee paid diagnostic display instantly if management/Tarun locks a paid fee boundary.
- **QA Action Requested:** Ashish Gill & Tarun Tiwari to review and confirm if the free top-of-funnel intake is approved as the sprint entry offer before public validation.

---

## 4. Scope Mapping — Mayank 1 Sep Handoff

### 4.1 11 Claim-Safe Landing Page Sections
1. **H1 / Hero:** *"Open access eligibility & savings check for Indian C&I facilities"*
2. **Subhead:** *"Help mid-size factories and commercial sites understand open access / group captive options vs DISCOM supply — process language"*
3. **Primary CTA:** *"Get your free open access eligibility & savings check"*
4. **Who It's For:** C&I sites roughly 100 kW – 5 MW contracted demand; facilities/plant/finance decision-makers.
5. **What You Get:** Eligibility screen + indicative savings range + recommended next route (OA / Group Captive / Audit-first).
6. **What We Need:** 12 months electricity bills (or monthly bill) + contracted demand + state location.
7. **How It Works (4 Steps):** 1. Submit details → 2. We review eligibility → 3. You receive assessment → 4. Optional commercial discussion.
8. **Service Lines (Secondary):** Open access advisory · Group captive · Energy audit door-opener · Tariff/billing review.
9. **Trust / Proof Placeholders:** Explicitly marked `PLACEHOLDER ONLY — Methodology Transparency; NO invented logos, testimonials, or client results`.
10. **Exclusions / Disclaimer:** Not legal advice; not certification; savings figures if shown are indicative ranges not guarantees; no binding supplier contracts from this page.
11. **Privacy:** Data used for assessment only.

---

### 4.2 8 Diagnostic Intake Form Fields (Aman Khatana CRM Mapping)

| # | Form Label | Form ID | Data Type | CRM Field Name | Required? |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Company / Facility Name | `account_name` | String | `Account.Name` | **YES** |
| 2 | State / Location | `state_location` | String | `Account.BillingState` | **YES** |
| 3 | Contact Name & Role | `contact_name`, `buyer_role` | String/Enum | `Contact.FullName`, `Contact.Role` | **YES** |
| 4 | Email & Phone | `contact_email`, `contact_phone` | Email/Tel | `Contact.Email`, `Contact.Phone` | **YES** |
| 5 | Contracted Demand (kW) | `contracted_demand_kw` | Number | `Opportunity.ContractedDemand_kW` | Preferred |
| 6 | Monthly Bill (₹) / Bills Upload | `monthly_bill_inr`, `utility_bill_file` | Number/File | `Opportunity.MonthlySpend_INR`, `Opportunity.BillAttachmentRef` | **YES** (One of these) |
| 7 | Sector | `sector_type` | Enum | `Account.IndustrySector` | Optional |
| 8 | Privacy Consent | `privacy_consent` | Checkbox | `Opportunity.PrivacyConsentAccepted` | **YES** |

---

## 5. Team Deployment & Repository Access Instructions

To ensure Ashish Gill, Aman Khatana, and Mayank Bhola can access and test these files across shared environments:

1. **Local Staging Server / Preview**:
   - Run any local web server (e.g. `npx serve .` or XAMPP / Python `python -m http.server 8000`) inside `c:\Users\Admin.KRIPA\Desktop\insta-utility-project\`.
   - Access via `http://localhost:8000/index.html`.

2. **Shared Git Repository Push**:
   - All files are organized in the root directory `insta-utility-project/` and ready to be committed (`git add . && git commit -m "feat: Gaurav P1 staging conversion journey shell v2.0"`) and pushed to the team's central staging repository branch (`origin/staging-conversion-journey`).

3. **Staging Reply Status Submission**:
```json
{
  "GauravPalSubmission": {
    "Owner": "Gaurav Pal",
    "TaskPriority": "P1 (MVP Conversion Journey / Staging)",
    "Status": "Staging Shell READY FOR QA REVIEW",
    "FormRoute": "Functional",
    "CalculatorStatus": "Placeholder Verified",
    "OfficialLogoURL": "https://www.instautility.com/assets/img/logo/insta-utility-logo.png",
    "CRMIntegration": "100% Schema Mapped (form_field_map.json)",
    "FlaggedBoundary": "Free Top-of-Funnel Check vs Paid Diagnostic (Needs Tarun/Ashish QA confirmation)",
    "QAGateStatus": "SUBMITTED — AWAITING ASHISH GILL REVIEW & CEO GO"
  }
}
```

---
*Submitted for Venture QA Review by Gaurav Pal — VoltOS Greenfield Venture Execution Team.*
