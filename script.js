/* ================================================
   SHEET METAL BEND ALLOWANCE CALCULATOR — Logic
   Tesla Mechanical Designs
   ================================================ */

(function () {
    'use strict';

    // ──────── MATERIAL PRESETS ────────
    const MATERIALS = {
        mild_steel: { name: 'Mild Steel', kFactor: 0.44 },
        aluminum: { name: 'Aluminum', kFactor: 0.33 },
        stainless_steel: { name: 'Stainless Steel', kFactor: 0.45 },
        copper: { name: 'Copper', kFactor: 0.38 },
        brass: { name: 'Brass', kFactor: 0.35 },
        titanium: { name: 'Titanium', kFactor: 0.42 },
        spring_steel: { name: 'Spring Steel', kFactor: 0.45 },
        galvanized_steel: { name: 'Galvanized Steel', kFactor: 0.44 },
        custom: { name: 'Custom', kFactor: null }
    };

    // ──────── DOM REFERENCES ────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        material: $('#material'),
        thickness: $('#thickness'),
        radius: $('#radius'),
        kfactor: $('#kfactor'),
        angle: $('#angle'),
        angleSlider: $('#angleSlider'),

        baValue: $('#ba-value'),
        bdValue: $('#bd-value'),
        ossbValue: $('#ossb-value'),
        baUnit: $('#ba-unit'),
        bdUnit: $('#bd-unit'),
        ossbUnit: $('#ossb-unit'),
        baResult: $('#ba-result'),
        bdResult: $('#bd-result'),
        ossbResult: $('#ossb-result'),

        fAngle: $('#f-angle'),
        fRadius: $('#f-radius'),
        fKfactor: $('#f-kfactor'),
        fThickness: $('#f-thickness'),
        formulaSub: $('#formula-sub'),

        svgContainer: $('#svgContainer'),
        bendDiagram: $('#bendDiagram'),

        rtValue: $('#rtValue'),
        rtRecommendation: $('#rtRecommendation'),

        printBtn: $('#printBtn'),

        ctaButton: $('#ctaButton'),
        emailModal: $('#emailModal'),
        modalClose: $('#modalClose'),
        leadForm: $('#leadForm'),
        modalSuccess: $('#modalSuccess'),

        unitBtns: $$('.unit-btn'),
        unitLabels: $$('.unit-label'),
    };

    let currentUnit = 'mm';

    // ──────── UNIT TOGGLE ────────
    dom.unitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.unit === currentUnit) return;
            dom.unitBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const oldUnit = currentUnit;
            currentUnit = btn.dataset.unit;

            // Convert values
            convertField(dom.thickness, oldUnit, currentUnit);
            convertField(dom.radius, oldUnit, currentUnit);

            // Update labels
            dom.unitLabels.forEach(l => l.textContent = currentUnit);
            dom.baUnit.textContent = currentUnit;
            dom.bdUnit.textContent = currentUnit;
            dom.ossbUnit.textContent = currentUnit;

            calculate();
        });
    });

    function convertField(input, from, to) {
        const val = parseFloat(input.value);
        if (isNaN(val)) return;
        if (from === 'mm' && to === 'in') {
            input.value = (val / 25.4).toFixed(4);
            input.step = '0.001';
        } else if (from === 'in' && to === 'mm') {
            input.value = (val * 25.4).toFixed(2);
            input.step = '0.01';
        }
    }

    // ──────── MATERIAL PRESET ────────
    dom.material.addEventListener('change', () => {
        const mat = MATERIALS[dom.material.value];
        if (mat && mat.kFactor !== null) {
            dom.kfactor.value = mat.kFactor;
            dom.kfactor.setAttribute('readonly', 'true');
            dom.kfactor.style.opacity = '0.7';
        } else {
            dom.kfactor.removeAttribute('readonly');
            dom.kfactor.style.opacity = '1';
            dom.kfactor.focus();
        }
        calculate();
    });

    // ──────── ANGLE SLIDER SYNC ────────
    dom.angle.addEventListener('input', () => {
        dom.angleSlider.value = dom.angle.value;
        calculate();
    });
    dom.angleSlider.addEventListener('input', () => {
        dom.angle.value = dom.angleSlider.value;
        calculate();
    });

    // ──────── LIVE CALCULATION ON EVERY INPUT ────────
    [dom.thickness, dom.radius, dom.kfactor, dom.angle].forEach(input => {
        input.addEventListener('input', calculate);
    });

    // ──────── VALIDATION ────────
    function validate() {
        let valid = true;

        const t = parseFloat(dom.thickness.value);
        const r = parseFloat(dom.radius.value);
        const k = parseFloat(dom.kfactor.value);
        const a = parseFloat(dom.angle.value);

        // Thickness
        if (isNaN(t) || t <= 0) {
            showError('thickness', 'Thickness must be greater than 0');
            valid = false;
        } else {
            clearError('thickness');
        }

        // Radius
        if (isNaN(r) || r < 0) {
            showError('radius', 'Radius cannot be negative');
            valid = false;
        } else {
            clearError('radius');
        }

        // K-Factor
        if (isNaN(k) || k < 0 || k > 1) {
            showError('kfactor', 'K-Factor must be between 0 and 1');
            valid = false;
        } else {
            clearError('kfactor');
        }

        // Angle
        if (isNaN(a) || a <= 0 || a > 180) {
            showError('angle', 'Angle must be between 0° and 180°');
            valid = false;
        } else {
            clearError('angle');
        }

        return valid ? { t, r, k, a } : null;
    }

    function showError(field, msg) {
        const input = $(`#${field}`);
        const errEl = $(`#${field}-error`);
        input.classList.add('invalid');
        if (errEl) errEl.textContent = msg;
    }

    function clearError(field) {
        const input = $(`#${field}`);
        const errEl = $(`#${field}-error`);
        input.classList.remove('invalid');
        if (errEl) errEl.textContent = '';
    }

    // ──────── CORE CALCULATION ────────
    function calculate() {
        const vals = validate();
        if (!vals) {
            dom.baValue.textContent = '—';
            dom.bdValue.textContent = '—';
            dom.ossbValue.textContent = '—';
            dom.formulaSub.textContent = 'Fix the highlighted errors above.';
            return;
        }

        const { t, r, k, a } = vals;

        // Bend Allowance
        const ba = (Math.PI / 180) * a * (r + k * t);

        // Outside Setback
        const halfAngleRad = (a / 2) * (Math.PI / 180);
        const ossb = (r + t) * Math.tan(halfAngleRad);

        // Bend Deduction
        const bd = 2 * ossb - ba;

        // Update result values with animation
        animateResult(dom.baValue, ba.toFixed(4));
        animateResult(dom.bdValue, bd.toFixed(4));
        animateResult(dom.ossbValue, ossb.toFixed(4));

        // Formula substitution
        dom.fAngle.textContent = a;
        dom.fRadius.textContent = r;
        dom.fKfactor.textContent = k;
        dom.fThickness.textContent = t;
        dom.formulaSub.innerHTML =
            `= (π/180) × ${a} × (${r} + ${k} × ${t})<br>` +
            `= ${(Math.PI / 180).toFixed(6)} × ${a} × ${(r + k * t).toFixed(4)}<br>` +
            `<strong>= ${ba.toFixed(4)} ${currentUnit}</strong>`;

        // Update R/T ratio explainer
        updateRTExplainer(r, t);

        // Update SVG diagram
        drawBendDiagram(r, t, a, k);
    }

    function animateResult(el, newValue) {
        if (el.textContent !== newValue) {
            el.textContent = newValue;
            const card = el.closest('.result-card');
            if (card) {
                card.classList.remove('computed');
                // Force reflow
                void card.offsetWidth;
                card.classList.add('computed');
            }
        }
    }

    // ──────── R/T RATIO EXPLAINER ────────
    function updateRTExplainer(r, t) {
        if (t <= 0) return;
        const ratio = r / t;
        dom.rtValue.textContent = ratio.toFixed(2);

        // Highlight active row in the table
        const rows = $$('.kfactor-table tbody tr');
        rows.forEach(row => row.classList.remove('active-range'));

        let recommendation = '';
        if (ratio < 1) {
            recommendation = `<strong>Tight bend detected</strong> (R/T = ${ratio.toFixed(2)}). ` +
                `The neutral axis shifts inward. Typical K-Factor: <strong>≈ 0.33</strong>. ` +
                `This is common in air bending operations. Risk of cracking increases for brittle materials.`;
            if (rows[0]) rows[0].classList.add('active-range');
        } else if (ratio <= 2) {
            recommendation = `<strong>Standard bend</strong> (R/T = ${ratio.toFixed(2)}). ` +
                `The neutral axis is near the center. Typical K-Factor: <strong>0.40 – 0.44</strong>. ` +
                `Most common in production sheet metal work. Good balance of formability and precision.`;
            if (rows[1]) rows[1].classList.add('active-range');
        } else {
            recommendation = `<strong>Loose / large radius bend</strong> (R/T = ${ratio.toFixed(2)}). ` +
                `The neutral axis shifts outward. Typical K-Factor: <strong>0.45 – 0.50</strong>. ` +
                `Often used for aesthetic bends or when minimizing surface stress is needed.`;
            if (rows[2]) rows[2].classList.add('active-range');
        }

        dom.rtRecommendation.innerHTML = recommendation;
    }

    // ──────── SVG BEND DIAGRAM ────────
    function drawBendDiagram(R, T, angleDeg, K) {
        const svg = dom.bendDiagram;
        const w = 400, h = 300;

        // Normalize dimensions for display
        const maxDim = Math.max(R + T, 50);
        const scale = Math.min(80 / maxDim, 8);

        const sR = Math.max(R * scale, 5);   // scaled inside radius
        const sT = Math.max(T * scale, 3);   // scaled thickness
        const sOR = sR + sT;                 // scaled outside radius

        const angleRad = (angleDeg * Math.PI) / 180;
        const halfAngle = angleRad / 2;

        // Center point of the bend arc
        const cx = w / 2;
        const cy = h / 2 + 20;

        // Leg length (the straight sections)
        const legLen = 70;

        // Start angle: the bend opens symmetrically upward
        const startAngle = Math.PI / 2 + halfAngle;
        const endAngle = Math.PI / 2 - halfAngle;

        // Helper: point on circle
        const ptOnCircle = (cx, cy, r, angle) => ({
            x: cx + r * Math.cos(angle),
            y: cy - r * Math.sin(angle)
        });

        // Arc points
        const iStart = ptOnCircle(cx, cy, sR, startAngle);
        const iEnd = ptOnCircle(cx, cy, sR, endAngle);
        const oStart = ptOnCircle(cx, cy, sOR, startAngle);
        const oEnd = ptOnCircle(cx, cy, sOR, endAngle);

        // Neutral axis
        const neutralR = sR + K * sT;
        const nStart = ptOnCircle(cx, cy, neutralR, startAngle);
        const nEnd = ptOnCircle(cx, cy, neutralR, endAngle);

        // Leg directions (tangent to arc at endpoints)
        const leftLegDir = { x: -Math.sin(startAngle), y: Math.cos(startAngle) };
        const rightLegDir = { x: Math.sin(endAngle), y: -Math.cos(endAngle) };

        // Leg endpoints
        const iLeftLeg = { x: iStart.x + leftLegDir.x * legLen, y: iStart.y + leftLegDir.y * legLen };
        const oLeftLeg = { x: oStart.x + leftLegDir.x * legLen, y: oStart.y + leftLegDir.y * legLen };
        const iRightLeg = { x: iEnd.x + rightLegDir.x * legLen, y: iEnd.y + rightLegDir.y * legLen };
        const oRightLeg = { x: oEnd.x + rightLegDir.x * legLen, y: oEnd.y + rightLegDir.y * legLen };

        // Determine arc sweep flags
        const largeArc = angleDeg > 180 ? 1 : 0;

        // Build SVG HTML
        let svgContent = '';

        // Background grid pattern
        svgContent += `
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(236,240,241,0.04)" stroke-width="0.5"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" rx="8"/>`;

        // Sheet metal fill (outer path)
        svgContent += `
            <path d="
                M ${oLeftLeg.x.toFixed(1)} ${oLeftLeg.y.toFixed(1)}
                L ${oStart.x.toFixed(1)} ${oStart.y.toFixed(1)}
                A ${sOR.toFixed(1)} ${sOR.toFixed(1)} 0 ${largeArc} 1 ${oEnd.x.toFixed(1)} ${oEnd.y.toFixed(1)}
                L ${oRightLeg.x.toFixed(1)} ${oRightLeg.y.toFixed(1)}
                L ${iRightLeg.x.toFixed(1)} ${iRightLeg.y.toFixed(1)}
                L ${iEnd.x.toFixed(1)} ${iEnd.y.toFixed(1)}
                A ${sR.toFixed(1)} ${sR.toFixed(1)} 0 ${largeArc} 0 ${iStart.x.toFixed(1)} ${iStart.y.toFixed(1)}
                L ${iLeftLeg.x.toFixed(1)} ${iLeftLeg.y.toFixed(1)}
                Z"
                fill="rgba(44, 62, 80, 0.5)"
                stroke="#ecf0f1"
                stroke-width="1.5"
            />`;

        // Neutral axis (dashed)
        const nLeftLeg = { x: nStart.x + leftLegDir.x * legLen, y: nStart.y + leftLegDir.y * legLen };
        const nRightLeg = { x: nEnd.x + rightLegDir.x * legLen, y: nEnd.y + rightLegDir.y * legLen };
        svgContent += `
            <path d="
                M ${nLeftLeg.x.toFixed(1)} ${nLeftLeg.y.toFixed(1)}
                L ${nStart.x.toFixed(1)} ${nStart.y.toFixed(1)}
                A ${neutralR.toFixed(1)} ${neutralR.toFixed(1)} 0 ${largeArc} 1 ${nEnd.x.toFixed(1)} ${nEnd.y.toFixed(1)}
                L ${nRightLeg.x.toFixed(1)} ${nRightLeg.y.toFixed(1)}"
                fill="none"
                stroke="#e74c3c"
                stroke-width="1.5"
                stroke-dasharray="6 4"
                opacity="0.9"
            />`;

        // Radius dimension line (from center to inside arc midpoint)
        const midAngle = Math.PI / 2;
        const rDimEnd = ptOnCircle(cx, cy, sR, midAngle);
        svgContent += `
            <line x1="${cx}" y1="${cy}" x2="${rDimEnd.x.toFixed(1)}" y2="${rDimEnd.y.toFixed(1)}"
                  stroke="#e74c3c" stroke-width="1" stroke-dasharray="3 2" opacity="0.6"/>
            <circle cx="${cx}" cy="${cy}" r="3" fill="#e74c3c" opacity="0.6"/>`;

        // Labels
        svgContent += `
            <text x="${cx}" y="${cy + 16}" text-anchor="middle"
                  font-family="Inter, sans-serif" font-size="10" fill="#e74c3c" opacity="0.8">
                R = ${R}
            </text>`;

        // Thickness label
        const tLabelAngle = startAngle;
        const tMid = ptOnCircle(cx, cy, sR + sT / 2, tLabelAngle);
        svgContent += `
            <text x="${tMid.x - 30}" y="${tMid.y}" text-anchor="middle"
                  font-family="Inter, sans-serif" font-size="10" fill="#ecf0f1" opacity="0.7">
                T = ${T}
            </text>`;

        // Angle arc indicator
        const angleArcR = 25;
        const angStart = ptOnCircle(cx, cy, angleArcR, startAngle);
        const angEnd = ptOnCircle(cx, cy, angleArcR, endAngle);
        const angleLabel = ptOnCircle(cx, cy, angleArcR + 14, Math.PI / 2);
        svgContent += `
            <path d="M ${angStart.x.toFixed(1)} ${angStart.y.toFixed(1)}
                     A ${angleArcR} ${angleArcR} 0 ${largeArc} 1 ${angEnd.x.toFixed(1)} ${angEnd.y.toFixed(1)}"
                  fill="none" stroke="#f39c12" stroke-width="1.5" opacity="0.7"/>
            <text x="${angleLabel.x}" y="${angleLabel.y}" text-anchor="middle"
                  font-family="Inter, sans-serif" font-size="10" fill="#f39c12" opacity="0.9">
                ${angleDeg}°
            </text>`;

        // Legend
        svgContent += `
            <g transform="translate(10, 16)">
                <line x1="0" y1="0" x2="16" y2="0" stroke="#ecf0f1" stroke-width="1.5"/>
                <text x="20" y="4" font-family="Inter, sans-serif" font-size="9" fill="#95a5a6">Sheet Metal</text>
                <line x1="0" y1="16" x2="16" y2="16" stroke="#e74c3c" stroke-width="1.5" stroke-dasharray="4 3"/>
                <text x="20" y="20" font-family="Inter, sans-serif" font-size="9" fill="#95a5a6">Neutral Axis</text>
                <line x1="0" y1="32" x2="16" y2="32" stroke="#f39c12" stroke-width="1.5"/>
                <text x="20" y="36" font-family="Inter, sans-serif" font-size="9" fill="#95a5a6">Bend Angle</text>
            </g>`;

        svg.innerHTML = svgContent;
    }

    // ──────── MODAL LOGIC ────────
    dom.ctaButton.addEventListener('click', () => {
        dom.emailModal.hidden = false;
        dom.emailModal.removeAttribute('hidden');
        requestAnimationFrame(() => {
            dom.emailModal.classList.add('visible');
        });
    });

    function closeModal() {
        dom.emailModal.classList.remove('visible');
        setTimeout(() => {
            dom.emailModal.hidden = true;
            dom.emailModal.setAttribute('hidden', '');
        }, 300);
    }

    dom.modalClose.addEventListener('click', closeModal);
    dom.emailModal.addEventListener('click', (e) => {
        if (e.target === dom.emailModal) closeModal();
    });

    dom.leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('#leadEmail').value;
        if (email && email.includes('@')) {
            dom.leadForm.hidden = true;
            dom.modalSuccess.hidden = false;
            dom.modalSuccess.removeAttribute('hidden');
            // Here you would send the email to your backend/CRM
            console.log('Lead captured:', email);
            // Open the design guide in a new tab
            setTimeout(() => {
                window.open('sheet-metal-design-guide.html', '_blank');
            }, 800);
            setTimeout(closeModal, 2500);
        }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dom.emailModal.classList.contains('visible')) {
            closeModal();
        }
    });

    // ──────── PRINT / EXPORT ────────
    dom.printBtn.addEventListener('click', () => {
        const vals = validate();
        if (!vals) {
            alert('Please fix the input errors before printing.');
            return;
        }
        const { t, r, k, a } = vals;
        const ba = (Math.PI / 180) * a * (r + k * t);
        const halfAngleRad = (a / 2) * (Math.PI / 180);
        const ossb = (r + t) * Math.tan(halfAngleRad);
        const bd = 2 * ossb - ba;
        const matName = MATERIALS[dom.material.value]?.name || 'Custom';
        const ratio = t > 0 ? (r / t).toFixed(2) : 'N/A';

        const printWin = window.open('', '_blank', 'width=700,height=900');
        printWin.document.write(`<!DOCTYPE html><html><head><title>Bend Allowance Report</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family:'Inter',sans-serif; padding:40px; color:#1a252f; }
            .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #e74c3c; padding-bottom:16px; margin-bottom:32px; }
            .header h1 { font-size:1.3rem; color:#2c3e50; }
            .header .date { font-size:0.8rem; color:#7f8c8d; }
            .brand { font-size:0.75rem; color:#95a5a6; }
            table { width:100%; border-collapse:collapse; margin-bottom:24px; }
            th, td { padding:10px 16px; text-align:left; border-bottom:1px solid #ecf0f1; }
            th { background:#f8f9fa; font-size:0.8rem; color:#7f8c8d; text-transform:uppercase; letter-spacing:0.05em; }
            td { font-family:'JetBrains Mono',monospace; font-size:0.95rem; }
            .result-row td { font-weight:700; color:#2c3e50; }
            .primary-result td { color:#e74c3c; font-size:1.1rem; }
            .formula-section { background:#f8f9fa; padding:20px; border-radius:8px; margin-bottom:24px; }
            .formula-section h3 { font-size:0.85rem; color:#7f8c8d; text-transform:uppercase; margin-bottom:8px; }
            .formula-section code { font-family:'JetBrains Mono',monospace; font-size:0.95rem; }
            .note { font-size:0.75rem; color:#95a5a6; border-top:1px solid #ecf0f1; padding-top:16px; margin-top:32px; }
            @media print { body { padding:20px; } }
        </style></head><body>
            <div class="header">
                <div><h1>⚙ Bend Allowance Calculation Report</h1><span class="brand">Tesla Mechanical Designs</span></div>
                <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <h3 style="font-size:0.9rem;color:#7f8c8d;text-transform:uppercase;margin-bottom:12px;">Input Parameters</h3>
            <table>
                <tr><th>Parameter</th><th>Value</th></tr>
                <tr><td>Material</td><td>${matName}</td></tr>
                <tr><td>Thickness (T)</td><td>${t} ${currentUnit}</td></tr>
                <tr><td>Inside Bend Radius (R)</td><td>${r} ${currentUnit}</td></tr>
                <tr><td>K-Factor (K)</td><td>${k}</td></tr>
                <tr><td>Bend Angle (A)</td><td>${a}°</td></tr>
                <tr><td>R/T Ratio</td><td>${ratio}</td></tr>
            </table>

            <h3 style="font-size:0.9rem;color:#7f8c8d;text-transform:uppercase;margin-bottom:12px;">Results</h3>
            <table>
                <tr><th>Output</th><th>Value</th></tr>
                <tr class="result-row primary-result"><td>Bend Allowance (BA)</td><td>${ba.toFixed(4)} ${currentUnit}</td></tr>
                <tr class="result-row"><td>Bend Deduction (BD)</td><td>${bd.toFixed(4)} ${currentUnit}</td></tr>
                <tr class="result-row"><td>Outside Setback (OSSB)</td><td>${ossb.toFixed(4)} ${currentUnit}</td></tr>
            </table>

            <div class="formula-section">
                <h3>Formula Used</h3>
                <code>BA = (π / 180) × ${a} × (${r} + ${k} × ${t}) = ${ba.toFixed(4)} ${currentUnit}</code>
            </div>

            <p class="note">This report was generated by the Sheet Metal Bend Allowance Calculator at teslamechanicaldesigns.com.<br>Calculations are for reference only. Always verify with your CAD system and material data sheets.</p>
        </body></html>`);
        printWin.document.close();
        setTimeout(() => printWin.print(), 400);
    });

    // ──────── PAGE-LOAD ANIMATIONS ────────
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-in').forEach(el => {
        animateObserver.observe(el);
    });

    // ──────── INITIAL CALCULATION ────────
    // Set initial state for material preset
    dom.kfactor.setAttribute('readonly', 'true');
    dom.kfactor.style.opacity = '0.7';

    // Run initial calculation
    calculate();

})();
