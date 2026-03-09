<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Free Sheet Metal Bend Allowance Calculator | Tesla Mechanical Designs</title>
    <meta name="description"
        content="Calculate bend allowance, bend deduction, and developed length instantly. Supports Mild Steel, Aluminum, Stainless Steel &amp; Copper with standard K-Factor presets. ASME &amp; ISO compliant.">
    <meta name="keywords"
        content="bend allowance calculator, sheet metal calculator, K-factor, bend deduction, sheet metal design, ASME, ISO">
    <meta name="author" content="Tesla Mechanical Designs">

    <!-- Robots -->
    <meta name="robots" content="noindex,nofollow">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

    <!-- Theme & Apple -->
    <meta name="theme-color" content="#000000">
    <meta name="apple-mobile-web-app-title" content="TMD Bend Calculator">

    <!-- Open Graph -->
    <meta property="og:title" content="Free Sheet Metal Bend Allowance Calculator">
    <meta property="og:description"
        content="High-precision bend allowance calculator with real-time SVG diagrams, material presets, and K-Factor explanations.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://teslamechanicaldesigns.com/calculators/sheet-metal-bend-allowance/">
    <meta property="og:locale" content="en_US">
    <meta property="og:image" content="https://teslamechanicaldesigns.com/images/tmd-logo.svg">
    <meta property="og:site_name" content="Tesla Mechanical Designs">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Free Sheet Metal Bend Allowance Calculator">
    <meta name="twitter:description"
        content="High-precision bend allowance calculator for engineers and fabricators. Real-time results with visual diagrams.">
    <meta name="twitter:image" content="https://teslamechanicaldesigns.com/images/tmd-logo.svg">
    <meta name="twitter:image:alt" content="TMD Bend Allowance Calculator">

    <!-- Canonical -->
    <link rel="canonical" href="https://teslamechanicaldesigns.com/calculators/sheet-metal-bend-allowance/">

    <!-- Google Fonts (monospace only) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="favicon.svg">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="sheet-metal-bend-allowance-calculator.css">

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Sheet Metal Bend Allowance Calculator",
        "url": "https://teslamechanicaldesigns.com/calculators/sheet-metal-bend-allowance/",
        "description": "Free interactive calculator for sheet metal bend allowance, bend deduction, and developed length. Supports multiple materials with standard K-Factor presets.",
        "applicationCategory": "Engineering Tool",
        "operatingSystem": "All",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "creator": {
            "@type": "Organization",
            "name": "Tesla Mechanical Designs",
            "url": "https://teslamechanicaldesigns.com"
        }
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://teslamechanicaldesigns.com/" },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://teslamechanicaldesigns.com/calculators/" },
            { "@type": "ListItem", "position": 3, "name": "Bend Allowance Calculator" }
        ]
    }
    </script>
</head>

<body>

    <!-- ========== HEADER ========== -->
    <header class="site-header">
        <div class="container header-inner">
            <a href="https://teslamechanicaldesigns.com" class="logo" aria-label="Tesla Mechanical Designs Home">
                <img src="tmd-logo.svg" alt="TMD Logo" class="logo-icon-img" width="40" height="40" loading="eager">
                <div class="logo-text">
                    <span class="logo-name"><span class="tmd-highlight">T</span>ESLA <span
                            class="tmd-highlight">M</span>ECHANICAL <span class="tmd-highlight">D</span>ESIGNS</span>
                    <span class="logo-tagline">Precision Engineering Tools</span>
                </div>
            </a>
            <nav class="header-nav" aria-label="Main navigation">
                <a href="https://teslamechanicaldesigns.com" class="nav-link">← Back to Main Site</a>
            </nav>
        </div>
    </header>

    <!-- ========== HERO ========== -->
    <section class="hero animate-in" id="hero">
        <div class="container hero-inner">
            <div class="hero-badge">Free Online Tool</div>
            <h1>Sheet Metal Bend Allowance Calculator</h1>
            <p class="hero-subtitle">Calculate bend allowance, bend deduction, and developed length instantly.
                Compliant with <strong>ASME Y14.5</strong> and <strong>ISO 2768</strong> standards.</p>
            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-value">8</span>
                    <span class="stat-label">Material Presets</span>
                </div>
                <div class="stat">
                    <span class="stat-value">&lt;100ms</span>
                    <span class="stat-label">Instant Results</span>
                </div>
                <div class="stat">
                    <span class="stat-value">ASME</span>
                    <span class="stat-label">Standards</span>
                </div>
            </div>
        </div>
    </section>

    <!-- ========== MAIN CALCULATOR ========== -->
    <main class="calculator-section" id="calculator">
        <div class="container calculator-grid">

            <!-- ---- INPUT PANEL ---- -->
            <div class="panel input-panel animate-in">
                <div class="panel-header">
                    <h2 class="panel-title">
                        <span class="panel-icon">📐</span> Input Parameters
                    </h2>
                    <!-- Precision Selector (ASME Y14.5) -->
                    <div class="precision-toggle">
                        <label for="precision" class="precision-label">Decimals</label>
                        <select id="precision" class="precision-select">
                            <option value="2">2 dp</option>
                            <option value="3">3 dp</option>
                            <option value="4" selected>4 dp</option>
                        </select>
                    </div>
                    <!-- Unit Toggle -->
                    <div class="unit-toggle" role="radiogroup" aria-label="Unit system">
                        <button type="button" class="unit-btn active" data-unit="mm" aria-pressed="true">mm</button>
                        <button type="button" class="unit-btn" data-unit="in" aria-pressed="false">inches</button>
                    </div>
                </div>

                <form id="calcForm" autocomplete="off" novalidate>
                    <!-- Material Preset -->
                    <div class="form-group">
                        <label for="material">Material Preset</label>
                        <select id="material" name="material">
                            <option value="custom">Custom / Manual</option>
                            <optgroup label="Common Metals">
                                <option value="mild_steel" selected>Mild Steel (K = 0.44)</option>
                                <option value="aluminum">Aluminum (K = 0.33)</option>
                                <option value="stainless_steel">Stainless Steel (K = 0.45)</option>
                                <option value="copper">Copper (K = 0.38)</option>
                            </optgroup>
                            <optgroup label="Specialty Metals">
                                <option value="brass">Brass (K = 0.35)</option>
                                <option value="titanium">Titanium (K = 0.42)</option>
                                <option value="spring_steel">Spring Steel (K = 0.45)</option>
                                <option value="galvanized_steel">Galvanized Steel (K = 0.44)</option>
                            </optgroup>
                        </select>
                    </div>

                    <!-- Material Thickness -->
                    <div class="form-group">
                        <label for="thickness">Material Thickness (T) <span class="unit-label">mm</span></label>
                        <input type="number" id="thickness" name="thickness" placeholder="e.g. 2.0" step="0.01"
                            min="0.01" value="2" required>
                        <span class="error-msg" id="thickness-error"></span>
                    </div>

                    <!-- Inside Bend Radius -->
                    <div class="form-group">
                        <label for="radius">Bend Radius (R) <span class="unit-label">mm</span></label>
                        <input type="number" id="radius" name="radius" placeholder="e.g. 3.0" step="0.01" min="0"
                            value="3" required>
                        <span class="error-msg" id="radius-error"></span>
                    </div>

                    <!-- K-Factor -->
                    <div class="form-group">
                        <label for="kfactor">K-Factor (K) <span class="k-range-hint">Range: 0 – 1</span></label>
                        <input type="number" id="kfactor" name="kfactor" placeholder="e.g. 0.44" step="0.01" min="0"
                            max="1" value="0.44" required>
                        <span class="error-msg" id="kfactor-error"></span>
                    </div>

                    <!-- Bend Angle -->
                    <div class="form-group">
                        <label for="angle">Bend Angle (A) <span class="angle-unit">degrees</span></label>
                        <input type="number" id="angle" name="angle" placeholder="e.g. 90" step="0.1" min="0.1"
                            max="180" value="90" required>
                        <input type="range" id="angleSlider" min="1" max="180" value="90" class="angle-slider">
                        <span class="error-msg" id="angle-error"></span>
                    </div>
                </form>

                <!-- SVG Diagram -->
                <div class="diagram-box" style="margin-top: 24px;">
                    <h3>Visual Bend Diagram</h3>
                    <div class="svg-container" id="svgContainer">
                        <svg id="bendDiagram" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg"
                            aria-label="Dynamic bend cross-section diagram">
                            <!-- Populated by JS -->
                        </svg>
                    </div>
                </div>
            </div>

            <!-- ---- RESULTS PANEL ---- -->
            <div class="panel results-panel animate-in">
                <div class="panel-header">
                    <h2 class="panel-title">
                        <span class="panel-icon">📊</span> Results
                    </h2>
                    <button type="button" class="print-btn" id="printBtn" title="Print / Export Results">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>Print Results</span>
                    </button>
                </div>
                <div class="results-grid">
                    <div class="result-card primary" id="ba-result">
                        <span class="result-label">Bend Allowance (BA)</span>
                        <span class="result-value" id="ba-value">—</span>
                        <span class="result-unit" id="ba-unit">mm</span>
                    </div>
                    <div class="result-card" id="bd-result">
                        <span class="result-label">Bend Deduction (BD)</span>
                        <span class="result-value" id="bd-value">—</span>
                        <span class="result-unit" id="bd-unit">mm</span>
                    </div>
                    <div class="result-card" id="ossb-result">
                        <span class="result-label">Outside Setback (OSSB)</span>
                        <span class="result-value" id="ossb-value">—</span>
                        <span class="result-unit" id="ossb-unit">mm</span>
                    </div>
                    <div class="result-card tolerance-card" id="tol-result">
                        <span class="result-label">
                            ISO 2768-m Tolerance
                            <span class="tolerance-info" id="tolInfo"
                                title="General tolerances per ISO 2768-m (medium class) based on the Bend Allowance dimension.">ⓘ</span>
                        </span>
                        <span class="result-value" id="tol-value">—</span>
                        <span class="result-unit" id="tol-unit">mm</span>
                    </div>

                    <!-- ISO 2768-m Reference Table -->
                    <div class="iso-ref-table">
                        <h4 class="iso-ref-title">ISO 2768-m Reference <span class="tolerance-info"
                                title="General tolerances per ISO 2768-m (medium class). The active row highlights based on your Bend Allowance.">ⓘ</span>
                        </h4>
                        <table class="iso-table" id="isoTable">
                            <thead>
                                <tr>
                                    <th>Dimension (mm)</th>
                                    <th>Tolerance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr data-range="0-0.5">
                                    <td>
                                        < 0.5</td>
                                    <td>± 0.05</td>
                                </tr>
                                <tr data-range="0.5-3">
                                    <td>0.5 – 3</td>
                                    <td>± 0.1</td>
                                </tr>
                                <tr data-range="3-6">
                                    <td>3 – 6</td>
                                    <td>± 0.1</td>
                                </tr>
                                <tr data-range="6-30">
                                    <td>6 – 30</td>
                                    <td>± 0.2</td>
                                </tr>
                                <tr data-range="30-120">
                                    <td>30 – 120</td>
                                    <td>± 0.3</td>
                                </tr>
                                <tr data-range="120-400">
                                    <td>120 – 400</td>
                                    <td>± 0.5</td>
                                </tr>
                                <tr data-range="400-1000">
                                    <td>400 – 1000</td>
                                    <td>± 0.8</td>
                                </tr>
                                <tr data-range="1000-2000">
                                    <td>1000 – 2000</td>
                                    <td>± 1.2</td>
                                </tr>
                                <tr data-range="2000-999999">
                                    <td>≥ 2000</td>
                                    <td>± 2.0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Formula Display -->
                <div class="formula-box">
                    <h3>Formula Used</h3>
                    <div class="formula">
                        BA = (π / 180) × <span id="f-angle" class="f-highlight">A</span> × (<span id="f-radius"
                            class="f-highlight">R</span> + <span id="f-kfactor" class="f-highlight">K</span> × <span
                            id="f-thickness" class="f-highlight">T</span>)
                    </div>
                    <div class="formula-substitution" id="formula-sub">
                        Enter values to see the substitution…
                    </div>
                </div>

            </div>
        </div>
    </main>

    <!-- ========== K-FACTOR EXPLAINER ========== -->
    <section class="explainer-section animate-in" id="explainer">
        <div class="container">
            <div class="panel explainer-panel">
                <h2 class="section-title"><span class="panel-icon">🔬</span> K-Factor Explained</h2>
                <div class="explainer-content">
                    <div class="explainer-text">
                        <p>The <strong>K-Factor</strong> is the ratio of the neutral axis position to the material
                            thickness. It determines where the sheet metal neither stretches nor compresses during
                            bending.</p>
                        <div class="rt-ratio-box" id="rtRatioBox">
                            <div class="rt-ratio-header">
                                <span class="rt-label">Your R/T Ratio:</span>
                                <span class="rt-value" id="rtValue">—</span>
                            </div>
                            <div class="rt-recommendation" id="rtRecommendation">
                                Enter thickness and radius values above to see the recommendation.
                            </div>
                        </div>
                    </div>
                    <div class="explainer-table-wrap">
                        <table class="kfactor-table">
                            <thead>
                                <tr>
                                    <th>R/T Ratio</th>
                                    <th>Bend Type</th>
                                    <th>Typical K-Factor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>&lt; 1</td>
                                    <td>Tight Bend (Air Bending)</td>
                                    <td>0.33</td>
                                </tr>
                                <tr>
                                    <td>1 – 2</td>
                                    <td>Standard Bend</td>
                                    <td>0.40 – 0.44</td>
                                </tr>
                                <tr>
                                    <td>&gt; 2</td>
                                    <td>Loose / Large Radius</td>
                                    <td>0.45 – 0.50</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ========== LEAD GEN CTA ========== -->
    <section class="cta-section animate-in" id="cta">
        <div class="container cta-inner">
            <div class="cta-content">
                <h2>📘 Download the Complete Sheet Metal Design Guide</h2>
                <p>Get our free 40-page PDF covering bend calculations, material selection, DFM tips, and tolerance
                    charts used by top-tier fabricators.</p>
                <button type="button" class="cta-button" id="ctaButton">
                    <span>Download Free Guide</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                </button>
            </div>
        </div>
    </section>

    <!-- ========== PRINT REPORT MODAL ========== -->
    <div class="modal-overlay" id="printModal" role="dialog" aria-modal="true" aria-labelledby="printModalTitle" hidden>
        <div class="modal print-modal">
            <button class="modal-close" id="printModalClose" aria-label="Close modal">&times;</button>
            <h3 id="printModalTitle">Download CNC Design Verification Report</h3>

            <form id="printForm" novalidate class="print-lead-form">
                <div class="form-grid">
                    <div class="form-group icon-input">
                        <span class="input-icon">👤</span>
                        <input type="text" id="printName" placeholder="Your Name" required>
                    </div>
                    <div class="form-group icon-input">
                        <span class="input-icon">✉️</span>
                        <input type="email" id="printEmail" placeholder="E-mail" required>
                    </div>
                    <div class="form-group icon-input">
                        <span class="input-icon">📞</span>
                        <input type="tel" id="printPhone" placeholder="Phone No" required>
                    </div>
                    <div class="form-group icon-input select-wrapper">
                        <span class="input-icon">🌎</span>
                        <select id="printCountry" required>
                            <option value="" disabled selected hidden>Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="IN">India</option>
                            <option value="OT">Other</option>
                        </select>
                    </div>
                </div>

                <div class="form-group icon-input full-width">
                    <span class="input-icon message-icon">💬</span>
                    <textarea id="printMessage" placeholder="Message" rows="3" required></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="cta-button print-modal-submit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                        <span>SUBMIT</span>
                    </button>
                </div>
            </form>

            <div class="modal-success" id="printModalSuccess" hidden>
                <span class="success-icon">✅</span>
                <p>Generating your report...</p>
            </div>
        </div>
    </div>

    <!-- ========== EMAIL MODAL ========== -->
    <div class="modal-overlay" id="emailModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
        <div class="modal">
            <button class="modal-close" id="modalClose" aria-label="Close modal">&times;</button>
            <h3 id="modalTitle">Get Your Free Design Guide</h3>
            <p>Enter your email and we'll send the PDF directly to your inbox.</p>
            <form id="leadForm" novalidate>
                <div class="form-group">
                    <label for="leadEmail">Email Address</label>
                    <input type="email" id="leadEmail" placeholder="you@company.com" required>
                </div>
                <button type="submit" class="cta-button modal-submit">Send Me the Guide →</button>
            </form>
            <div class="modal-success" id="modalSuccess" hidden>
                <span class="success-icon">✅</span>
                <p>Thank you! Check your inbox shortly.</p>
            </div>
        </div>
    </div>

    <!-- ========== FOOTER ========== -->
    <footer class="site-footer">
        <div class="container footer-inner">
            <p>© 2026 <a href="https://teslamechanicaldesigns.com">Tesla Mechanical Designs</a>. All rights reserved.
            </p>
            <p class="footer-note">Calculations are for reference only. Always verify with your CAD system and material
                data sheets.</p>
            <p class="footer-compliance">Calculations follow standard engineering principles compliant with ASME Y14.5
                and ISO 2768-m.</p>
        </div>
    </footer>
    <!-- ========== HIDDEN PDF TEMPLATE ========== -->
    <div id="pdf-container" style="display: none;">
        <div id="pdf-template"
            style="width: 800px; padding: 40px 50px; background: #ffffff; color: #1a1a1a; font-family: 'Segoe UI', Roboto, sans-serif;">

            <!-- Header -->
            <div
                style="border-bottom: 3px solid #FBAF03; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <!-- TMD Logo instead of generic icon -->
                    <img src="tmd-logo.svg" alt="TMD" style="height: 40px; display: block;">
                    <div>
                        <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">
                            Bend Allowance Calculation Report
                        </h1>
                        <span style="color: #888888; font-size: 14px;">Tesla Mechanical Designs</span>
                    </div>
                </div>
                <div id="pdf-date" style="color: #888888; font-size: 14px;"></div>
            </div>

            <!-- Input Parameters -->
            <h3
                style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 600;">
                INPUT PARAMETERS</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th
                            style="padding: 12px 16px; text-align: left; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #dddddd;">
                            PARAMETER</th>
                        <th
                            style="padding: 12px 16px; text-align: left; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #dddddd;">
                            VALUE</th>
                    </tr>
                </thead>
                <tbody id="pdf-inputs" style="font-family: 'JetBrains Mono', monospace; font-size: 14px;">
                    <!-- Injected via JS -->
                </tbody>
            </table>

            <!-- Results -->
            <h3
                style="color: #7f8c8d; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 600;">
                RESULTS</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f8f9fa;">
                        <th
                            style="padding: 12px 16px; text-align: left; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #dddddd;">
                            OUTPUT</th>
                        <th
                            style="padding: 12px 16px; text-align: left; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #dddddd;">
                            VALUE</th>
                    </tr>
                </thead>
                <tbody id="pdf-results" style="font-family: 'JetBrains Mono', monospace; font-size: 14px;">
                    <!-- Injected via JS -->
                </tbody>
            </table>

            <!-- Formula -->
            <div style="background: #f8f9fa; padding: 24px; border-radius: 8px; margin-bottom: 40px;">
                <h3 style="color: #7f8c8d; font-size: 13px; text-transform: uppercase; margin: 0 0 12px 0;">FORMULA USED
                </h3>
                <code id="pdf-formula"
                    style="font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #1a1a1a; display: block;">
                    <!-- Injected via JS -->
                </code>
            </div>

            <!-- Visual Diagram -->
            <div style="margin-top: 40px; margin-bottom: 40px; page-break-inside: avoid;">
                <h3 style="color: #7f8c8d; font-size: 12px; text-transform: uppercase; margin-bottom: 16px;">VISUAL BEND
                    DIAGRAM</h3>
                <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; text-align: center;">
                    <svg id="pdf-svg" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg"
                        style="width: 100%; max-width: 400px; height: auto;">
                    </svg>
                </div>
            </div>

            <!-- Dark Footer -->
            <div
                style="background-color: #3b3b3b; color: #ffffff; padding: 30px; border-radius: 8px; page-break-inside: avoid;">
                <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 24px;">
                    <div style="background-color: #ffffff; padding: 10px; border-radius: 4px; display: inline-block;">
                        <img src="tmd-logo.svg" alt="TMD" style="height: 35px; display: block;">
                    </div>
                </div>

                <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.3;">
                    Your Engineering Challenges, Our <span style="color: #FBAF03;">CAD &<br>Manufacturing</span>
                    Solutions
                </h2>

                <div style="height: 2px; background-color: #FBAF03; width: 100%; margin-bottom: 20px;"></div>

                <div
                    style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; margin-bottom: 30px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    info@teslamechanicaldesigns.com
                </div>

                <p
                    style="color: #a0a0a0; font-size: 11px; line-height: 1.5; border-top: 1px solid #555555; padding-top: 15px; margin: 0;">
                    This report was generated by the Sheet Metal Bend Allowance Calculator at
                    teslamechanicaldesigns.com.<br>
                    Calculations are for reference only. Always verify with your CAD system and material data
                    sheets.<br>
                    Calculations follow standard engineering principles compliant with ASME Y14.5 and ISO 2768-m.
                </p>
            </div>

        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="sheet-metal-bend-allowance-calculator.js"></script>
</body>

</html>