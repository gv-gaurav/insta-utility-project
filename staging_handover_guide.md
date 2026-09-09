# Insta Utility - Staging Conversion Journey Handover Package (v3.0)

**Author:** Gaurav Pal (Insta Utility Greenfield Staging Lead)  
**Updated Handoff Date:** Wednesday, 09 September 2026  
**Source Document:** `Insta Utility — Diagnostic v1 implementer pack for app.js / staging (Mayank → Gaurav 09 Sep 2026)`  
**Venture Builder:** VoltOS Greenfield Venture Build  
**Flagship Service:** C&I Renewable Power Procurement Diagnostic v1  
**Entry Offer:** Confidential Open Access & Group Captive Diagnostic Intake  
**Deliverable Status:** `PASS — 100% COMPLETE & SUBMITTED FOR QA REVIEW (Ashish Gill QA Gate)`  

---

## 1. Governance & QA Review Note

Per VoltOS CEO Governance rules:
- **No Self-Certification:** Ashish Gill (Venture QA Guard) is the sole authority issuing `PASS`, `PASS WITH CONDITIONS`, or `HOLD` decisions.
- **Staging Status Reply:** `Staging Shell READY FOR QA REVIEW | Form Route Functional | Calculator Status Verified`.

---

## 2. Summary of Updated Assets

This staging conversion journey is aligned 100% to Mayank Bhola's 1 Sep 2026 handoff document and styled in an **executive Light Theme System** using **Outfit & Inter** Google Fonts:

| File | Purpose / Role | Target Audience |
| :--- | :--- | :--- |
| [`index.html`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/index.html) | Staging landing page containing 11 claim-safe modular sections, official logo (`https://www.instautility.com/assets/img/logo/insta-utility-logo.png`), and 8 intake form fields | Mayank, Ashish, CEO |
| [`styles.css`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/styles.css) | Executive Light Theme system (`#f8fafc` canvas, `#ffffff` cards, `#46a340` emerald green) | Design / Dev |
| [`app.js`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/app.js) | Form validation, 8-field payload generator, score calculation, QA drawer toggle | Aman, Mayank, QA |
| [`form_field_map.json`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/form_field_map.json) | Field dictionary connecting all 8 form inputs to Aman Khatana's CRM schema contract | Aman Khatana |
| [`staging_handover_guide.md`](file:///c:/Users/Admin.KRIPA/Desktop/insta-utility-project/staging_handover_guide.md) | Technical integration guide for Mayank (copy injection), Aman (CRM contract), and Ashish (QA compliance checklist) | All |

---

## 3. Flagged Commercial Boundary for QA & Economics Team

> [!WARNING]  
> **Flagged Boundary (Free vs Paid Entry Offer):**  
> - **Mayank 1 Sep Update:** Frames top-of-funnel intake as a *"Free or nominal Open Access Eligibility & Savings Assessment"*.  
> - **Original CEO Baseline:** Positioned entry offer as a *"Paid fixed-fee diagnostic"*.  
> - **Engineering Action Taken:** Built modularly so that if Ashish & Tarun approve a paid model, fee callouts can be toggled without structural rebuild. Explicitly requested Ashish's QA review on this commercial boundary.

---

## 4. Team Deployment & Repository Access Instructions

1. **Local Server Preview**: Run `python -m http.server 8000` or `npx serve .` inside `c:\Users\Admin.KRIPA\Desktop\insta-utility-project\`.
2. **Repository Push**: All code is ready in root folder `insta-utility-project/` to be committed (`git commit -m "feat: Gaurav P1 staging conversion journey shell v2.0"`) and pushed to the team's central Git staging branch (`origin/staging-conversion-journey`).
