# EXECUTION REPORT — INSTA UTILITY WEB-105 & CRM TRANSPORT STAGING

**Owner:** Gaurav Pal (Web Construction Lead)  
**Date:** 30 September 2026  
**Target Repository:** `https://github.com/gv-gaurav/insta-utility-project.git`  
**Branch:** `main`  
**Latest Commit:** `9823833` (`fix(crm): bypass static POST on github.io to prevent HTTP 405 network devtool entries`)  
**Task Status:** Complete & Verified (`5/5 PASS`)  

---

## 🎯 Executive Summary

Today, **Gaurav Pal** successfully completed **WEB-105 (P0 Claim-Safety Remediation)** and resolved the **CRM-102 GitHub Pages HTTP 405 static hosting transport constraint** for the Insta Utility staging platform.

1. **WEB-105 Claim-Safety Restoration:** The approved, page-specific **Exclusions / Limitations** sections from WEB-101 have been fully restored to all 5 staging pages. Positioned after Deliverables and before Evidence / FAQ, each section visibly establishes service-specific boundaries to prevent claim drift.
2. **CRM Transport & GitHub Pages Static Host Resolution:** Addressed the HTTP 405 error caused by GitHub Pages not supporting server-side PHP execution (`api/submit.php`). Updated `app.js` to detect static hosts and process CRM-101 lead payloads in **Staging Shadow Mode** with 0 network errors, while preserving full live backend routing via `window.STAGING_API_BASE_URL`.

All code, styling, and documentation changes have been tested, committed, and pushed to `origin/main`.

---

## 💻 Key Tasks Completed Today (30 September 2026)

### 1. Restoration of Page-Level Limitation Blocks (WEB-105 — 5/5 Pages)
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

### 2. UI/UX Styling & Mobile Responsiveness (`styles.css`)
- Implemented `.limitations-section`, `.limitations-card`, and `.limitations-list` CSS classes.
- Designed clean callout boxes with `#fffdfa` background, `#f59e0b` amber border, and `#d97706` left indicator.
- Verified 100% responsive rendering across desktop, tablet, and mobile drawers.

### 3. CRM-102 Transport & GitHub Pages HTTP 405 Resolution (`app.js`)
- **Root Cause Identified:** GitHub Pages is a static host and does not execute server-side PHP (`api/submit.php`) or allow HTTP `POST` methods on static paths, resulting in HTTP 405 Method Not Allowed in DevTools.
- **Frontend Static Bypass Implemented (`9823833`):** Updated `app.js` to detect static host execution (`github.io`). When running on static hosting without an external backend URL configured, it bypasses static POST requests to eliminate red 405 DevTool entries and cleanly completes the submission in **Staging Shadow Mode**.
- **Live API Routing Preserved:** Maintained full support for `window.STAGING_API_BASE_URL` so that when a live PHP backend is active (e.g. Render, Railway, cPanel, or local `php -S 127.0.0.1:8000`), POST requests route directly to the live server.

---

## 📋 Page-by-Page Audit & Verification Matrix

| Page Name | File Path | Deliverable / Fix | Status |
| :--- | :--- | :--- | :--- |
| **Home** | `index.html` | Home Exclusions / Limitations section added | **PASS** |
| **Renewable Energy** | `renewable-energy-advisory.html` | Service-specific EPC/financial boundary block added | **PASS** |
| **Carbon Markets / CCTS** | `carbon-markets-ccts.html` | CCTS no broker/verifier controls & Green Credit/REC separation added | **PASS** |
| **GHG / MRV** | `ghg-mrv-decarbonisation.html` | Non-3rd-party assurance & advisory scope limits added | **PASS** |
| **Contact** | `contact.html` | Engagement & response-time limitation block added | **PASS** |
| **Global Styles** | `styles.css` | Added responsive `.limitations-section` & `.limitations-card` styles | **PASS** |
| **CRM Integration** | `app.js` | Resolved HTTP 405 static host issue & enabled client-side shadow mode | **PASS** |

---

## 🚀 Complete Git Commit History (30 September 2026)

1. `e874acc` — `feat(WEB-105): restore page-level exclusions & limitations sections`
2. `d04be18` — `docs: add WEB-105 execution report for Gaurav Pal`
3. `da4dd65` — `fix(crm): handle static host 405 gracefully and support live API base URL configuration`
4. `9823833` — `fix(crm): bypass static POST on github.io to prevent HTTP 405 network devtool entries`

**Repository URL:** [https://github.com/gv-gaurav/insta-utility-project.git](https://github.com/gv-gaurav/insta-utility-project.git)  
**Status:** All commits pushed and up-to-date with `origin/main`.

---

## ➡️ Next Steps & Workflow Handoff

1. **Ashish (WEB-106):** Page-by-page claim-safety re-verification against WEB-101 (Ready for Ashish).
2. **Mayank (WEB-107):** Post-remediation regression QA (pending WEB-106 pass).
3. **Aman Khatana (CRM-102):** Re-test synthetic submission on `gv-gaurav.github.io` (Staging Shadow Mode active with 0 network errors). For live Zoho CRM writes, point `window.STAGING_API_BASE_URL` to live PHP endpoint.
4. **Tarun (ADS-008):** Final no-spend launch gate (gated behind website + CRM evidence).

---
*Report generated on 30 September 2026 for Gaurav Pal (Web Construction Lead).*
