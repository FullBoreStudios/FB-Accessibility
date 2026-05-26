# FB-Accessibility

[![License](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/fullbore/FB-Accessibility/pulls)
[![Platform](https://img.shields.io/badge/platform-Vanilla%20JS-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A lightweight, self-contained, open-source web accessibility widget and language switcher. Designed to provide essential WCAG 2.1 & 2.2 accessibility adjustments and client-side translation capability.

## Features

- **Language Switcher (Weglot style)**: Seamless client-side translation using Google Translate API with custom dropdown UI.
- **Smart Contrast & Contrast+**: Multiple contrast filters including High Contrast (dark bg, light text), Inverted Colors, and Grayscale.
- **Screen Reader**: Text-to-speech using Web Speech API that highlights and reads text on hover.
- **Highlight Links**: Emphasizes clickable links with clear styling (yellow background, bold underline).
- **Text Sizing & Spacing**: Adjust font scale and text spacing on the fly.
- **Line Height**: Cycles between line-height constraints for better readability.
- **Hide Images**: Instant visual declutter by hiding images, svgs, and pictures.
- **Large Cursor & Reading Guide**: Custom cursor magnification and an interactive horizontal reading line that follows the cursor.
- **Text Alignment**: Standardize text alignment (Left, Center, Right, Justify) for readability.
- **Saturation Controls**: Cycles between Monochromatic (grayscale), Low, and High saturation.
- **Move Widget**: Position the trigger button dynamically in any of the 4 screen corners (settings saved in `localStorage`).
- **Shortcuts**: Use `Alt+U` to toggle the menu open/closed.

## Installation

Since `fb_accessibility.js` is fully self-contained, simply place the script tag before the closing `</body>` tag on your website:

```html
<script src="/js/fb_accessibility.js"></script>
```

No additional CSS or external dependencies are required. All styling, SVG icons, and HTML panels are injected dynamically via JavaScript.

## Contributing

We want to keep making this accessibility widget better! Contributions, issues, and feature requests are welcome.

### How to Contribute
1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FB-Accessibility.git
   ```
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. Make your changes in `fb_accessibility.js`.
5. Test locally: Create a simple test HTML page, include the script tag `<script src="fb_accessibility.js"></script>`, and verify your changes in the browser.
6. Commit your changes:
   ```bash
   git commit -m "Add some amazing feature"
   ```
7. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
8. Open a **Pull Request** against the main repository.

## License

This software is released into the public domain under the **Unlicense**. You are free to copy, modify, publish, use, compile, sell, or distribute this software for any purpose, commercial or non-commercial, by any means. See the [LICENSE](LICENSE) file for details.
