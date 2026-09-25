# EXECUTION REPORT — INSTA UTILITY WEBSITE STAGING & CRM-101 INTEGRATION

**Owner:** Gaurav Pal (Web Designer & Staging Construction Lead — WEB-102)  
**Date:** 25 September 2026  
**Target Repository:** `https://github.com/gv-gaurav/insta-utility-project.git`  
**Branch:** `main`  
**Staging Status:** Complete & Verified (`5/5 PASS`)

---

## 🎯 Executive Summary

Today, **Gaurav Pal** successfully completed the end-to-end staging build of the **Insta Utility 5-page website architecture** (WEB-102) and fully aligned all website enquiry forms with **Aman Khatana's CRM-101 lead capture contract**. 

All work has been validated via automated build scripts, committed, and pushed to the primary Git repository.

---

## 💻 Key Tasks Completed Today

### 1. Web Staging Construction (WEB-102 — 5-Page Architecture)
- **Home Page (`index.html`):** 3-Pillar Advisory overview, target reader problems, interactive scoping form, cross-navigation.
- **Renewable Energy Advisory (`renewable-energy-advisory.html`):** C&I solar, open access, group captive advisory scope, 5-step process, and disclaimer controls.
- **Carbon Markets / CCTS Advisory (`carbon-markets-ccts.html`):** PAT transition, CCTS compliance readiness roadmap. *Strict claim isolation:* CCTS is kept completely separate from Green Credits and RECs. No credit trading/brokerage role claimed.
- **GHG Inventory & MRV Advisory (`ghg-mrv-decarbonisation.html`):** Scope 1 & Scope 2 inventory build-out, MRV data flow setup, and decarbonisation roadmaps.
- **Contact Us (`contact.html`):** Introductory call booking form, office placeholders, and contact workflow.
- **Staging Robots Control:** `<meta name="robots" content="noindex, nofollow">` verified across 100% of pages.

### 2. CRM-101 Lead Integration (Target Module: `Website_Leads`)
- Wired all 5 enquiry forms to capture and format the exact **17 CRM fields** specified by Aman Khatana.
- **Static Brand Assignment:** Enforced `Brand = "Insta utility"`.
- **Owner Assignment:** Omitted `Owner` field from website payload (CRM manages default owner assignment).
- **Submission Identifier:** Implemented auto-generating unique `Submission_Ref` in format `IU-YYYY-MMDD-XXXX`.
- **Marketing Attribution Engine (`app.js`):** Auto-captures `UTM_Source`, `UTM_Medium`, `UTM_Campaign`, `GCLID`, and `Landing_Page` from URL parameters.
- **Sector Picklist Alignment:** Restricted to `Commercial`, `Industrial`, `Public Sector`, `Education`, `Healthcare`, `Hospitality`, `Retail`, `Manufacturing`, `Property / Real Estate`, `Other`.
- **Service Interest Picklist Alignment:** Mapped to `Renewable Energy Advisory`, `Carbon Markets / CCTS`, `GHG / MRV & Decarbonisation`.
- **Preferred Contact Route Dropdown:** Updated to `Email` and `Phone` (`WhatsApp` option removed per UI request).
- **PHP Backend Endpoint (`api/submit.php`):** Configured in **Shadow Mode** (`LIVE_WRITE_ENABLED = false`). Generates instant confirmation cards for visitors while logging CRM payloads for Aman Khatana's webhook integration.

### 3. UI/UX Consistency & Footer Unification
- Standardized the 4-column footer component (`brand-col`, `Advisory Services`, `Navigation`, `Claim Safety Notice`) across all 5 pages.
- Refined form inputs, button styling, hover states, and mobile responsive drawer navigation.

---

## 📊 CRM-101 Field Mapping Matrix

| Web Form Field | Frontend DOM ID | CRM API Field Name | Mapped Value / Format |
| :--- | :--- | :--- | :--- |
| **Business Name** | `account_name` | `Business_Name` | Text (Mandatory) |
| **Contact Name** | `contact_name` | `Name` | Text (Mandatory) |
| **Contact Email** | `contact_email` | `Contact_Email` | Email (Mandatory) |
| **Contact Number** | `contact_phone` | `Contact_Number` | Phone (Mandatory) |
| **Postcode** | `postcode` | `Postcode` | PIN Code / Postcode |
| **Submission Ref** | `submission_ref` | `Submission_Ref` | Auto ID (`IU-2026-0925-XXXX`) |
| **Brand** | `brand` | `Brand` | `Insta utility` |
| **UTM Source** | `utm_source` | `UTM_Source` | URL Parameter |
| **UTM Medium** | `utm_medium` | `UTM_Medium` | URL Parameter |
| **UTM Campaign** | `utm_campaign` | `UTM_Campaign` | URL Parameter |
| **GCLID** | `gclid` | `GCLID` | Google Click ID |
| **Landing Page** | `landing_page` | `Landing_Page` | Full Canonical URL |
| **Sector** | `sector_type` | `Sector` | Allowed CRM Picklist |
| **Geography** | `state_location` | `Geography` | State / Region |
| **Service Interest**| `service_interest` | `Service_Interest` | Advisory Pillar Picklist |
| **Contact Route** | `preferred_contact_route` | `Preferred_Contact_Route` | `Email` / `Phone` |
| **Enquiry Context** | `enquiry_context` | `Enquiry_Context` | Multi-line Notes |

---

## 🧪 Automated Verification Results

- **Script:** `validate_pages.js`
- **Results:**
  - `index.html`: **PASS**
  - `renewable-energy-advisory.html`: **PASS**
  - `carbon-markets-ccts.html`: **PASS**
  - `ghg-mrv-decarbonisation.html`: **PASS**
  - `contact.html`: **PASS**

---

## 🚀 Git Commit History (25 Sep 2026)

1. `cad1f9f` — `feat(staging): build 5-page Insta Utility website architecture with noindex & claim safety controls`
2. `694a9fb` — `feat(crm-101): align all 5 website intake forms with Aman Khatana CRM-101 lead capture schema`
3. `4780e51` — `fix(ui): unify footer grid component across all 5 website pages to match homepage standard`
4. `9187fc9` — `fix(forms): remove WhatsApp option from Preferred Contact Route select dropdown across all pages`

---

## ➡️ Next Steps & Ownership Handoff

1. **Ashish (WEB-104):** Perform content intent & claim safety review.
2. **Mayank (WEB-103):** Run on-page SEO QA & meta tag check.
3. **Aman Khatana (CRM-101):** Review JSON payload schema and provide Zoho CRM Webhook API credentials to enable live lead submission.
4. **Tarun (Paid Search):** Map paid search landing URLs once QA passes.

---
*Report generated on 25 September 2026 for Gaurav Pal (Web Construction Lead — WEB-102).*
