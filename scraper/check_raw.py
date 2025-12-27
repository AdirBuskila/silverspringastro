import requests

BASE = "https://silverspringastro.com"

r = requests.get(f"{BASE}/index.html", timeout=30)
print("=== Raw HTML (first 2000 chars) ===")
print(r.text[:2000])

