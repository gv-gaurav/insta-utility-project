import json

with open("lighthouse_report_index.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("=== LIGHTHOUSE AUDIT SCORES (index.html) ===")
for cat_id, cat in data.get("categories", {}).items():
    score = int(cat["score"] * 100) if cat.get("score") is not None else "N/A"
    print(f"  {cat['title']}: {score}/100")

print("\n=== CORE WEB VITALS ===")
audits = data.get("audits", {})
for metric in ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]:
    a = audits.get(metric, {})
    print(f"  {a.get('title')}: {a.get('displayValue')} (score: {a.get('score')})")
