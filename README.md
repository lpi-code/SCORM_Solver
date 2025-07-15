# SCORM Completion Helper

A browser extension that automatically injects SCORM API calls to mark courses as completed with a 100% score. Features a beautiful, modern UI with real-time SCORM API detection.

## Features

- ✅ **SCORM API Detection**: Automatically detects SCORM 1.2 and SCORM 2004 APIs
- 🎯 **One-Click Completion**: Mark courses as completed with a single button click
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 🔍 **Real-time Status**: Shows whether SCORM API is available on the current page
- 🌐 **Cross-browser**: Works on both Chrome and Firefox
- 📱 **Responsive**: Optimized for different screen sizes
- 🚀 **Fast**: Lightweight and efficient

## Installation

### Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Firefox Add-ons
1. Visit [Firefox Add-ons](https://addons.mozilla.org) (link coming soon)
2. Click "Add to Firefox"
3. Confirm the installation

### Manual Installation (Development)

#### Chrome
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list

#### Firefox
1. Download or clone this repository
2. Copy `manifest-firefox.json` to `manifest.json` (overwriting the existing file)
3. Open Firefox and navigate to `about:debugging`
4. Click "This Firefox" in the sidebar
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from the extension folder

## Usage

1. **Navigate to a SCORM course**: Open any webpage containing SCORM content
2. **Check API status**: Click the extension icon to see if SCORM API is detected
3. **Mark as completed**: If SCORM API is available, click "Mark as Completed"
4. **Success confirmation**: The extension will show a success message and update the button

### SCORM API Support

The extension supports both major SCORM versions:
- **SCORM 1.2**: Uses `API` object with `LMSSetValue` and `LMSCommit`
- **SCORM 2004**: Uses `API_1484_11` object with `SetValue` and `Commit`

### Injected Values

When you click "Mark as Completed", the extension injects these values:

**SCORM 2004:**
```javascript
API_1484_11.SetValue("cmi.score.raw", "100");
API_1484_11.SetValue("cmi.score.scaled", "1.0");
API_1484_11.SetValue("cmi.success_status", "passed");
API_1484_11.SetValue("cmi.completion_status", "completed");
API_1484_11.Commit("");
```

**SCORM 1.2:**
```javascript
API.LMSSetValue("cmi.core.score.raw", "100");
API.LMSSetValue("cmi.core.lesson_status", "completed");
API.LMSCommit("");
```

## UI Features

- **Status Indicator**: 
  - 🟢 Green checkmark = SCORM API detected
  - 🔴 Red X = SCORM API not found
  - ⏳ Spinner = Checking for API
- **Beautiful Button**: Gradient design with hover effects and animations
- **Real-time Feedback**: Visual confirmation when injection is successful
- **Error Handling**: Clear error messages if something goes wrong

## Development

### Prerequisites
- Python 3.x (for icon generation)
- ImageMagick (for SVG to PNG conversion)
- Node.js (for web-ext linting)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/scorm-completion-helper.git
   cd scorm-completion-helper
   ```

2. Generate icons:
   ```bash
   python3 create_icons.py
   cd icons
   for size in 16 32 48 128; do
     convert icon-${size}.svg icon-${size}.png
   done
   cd ..
   ```

3. Install development tools:
   ```bash
   npm install -g web-ext
   ```

### File Structure
```
scorm-completion-helper/
├── manifest.json          # Chrome manifest (Manifest V3)
├── manifest-firefox.json  # Firefox manifest (Manifest V2)
├── popup.html             # Extension popup UI
├── popup.css              # Popup styles
├── popup.js               # Popup logic (cross-browser compatible)
├── content.js             # Content script for page interaction
├── icons/                 # Extension icons (SVG and PNG)
├── create_icons.py        # Icon generation script
├── .github/workflows/     # CI/CD pipelines
└── README.md             # This file
```

### Building for Release

#### Chrome
```bash
mkdir -p dist/chrome
cp manifest.json dist/chrome/
cp popup.html popup.css popup.js content.js dist/chrome/
cp -r icons dist/chrome/
cd dist/chrome
zip -r ../scorm-completion-helper-chrome.zip .
```

#### Firefox
```bash
mkdir -p dist/firefox
cp manifest-firefox.json dist/firefox/manifest.json
cp popup.html popup.css popup.js content.js dist/firefox/
cp -r icons dist/firefox/
cd dist/firefox
zip -r ../scorm-completion-helper-firefox.zip .
```

### Testing
```bash
# Lint Chrome extension
web-ext lint --source-dir dist/chrome

# Lint Firefox extension
web-ext lint --source-dir dist/firefox
```

## CI/CD Pipeline

The project includes GitHub Actions workflows for:
- ✅ Automated testing and linting
- 📦 Building release packages
- 🚀 Publishing to Chrome Web Store
- 🦊 Publishing to Firefox Add-ons

### Required Secrets
For automated publishing, add these secrets to your GitHub repository:

**Chrome Web Store:**
- `CHROME_EXTENSION_ID`
- `CHROME_CLIENT_ID`
- `CHROME_CLIENT_SECRET`
- `CHROME_REFRESH_TOKEN`

**Firefox Add-ons:**
- `FIREFOX_ADDON_UUID`
- `FIREFOX_API_KEY`
- `FIREFOX_API_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/scorm-completion-helper/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your browser, SCORM version, and the issue

## Changelog

### v1.0.0
- Initial release
- Support for SCORM 1.2 and SCORM 2004
- Beautiful gradient UI design
- Cross-browser compatibility (Chrome and Firefox)
- Real-time SCORM API detection
- One-click completion injection
- Comprehensive error handling

---

**⚠️ Disclaimer**: This extension is for educational and testing purposes. Use responsibly and in accordance with your organization's policies.
