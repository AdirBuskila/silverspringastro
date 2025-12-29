#!/usr/bin/env python3
"""
Clean up asteroid images - keep only the most meaningful ones.
Remove repetitive daily observation data images.
"""

import os
import shutil
from pathlib import Path
from collections import defaultdict

ASTEROIDS_PATH = Path(r"C:\Users\Adir\Desktop\Coding\Dev\silverspringastro-2\public\images\asteroids")
ARCHIVE_PATH = ASTEROIDS_PATH / "archive"

def analyze_and_clean():
    """Analyze asteroid images and move repetitive ones to archive."""
    
    # Categories of images
    categories = defaultdict(list)
    
    # Patterns to identify repetitive daily data
    repetitive_patterns = [
        'Combo',      # Nightly combo images (many duplicates)
        'Moving',     # Moving object images (many duplicates)
        'AirMass_',   # Air mass measurements (technical data)
        'Extinct_',   # Extinction measurements (technical data)
        'SkyBackGround_', # Sky background data (technical data)
    ]
    
    # Patterns to KEEP (interesting/unique images)
    keep_patterns = [
        'LC',         # Light curves
        'Stats',      # Statistics
        'Schedule',   # Observation schedules
        'Check',      # MPC verification
        'totals',     # Summary totals
        '_G53',       # Observatory-specific images
        '_WiseBlackBird', # Named objects
        'RT38',       # Specific asteroid observations
        'QH16',       # Specific asteroid observations
        'WE67',       # Specific asteroid observations
    ]
    
    all_images = list(ASTEROIDS_PATH.glob('*.jpg')) + list(ASTEROIDS_PATH.glob('*.gif'))
    
    to_archive = []
    to_keep = []
    
    for img_path in all_images:
        name = img_path.name
        
        # Check if should be kept
        should_keep = False
        for pattern in keep_patterns:
            if pattern in name:
                should_keep = True
                break
        
        if should_keep:
            to_keep.append(img_path)
            continue
        
        # Check if repetitive
        is_repetitive = False
        for pattern in repetitive_patterns:
            if pattern in name:
                is_repetitive = True
                break
        
        if is_repetitive:
            to_archive.append(img_path)
        else:
            to_keep.append(img_path)
    
    print(f"Total images: {len(all_images)}")
    print(f"To keep: {len(to_keep)}")
    print(f"To archive (repetitive): {len(to_archive)}")
    
    print("\n=== Images to KEEP ===")
    for img in sorted(to_keep, key=lambda x: x.name):
        print(f"  {img.name}")
    
    print("\n=== Images to ARCHIVE (repetitive daily data) ===")
    print(f"  {len(to_archive)} images will be moved to archive/")
    
    # Ask before moving
    choice = input("\nMove repetitive images to archive? (y/n): ").strip().lower()
    if choice == 'y':
        ARCHIVE_PATH.mkdir(exist_ok=True)
        for img in to_archive:
            dest = ARCHIVE_PATH / img.name
            shutil.move(str(img), str(dest))
        print(f"Moved {len(to_archive)} images to archive/")
    else:
        print("No changes made.")

if __name__ == "__main__":
    analyze_and_clean()

