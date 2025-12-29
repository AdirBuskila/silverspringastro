import requests
from bs4 import BeautifulSoup

BASE = "https://silverspringastro.com"

r = requests.get(f"{BASE}/index.html", timeout=30)
soup = BeautifulSoup(r.content, 'html.parser')

print("=== All Links ===")
for a in soup.find_all('a'):
    href = a.get('href', '')
    text = a.get_text(strip=True)[:50]
    if href:
        print(f"  {href} -> {text}")

print("\n=== All Images ===")
for img in soup.find_all('img'):
    src = img.get('src', '')
    if src:
        print(f"  {src}")



