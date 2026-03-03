# UI/UX Branding & Theme Synchronization Plan

**Project:** Tesla Mechanical Designs Tool Re-Skinning
**Target Tool:** https://intilligentidiot.github.io/TMD-tool/
**Reference Branding:** https://www.teslamechanicaldesigns.com/

## 1. Visual Identity Requirements
The goal is to eliminate the current "generic" look and adopt the premium, industrial aesthetic of the Tesla Mechanical Designs main site.

### 1.1 Color Palette (CSS Variable Mapping)
- **Primary Brand Color:** `#0054a6` (Deep Tesla Blue) - Use for Headers, Primary Buttons, and active states.
- **Secondary Brand Color:** `#ed1c24` (Accent Red) - Use for hover effects, important alerts, or "Calculate" buttons.
- **Text Primary:** `#333333` (Dark Gray) - For body text and labels.
- **Background/Surface:** `#ffffff` (White) and `#f8f9fa` (Light Gray) for section backgrounds.

### 1.2 Typography
- **Headings:** Use 'Roboto' or 'Open Sans', Sans-serif (Bold). Match the weight used on the main website’s H1 and H2 tags.
- **Body:** Clean Sans-serif with a line height of 1.6 for readability.

## 2. Component Synchronization
### 2.1 The Header & Logo
- **Action:** Remove the current text-based header.
- **Implementation:** Use the official Tesla Mechanical Designs logo (fetch from `https://www.teslamechanicaldesigns.com/images/logo.png`).
- **Layout:** Logo on the left, "Engineering Tools" title on the right or centered.

### 2.2 Buttons & Form Fields
- **Buttons:** Rounded corners (4px to 6px), solid `#0054a6` background, white text. Add a transition effect to turn `#ed1c24` on hover.
- **Input Fields:** Use thin light gray borders. When clicked (focus), the border color should change to the Primary Blue.

### 2.3 Lead Capture Form (Footer)
- The form should look like a "Card" component with a light gray border and a subtle box-shadow.
- Align the "I am a..." dropdown style to match the rest of the inputs.

## 3. Technical Instructions for Antigravity Agent
- **CSS Extraction:** Scan the `styles.css` of `teslamechanicaldesigns.com` and extract the global font-family and button padding.
- **Clean Code:** Remove all existing CSS styles in the current TMD-tool and replace them with a unified `theme.css` that follows the branding above.
- **Responsiveness:** Ensure the new theme maintains the mobile-friendly "Stacking" behavior for engineers using tablets on the shop floor.

## 4. Final Verification
1. Does the header logo match the main site?
2. Are the blue and red colors identical to the main site's branding?
3. Is the font consistent across the tool and the main website?