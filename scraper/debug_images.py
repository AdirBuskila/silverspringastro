"""
Debug - see all images found on pages
"""
import requests
from bs4 import BeautifulSoup
import urllib.parse

def get_page(url):
    r = requests.get(url, timeout=30)
    return BeautifulSoup(r.content, 'html.parser')

def find_all_images(soup, base_url):
    images = []
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if src:
            if not src.startswith('http'):
                src = urllib.parse.urljoin(base_url, src)
            images.append(('img', src))
    
    for a in soup.find_all('a'):
        href = a.get('href', '')
        if href and ('.jpg' in href.lower() or '.gif' in href.lower()):
            if not href.startswith('http'):
                href = urllib.parse.urljoin(base_url, href)
            images.append(('link', href))
    
    return images

print("=== Galaxy Clusters ===")
url = "http://www.silverspringastro.com/galaxyclusters/galaxyclusters.htm"
soup = get_page(url)
images = find_all_images(soup, url)
for typ, img in images:
    print(f"  [{typ}] {img}")

print("\n=== Star Clusters ===")
url = "http://www.silverspringastro.com/starclusters/starclusters.htm"
soup = get_page(url)
images = find_all_images(soup, url)
for typ, img in images:
    print(f"  [{typ}] {img}")



