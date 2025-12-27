"""
Download galaxy clusters and star clusters images
"""
import requests
from pathlib import Path
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def download(url, output_path):
    """Download a file."""
    if output_path.exists():
        print(f"  [SKIP] {output_path.name}")
        return True
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        with open(output_path, 'wb') as f:
            f.write(r.content)
        size_kb = output_path.stat().st_size / 1024
        print(f"  [OK] {output_path.name} ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"  [FAIL] {output_path.name}: {e}")
        return False

# Galaxy Clusters
gc_base = "http://www.silverspringastro.com/galaxyclusters/images"
gc_images = [
    "Abell-1656_LRGB_H85",
    "Abell-262_L_H85",
    "Abell-426_L_H85",
    "Abell262_LRGB_BBO",
    "Arp319_LRGB_BBO",
    "Arp319_L_H85",
    "Arp319_RGB_H85",
    "M105_L_H85",
    "NGC2752_L_H85",
    "NGC90_LRGB_H85",
]

# Star Clusters
sc_base = "http://www.silverspringastro.com/starclusters/images"
sc_images = [
    "M13_LRGB_H85",
    "M5_LRGB_H85",
]

print("=" * 60)
print("Downloading Cluster Images")
print("=" * 60)

# Galaxy Clusters
print("\n=== Galaxy Clusters ===")
gc_dir = Path("public/images/galaxy-clusters")
gc_dir.mkdir(parents=True, exist_ok=True)

for img in gc_images:
    # Try full size first
    full_url = f"{gc_base}/{img}.jpg"
    thumb_url = f"{gc_base}/{img}_thumb.jpg"
    
    # Download full size
    download(full_url, gc_dir / f"{img}.jpg")
    # Download thumbnail
    download(thumb_url, gc_dir / f"{img}_thumb.jpg")

# Star Clusters
print("\n=== Star Clusters ===")
sc_dir = Path("public/images/star-clusters")
sc_dir.mkdir(parents=True, exist_ok=True)

for img in sc_images:
    full_url = f"{sc_base}/{img}.jpg"
    thumb_url = f"{sc_base}/{img}_thumb.jpg"
    
    download(full_url, sc_dir / f"{img}.jpg")
    download(thumb_url, sc_dir / f"{img}_thumb.jpg")

print("\n" + "=" * 60)
print("Done!")
print("=" * 60)

