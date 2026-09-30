# EXECUTION REPORT — INSTA UTILITY WEB-105 & WEB-108 IMPLEMENTATION

**Owner:** Gaurav Pal (Web Construction Lead)  
**Date:** 30 September 2026  
**Target Repository:** `https://github.com/gv-gaurav/insta-utility-project.git`  
**Branch:** `main`  
**Latest Commit:** `8322f01`  
**Overall Task Status:** COMPLETE (`PASS` for WEB-105 & WEB-108)  

---

## 🎯 Executive Summary

On **30 September 2026**, **Gaurav Pal** successfully completed both **WEB-105 (P0 Claim-Safety Remediation)** and **WEB-108 (P0 Frontend Transport Truthfulness)** for the Insta Utility staging platform.

1. **WEB-105 Claim-Safety Restoration:** The approved, page-specific **Exclusions / Limitations** sections have been fully restored to all 5 staging website pages. Positioned after Deliverables and before Evidence / FAQ, each section visibly establishes service-specific boundaries to prevent claim drift.
2. **WEB-108 Frontend Transport Truthfulness:** Updated `app.js` and `styles.css` to guarantee transport truthfulness. Network failures, API timeouts, and HTTP errors now map exclusively to `ERROR` / `FAIL_CLOSED` and **never** display CRM success. Static host execution on GitHub Pages displays an explicit banner: `STAGING ONLY - NOT WRITTEN TO CRM`. The payload-key mismatch has been fixed, and fake client-side CRM record IDs have been completely removed.
3. **Current Workflow Status:** WEB-108 is complete. **WEB-109 (Hardened Backend Deploy Package)** is currently **BLOCKED** awaiting receipt of **CRM-103** (Production CRM Contract & Allowed Origins) from **Aman Khatana**.

All code, styling, and documentation updates have been committed and pushed to `origin/main`.

---

## 💻 Detailed Task Accomplishments

### 1. Restoration of Page-Level Limitation Blocks (WEB-105 — 5/5 Pages PASS)
- **Home (`index.html`):**
  - Added 4 core advisory limitations: Legal/tax/financial advice exclusion, no broker/verifier/certifier/issuing authority role, no savings/emissions guarantees, and illustrative outreach reference rules.
- **Renewable Energy Advisory (`renewable-energy-advisory.html`):**
  - Added 5 service-specific limitations: No EPC contractor/developer/financier role, no generation output/savings/payback guarantees, no legal/tax advice, no contract drafting/negotiation, and reliance on client-provided data vs statutory approvals.
- **Carbon Markets / CCTS Advisory (`carbon-markets-ccts.html`):**
  - Added 6 regulatory & market limitations: No carbon credit broker/trading intermediary role, no verification/validation/issuance of carbon credits, Green Credits or RECs, no unconfirmed regulator relationships, no compliance target guarantees, advisory nature of public rules, and explicit separation from Green Credit Programme / REC mechanisms.
- **GHG Inventory & MRV Advisory (`ghg-mrv-decarbonisation.html`):**
  - Added 5 assurance limitations: No independent audit/verification of client data, non-3rd-party status, no emission reduction/regulatory acceptance guarantees, advisory status of inventory & roadmaps, and non-replacement of internal client controls.
- **Contact Us (`contact.html`):**
  - Added 3 engagement limitations: Enquiry submission non-engagement clause, indicative response times, and non-advisory nature of contact page.
- **Global Styling (`styles.css`):**
  - Styled `.limitations-section`, `.limitations-card`, and `.limitations-list` with clean amber warning borders (`#f59e0b`), soft background tinting (`#fffdfa`), and 100% mobile responsiveness.

---

### 2. Frontend Transport Truthfulness & Hardening (WEB-108 — 4/4 Acceptance States PASS)

- **Network & API Failure Truthfulness (`app.js`):**
  - Refactored `fetch().catch()` logic. Network errors, server timeouts, or unhandled exceptions now explicitly set transport state to `ERROR` / `FAIL_CLOSED`. Network failure **never** displays CRM success.
- **Staging Shadow Mode Explicit Outcome (`app.js` & `styles.css`):**
  - GitHub Pages static hosting detection (`github.io`) sets mode to `SHADOW_ONLY`.
  - UI banner explicitly renders: **`ℹ️ STAGING ONLY - NOT WRITTEN TO CRM`**.
- **Payload Key Mismatch Fixed (`app.js`):**
  - `processCRMTransportResponse` now inspects `Zoho_Website_Leads_Payload` matching `handleFormSubmit` (with fallback to `Zoho_Website_Leads_Verified_Payload`), ensuring client-side validation evaluates the exact fields submitted by the user.
- **Simulated Record IDs Removed (`app.js`):**
  - Removed random client-side ID generation (`zcrm_...`). Record IDs appear **only** when returned by a live backend/Zoho path.

---

## 🧪 4-State Transport Verification Matrix

| State | Condition | Status Code | UI Banner Outcome | CRM Success Claim? |
| :--- | :--- | :--- | :--- | :--- |
| **Shadow Mode** | GitHub Pages / Static Staging | `NOT_WRITTEN_TO_CRM` | `ℹ️ STAGING ONLY - NOT WRITTEN TO CRM` | ❌ **NO** |
| **Network Failure** | Server offline / Unreachable | `CRM_TRANSPORT_ERROR` | `CRM Transport Error (NOT Written to CRM)` | ❌ **NO** |
| **HTTP Failure** | 4xx / 5xx Bad Response | `FAIL_CLOSED` / `ERROR` | `Fail-Closed: CRM Validation Constraint` | ❌ **NO** |
| **Backend Success** | Live PHP API `200` + `status: SUCCESS` | `CRM_RECORD_CREATED` | `✓ CRM Record Created Successfully` | ✅ **YES (Only state)** |

---

## 📋 Page-by-Page Audit & Verification Matrix

| Page / Component | File Path | Deliverable / Fix | Status |
| :--- | :--- | :--- | :--- |
| **Home** | `index.html` | Restored Exclusions & Limitations callout section | **PASS** |
| **Renewable Energy** | `renewable-energy-advisory.html` | Restored EPC/financial limitation block | **PASS** |
| **Carbon Markets / CCTS** | `carbon-markets-ccts.html` | Restored CCTS no broker/verifier controls | **PASS** |
| **GHG / MRV** | `ghg-mrv-decarbonisation.html` | Restored Non-3rd-party assurance scope limits | **PASS** |
| **Contact** | `contact.html` | Restored engagement & response-time block | **PASS** |
| **Global Styles** | `styles.css` | Responsive `.limitations-section` & outcome banners | **PASS** |
| **CRM Transport** | `app.js` | Enforced WEB-108 transport truthfulness & shadow mode | **PASS** |

---

## 📌 IMPORTANT USER RECOMMENDATION & CONTENT HANDOFF REQUEST

> **Request for Website Copy / Real Content (Ashish Work Handoff):**  
> **Gaurav Pal Note:** "I haven't received any content from Ashish yet. I request that Ashish provide the actual real content/copy for the Insta Utility website pages so that we can replace the staging text with the official approved copy."

---

## 🚀 Complete Git Commit History (30 September 2026)

1. `e874acc` — `feat(WEB-105): restore page-level exclusions & limitations sections`
2. `d04be18` — `docs: add WEB-105 execution report for Gaurav Pal`
3. `da4dd65` — `fix(crm): handle static host 405 gracefully and support live API base URL configuration`
4. `9823833` — `fix(crm): bypass static POST on github.io to prevent HTTP 405 network devtool entries`
5. `bcab357` — `docs: update 30 Sep execution report with WEB-105 & CRM 405 static host resolution`
6. `8322f01` — `fix(WEB-108): enforce frontend transport truthfulness and explicit shadow mode outcomes`

**Repository URL:** [https://github.com/gv-gaurav/insta-utility-project.git](https://github.com/gv-gaurav/insta-utility-project.git)  
**Status:** All commits pushed and up-to-date with `origin/main`.

---

## ➡️ Workflow Status & Next Steps

1. **Aman Khatana (CRM-103 — P0):** Provide production-safe CRM contract, allowed origins list, duplicate handling rule, and response specs. *(Aman pinged; awaiting response)*.
2. **Gaurav Pal (WEB-109 — P0):** Harden PHP backend package (`api/submit.php`) upon receipt of approved CRM-103 contract.
3. **Management Gate:** Authorize server deployment to Insta Utility-controlled PHP staging host.
4. **Aman Khatana (CRM-102):** Execute 1 synthetic non-personal live-write test post-deployment.
5. **Tarun (ADS-008):** Final acquisition gate review.

---
*Report generated on 30 September 2026 for Gaurav Pal (Web Construction Lead).*
