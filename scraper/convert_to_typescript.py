"""
Convert scraped JSON data to TypeScript data files

This script:
1. Reads the scraped JSON data
2. Groups images by full-size vs thumbnails
3. Adds enhanced metadata (names, descriptions)
4. Outputs TypeScript files for the Next.js site
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass

# Messier object catalog with names
MESSIER_NAMES = {
    "M1": "Crab Nebula",
    "M3": "Messier 3",
    "M5": "Messier 5",
    "M8": "Lagoon Nebula",
    "M13": "Great Hercules Cluster",
    "M16": "Eagle Nebula",
    "M17": "Omega Nebula",
    "M20": "Trifid Nebula",
    "M27": "Dumbbell Nebula",
    "M31": "Andromeda Galaxy",
    "M33": "Triangulum Galaxy",
    "M42": "Orion Nebula",
    "M45": "Pleiades",
    "M51": "Whirlpool Galaxy",
    "M57": "Ring Nebula",
    "M63": "Sunflower Galaxy",
    "M74": "Phantom Galaxy",
    "M81": "Bode's Galaxy",
    "M82": "Cigar Galaxy",
    "M88": "Messier 88",
    "M90": "Messier 90",
    "M95": "Messier 95",
    "M100": "Mirror Galaxy",
    "M101": "Pinwheel Galaxy",
    "M104": "Sombrero Galaxy",
    "M105": "Messier 105",
    "M106": "Messier 106",
}

NGC_NAMES = {
    "NGC253": "Sculptor Galaxy",
    "NGC891": "Silver Sliver Galaxy",
    "NGC1156": "NGC 1156",
    "NGC2346": "Butterfly Nebula",
    "NGC2752": "NGC 2752",
    "NGC2903": "NGC 2903",
    "NGC4565": "Needle Galaxy",
    "NGC6181": "NGC 6181",
    "NGC6826": "Blinking Planetary",
    "NGC7331": "NGC 7331",
    "NGC7635": "Bubble Nebula",
    "NGC90": "NGC 90",
}

# Descriptions for common objects
OBJECT_DESCRIPTIONS = {
    "M1": "The Crab Nebula is a supernova remnant in the constellation Taurus.",
    "M20": "The Trifid Nebula is an emission/reflection nebula in Sagittarius.",
    "M27": "The Dumbbell Nebula is a planetary nebula in the constellation Vulpecula.",
    "M51": "The Whirlpool Galaxy is an interacting grand-design spiral galaxy with NGC 5195.",
    "M57": "The Ring Nebula is a planetary nebula in the constellation Lyra.",
    "M63": "The Sunflower Galaxy is a spiral galaxy in Canes Venatici.",
    "M74": "The Phantom Galaxy is a face-on spiral galaxy in the constellation Pisces.",
    "M82": "The Cigar Galaxy is a starburst galaxy with prominent hydrogen-alpha emissions.",
    "M100": "M100 is a grand design spiral galaxy in the constellation Coma Berenices.",
    "M101": "The Pinwheel Galaxy is a face-on spiral galaxy in Ursa Major.",
    "M106": "M106 is a spiral galaxy with an active galactic nucleus in Canes Venatici.",
    "NGC253": "The Sculptor Galaxy is a spiral galaxy in the constellation Sculptor.",
    "NGC891": "NGC 891 is an edge-on unbarred spiral galaxy in Andromeda.",
    "NGC2346": "The Butterfly Nebula is a planetary nebula in Monoceros.",
    "NGC6826": "The Blinking Planetary is a planetary nebula in Cygnus.",
    "NGC7331": "NGC 7331 is an unbarred spiral galaxy in Pegasus.",
    "NGC7635": "The Bubble Nebula is an emission nebula in Cassiopeia.",
}


def extract_designation(filename: str) -> Optional[str]:
    """Extract Messier or NGC designation from filename"""
    # Try Messier
    m_match = re.match(r'^M(\d+)', filename, re.IGNORECASE)
    if m_match:
        return f"M{m_match.group(1)}"
    
    # Try NGC
    ngc_match = re.match(r'^NGC(\d+)', filename, re.IGNORECASE)
    if ngc_match:
        return f"NGC{ngc_match.group(1)}"
    
    # Try PK (planetary nebula)
    pk_match = re.match(r'^PK(\d+)', filename, re.IGNORECASE)
    if pk_match:
        return f"PK {pk_match.group(1)}"
    
    # Try SN (supernova)
    sn_match = re.match(r'^SN(\d+)', filename, re.IGNORECASE)
    if sn_match:
        return f"SN {sn_match.group(1)}"
    
    return None


def extract_filters(filename: str) -> Optional[str]:
    """Extract filter info from filename"""
    if 'LRGBHa' in filename or 'LRGB_Ha' in filename:
        return 'LRGB+Ha'
    elif 'LRGB' in filename:
        return 'LRGB'
    elif 'RGB' in filename:
        return 'RGB'
    elif '_L_' in filename:
        return 'L'
    return None


def extract_observatory(filename: str) -> Optional[str]:
    """Extract observatory code from filename"""
    if '_BBO' in filename or 'BBO_' in filename or filename.endswith('BBO.jpg'):
        return 'BBO'
    elif '_H85' in filename or 'H85_' in filename or filename.endswith('H85.jpg'):
        return 'H85'
    elif '_SRO' in filename or 'SRO_' in filename:
        return 'SRO'
    return None


def is_thumbnail(filename: str) -> bool:
    """Check if file is a thumbnail"""
    return '_thumb' in filename.lower()


def get_full_image_path(thumb_path: str) -> str:
    """Get full image path from thumbnail path"""
    return thumb_path.replace('_thumb', '')


def process_images(json_data: List[dict], category: str) -> List[dict]:
    """Process images and pair thumbnails with full images"""
    
    # Separate thumbs and full images
    thumbs = {}
    full_images = {}
    
    for img in json_data:
        filename = img['filename']
        if is_thumbnail(filename):
            # Get the base name (remove _thumb)
            base_name = filename.replace('_thumb.jpg', '.jpg').replace('_thumb.png', '.png')
            thumbs[base_name] = img
        else:
            full_images[filename] = img
    
    # Create processed images list
    processed = []
    seen = set()
    
    for filename, img in full_images.items():
        if filename in seen:
            continue
        seen.add(filename)
        
        designation = extract_designation(filename)
        filters = extract_filters(filename)
        observatory = extract_observatory(filename)
        
        # Get name from catalogs
        name = None
        description = None
        if designation:
            name = MESSIER_NAMES.get(designation) or NGC_NAMES.get(designation)
            description = OBJECT_DESCRIPTIONS.get(designation)
        
        # Build image record
        record = {
            'id': f"{category[:3]}-{filename.replace('.jpg', '').replace('.png', '').lower().replace('_', '-')}",
            'designation': designation or filename.replace('.jpg', '').replace('.png', ''),
            'name': name,
            'category': category,
            'observatory': observatory,
            'filters': filters,
            'description': description,
            'imagePath': f"/images/{category}/{filename}",
            'thumbnailPath': f"/images/{category}/{filename.replace('.jpg', '_thumb.jpg').replace('.png', '_thumb.png')}" if filename in thumbs or filename.replace('.jpg', '_thumb.jpg') else None,
            'featured': designation in ['M51', 'M82', 'M101', 'M100', 'M1', 'M27', 'M57', 'NGC7635']
        }
        
        processed.append(record)
    
    return processed


def generate_typescript(category: str, images: List[dict]) -> str:
    """Generate TypeScript code for images"""
    
    lines = [
        f"// Auto-generated from scraped data",
        f"// Category: {category}",
        f"",
        f"import {{ AstronomyImage }} from '@/lib/types';",
        f"",
        f"export const {category.replace('-', '')}Images: AstronomyImage[] = [",
    ]
    
    for img in images:
        lines.append(f"  {{")
        lines.append(f"    id: '{img['id']}',")
        lines.append(f"    designation: '{img['designation']}',")
        if img['name']:
            lines.append(f"    name: '{img['name']}',")
        lines.append(f"    category: '{img['category']}',")
        if img['observatory']:
            lines.append(f"    observatory: '{img['observatory']}',")
        else:
            lines.append(f"    observatory: 'H85',")
        if img['filters']:
            lines.append(f"    filters: '{img['filters']}',")
        if img['description']:
            lines.append(f"    description: '{img['description']}',")
        lines.append(f"    imagePath: '{img['imagePath']}',")
        lines.append(f"    thumbnailPath: '{img['thumbnailPath'] or img['imagePath']}',")
        if img.get('featured'):
            lines.append(f"    featured: true,")
        lines.append(f"  }},")
    
    lines.append(f"];")
    
    return '\n'.join(lines)


def main():
    scraped_dir = Path("../src/data/scraped")
    output_dir = Path("../src/data/generated")
    output_dir.mkdir(exist_ok=True)
    
    categories = ['galaxies', 'nebulae', 'supernovae', 'asteroids', 'exoplanets', 'equipment', 'travel']
    
    all_images = []
    
    for category in categories:
        json_file = scraped_dir / f"{category}.json"
        if not json_file.exists():
            print(f"Skipping {category} - no JSON file")
            continue
        
        print(f"\nProcessing {category}...")
        
        with open(json_file) as f:
            data = json.load(f)
        
        processed = process_images(data, category)
        print(f"  Found {len(processed)} unique images")
        
        # Generate TypeScript
        ts_code = generate_typescript(category, processed)
        
        ts_file = output_dir / f"{category}.ts"
        with open(ts_file, 'w') as f:
            f.write(ts_code)
        print(f"  Written to {ts_file}")
        
        all_images.extend(processed)
    
    # Generate combined images file
    print(f"\n\nTotal images: {len(all_images)}")
    print("Generating combined images.ts...")
    
    combined_lines = [
        "// Auto-generated from scraped silverspringastro.com data",
        "// Total images: " + str(len(all_images)),
        "",
        "import { AstronomyImage, Category, ObservatoryCode } from '@/lib/types';",
        "",
        "export const astronomyImages: AstronomyImage[] = [",
    ]
    
    for img in all_images:
        combined_lines.append(f"  {{")
        combined_lines.append(f"    id: '{img['id']}',")
        combined_lines.append(f"    designation: '{img['designation']}',")
        if img.get('name'):
            combined_lines.append(f"    name: '{img['name']}',")
        combined_lines.append(f"    category: '{img['category']}' as Category,")
        combined_lines.append(f"    observatory: '{img.get('observatory', 'H85')}' as ObservatoryCode,")
        if img.get('filters'):
            combined_lines.append(f"    filters: '{img['filters']}',")
        if img.get('description'):
            desc = img['description'].replace("'", "\\'")
            combined_lines.append(f"    description: '{desc}',")
        combined_lines.append(f"    imagePath: '{img['imagePath']}',")
        combined_lines.append(f"    thumbnailPath: '{img.get('thumbnailPath') or img['imagePath']}',")
        if img.get('featured'):
            combined_lines.append(f"    featured: true,")
        combined_lines.append(f"  }},")
    
    combined_lines.append("];")
    combined_lines.append("")
    combined_lines.append("// Helper functions")
    combined_lines.append("export function getImagesByCategory(category: string): AstronomyImage[] {")
    combined_lines.append("  return astronomyImages.filter(img => img.category === category);")
    combined_lines.append("}")
    combined_lines.append("")
    combined_lines.append("export function getFeaturedImages(): AstronomyImage[] {")
    combined_lines.append("  return astronomyImages.filter(img => img.featured);")
    combined_lines.append("}")
    combined_lines.append("")
    combined_lines.append("export function getImageById(id: string): AstronomyImage | undefined {")
    combined_lines.append("  return astronomyImages.find(img => img.id === id);")
    combined_lines.append("}")
    
    with open(output_dir / "images.ts", 'w') as f:
        f.write('\n'.join(combined_lines))
    
    print("Done!")


if __name__ == "__main__":
    main()

