# 🔭 Silver Spring Observatory

A modern, beautiful astronomy portfolio website showcasing deep sky astrophotography by Ken Levin. This is a complete rebuild of [silverspringastro.com](https://silverspringastro.com) with a modern tech stack and enhanced user experience.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎨 Modern UI/UX
- **Dark space theme** - Deep blacks, cosmic blues, and nebula accents inspired by the night sky
- **Responsive design** - Mobile-first approach, works beautifully on all devices
- **Smooth animations** - Twinkling stars, nebula glows, and subtle hover effects
- **Accessible** - Keyboard navigation, ARIA labels, and semantic HTML

### 🖼️ Image Gallery
- **55+ astronomy images** - Galaxies, nebulae, star clusters, supernovae, asteroids, and exoplanets
- **High-resolution viewing** - Full-screen modal with zoom capability
- **Keyboard navigation** - Arrow keys to browse, Escape to close
- **Category organization** - 7 distinct categories with dedicated pages
- **Observatory badges** - Color-coded badges showing capture location (H85, BBO, SRO)
- **Filter information** - LRGB, Ha, OIII, and other filter data displayed

### 🚀 New Features (Not in Original Site)
- **Deep Sky Statistics** - Animated counters showing total light-years, galaxies, exposure hours
- **Image of the Day** - Rotating featured image showcase on homepage
- **Quick stats bar** - At-a-glance metrics in the hero section
- **Interactive image cards** - Hover effects reveal descriptions
- **Breadcrumb navigation** - Easy orientation within the site

### 📊 Content Categories
| Category | Description |
|----------|-------------|
| 🌌 Galaxies | Spiral, elliptical, and interacting galaxies |
| 🔵 Galaxy Clusters | Gravitationally bound collections of galaxies |
| ⭐ Star Clusters | Open and globular clusters |
| 🌈 Nebulae | Emission, planetary, and reflection nebulae |
| 💥 Supernovae | Stellar explosions and remnants |
| ☄️ Asteroids | Including asteroid (99862) "Kenlevin" |
| 🪐 Exoplanets | Transit observations and data |

## 🏗️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Image Optimization:** Next/Image with lazy loading
- **Deployment:** Static Site Generation (SSG) ready

## 📁 Project Structure

```
silverspringastro-2/
├── public/
│   └── images/
│       ├── hero/           # Hero section images
│       ├── galaxies/       # Galaxy images
│       ├── nebulae/        # Nebulae images
│       ├── supernovae/     # Supernovae images
│       ├── asteroids/      # Asteroid images
│       └── exoplanets/     # Exoplanet images
├── src/
│   ├── app/
│   │   ├── page.tsx        # Homepage
│   │   ├── galaxies/       # Galaxies gallery
│   │   ├── nebulae/        # Nebulae gallery
│   │   ├── supernovae/     # Supernovae gallery
│   │   ├── asteroids/      # Asteroids gallery
│   │   ├── exoplanets/     # Exoplanets gallery
│   │   ├── equipment/      # Equipment details
│   │   ├── about/          # About Ken Levin
│   │   └── travel/         # Travel photos
│   ├── components/
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── Footer.tsx      # Site footer
│   │   ├── Hero.tsx        # Homepage hero
│   │   ├── ImageGrid.tsx   # Gallery grid layout
│   │   ├── ImageCard.tsx   # Individual image card
│   │   ├── ImageModal.tsx  # Full-screen viewer
│   │   ├── DeepSkyStats.tsx # Animated statistics
│   │   ├── FeaturedGallery.tsx # Featured images
│   │   ├── CategoryCard.tsx # Category browser
│   │   ├── ObservatoryBadge.tsx # Observatory indicator
│   │   └── ...
│   ├── data/
│   │   ├── images.ts       # Image metadata
│   │   ├── categories.ts   # Category definitions
│   │   ├── observatories.ts # Observatory info
│   │   └── site.ts         # Site configuration
│   └── lib/
│       └── types.ts        # TypeScript interfaces
└── scraper/
    ├── scrape_site.py      # Content scraper
    ├── download_highres.py # High-res image downloader
    └── requirements.txt    # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/silverspringastro-2.git
cd silverspringastro-2

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🔧 Scraper Tools

The `scraper/` directory contains Python tools for extracting content from the original site:

```bash
cd scraper

# Install Python dependencies
pip install -r requirements.txt

# Run the main scraper (extracts metadata)
python scrape_site.py

# Download high-resolution images
python download_highres.py
```

## 🎯 Design Philosophy

This rebuild follows these principles:

1. **Preserve Content** - All original images, names, and descriptions maintained
2. **Respect the Original** - Serious, clean aesthetic befitting astronomical imagery
3. **Modern UX** - Responsive grids, smooth transitions, intuitive navigation
4. **Performance** - Optimized images, lazy loading, static generation
5. **Accessibility** - Keyboard navigation, screen reader support

## 🌟 Observatory Codes

| Code | Name | Location |
|------|------|----------|
| H85 | Silver Spring Observatory | Silver Spring, Maryland |
| BBO | Blackbird Observatory | Cloudcroft, New Mexico |
| SRO | Sierra Remote Observatories | Sierra Nevada, California |
| G53 | Alder Springs Observatory | - |

## 📜 About Ken Levin

Ken Levin (b. 1953) is a physicist working in infrared optics and sensors for medicine, aerospace, and astronomy. He operates multiple private observatories and has an asteroid named after him: **(99862) "Kenlevin"** = 2002 OD2.

## 📄 License

All astronomical images are original work by Ken Levin. © 2025 Ken Levin. All rights reserved.

The website code is available for reference and learning purposes.

## 🔗 Links

- **Original Site:** [silverspringastro.com](https://silverspringastro.com)
- **Sierra Remote Observatories:** [sierraremote.com](https://sierraremote.com)
- **Contact:** Klevin@aol.com

---

*Built with ❤️ for the love of astronomy*
