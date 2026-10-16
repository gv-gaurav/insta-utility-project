import subprocess
import sys
import json
import os

PAGES = [
    ("index.html", "http://localhost:8080/index.html", "lighthouse_report_index.json"),
    ("renewable-energy-advisory.html", "http://localhost:8080/renewable-energy-advisory.html", "lighthouse_report_renewable.json"),
    ("carbon-markets-ccts.html", "http://localhost:8080/carbon-markets-ccts.html", "lighthouse_report_carbon.json"),
    ("ghg-mrv-decarbonisation.html", "http://localhost:8080/ghg-mrv-decarbonisation.html", "lighthouse_report_ghg.json"),
    ("contact.html", "http://localhost:8080/contact.html", "lighthouse_report_contact.json"),
]

LIGHTHOUSE_CMD = r"E:\npm-global\lighthouse.cmd"

summary = []

for name, url, out_file in PAGES:
    print(f"\n[Lighthouse Audit] Starting audit for {name} ({url})...")
    # If already generated (e.g. index.html), skip or re-run if requested
    if not os.path.exists(out_file) or os.path.getsize(out_file) == 0:
        cmd = [
            LIGHTHOUSE_CMD,
            url,
            "--chrome-flags=--headless=new --no-sandbox",
            "--output=json",
            f"--output-path=./{out_file}",
            "--quiet"
        ]
        ret = subprocess.run(cmd, capture_output=True, text=True)
        if ret.returncode != 0:
            print(f"Warning: Lighthouse exited with code {ret.returncode}: {ret.stderr[:200]}")
    
    if os.path.exists(out_file):
        with open(out_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        cats = data.get("categories", {})
        audits = data.get("audits", {})
        
        perf = int(cats.get("performance", {}).get("score", 0) * 100) if cats.get("performance", {}).get("score") is not None else "N/A"
        a11y = int(cats.get("accessibility", {}).get("score", 0) * 100) if cats.get("accessibility", {}).get("score") is not None else "N/A"
        bp = int(cats.get("best-practices", {}).get("score", 0) * 100) if cats.get("best-practices", {}).get("score") is not None else "N/A"
        seo = int(cats.get("seo", {}).get("score", 0) * 100) if cats.get("seo", {}).get("score") is not None else "N/A"
        
        cls_val = audits.get("cumulative-layout-shift", {}).get("displayValue", "N/A")
        lcp_val = audits.get("largest-contentful-paint", {}).get("displayValue", "N/A")
        fcp_val = audits.get("first-contentful-paint", {}).get("displayValue", "N/A")
        tbt_val = audits.get("total-blocking-time", {}).get("displayValue", "N/A")
        
        summary.append({
            "page": name,
            "perf": perf,
            "a11y": a11y,
            "bp": bp,
            "seo": seo,
            "cls": cls_val,
            "lcp": lcp_val,
            "fcp": fcp_val,
            "tbt": tbt_val,
            "json_path": out_file
        })
        print(f"  -> {name}: Perf={perf}, A11y={a11y}, BestPractices={bp}, SEO={seo} | CLS={cls_val}, LCP={lcp_val}")

print("\n" + "="*80)
print("FINAL LIGHTHOUSE SUMMARY FOR ALL 5 LAUNCH PAGES:")
print("="*80)
print(f"{'Page':<35} | {'Perf':<5} | {'A11y':<5} | {'BP':<5} | {'SEO':<5} | {'CLS':<6} | {'LCP':<8}")
print("-" * 80)
for s in summary:
    print(f"{s['page']:<35} | {str(s['perf']):<5} | {str(s['a11y']):<5} | {str(s['bp']):<5} | {str(s['seo']):<5} | {s['cls']:<6} | {s['lcp']:<8}")

with open("lighthouse_summary.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)
print("\nSaved full summary to lighthouse_summary.json")
