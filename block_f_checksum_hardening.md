# Block F Checksum Hardening Specification
**Author:** Gaurav Pal  
**Role:** VoltOS / Insta Staging Lead  
**Target Priority:** Priority P2 (Deferred Production Hardening per 04 Sep 2026 CEO Directive)  
**Status:** `DOCUMENTED FOR PRODUCTION HARDENING (Sprint 01 Critical Path Deferred)`  

---

## 1. Context & Executive Directive
As specified in the **VoltOS CEO Internal Execution Control Directive (04 Sep 2026)**:
* **Priority P2 Hardening:** *"Move checksum-layer work out of Sprint 01 critical path. Document future production-hardening method only after live canary passes."*
* **Success Test:** Zero delay to autonomy proof; checksum verification mechanism defined for post-canary deployment.

---

## 2. Technical Architecture for Raw File Checksum Hardening

### 2.1 Problem Statement
In intake forms involving utility bill file uploads (e.g. 12-month DISCOM electricity bill PDFs/ZIPs), raw file tampering, partial upload corruption, or duplicate submission spoofing can compromise CRM data integrity and downstream document processing.

### 2.2 Proposed Solution (Post-Canary Production Phase)
Implement a client-side SHA-256 binary hash generator and header payload verification protocol prior to uploading file attachments into the storage bucket / Zoho attachment endpoint.

```
[ Client Utility Intake Form ]
           │
           ├─► 1. File Selected (PDF/ZIP)
           ├─► 2. Web Crypto API computes SHA-256 Hash
           │      Example: "a3f5c9e2b1d0487...89e"
           │
           ▼
[ Payload Construction ]
           │
           ├─► Attach `BillAttachmentChecksum_SHA256` to Opportunity Payload
           ├─► Include `FileByteSize` & `MIME_Type`
           │
           ▼
[ Staging / Ingestion Gate ]
           │
           ├─► Verify SHA-256 Hash match before write
           └─► De-duplicate matching file hashes across pipeline
```

---

## 3. Client-Side Implementation Code (JavaScript Web Crypto API)

```javascript
/**
 * Computes SHA-256 checksum for utility bill attachment
 * @param {File} file - File object from HTML input
 * @returns {Promise<string>} SHA-256 hash in hex format
 */
async function computeFileChecksum(file) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
```

---

## 4. Integration into CRM Mapping Dictionary

When production hardening is activated, `form_field_map.json` will incorporate the checksum metadata key:

```json
{
  "Opportunity": {
    "BillAttachmentRef": "bills_12month_apex_2026.pdf",
    "BillAttachmentChecksum_SHA256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "FileByteSizeBytes": 2485920,
    "ChecksumVerificationStatus": "UNVERIFIED_STAGING_PLACEHOLDER"
  }
}
```

---

## 5. Verification & Rollout Trigger
1. **Sprint 01 Phase**: Retain as documentation reference only. P0 Live Canary takes precedence.
2. **Production Phase**: Activate `computeFileChecksum()` in `app.js` upon CEO approval and successful completion of Aman's live canary run.
