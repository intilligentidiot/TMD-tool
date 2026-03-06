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

        printModal: $('#printModal'),
        printModalClose: $('#printModalClose'),
        printForm: $('#printForm'),
        printModalSuccess: $('#printModalSuccess'),

        ctaButton: $('#ctaButton'),
        emailModal: $('#emailModal'),
        modalClose: $('#modalClose'),
        leadForm: $('#leadForm'),
        modalSuccess: $('#modalSuccess'),

        unitBtns: $$('.unit-btn'),
        unitLabels: $$('.unit-label'),

        precisionSelect: $('#precision'),

        tolValue: $('#tol-value'),
        tolUnit: $('#tol-unit'),
    };

    let currentUnit = 'mm';
    let currentPrecision = 4;

    // ──────── PRECISION SELECTOR (ASME Y14.5) ────────
    dom.precisionSelect.addEventListener('change', () => {
        currentPrecision = parseInt(dom.precisionSelect.value, 10);
        calculate();
    });

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

    // ──────── ISO 2768-m TOLERANCE ────────
    function getISO2768Tolerance(lengthMM) {
        // ISO 2768-m (medium) general tolerance ranges
        if (lengthMM <= 0) return null;
        if (lengthMM > 0 && lengthMM < 0.5) return { tol: 0.05, label: '±0.05' };
        if (lengthMM >= 0.5 && lengthMM < 3) return { tol: 0.1, label: '±0.1' };
        if (lengthMM >= 3 && lengthMM < 6) return { tol: 0.1, label: '±0.1' };
        if (lengthMM >= 6 && lengthMM < 30) return { tol: 0.2, label: '±0.2' };
        if (lengthMM >= 30 && lengthMM < 120) return { tol: 0.3, label: '±0.3' };
        if (lengthMM >= 120 && lengthMM < 400) return { tol: 0.5, label: '±0.5' };
        if (lengthMM >= 400 && lengthMM < 1000) return { tol: 0.8, label: '±0.8' };
        if (lengthMM >= 1000 && lengthMM < 2000) return { tol: 1.2, label: '±1.2' };
        if (lengthMM >= 2000) return { tol: 2.0, label: '±2.0' };
        return null;
    }

    // ──────── CORE CALCULATION ────────
    function calculate() {
        const vals = validate();
        if (!vals) {
            dom.baValue.textContent = '—';
            dom.bdValue.textContent = '—';
            dom.ossbValue.textContent = '—';
            dom.tolValue.textContent = '—';
            dom.formulaSub.textContent = 'Fix the highlighted errors above.';
            return;
        }

        const { t, r, k, a } = vals;
        const dp = currentPrecision;

        // Bend Allowance
        const ba = (Math.PI / 180) * a * (r + k * t);

        // Outside Setback
        const halfAngleRad = (a / 2) * (Math.PI / 180);
        const ossb = (r + t) * Math.tan(halfAngleRad);

        // Bend Deduction
        const bd = 2 * ossb - ba;

        // Update result values with animation
        animateResult(dom.baValue, ba.toFixed(dp));
        animateResult(dom.bdValue, bd.toFixed(dp));
        animateResult(dom.ossbValue, ossb.toFixed(dp));

        // ISO 2768-m Tolerance (based on BA value in mm)
        const baMM = currentUnit === 'in' ? ba * 25.4 : ba;
        const isoTol = getISO2768Tolerance(baMM);
        if (isoTol) {
            animateResult(dom.tolValue, isoTol.label);
            dom.tolUnit.textContent = currentUnit === 'in' ? `(${(isoTol.tol / 25.4).toFixed(4)} in)` : 'mm';
        } else {
            dom.tolValue.textContent = 'N/A';
            dom.tolUnit.textContent = 'Outside range';
        }

        // Highlight active row in ISO reference table
        const isoRows = $$('#isoTable tbody tr');
        isoRows.forEach(row => {
            row.classList.remove('active-iso-range');
            const [lo, hi] = row.dataset.range.split('-').map(Number);
            if (baMM >= lo && baMM < hi) {
                row.classList.add('active-iso-range');
            }
        });

        // Formula substitution
        dom.fAngle.textContent = a;
        dom.fRadius.textContent = r;
        dom.fKfactor.textContent = k;
        dom.fThickness.textContent = t;
        dom.formulaSub.innerHTML =
            `= (π/180) × ${a} × (${r} + ${k} × ${t})<br>` +
            `= ${(Math.PI / 180).toFixed(6)} × ${a} × ${(r + k * t).toFixed(dp)}<br>` +
            `<strong>= ${ba.toFixed(dp)} ${currentUnit}</strong>`;

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
        const w = 600, h = 450;

        // Normalize dimensions for display — large scale
        const maxDim = Math.max(R + T, 5);
        const scale = Math.min(150 / maxDim, 18);

        const sR = Math.max(R * scale, 15);   // scaled inside radius
        const sT = Math.max(T * scale, 8);    // scaled thickness
        const sOR = sR + sT;                 // scaled outside radius

        const angleRad = (angleDeg * Math.PI) / 180;
        const halfAngle = angleRad / 2;

        // Center point of the bend arc
        const cx = w / 2;
        const cy = h / 2 + 30; // Better center alignment

        // Leg length (the straight sections)
        const legLen = 160;

        // Start angle: the bend opens symmetrically upward (arc is at the bottom)
        // We pivot around 3*PI/2 (270 degrees) so the center of the arc is down.
        const startAngle = (3 * Math.PI / 2) - halfAngle;
        const endAngle = (3 * Math.PI / 2) + halfAngle;

        // Helper: point on circle
        const ptOnCircle = (cx, cy, r, angle) => ({
            x: cx + r * Math.cos(angle),
            y: cy - r * Math.sin(angle) // Note: SVG y is inverted, so this assumes normal Cartesian +y is up
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
        // Derivatives of ptOnCircle: dx/dtheta = -r*sin(theta), dy/dtheta = -r*cos(theta)
        // Since we want the legs to go OUTWARD from the arc ends:
        // For startAngle (left side), theta is decreasing, so we take the NEGATIVE derivative
        // For endAngle (right side), theta is increasing, so we take the POSITIVE derivative
        const leftLegDir = { x: Math.sin(startAngle), y: Math.cos(startAngle) };
        const rightLegDir = { x: -Math.sin(endAngle), y: -Math.cos(endAngle) };

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
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
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
                fill="rgba(26, 26, 26, 0.5)"
                stroke="#ffffff"
                stroke-width="2.5"
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
                stroke="#FBAF03"
                stroke-width="2.5"
                stroke-dasharray="8 5"
                opacity="0.9"
            />`;

        // Radius dimension line (from center to inside arc midpoint)
        const midAngle = Math.PI / 2;
        const rDimEnd = ptOnCircle(cx, cy, sR, midAngle);
        svgContent += `
            <line x1="${cx}" y1="${cy}" x2="${rDimEnd.x.toFixed(1)}" y2="${rDimEnd.y.toFixed(1)}"
                  stroke="#FBAF03" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6"/>
            <circle cx="${cx}" cy="${cy}" r="4" fill="#FBAF03" opacity="0.6"/>`;

        // Labels — larger fonts
        svgContent += `
            <text x="${cx}" y="${cy + Math.max(sR / 2, 20)}" text-anchor="middle"
                  font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#FBAF03" opacity="0.9">
                R = ${R}
            </text>`;

        // Thickness label
        const tLabelAngle = startAngle;
        const tMid = ptOnCircle(cx, cy, sR + sT / 2, tLabelAngle);
        svgContent += `
            <text x="${tMid.x - 30}" y="${tMid.y + 10}" text-anchor="middle"
                  font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#ffffff" opacity="0.8">
                T = ${T}
            </text>`;

        // Angle arc indicator
        // Since diagram is inverted (pivoting around 270 deg / 3*PI/2), the angle arc is drawn at the top or bottom
        // We'll draw it tracking the outer radius
        const angleArcR = sOR + 25;
        const angStart = ptOnCircle(cx, cy, angleArcR, startAngle);
        const angEnd = ptOnCircle(cx, cy, angleArcR, endAngle);
        const angleLabel = ptOnCircle(cx, cy, angleArcR + 20, 3 * Math.PI / 2);
        svgContent += `
            <path d="M ${angStart.x.toFixed(1)} ${angStart.y.toFixed(1)}
                     A ${angleArcR} ${angleArcR} 0 ${largeArc} 1 ${angEnd.x.toFixed(1)} ${angEnd.y.toFixed(1)}"
                  fill="none" stroke="#f39c12" stroke-width="2" stroke-dasharray="4 4" opacity="0.7"/>
            <text x="${angleLabel.x}" y="${angleLabel.y}" text-anchor="middle"
                  font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#f39c12" opacity="0.9">
                ${angleDeg}°
            </text>`;

        // Legend — moved to bottom left to prevent overlap with the large diagram
        svgContent += `
            <g transform="translate(20, 370)">
                <line x1="0" y1="0" x2="22" y2="0" stroke="#ffffff" stroke-width="2.5"/>
                <text x="28" y="5" font-family="system-ui, sans-serif" font-size="13" fill="#b0b0b0">Sheet Metal</text>
                <line x1="0" y1="22" x2="22" y2="22" stroke="#FBAF03" stroke-width="2.5" stroke-dasharray="6 4"/>
                <text x="28" y="27" font-family="system-ui, sans-serif" font-size="13" fill="#b0b0b0">Neutral Axis</text>
                <line x1="0" y1="44" x2="22" y2="44" stroke="#f39c12" stroke-width="2"/>
                <text x="28" y="49" font-family="system-ui, sans-serif" font-size="13" fill="#b0b0b0">Bend Angle</text>
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

    dom.printBtn.addEventListener('click', () => {
        const vals = validate();
        if (!vals) {
            alert('Please fix the input errors before proceeding.');
            return;
        }
        dom.printModal.hidden = false;
        dom.printModal.removeAttribute('hidden');
        requestAnimationFrame(() => {
            dom.printModal.classList.add('visible');
        });
    });

    function closeModal() {
        dom.emailModal.classList.remove('visible');
        dom.printModal.classList.remove('visible');
        setTimeout(() => {
            dom.emailModal.hidden = true;
            dom.emailModal.setAttribute('hidden', '');
            dom.printModal.hidden = true;
            dom.printModal.setAttribute('hidden', '');

            // Reset forms state
            dom.leadForm.reset();
            dom.leadForm.hidden = false;
            dom.modalSuccess.hidden = true;

            dom.printForm.reset();
            dom.printForm.hidden = false;
            dom.printModalSuccess.hidden = true;
        }, 300);
    }

    dom.modalClose.addEventListener('click', closeModal);
    dom.printModalClose.addEventListener('click', closeModal);

    [dom.emailModal, dom.printModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
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

    dom.printForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const vals = validate();
        if (!vals) {
            alert('Please fix calculator input errors before submitting.');
            return;
        }

        const name = $('#printName').value.trim();
        const email = $('#printEmail').value.trim();
        const phone = $('#printPhone').value.trim();
        const country = $('#printCountry').value.trim();
        const message = $('#printMessage').value.trim();

        if (!name || !email || !phone || !country || !message) {
            alert('Please fill all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please use a valid email ID');
            return;
        }

        // Show loading state
        dom.printForm.hidden = true;
        dom.printModalSuccess.hidden = false;
        dom.printModalSuccess.removeAttribute('hidden');
        dom.printModalSuccess.querySelector('p').textContent = "Generating PDF and sending...";

        try {
            // 1. Generate PDF on the fly
            const pdfBlob = await getBendReportPDFBlob(vals);

            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('country', country);
            formData.append('message', message);
            formData.append('pdf_file', pdfBlob, 'Tesla_Mechanical_CNC_Report.pdf');

            // 3. Submit to server
            // Note: This URL must point to your WordPress install where the PHP file lives.
            const response = await fetch('/bend-allowance-form-submission.php', {
                method: 'POST',
                body: formData
            });

            const resultText = await response.text();

            if (resultText.trim() === 'SUCCESS') {
                dom.printModalSuccess.querySelector('p').textContent = "Success! Redirecting...";
                setTimeout(() => {
                    closeModal();
                    window.location.href = "https://www.teslamechanicaldesigns.com/thank-you.php";
                }, 1000);
            } else {
                alert('Server Error: ' + resultText);
                dom.printForm.hidden = false;
                dom.printModalSuccess.hidden = true;
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert('Something went wrong. Please try again.');
            dom.printForm.hidden = false;
            dom.printModalSuccess.hidden = true;
        }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // ──────── PDF GENERATION ────────
    async function getBendReportPDFBlob(vals) {
        return new Promise((resolve, reject) => {
            const { t, r, k, a } = vals;
            const ba = (Math.PI / 180) * a * (r + k * t);
            const halfAngleRad = (a / 2) * (Math.PI / 180);
            const ossb = (r + t) * Math.tan(halfAngleRad);
            const bd = 2 * ossb - ba;
            const matName = MATERIALS[dom.material.value]?.name || 'Custom';
            const ratio = t > 0 ? (r / t).toFixed(2) : 'N/A';

            // Populate the template
            document.getElementById('pdf-date').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            document.getElementById('pdf-inputs').innerHTML = `
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">Material</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${matName}</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">Thickness (T)</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${t} ${currentUnit}</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">Inside Bend Radius (R)</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${r} ${currentUnit}</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">K-Factor (K)</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${k}</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">Bend Angle (A)</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${a}°</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">R/T Ratio</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">${ratio}</td></tr>
            `;

            document.getElementById('pdf-results').innerHTML = `
                <tr><td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; color: #FBAF03;">Bend Allowance (BA)</td><td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 700; color: #FBAF03; font-size: 16px;">${ba.toFixed(4)} ${currentUnit}</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">Bend Deduction (BD)</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${bd.toFixed(4)} ${currentUnit}</td></tr>
                <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">Outside Setback (OSSB)</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-weight: 600;">${ossb.toFixed(4)} ${currentUnit}</td></tr>
            `;

            document.getElementById('pdf-formula').innerHTML = `BA = (π / 180) × ${a} × (${r} + ${k} × ${t}) = ${ba.toFixed(4)} ${currentUnit}`;

            // Clone SVG
            document.getElementById('pdf-svg').innerHTML = dom.bendDiagram.innerHTML;

            const container = document.getElementById('pdf-container');
            const element = document.getElementById('pdf-template');

            // html2pdf cannot render elements with display: none
            // Temporarily show it (it's positioned off-screen left: -9999px via inline styles already)
            container.style.display = 'block';

            // html2pdf options for high quality
            const opt = {
                margin: 0, // using internal padding
                filename: 'Tesla_Mechanical_CNC_Report.pdf',
                image: { type: 'jpeg', quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true, letterRendering: true, windowWidth: 800 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // Generate blob
            html2pdf().set(opt).from(element).output('blob').then((blob) => {
                container.style.display = 'none'; // Hide again immediately
                resolve(blob);
            }).catch(err => {
                container.style.display = 'none'; // Hide even if it fails
                console.error("PDF Generation failed:", err);
                reject(err);
            });
        });
    }

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
