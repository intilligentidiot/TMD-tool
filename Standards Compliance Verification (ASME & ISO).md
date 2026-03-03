# Standards Verification for Sheet Metal Calculator

**Context:** The calculator must be technically accurate for professional engineering use according to ASME Y14.5 and ISO 2768.

## 1. ASME Y14.5 Verification (Drafting & Dimensioning)
Ensure the tool handles dimensions exactly as required for engineering drawings:
- **Rule of Precision:** Implement a "Precision Selector" allowing 2, 3, or 4 decimal places. 
- **The Calculation Logic:** Verify that Bend Allowance is calculated based on the **Inside Radius**. 
- **Neutral Axis Definition:** Confirm that the K-Factor correctly shifts the neutral axis based on the material thickness ratio.

## 2. ISO 2768-m Verification (General Tolerances)
The tool must provide a "Manufacturing Tolerance" output:
- **Function:** Create a logic loop that takes the final 'Developed Length' (L) and displays the ISO 2768-m tolerance.
- **Rules:**
    - If L is 6mm to 30mm: Display ±0.2mm
    - If L is 30mm to 120mm: Display ±0.3mm
    - If L is 120mm to 400mm: Display ±0.5mm
- **UI Element:** Add a small 'Tolerance Info' icon that explains these values are per ISO 2768-m.

## 3. Output Requirements
Antigravity must generate:
1. A **Verification Report** stating that the formulas used match the 'Machinery’s Handbook' standards.
2. A **Disclaimer Text** for the footer: "Calculations follow standard engineering principles compliant with ASME Y14.5 and ISO 2768-m."