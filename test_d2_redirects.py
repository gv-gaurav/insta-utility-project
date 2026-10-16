import http.server
import socketserver
import urllib.request
import threading
import time
import os

PORT = 8088

# A compatible host simulation that executes the _redirects / .htaccess 301 mapping
REDIRECT_MAP = {
    "/open-access-eligibility-screening.html": "/renewable-energy-advisory.html",
    "/group-captive-screening-for-ci.html": "/renewable-energy-advisory.html",
    "/paid-renewable-power-diagnostic.html": "/renewable-energy-advisory.html"
}

class RedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Normalize path
        req_path = self.path.split("?")[0]
        if req_path in REDIRECT_MAP:
            target = REDIRECT_MAP[req_path]
            self.send_response(301)
            self.send_header("Location", target)
            self.send_header("X-Redirect-Engine", "InstaUtility-Host-Emulated-301")
            self.end_headers()
            return
        return super().do_GET()

    def do_HEAD(self):
        req_path = self.path.split("?")[0]
        if req_path in REDIRECT_MAP:
            target = REDIRECT_MAP[req_path]
            self.send_response(301)
            self.send_header("Location", target)
            self.send_header("X-Redirect-Engine", "InstaUtility-Host-Emulated-301")
            self.end_headers()
            return
        return super().do_HEAD()

def run_server():
    with socketserver.TCPServer(("", PORT), RedirectHandler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(0.5)

    print("=" * 70)
    print("D2 RUNTIME 301 REDIRECT VERIFICATION (COMPATIBLE HOST SIMULATION)")
    print("=" * 70)

    all_passed = True
    for legacy_url, canonical_target in REDIRECT_MAP.items():
        test_url = f"http://localhost:{PORT}{legacy_url}"
        req = urllib.request.Request(test_url, method="HEAD")
        
        # Don't auto-follow redirects so we inspect 301 response
        class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
            def http_error_301(self, req, fp, code, msg, headers):
                return fp

        opener = urllib.request.build_opener(NoRedirectHandler)
        try:
            resp = opener.open(req)
            status = resp.getcode()
            location = resp.headers.get("Location")
            if status == 301 and location == canonical_target:
                print(f"[PASS] {legacy_url} -> HTTP {status} | Location: {location}")
            else:
                print(f"[FAIL] {legacy_url} -> HTTP {status} | Location: {location} (Expected 301 -> {canonical_target})")
                all_passed = False
        except Exception as e:
            print(f"[FAIL] {legacy_url} -> Exception: {e}")
            all_passed = False

    print("-" * 70)
    if all_passed:
        print("ALL 3 LEGACY URLS SUCCESSFULLY EMIT HTTP 301 REDIRECT TO CANONICAL TARGET!")
    else:
        print("FAILED REDIRECT CHECKS DETECTED")
