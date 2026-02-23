# ⚙ Sheet Metal Bend Allowance Calculator

A free, interactive web tool for calculating **bend allowance**, **bend deduction**, and **outside setback** for sheet metal fabrication. Compliant with **ASME Y14.5** and **ISO 2768** standards.

**Live:** [teslamechanicaldesigns.com/calculators/sheet-metal-bend-allowance/](https://teslamechanicaldesigns.com/calculators/sheet-metal-bend-allowance/)

## Features

- 📐 **Real-time calculation** — results update as you type (<100ms)
- 🎨 **Dynamic SVG diagram** — bend cross-section with neutral axis visualization
- 🔧 **8 Material Presets** — Mild Steel, Aluminum, Stainless Steel, Copper, Brass, Titanium, Spring Steel, Galvanized Steel
- 📏 **Unit toggle** — switch between mm and inches instantly
- 🔬 **K-Factor explainer** — R/T ratio analysis with recommendations
- 🖨️ **Print/Export** — generate a branded PDF-style calculation report
- 📱 **Mobile-first** — responsive design for tablets and phones
- 📘 **Design Guide** — 10-chapter reference: formulas, materials, DFM tips, tolerances

## Formula

```
BA = (π / 180) × A × (R + K × T)
```

| Symbol | Meaning |
|--------|---------|
| BA | Bend Allowance |
| A | Bend Angle (degrees) |
| R | Inside Bend Radius |
| K | K-Factor (0 to 1) |
| T | Material Thickness |

## Material K-Factors

| Material | K-Factor |
|----------|----------|
| Mild Steel | 0.44 |
| Aluminum | 0.33 |
| Stainless Steel | 0.45 |
| Copper | 0.38 |
| Brass | 0.35 |
| Titanium | 0.42 |
| Spring Steel | 0.45 |
| Galvanized Steel | 0.44 |

## Tech Stack

- **HTML5** — Semantic structure with SEO schema markup
- **CSS3** — Custom properties, glassmorphism, responsive grid
- **Vanilla JS** — Zero dependencies, instant performance
- **SVG** — Dynamic bend diagram rendered in real-time

## Quick Start

Just open `index.html` in any browser — no build step or server required.

## License

© 2026 [Tesla Mechanical Designs](https://teslamechanicaldesigns.com). All rights reserved.
