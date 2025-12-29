#!/usr/bin/env python3
"""
Non-interactive cleanup of asteroid images.
Moves repetitive daily observation images to archive.
"""

import os
import shutil
from pathlib import Path

ASTEROIDS_PATH = Path(r"C:\Users\Adir\Desktop\Coding\Dev\silverspringastro-2\public\images\asteroids")
ARCHIVE_PATH = ASTEROIDS_PATH / "archive"

# Patterns to identify repetitive daily data
REPETITIVE_PATTERNS = [
    'Combo',      # Nightly combo images
    'Moving',     # Moving object images
    'AirMass_',   # Air mass measurements
    'Extinct_',   # Extinction measurements
    'SkyBackGround_', # Sky background data
]

# Patterns to ALWAYS KEEP
KEEP_PATTERNS = [
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

def is_repetitive(filename):
    """Check if file is repetitive daily data."""
    for pattern in KEEP_PATTERNS:
        if pattern in filename:
            return False  # Always keep these
    for pattern in REPETITIVE_PATTERNS:
        if pattern in filename:
            return True
    return False

def main():
    print("Cleaning asteroid images...")
    
    all_images = list(ASTEROIDS_PATH.glob('*.jpg')) + list(ASTEROIDS_PATH.glob('*.gif')) + list(ASTEROIDS_PATH.glob('*.JPG'))
    
    to_archive = [img for img in all_images if is_repetitive(img.name)]
    to_keep = [img for img in all_images if not is_repetitive(img.name)]
    
    print(f"Total: {len(all_images)}")
    print(f"Keeping: {len(to_keep)}")
    print(f"Archiving: {len(to_archive)}")
    
    # Create archive and move files
    ARCHIVE_PATH.mkdir(exist_ok=True)
    
    moved = 0
    for img in to_archive:
        try:
            dest = ARCHIVE_PATH / img.name
            shutil.move(str(img), str(dest))
            moved += 1
        except Exception as e:
            print(f"Error moving {img.name}: {e}")
    
    print(f"\nMoved {moved} repetitive images to archive/")
    print(f"Kept {len(to_keep)} unique/interesting images")

if __name__ == "__main__":
    main()

