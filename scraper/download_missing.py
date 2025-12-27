"""
Download missing images from silverspringastro.com
Galaxy Clusters and Star Clusters
"""
import requests
from pathlib import Path
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://silverspringastro.com/"

# Galaxy Clusters images
GALAXY_CLUSTERS = [
    "Abell_1656_LRGB_H85.jpg",
    "Abell_262_LRGB_H85.jpg",
    "Abell_262.jpg",
    "Abell_426_LRGB_H85.jpg",
    "Arp319_LRGB_BBO.jpg",
    "Arp319_LRGB_H85.jpg",
    "Arp319_L_H85.jpg",
]

# Star Clusters images  
STAR_CLUSTERS = [
    "M13_LRGB_H85.jpg",
    "M5_LRGB_H85.jpg",
]

def download_image(filename: str, category: str):
    """Download an image from the original site."""
    url = f"{BASE_URL}{filename}"
    output_dir = Path(f"public/images/{category}")
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename
    
    if output_path.exists():
        print(f"  [SKIP] {filename} already exists")
        return True
    
    try:
        print(f"  Downloading {filename}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        size_kb = output_path.stat().st_size / 1024
        print(f"  [OK] {filename} ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"  [FAIL] {filename}: {e}")
        return False

def main():
    print("=" * 60)
    print("Downloading Missing Images")
    print("=" * 60)
    
    print("\n=== Galaxy Clusters ===")
    for img in GALAXY_CLUSTERS:
        download_image(img, "galaxy-clusters")
    
    print("\n=== Star Clusters ===")
    for img in STAR_CLUSTERS:
        download_image(img, "star-clusters")
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)

if __name__ == "__main__":
    main()

