/**
 * fb_accessibility.js
 * A lightweight, self-contained, open-source web accessibility widget and language switcher.
 * Inspired by UserWay and Weglot style services, convoked by lack of money and wanting to help people
 */

(function () {
  // Prevent duplicate initialization
  if (window.__fbAccessibilityInitialized) return;
  window.__fbAccessibilityInitialized = true;

  // Language mapping
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' }
  ];

  // Default Settings State
  const defaultSettings = {
    contrast: false,          // Smart Contrast
    contrastPlus: 0,          // 0: Normal, 1: High Contrast, 2: Inverted, 3: Grayscale
    reader: false,            // Screen Reader
    links: false,             // Highlight Links
    textSize: 0,              // 0: Default, 1: Big, 2: Bigger, 3: Biggest
    spacing: 0,               // 0: Normal, 1: Wide, 2: Wider, 3: Widest
    hideImages: false,        // Hide Images
    cursor: 0,                // 0: Normal, 1: Large, 2: Extra Large, 3: Reading Guide, 4: Large + Guide
    lineHeight: 0,            // 0: Normal, 1: Loose, 2: Looser
    align: 0,                 // 0: Default, 1: Left, 2: Center, 3: Right, 4: Justify
    saturation: 0,            // 0: Normal, 1: Monochromatic (Grayscale), 2: Low, 3: High
    position: 0               // 0: Bottom-Right, 1: Bottom-Left, 2: Top-Right, 3: Top-Left
  };

  const positions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
  const positionLabels = ['Bottom-Right', 'Bottom-Left', 'Top-Right', 'Top-Left'];

  let settings = { ...defaultSettings };
  let activeSpeechElement = null;

  // CSS Scoped Styles Injection
  const css = `
    /* Host Reset and Stylesheet */
    :root {
      --fb-font-scale: 1;
      --fb-letter-spacing: 0px;
      --fb-word-spacing: 0px;
      --fb-line-height: normal;
    }

    /* Accessibility Classes */
    html.fb-spacing-active *, html.fb-spacing-active {
      letter-spacing: var(--fb-letter-spacing) !important;
      word-spacing: var(--fb-word-spacing) !important;
    }

    html.fb-line-height-active *, html.fb-line-height-active {
      line-height: var(--fb-line-height) !important;
    }

    /* Highlight Links */
    html.fb-highlight-links-active a, 
    html.fb-highlight-links-active a * {
      background-color: #ffeb3b !important;
      color: #000000 !important;
      text-decoration: underline !important;
      outline: 2px solid #000000 !important;
      font-weight: bold !important;
    }

    /* Hide Images */
    html.fb-hide-images-active img,
    html.fb-hide-images-active svg:not(.fb-icon),
    html.fb-hide-images-active picture,
    html.fb-hide-images-active figure,
    html.fb-hide-images-active [style*="background-image"] {
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Text Alignment */
    html.fb-align-left * { text-align: left !important; }
    html.fb-align-center * { text-align: center !important; }
    html.fb-align-right * { text-align: right !important; }
    html.fb-align-justify * { text-align: justify !important; }

    /* Saturation Filters */
    html.fb-sat-grayscale { filter: grayscale(100%) !important; }
    html.fb-sat-low { filter: saturate(50%) !important; }
    html.fb-sat-high { filter: saturate(200%) !important; }

    /* Contrast Filters */
    html.fb-smart-contrast-active {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #000000 !important;
    }
    html.fb-smart-contrast-active img, 
    html.fb-smart-contrast-active video, 
    html.fb-smart-contrast-active iframe,
    html.fb-smart-contrast-active [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Contrast Plus: High Contrast Mode */
    html.fb-contrast-high {
      background-color: #000000 !important;
      color: #ffffff !important;
    }
    html.fb-contrast-high * {
      background-color: #000000 !important;
      color: #ffffff !important;
      border-color: #ffffff !important;
    }
    html.fb-contrast-high a, html.fb-contrast-high a * {
      color: #ffff00 !important;
      text-decoration: underline !important;
    }

    /* Contrast Plus: Inverted Colors Mode */
    html.fb-contrast-inverted {
      filter: invert(100%) !important;
    }
    html.fb-contrast-inverted img, 
    html.fb-contrast-inverted video, 
    html.fb-contrast-inverted iframe {
      filter: invert(100%) !important;
    }

    /* Custom Cursors */
    html.fb-cursor-large, html.fb-cursor-large * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='1.5'%3E%3Cpath d='M4.5 3v15.25l4.3-4.3 2.95 6.95 2.15-0.9-2.95-6.95h5.55L4.5 3z'/%3E%3C/svg%3E"), auto !important;
    }
    html.fb-cursor-xlarge, html.fb-cursor-xlarge * {
      cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='white' stroke='black' stroke-width='1.5'%3E%3Cpath d='M4.5 3v15.25l4.3-4.3 2.95 6.95 2.15-0.9-2.95-6.95h5.55L4.5 3z'/%3E%3C/svg%3E"), auto !important;
    }

    /* Screen Reader Highlights */
    .fb-speech-highlight {
      outline: 3px solid #0056b3 !important;
      background-color: rgba(0, 86, 179, 0.1) !important;
    }

    /* Google Translate Overrides */
    .goog-te-banner-frame, .goog-te-banner, iframe.goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame {
      display: none !important;
      visibility: hidden !important;
    }
    body {
      top: 0px !important;
      position: static !important;
    }
    .goog-text-highlight {
      background-color: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }

    /* Widget UI Styling */
    #fb-accessibility-widget {
      position: static;
    }

    .fb-trigger-btn {
      position: fixed;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #0056b3;
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 16px rgba(0, 86, 179, 0.35);
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0;
    }
    .fb-trigger-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0, 86, 179, 0.45);
      background-color: #004085;
    }
    .fb-trigger-btn:focus-visible {
      outline: 3px solid #ffeb3b;
      outline-offset: 2px;
    }

    .fb-panel {
      position: fixed;
      width: 360px;
      max-height: calc(100vh - 130px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      z-index: 2147483646;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: left;
    }
    .fb-panel.fb-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Position Styles */
    .fb-pos-bottom-right .fb-trigger-btn { bottom: 20px; right: 20px; top: auto; left: auto; }
    .fb-pos-bottom-right .fb-panel { bottom: 90px; right: 20px; top: auto; left: auto; }

    .fb-pos-bottom-left .fb-trigger-btn { bottom: 20px; left: 20px; top: auto; right: auto; }
    .fb-pos-bottom-left .fb-panel { bottom: 90px; left: 20px; top: auto; right: auto; }

    .fb-pos-top-right .fb-trigger-btn { top: 20px; right: 20px; bottom: auto; left: auto; }
    .fb-pos-top-right .fb-panel { top: 90px; right: 20px; bottom: auto; left: auto; }

    .fb-pos-top-left .fb-trigger-btn { top: 20px; left: 20px; bottom: auto; right: auto; }
    .fb-pos-top-left .fb-panel { top: 90px; left: 20px; bottom: auto; right: auto; }

    .fb-panel-header {
      background: #0056b3;
      color: #ffffff;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .fb-header-title {
      font-weight: 700;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .fb-shortcut-hint {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.25);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    .fb-close-btn {
      background: none;
      border: none;
      color: #ffffff;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .fb-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .fb-panel-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .fb-section-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .fb-section-title {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #6c757d;
      letter-spacing: 0.8px;
    }

    /* Custom Dropdown for Language Selector */
    .fb-lang-dropdown-wrapper {
      position: relative;
      width: 100%;
    }
    .fb-lang-active-btn {
      width: 100%;
      padding: 10px 14px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      text-align: left;
      font-size: 0.9rem;
      font-weight: 600;
      color: #212529;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.2s;
    }
    .fb-lang-active-btn:hover {
      background: #e9ecef;
      border-color: #ced4da;
    }
    .fb-lang-active-btn .fb-lang-selected {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .fb-lang-dropdown-menu {
      position: absolute;
      top: 105%;
      left: 0;
      width: 100%;
      background: #ffffff;
      border: 1px solid #ced4da;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      z-index: 2147483647;
      display: none;
      max-height: 220px;
      overflow-y: auto;
      padding: 4px 0;
    }
    .fb-lang-dropdown-menu.fb-show {
      display: block;
    }
    .fb-lang-item {
      padding: 10px 14px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.15s;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #212529;
    }
    .fb-lang-item:hover {
      background: #f1f3f5;
    }

    .fb-divider {
      height: 1px;
      background: #e9ecef;
    }

    /* Grid for Options */
    .fb-controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .fb-control-card {
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 12px;
      padding: 12px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.01);
      width: 100%;
      box-sizing: border-box;
    }
    .fb-control-card:hover {
      border-color: #adb5bd;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      transform: translateY(-1px);
    }
    .fb-control-card.fb-active {
      border-color: #0056b3;
      background: rgba(0, 86, 179, 0.05);
    }
    .fb-control-card.fb-active:hover {
      background: rgba(0, 86, 179, 0.08);
    }
    .fb-card-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
    .fb-card-title {
      font-size: 0.78rem;
      font-weight: 600;
      color: #212529;
      text-align: center;
    }
    .fb-card-status {
      font-size: 0.68rem;
      font-weight: 700;
      color: #6c757d;
      background: #e9ecef;
      padding: 2px 8px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }
    .fb-control-card.fb-active .fb-card-status {
      color: #ffffff;
      background: #0056b3;
    }

    /* Actions */
    .fb-reset-btn {
      width: 100%;
      padding: 12px;
      background: #0056b3;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s;
      text-align: center;
      margin-top: 4px;
    }
    .fb-reset-btn:hover {
      background: #004085;
    }
    .fb-move-btn {
      width: 100%;
      padding: 10px 14px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      color: #495057;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
    }
    .fb-move-btn:hover {
      background: #e9ecef;
      border-color: #ced4da;
    }
    .fb-move-btn #fb-current-position-label {
      font-size: 0.75rem;
      color: #6c757d;
    }

    .fb-panel-footer {
      padding: 12px;
      text-align: center;
      background: #f8f9fa;
      border-top: 1px solid #dee2e6;
    }
    .fb-footer-link {
      font-size: 0.7rem;
      color: #6c757d;
      text-decoration: none;
      font-weight: 500;
    }
    .fb-footer-link:hover {
      color: #0056b3;
    }

    /* Reading Guide Guide line style */
    #fb-reading-guide {
      position: fixed;
      left: 0;
      width: 100%;
      height: 8px;
      background-color: rgba(255, 235, 59, 0.85);
      box-shadow: 0 0 10px rgba(255, 235, 59, 0.9);
      pointer-events: none;
      z-index: 2147483645;
      display: none;
      transform: translateY(-50%);
    }

    /* Scaling factor */
    html {
      font-size: calc(100% * var(--fb-font-scale)) !important;
    }

    /* Responsive full screen */
    @media (max-width: 400px) {
      .fb-panel {
        width: calc(100% - 20px) !important;
        right: 10px !important;
        left: 10px !important;
        bottom: 80px !important;
        max-height: calc(100vh - 100px) !important;
      }
    }
  `;

  // HTML Structure
  const html = `
    <!-- Floating Trigger Icon -->
    <button id="fb-accessibility-btn" class="fb-trigger-btn" aria-label="Accessibility Menu" title="Accessibility Menu (Alt+U)">
      <svg class="fb-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
      </svg>
    </button>

    <!-- Slide Panel Container -->
    <div id="fb-accessibility-panel" class="fb-panel" aria-modal="true" role="dialog" aria-label="Accessibility Settings">
      <div class="fb-panel-header">
        <div class="fb-header-title">
          <span>Accessibility Menu</span>
          <span class="fb-shortcut-hint">Alt+U</span>
        </div>
        <button id="fb-panel-close-btn" class="fb-close-btn" aria-label="Close accessibility menu">&times;</button>
      </div>

      <div class="fb-panel-content">
        <!-- Translation (Weglot Style) -->
        <div class="fb-section-container">
          <div class="fb-section-title">Select Language</div>
          <div class="fb-lang-dropdown-wrapper">
            <button id="fb-lang-active-btn" class="fb-lang-active-btn" aria-haspopup="listbox" aria-label="Language Selector">
              <span class="fb-lang-selected">
                <span id="fb-lang-active-flag">🇺🇸</span>
                <span id="fb-lang-active-name">English</span>
              </span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:inline-block;"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div id="fb-lang-dropdown-menu" class="fb-lang-dropdown-menu" role="listbox">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <div class="fb-divider"></div>

        <!-- Settings Grid -->
        <div class="fb-controls-grid">
          <!-- Smart Contrast -->
          <button class="fb-control-card" id="fb-ctrl-contrast" aria-pressed="false">
            <div class="fb-card-icon">🌓</div>
            <div class="fb-card-title">Smart Contrast</div>
            <div class="fb-card-status" id="fb-status-contrast">Off</div>
          </button>

          <!-- Contrast Plus -->
          <button class="fb-control-card" id="fb-ctrl-contrast-plus" aria-pressed="false">
            <div class="fb-card-icon">👁️</div>
            <div class="fb-card-title">Contrast +</div>
            <div class="fb-card-status" id="fb-status-contrast-plus">Normal</div>
          </button>

          <!-- Screen Reader -->
          <button class="fb-control-card" id="fb-ctrl-reader" aria-pressed="false">
            <div class="fb-card-icon">🔊</div>
            <div class="fb-card-title">Screen Reader</div>
            <div class="fb-card-status" id="fb-status-reader">Off</div>
          </button>

          <!-- Highlight Links -->
          <button class="fb-control-card" id="fb-ctrl-links" aria-pressed="false">
            <div class="fb-card-icon">🔗</div>
            <div class="fb-card-title">Highlight Links</div>
            <div class="fb-card-status" id="fb-status-links">Off</div>
          </button>

          <!-- Bigger Text -->
          <button class="fb-control-card" id="fb-ctrl-text-size" aria-pressed="false">
            <div class="fb-card-icon">A+</div>
            <div class="fb-card-title">Bigger Text</div>
            <div class="fb-card-status" id="fb-status-text-size">Default</div>
          </button>

          <!-- Text Spacing -->
          <button class="fb-control-card" id="fb-ctrl-spacing" aria-pressed="false">
            <div class="fb-card-icon">↔️</div>
            <div class="fb-card-title">Text Spacing</div>
            <div class="fb-card-status" id="fb-status-spacing">Normal</div>
          </button>

          <!-- Line Height -->
          <button class="fb-control-card" id="fb-ctrl-line-height" aria-pressed="false">
            <div class="fb-card-icon">↕️</div>
            <div class="fb-card-title">Line Height</div>
            <div class="fb-card-status" id="fb-status-line-height">Normal</div>
          </button>

          <!-- Text Align -->
          <button class="fb-control-card" id="fb-ctrl-align" aria-pressed="false">
            <div class="fb-card-icon">＝</div>
            <div class="fb-card-title">Text Align</div>
            <div class="fb-card-status" id="fb-status-align">Default</div>
          </button>

          <!-- Saturation -->
          <button class="fb-control-card" id="fb-ctrl-saturation" aria-pressed="false">
            <div class="fb-card-icon">💧</div>
            <div class="fb-card-title">Saturation</div>
            <div class="fb-card-status" id="fb-status-saturation">Normal</div>
          </button>

          <!-- Hide Images -->
          <button class="fb-control-card" id="fb-ctrl-hide-images" aria-pressed="false">
            <div class="fb-card-icon">🖼️❌</div>
            <div class="fb-card-title">Hide Images</div>
            <div class="fb-card-status" id="fb-status-hide-images">Off</div>
          </button>

          <!-- Cursor Settings -->
          <button class="fb-control-card" id="fb-ctrl-cursor" aria-pressed="false" style="grid-column: span 2;">
            <div class="fb-card-icon">🖱️</div>
            <div class="fb-card-title">Cursor & Reading Guide</div>
            <div class="fb-card-status" id="fb-status-cursor">Normal</div>
          </button>
        </div>

        <div class="fb-divider"></div>

        <!-- Reset -->
        <button id="fb-reset-btn" class="fb-reset-btn">Reset All Settings</button>

        <!-- Position Move -->
        <button id="fb-move-btn" class="fb-move-btn" aria-label="Cycle widget placement corner">
          <span>Move Widget Corner</span>
          <span id="fb-current-position-label">Bottom-Right</span>
        </button>
      </div>

      <div class="fb-panel-footer">
        <a href="https://github.com/fullbore/fb_accessibility" target="_blank" class="fb-footer-link">fb_accessibility v1.0.0</a>
      </div>
    </div>

    <!-- Screen reading guide line element -->
    <div id="fb-reading-guide"></div>

    <!-- Hidden translate hook -->
    <div id="fb-google-translate-hidden" style="display:none !important;"></div>
  `;

  // Cookie Helpers
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    const domain = window.location.hostname;
    document.cookie = `${name}=${value || ""}${expires}; path=/; domain=${domain}`;
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Load Saved Settings from localStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem('fb_accessibility_settings');
      if (saved) {
        settings = { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("fb_accessibility: localStorage not available, running with defaults.", e);
    }
  }

  // Save Settings to localStorage
  function saveSettings() {
    try {
      localStorage.setItem('fb_accessibility_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn("fb_accessibility: Failed to save settings to localStorage.", e);
    }
  }

  // Apply Settings to document DOM
  function applySettings() {
    const htmlEl = document.documentElement;

    // 1. Smart Contrast
    if (settings.contrast) {
      htmlEl.classList.add('fb-smart-contrast-active');
    } else {
      htmlEl.classList.remove('fb-smart-contrast-active');
    }

    // 2. Contrast Plus (0: Normal, 1: High Contrast, 2: Inverted, 3: Grayscale)
    htmlEl.classList.remove('fb-contrast-high', 'fb-contrast-inverted', 'fb-sat-grayscale');
    if (settings.contrastPlus === 1) {
      htmlEl.classList.add('fb-contrast-high');
    } else if (settings.contrastPlus === 2) {
      htmlEl.classList.add('fb-contrast-inverted');
    } else if (settings.contrastPlus === 3) {
      htmlEl.classList.add('fb-sat-grayscale');
    }

    // 3. Highlight Links
    if (settings.links) {
      htmlEl.classList.add('fb-highlight-links-active');
    } else {
      htmlEl.classList.remove('fb-highlight-links-active');
    }

    // 4. Text Size
    const fontScales = [1.0, 1.15, 1.30, 1.45];
    htmlEl.style.setProperty('--fb-font-scale', fontScales[settings.textSize]);

    // 5. Text Spacing
    const letterSpacings = ['0px', '1.5px', '3px', '4.5px'];
    const wordSpacings = ['0px', '3px', '6px', '9px'];
    if (settings.spacing > 0) {
      htmlEl.classList.add('fb-spacing-active');
      htmlEl.style.setProperty('--fb-letter-spacing', letterSpacings[settings.spacing]);
      htmlEl.style.setProperty('--fb-word-spacing', wordSpacings[settings.spacing]);
    } else {
      htmlEl.classList.remove('fb-spacing-active');
      htmlEl.style.removeProperty('--fb-letter-spacing');
      htmlEl.style.removeProperty('--fb-word-spacing');
    }

    // 6. Line Height
    const lineHeights = ['normal', '1.8', '2.2'];
    if (settings.lineHeight > 0) {
      htmlEl.classList.add('fb-line-height-active');
      htmlEl.style.setProperty('--fb-line-height', lineHeights[settings.lineHeight]);
    } else {
      htmlEl.classList.remove('fb-line-height-active');
      htmlEl.style.removeProperty('--fb-line-height');
    }

    // 7. Text Align
    htmlEl.classList.remove('fb-align-left', 'fb-align-center', 'fb-align-right', 'fb-align-justify');
    const alignments = ['', 'left', 'center', 'right', 'justify'];
    if (settings.align > 0) {
      htmlEl.classList.add(`fb-align-${alignments[settings.align]}`);
    }

    // 8. Saturation
    htmlEl.classList.remove('fb-sat-grayscale', 'fb-sat-low', 'fb-sat-high');
    // If contrastPlus grayscale is active, it already has grayscale class, let's only override if normal
    if (settings.contrastPlus !== 3) {
      if (settings.saturation === 1) {
        htmlEl.classList.add('fb-sat-grayscale');
      } else if (settings.saturation === 2) {
        htmlEl.classList.add('fb-sat-low');
      } else if (settings.saturation === 3) {
        htmlEl.classList.add('fb-sat-high');
      }
    }

    // 9. Hide Images
    if (settings.hideImages) {
      htmlEl.classList.add('fb-hide-images-active');
    } else {
      htmlEl.classList.remove('fb-hide-images-active');
    }

    // 10. Cursor & Reading Guide
    htmlEl.classList.remove('fb-cursor-large', 'fb-cursor-xlarge');
    const guideEl = document.getElementById('fb-reading-guide');
    if (guideEl) guideEl.classList.remove('fb-active');

    if (settings.cursor === 1) {
      htmlEl.classList.add('fb-cursor-large');
    } else if (settings.cursor === 2) {
      htmlEl.classList.add('fb-cursor-xlarge');
    } else if (settings.cursor === 3) {
      if (guideEl) guideEl.classList.add('fb-active');
    } else if (settings.cursor === 4) {
      htmlEl.classList.add('fb-cursor-large');
      if (guideEl) guideEl.classList.add('fb-active');
    }

    // 11. Widget Position
    const container = document.getElementById('fb-accessibility-container-root');
    if (container) {
      container.className = `fb-pos-${positions[settings.position]}`;
    }

    // 12. Screen Reader Handler
    toggleScreenReaderListeners();

    // Update UI Indicators
    updateUIStates();
  }

  // Toggle SpeechSynthesis Listeners
  function toggleScreenReaderListeners() {
    if (settings.reader) {
      document.body.addEventListener('mouseover', onTextHover);
      document.body.addEventListener('mouseout', onTextLeave);
    } else {
      document.body.removeEventListener('mouseover', onTextHover);
      document.body.removeEventListener('mouseout', onTextLeave);
      if (activeSpeechElement) {
        activeSpeechElement.classList.remove('fb-speech-highlight');
        activeSpeechElement = null;
      }
      window.speechSynthesis.cancel();
    }
  }

  function onTextHover(e) {
    const speechEl = e.target.closest('p, h1, h2, h3, h4, h5, h6, a, li, button, span, label, strong, em');
    if (!speechEl || speechEl === activeSpeechElement) return;

    if (activeSpeechElement) {
      activeSpeechElement.classList.remove('fb-speech-highlight');
    }

    activeSpeechElement = speechEl;
    activeSpeechElement.classList.add('fb-speech-highlight');

    const textToRead = activeSpeechElement.innerText.trim();
    if (textToRead.length > 0) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      // Automatically detect current language if Google Translate is active
      const googtransVal = getCookie('googtrans');
      if (googtransVal) {
        const parts = googtransVal.split('/');
        utterance.lang = parts[parts.length - 1];
      } else {
        utterance.lang = document.documentElement.lang || 'en';
      }
      window.speechSynthesis.speak(utterance);
    }
  }

  function onTextLeave(e) {
    const speechEl = e.target.closest('p, h1, h2, h3, h4, h5, h6, a, li, button, span, label, strong, em');
    if (speechEl && speechEl === activeSpeechElement) {
      speechEl.classList.remove('fb-speech-highlight');
      activeSpeechElement = null;
      window.speechSynthesis.cancel();
    }
  }

  // Update Buttons UI with active class & labels
  function updateUIStates() {
    // Helper to toggle active classes
    const updateCard = (id, isActive, statusText) => {
      const card = document.getElementById(id);
      const status = document.getElementById(id.replace('ctrl', 'status'));
      if (card) {
        if (isActive) card.classList.add('fb-active');
        else card.classList.remove('fb-active');
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      }
      if (status) status.textContent = statusText;
    };

    // Smart Contrast
    updateCard('fb-ctrl-contrast', settings.contrast, settings.contrast ? 'On' : 'Off');

    // Contrast Plus (0: Normal, 1: High Contrast, 2: Inverted, 3: Grayscale)
    const contrastLabels = ['Normal', 'High Contrast', 'Inverted', 'Grayscale'];
    updateCard('fb-ctrl-contrast-plus', settings.contrastPlus > 0, contrastLabels[settings.contrastPlus]);

    // Screen Reader
    updateCard('fb-ctrl-reader', settings.reader, settings.reader ? 'On' : 'Off');

    // Highlight Links
    updateCard('fb-ctrl-links', settings.links, settings.links ? 'On' : 'Off');

    // Bigger Text
    const textLabels = ['Default', 'Big (115%)', 'Bigger (130%)', 'Biggest (145%)'];
    updateCard('fb-ctrl-text-size', settings.textSize > 0, textLabels[settings.textSize]);

    // Text Spacing
    const spacingLabels = ['Normal', 'Wide', 'Wider', 'Widest'];
    updateCard('fb-ctrl-spacing', settings.spacing > 0, spacingLabels[settings.spacing]);

    // Line Height
    const lineLabels = ['Normal', 'Loose (1.8)', 'Looser (2.2)'];
    updateCard('fb-ctrl-line-height', settings.lineHeight > 0, lineLabels[settings.lineHeight]);

    // Text Align
    const alignLabels = ['Default', 'Left', 'Center', 'Right', 'Justify'];
    updateCard('fb-ctrl-align', settings.align > 0, alignLabels[settings.align]);

    // Saturation
    const satLabels = ['Normal', 'Grayscale', 'Low', 'High'];
    updateCard('fb-ctrl-saturation', settings.saturation > 0, satLabels[settings.saturation]);

    // Hide Images
    updateCard('fb-ctrl-hide-images', settings.hideImages, settings.hideImages ? 'On' : 'Off');

    // Cursor
    const cursorLabels = ['Normal', 'Large', 'Extra Large', 'Guide Line', 'Large + Guide'];
    updateCard('fb-ctrl-cursor', settings.cursor > 0, cursorLabels[settings.cursor]);

    // Position Label
    const posLabel = document.getElementById('fb-current-position-label');
    if (posLabel) posLabel.textContent = positionLabels[settings.position];
  }

  // Google Translate Client Integration (Weglot style)
  function initGoogleTranslate() {
    // 1. Create a script link if it doesn't exist
    if (!document.getElementById('fb-google-translate-script')) {
      window.fbGoogleTranslateElementInit = function () {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,vi,ar,zh-CN',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'fb-google-translate-hidden');

        // Check if cookie is set and synchronize dropdown display
        syncActiveLanguageFromCookie();
      };

      const script = document.createElement('script');
      script.id = 'fb-google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=fbGoogleTranslateElementInit';
      document.body.appendChild(script);
    }
  }

  function syncActiveLanguageFromCookie() {
    const googtransVal = getCookie('googtrans');
    let code = 'en';
    if (googtransVal) {
      const parts = googtransVal.split('/');
      code = parts[parts.length - 1];
    }
    const match = languages.find(l => l.code.toLowerCase() === code.toLowerCase());
    if (match) {
      updateLanguageUI(match.code, match.name, match.flag);
    }
  }

  function updateLanguageUI(code, name, flag) {
    const activeFlag = document.getElementById('fb-lang-active-flag');
    const activeName = document.getElementById('fb-lang-active-name');
    if (activeFlag) activeFlag.textContent = flag;
    if (activeName) activeName.textContent = name;
  }

  function changeLanguage(code) {
    // Update translation via Google Translate Element Select
    const select = document.querySelector('#fb-google-translate-hidden select.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
      
      // Save in cookie
      setCookie('googtrans', `/en/${code}`, 30);
      
      const match = languages.find(l => l.code === code);
      if (match) {
        updateLanguageUI(match.code, match.name, match.flag);
      }
    } else {
      // If select doesn't exist yet, write cookie and reload to auto-translate
      setCookie('googtrans', `/en/${code}`, 30);
      window.location.reload();
    }
  }

  // Populate Custom Language List UI
  function populateLanguageDropdown() {
    const menu = document.getElementById('fb-lang-dropdown-menu');
    if (!menu) return;

    menu.innerHTML = '';
    languages.forEach(lang => {
      const div = document.createElement('div');
      div.className = 'fb-lang-item';
      div.setAttribute('role', 'option');
      div.setAttribute('data-lang', lang.code);
      div.innerHTML = `${lang.flag} ${lang.name}`;
      div.addEventListener('click', () => {
        changeLanguage(lang.code);
        menu.classList.remove('fb-show');
      });
      menu.appendChild(div);
    });
  }

  // Initialize Panel DOM injection
  function initWidget() {
    // 1. Inject Stylesheet
    const styleEl = document.createElement('style');
    styleEl.id = 'fb-accessibility-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // 2. Inject HTML Elements
    const root = document.createElement('div');
    root.id = 'fb-accessibility-container-root';
    root.className = `fb-pos-${positions[settings.position]}`;
    root.innerHTML = html;
    document.body.appendChild(root);

    // 3. Register Language Selector
    populateLanguageDropdown();
    const langBtn = document.getElementById('fb-lang-active-btn');
    const langMenu = document.getElementById('fb-lang-dropdown-menu');
    if (langBtn && langMenu) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('fb-show');
      });
    }

    // 4. Panel Toggle Actions
    const triggerBtn = document.getElementById('fb-accessibility-btn');
    const panel = document.getElementById('fb-accessibility-panel');
    const closeBtn = document.getElementById('fb-panel-close-btn');

    const togglePanel = () => {
      const isOpen = panel.classList.toggle('fb-open');
      triggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        initGoogleTranslate(); // Load translation script when panel is opened
      }
    };

    if (triggerBtn) triggerBtn.addEventListener('click', togglePanel);
    if (closeBtn) closeBtn.addEventListener('click', togglePanel);

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (panel && panel.classList.contains('fb-open')) {
        const insideWidget = e.target.closest('#fb-accessibility-container-root');
        if (!insideWidget) {
          panel.classList.remove('fb-open');
          triggerBtn.setAttribute('aria-expanded', 'false');
        }
      }
      if (langMenu && langMenu.classList.contains('fb-show')) {
        if (!e.target.closest('.fb-lang-dropdown-wrapper')) {
          langMenu.classList.remove('fb-show');
        }
      }
    });

    // Close panel and dropdown on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (langMenu && langMenu.classList.contains('fb-show')) {
          langMenu.classList.remove('fb-show');
        } else if (panel && panel.classList.contains('fb-open')) {
          panel.classList.remove('fb-open');
          triggerBtn.setAttribute('aria-expanded', 'false');
          triggerBtn.focus();
        }
      }
    });

    // Keyboard Shortcuts (Alt+U or Ctrl+U to toggle)
    document.addEventListener('keydown', (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'u') || (e.ctrlKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault();
        togglePanel();
      }
    });

    // Reading guide vertical movement
    const guideEl = document.getElementById('fb-reading-guide');
    document.addEventListener('mousemove', (e) => {
      if (guideEl && (settings.cursor === 3 || settings.cursor === 4)) {
        guideEl.style.top = e.clientY + 'px';
      }
    });

    // 5. Register Button Control Handlers
    // Smart Contrast toggle
    const contrastCard = document.getElementById('fb-ctrl-contrast');
    if (contrastCard) {
      contrastCard.addEventListener('click', () => {
        settings.contrast = !settings.contrast;
        saveSettings();
        applySettings();
      });
    }

    // Contrast Plus cycles
    const contrastPlusCard = document.getElementById('fb-ctrl-contrast-plus');
    if (contrastPlusCard) {
      contrastPlusCard.addEventListener('click', () => {
        settings.contrastPlus = (settings.contrastPlus + 1) % 4;
        saveSettings();
        applySettings();
      });
    }

    // Screen Reader toggle
    const readerCard = document.getElementById('fb-ctrl-reader');
    if (readerCard) {
      readerCard.addEventListener('click', () => {
        settings.reader = !settings.reader;
        saveSettings();
        applySettings();
      });
    }

    // Links toggle
    const linksCard = document.getElementById('fb-ctrl-links');
    if (linksCard) {
      linksCard.addEventListener('click', () => {
        settings.links = !settings.links;
        saveSettings();
        applySettings();
      });
    }

    // Text Size cycles
    const sizeCard = document.getElementById('fb-ctrl-text-size');
    if (sizeCard) {
      sizeCard.addEventListener('click', () => {
        settings.textSize = (settings.textSize + 1) % 4;
        saveSettings();
        applySettings();
      });
    }

    // Spacing cycles
    const spacingCard = document.getElementById('fb-ctrl-spacing');
    if (spacingCard) {
      spacingCard.addEventListener('click', () => {
        settings.spacing = (settings.spacing + 1) % 4;
        saveSettings();
        applySettings();
      });
    }

    // Line height cycles
    const lineCard = document.getElementById('fb-ctrl-line-height');
    if (lineCard) {
      lineCard.addEventListener('click', () => {
        settings.lineHeight = (settings.lineHeight + 1) % 3;
        saveSettings();
        applySettings();
      });
    }

    // Align cycles
    const alignCard = document.getElementById('fb-ctrl-align');
    if (alignCard) {
      alignCard.addEventListener('click', () => {
        settings.align = (settings.align + 1) % 5;
        saveSettings();
        applySettings();
      });
    }

    // Saturation cycles
    const satCard = document.getElementById('fb-ctrl-saturation');
    if (satCard) {
      satCard.addEventListener('click', () => {
        settings.saturation = (settings.saturation + 1) % 4;
        saveSettings();
        applySettings();
      });
    }

    // Hide images toggle
    const imagesCard = document.getElementById('fb-ctrl-hide-images');
    if (imagesCard) {
      imagesCard.addEventListener('click', () => {
        settings.hideImages = !settings.hideImages;
        saveSettings();
        applySettings();
      });
    }

    // Cursor cycles
    const cursorCard = document.getElementById('fb-ctrl-cursor');
    if (cursorCard) {
      cursorCard.addEventListener('click', () => {
        settings.cursor = (settings.cursor + 1) % 5;
        saveSettings();
        applySettings();
      });
    }

    // Move widget cycles
    const moveBtn = document.getElementById('fb-move-btn');
    if (moveBtn) {
      moveBtn.addEventListener('click', () => {
        settings.position = (settings.position + 1) % 4;
        saveSettings();
        applySettings();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('fb-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Reset translate cookie if it exists
        setCookie('googtrans', '', -1);
        
        // Reset setting values (preserve positioning)
        const savedPos = settings.position;
        settings = { ...defaultSettings, position: savedPos };
        
        saveSettings();
        applySettings();
        
        // Reset Google Translate widget if loaded
        const select = document.querySelector('#fb-google-translate-hidden select.goog-te-combo');
        if (select && select.value !== 'en') {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
        updateLanguageUI('en', 'English', '🇺🇸');
      });
    }

    // 6. Initial Application of Saved Settings
    applySettings();
    
    // Proactively check if translation cookie is active on start and boot translate script
    const googtransVal = getCookie('googtrans');
    if (googtransVal && googtransVal !== '/en/en') {
      initGoogleTranslate();
    }
  }

  // Boot
  loadSettings();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
