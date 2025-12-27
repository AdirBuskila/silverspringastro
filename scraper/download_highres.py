"""
High Resolution Image Downloader for Silver Spring Observatory

Downloads full-resolution images (not thumbnails) from the original site.
Also downloads the Ken Levin hero image.
"""

import os
import re
import requests
from pathlib import Path
from urllib.parse import urljoin

BASE_URL = "https://silverspringastro.com"
OUTPUT_DIR = Path("../public/images")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

session = requests.Session()
session.headers.update(HEADERS)

def download_image(url: str, output_path: Path) -> bool:
    """Download a single image"""
    try:
        response = session.get(url, timeout=60)
        response.raise_for_status()
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        size_kb = len(response.content) / 1024
        print(f"  [OK] Downloaded: {output_path.name} ({size_kb:.1f} KB)")
        return True
    except Exception as e:
        print(f"  [FAIL] Failed: {url} - {e}")
        return False

def download_hero_images():
    """Download the Ken Levin hero images from the home page"""
    print("\n=== Downloading Hero Images ===")
    
    hero_images = [
        ("new_mount2.jpg", "hero/ken-telescope.jpg"),  # Ken with telescope
        ("NMscope_thumb.jpg", "hero/nm-scope.jpg"),    # New Mexico scope
        ("ABL_thumb.jpg", "hero/abl.jpg"),             # ABL image
    ]
    
    for src_name, dest_path in hero_images:
        url = f"{BASE_URL}/{src_name}"
        output = OUTPUT_DIR / dest_path
        download_image(url, output)

def download_galaxy_fullres():
    """Download full resolution galaxy images"""
    print("\n=== Downloading Full Resolution Galaxy Images ===")
    
    # Known full-res galaxy images from the site
    galaxy_images = [
        "M100_LRGB_BBO.jpg",
        "M101_LRGB_H85.jpg", 
        "M105_L_H85.jpg",
        "M106_LRGB_H85.jpg",
        "M51_LRGB_H85.jpg",
        "M51_LRGB_gradient_H85.jpg",
        "M63_LRGB_H85.jpg",
        "M74_LRGB_H85.jpg",
        "M74_LRGB_BBO.jpg",
        "M82_LRGB_H85.jpg",
        "M82_LRGBHa_H85.jpg",
        "M88_LRGB_H85.jpg",
        "M90_LRGB_BBO.jpg",
        "M95_LRGB_BBO.jpg",
        "M95_LRGB_H85.jpg",
        "NGC1156_RGB_H85.jpg",
        "NGC253_LRGB_BBO.jpg",
        "NGC2752_L_H85.jpg",
        "NGC2903_LRGB_BBO.jpg",
        "NGC6181_L_H85.jpg",
        "NGC7331_LRGB_H85.jpg",
        "NGC891_LRGB_BBO.jpg",
        "NGC891_LRGB_H85.jpg",
        "NGC90_LRGB_H85.jpg",
    ]
    
    for img in galaxy_images:
        url = f"{BASE_URL}/galaxies/images/{img}"
        output = OUTPUT_DIR / "galaxies" / img
        download_image(url, output)

def download_nebula_fullres():
    """Download full resolution nebula images"""
    print("\n=== Downloading Full Resolution Nebula Images ===")
    
    nebula_images = [
        "M1_LRGB_H85.jpg",
        "M20_RGB_BBO.jpg",
        "M27_LRGB_H85.jpg",
        "M57_LRGB_H85.jpg",
        "NGC2346_LRGB_H85.jpg",
        "NGC6826_LRGB_H85.jpg",
        "NGC7635_LRGB_BBO.jpg",
        "PK205_LRGB_BBO.jpg",
    ]
    
    for img in nebula_images:
        url = f"{BASE_URL}/nebulae/images/{img}"
        output = OUTPUT_DIR / "nebulae" / img
        download_image(url, output)

def download_supernova_fullres():
    """Download full resolution supernova images"""
    print("\n=== Downloading Full Resolution Supernova Images ===")
    
    sn_images = [
        "SN2004eo_LRGB_H85.jpg",
        "SN2004et_RGB_H85.jpg",
        "SN2004fu_RGB_H85.jpg",
        "SN2004gq_RGB_H85.jpg",
        "SN2005A_RGB_H85.jpg",
        "SN2005am_RGB_H85.jpg",
        "SN2005ay_RGB_H85.jpg",
        "SN2005cs_RGB_H85.jpg",
        "SN2005da_RGB_H85.jpg",
        "SN2005de_RGB_H85.jpg",
        "SN2005W_RGB_H85.jpg",
        "SN2008ax_LRGB_H85.jpg",
        "SN2008bo_LRGB_H85.jpg",
    ]
    
    for img in sn_images:
        url = f"{BASE_URL}/supernovae/images/{img}"
        output = OUTPUT_DIR / "supernovae" / img
        download_image(url, output)

def download_asteroid_fullres():
    """Download full resolution asteroid images"""
    print("\n=== Downloading Full Resolution Asteroid Images ===")
    
    # These are from the asteroidsastrometry page
    ast_images = [
        ("asteroidsastrometry/images/astero2.gif", "asteroids/astero2.gif"),
        ("asteroidsastrometry/images/wmap.jpg", "asteroids/wmap.jpg"),
        ("asteroidsastrometry/images/MP785_LC.jpg", "asteroids/MP785_LC.jpg"),
        ("asteroidsastrometry/images/2002QF15_20060723_WiseBlackBird.jpg", "asteroids/2002QF15_20060723_WiseBlackBird.jpg"),
    ]
    
    for src, dest in ast_images:
        url = f"{BASE_URL}/{src}"
        output = OUTPUT_DIR / dest
        download_image(url, output)

def download_exoplanet_fullres():
    """Download full resolution exoplanet images"""
    print("\n=== Downloading Full Resolution Exoplanet Images ===")
    
    exo_images = [
        "exopla1.jpg",
        "HD17156b_2.jpg",
        "HD189733.jpg",
        "WASP1.jpg",
    ]
    
    for img in exo_images:
        url = f"{BASE_URL}/exoplanets/images/{img}"
        output = OUTPUT_DIR / "exoplanets" / img
        download_image(url, output)

def main():
    print("=" * 60)
    print("Silver Spring Observatory - High Resolution Image Downloader")
    print("=" * 60)
    
    # Create hero directory
    (OUTPUT_DIR / "hero").mkdir(parents=True, exist_ok=True)
    
    download_hero_images()
    download_galaxy_fullres()
    download_nebula_fullres()
    download_supernova_fullres()
    download_asteroid_fullres()
    download_exoplanet_fullres()
    
    print("\n" + "=" * 60)
    print("Download Complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()

