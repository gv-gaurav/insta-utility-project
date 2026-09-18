import os
import time
import logging
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS for local frontend origins
ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:8000,http://127.0.0.1:8000,http://localhost:5055,http://127.0.0.1:5055").split(",")
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}}, supports_credentials=True)

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("InstaCRMBackend")

# Configuration from environment / Aman's verified contract
ZOHO_CLIENT_ID = os.getenv("ZOHO_CLIENT_ID", "1000.YYH0LI03EGY4E81VU91KH3B3X0E4AF")
ZOHO_CLIENT_SECRET = os.getenv("ZOHO_CLIENT_SECRET", "b72fad09ec5c5dcfcf69995cb5f9db429892301656")
ZOHO_GRANT_TYPE = os.getenv("ZOHO_GRANT_TYPE", "client_credentials")
ZOHO_SCOPE = os.getenv("ZOHO_SCOPE", "ZohoCRM.modules.ALL")
ZOHO_SOID = os.getenv("ZOHO_SOID", "ZohoCRM.60046335348")
ZOHO_TOKEN_URL = os.getenv("ZOHO_TOKEN_URL", "https://accounts.zoho.in/oauth/v2/token")
ZOHO_LEAD_URL = os.getenv("ZOHO_LEAD_URL", "https://www.zohoapis.in/crm/v8/Website_Leads")

LIVE_WRITE_ENABLED = os.getenv("LIVE_WRITE_ENABLED", "False").lower() in ("true", "1", "t", "yes")

# Token Cache State
_token_cache = {
    "access_token": None,
    "expires_at": 0
}

def get_zoho_access_token():
    """Retrieves or refreshes OAuth access token using client_credentials grant."""
    now = time.time()
    if _token_cache["access_token"] and _token_cache["expires_at"] > now + 60:
        return _token_cache["access_token"], None

    logger.info("Requesting fresh OAuth access token from Zoho...")
    payload = {
        "grant_type": ZOHO_GRANT_TYPE,
        "client_id": ZOHO_CLIENT_ID,
        "client_secret": ZOHO_CLIENT_SECRET,
        "scope": ZOHO_SCOPE,
        "soid": ZOHO_SOID
    }
    
    try:
        res = requests.post(ZOHO_TOKEN_URL, data=payload, timeout=10)
        data = res.json()
        
        if "access_token" in data:
            access_token = data["access_token"]
            expires_in = int(data.get("expires_in", 3600))
            _token_cache["access_token"] = access_token
            _token_cache["expires_at"] = now + expires_in
            logger.info("Successfully fetched Zoho OAuth access token.")
            return access_token, None
        else:
            err_msg = data.get("error", "Unknown token error")
            logger.error(f"Failed to fetch Zoho OAuth token: {err_msg}")
            return None, f"OAuth Token Error: {err_msg}"
    except Exception as e:
        logger.exception("Exception occurred during Zoho OAuth token request.")
        return None, str(e)

@app.route("/health", methods=["GET"])
def health_check():
    """Health endpoint for staging/production readiness checks."""
    return jsonify({
        "status": "PASS",
        "service": "insta-crm-backend",
        "live_write_enabled": LIVE_WRITE_ENABLED,
        "target_endpoint": ZOHO_LEAD_URL
    }), 200

@app.route("/api/insta/crm/submit", methods=["POST"])
def submit_lead():
    """
    Form submission endpoint:
    Maps 6 verified contract fields and safely posts to Zoho CRM v8 Website_Leads.
    """
    body = request.get_json() or {}
    
    # Extract frontend fields with fallbacks
    account_name = body.get("account_name") or body.get("Business_Name")
    contact_name = body.get("contact_name") or body.get("Name")
    contact_email = body.get("contact_email") or body.get("Contact_Email")
    contact_phone = body.get("contact_phone") or body.get("Contact_Number")
    submission_ref = body.get("submission_ref") or body.get("Submission_Ref") or f"IU-2026-{int(time.time())}"
    brand = body.get("brand") or body.get("Brand") or "Insta utility"

    # Validation: Ensure mandatory fields exist
    missing_fields = []
    if not account_name: missing_fields.append("account_name")
    if not contact_name: missing_fields.append("contact_name")
    if not contact_email: missing_fields.append("contact_email")
    if not contact_phone: missing_fields.append("contact_phone")

    if missing_fields:
        logger.warning(f"Submission rejected due to missing mandatory fields: {missing_fields}")
        return jsonify({
            "status": "FAIL_CLOSED",
            "reason_code": "MISSING_MANDATORY_FIELDS",
            "missing_fields": missing_fields
        }), 400

    # Build Zoho 6-Field Payload according to verified contract
    zoho_record = {
        "Business_Name": account_name,
        "Name": contact_name,
        "Contact_Email": contact_email,
        "Contact_Number": contact_phone,
        "Submission_Ref": submission_ref,
        "Brand": brand
    }

    logger.info(f"Received submission for Ref: {submission_ref} ({account_name})")

    # If Live Write is disabled (Shadow/Staging Mode), return controlled dry-run response
    if not LIVE_WRITE_ENABLED:
        logger.info("[SHADOW MODE] LIVE_WRITE_ENABLED=False. Controlled dry-run PASS. 0 CRM writes performed.")
        return jsonify({
            "status": "FAIL_CLOSED",
            "mode": "SHADOW_ONLY",
            "message": "Local integration test successful. LIVE_WRITE_ENABLED=False (0 CRM writes).",
            "submission_ref": submission_ref,
            "mapped_payload": zoho_record
        }), 200

    # Retrieve OAuth Access Token securely on backend
    access_token, token_err = get_zoho_access_token()
    if not access_token:
        return jsonify({
            "status": "FAIL_CLOSED",
            "reason_code": "OAUTH_AUTHENTICATION_FAILURE",
            "error_detail": token_err
        }), 500

    # Post Record to Zoho CRM v8 Website_Leads Endpoint
    headers = {
        "Authorization": f"Zoho-oauthtoken {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "data": [zoho_record]
    }

    try:
        logger.info(f"Posting lead record to Zoho CRM v8 Website_Leads: {ZOHO_LEAD_URL}")
        res = requests.post(ZOHO_LEAD_URL, json=payload, headers=headers, timeout=15)
        res_data = res.json()

        logger.info(f"Zoho API Response Status ({res.status_code}): {res_data}")

        if res.status_code in (200, 201):
            return jsonify({
                "status": "SUCCESS",
                "message": "Lead record successfully created in Zoho CRM.",
                "submission_ref": submission_ref,
                "zoho_response": res_data
            }), 200
        else:
            return jsonify({
                "status": "FAIL_CLOSED",
                "reason_code": "ZOHO_API_ERROR",
                "http_code": res.status_code,
                "zoho_error": res_data
            }), res.status_code

    except Exception as e:
        logger.exception("Exception occurred during Zoho CRM POST request.")
        return jsonify({
            "status": "FAIL_CLOSED",
            "reason_code": "HTTP_CONNECTION_ERROR",
            "error_detail": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5055))
    logger.info(f"Starting Insta CRM Staging Backend API on http://127.0.0.1:{port}")
    logger.info(f"LIVE_WRITE_ENABLED = {LIVE_WRITE_ENABLED}")
    app.run(host="127.0.0.1", port=port, debug=True)
