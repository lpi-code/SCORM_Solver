# SCORM Score Injector

A beautiful web extension that injects SCORM API completion and score values into e-learning content with a single click.

![Extension Preview](https://via.placeholder.com/800x400/4facfe/ffffff?text=SCORM+Score+Injector+Extension)

## Features

- 🎯 **One-Click Injection**: Instantly set SCORM completion and score values
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 🔧 **Cross-Browser**: Works on both Chrome and Firefox
- 📊 **Perfect Scores**: Sets score to 100% and completion status to "completed"
- 🛡️ **Error Handling**: Robust error checking and user feedback
- 📱 **Responsive**: Clean, mobile-friendly popup interface

## Installation

### Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)
2. Click "Add to Chrome"
3. Click "Add extension" to confirm

### Firefox Add-ons
1. Visit [Firefox Add-ons](https://addons.mozilla.org) (link coming soon)
2. Click "Add to Firefox"
3. Click "Add" to confirm

### Manual Installation (Development)

#### Chrome
1. Download the latest `scorm-score-injector-chrome.zip` from [Releases](../../releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

#### Firefox
1. Download the latest `scorm-score-injector-firefox.zip` from [Releases](../../releases)
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the ZIP file

## Usage

1. **Navigate** to a page with SCORM content
2. **Click** the extension icon in your browser toolbar
3. **Click** the "Inject SCORM Values" button
4. **Success!** The extension will:
   - Set `cmi.score.raw` to "100"
   - Set `cmi.score.scaled` to "1.0"
   - Set `cmi.success_status` to "passed"
   - Set `cmi.completion_status` to "completed"
   - Commit the changes

## SCORM Values Injected

The extension injects the following SCORM 2004 API values:

```javascript
API_1484_11.SetValue("cmi.score.raw", "100");
API_1484_11.SetValue("cmi.score.scaled", "1.0");
API_1484_11.SetValue("cmi.success_status", "passed");
API_1484_11.SetValue("cmi.completion_status", "completed");
API_1484_11.Commit("");
```

## Screenshots

### Extension Popup
![Popup Interface](https://via.placeholder.com/400x500/667eea/ffffff?text=Beautiful+Popup+Interface)

### Success Notification
![Success Notification](https://via.placeholder.com/400x100/4facfe/ffffff?text=Success+Notification)

## Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/scorm-score-injector.git
cd scorm-score-injector

# Install dependencies
npm install

# Build extensions
npm run build

# Package for distribution
npm run package
```

### Scripts
- `npm run build` - Build both Chrome and Firefox extensions
- `npm run build:chrome` - Build Chrome extension only
- `npm run build:firefox` - Build Firefox extension only
- `npm run zip` - Create ZIP packages for both browsers
- `npm run dev` - Build and display success message

### File Structure
```
scorm-score-injector/
├── .github/workflows/     # CI/CD pipelines
├── icons/                 # Extension icons
├── dist/                  # Build outputs
│   ├── chrome/           # Chrome extension
│   └── firefox/          # Firefox extension
├── manifest.json          # Chrome manifest (v3)
├── manifest-firefox.json  # Firefox manifest (v2)
├── popup.html            # Extension popup
├── popup.js              # Popup logic
├── styles.css            # Beautiful styling
├── content.js            # Content script
└── package.json          # Build configuration
```

## Browser Compatibility

### Chrome
- Manifest V3
- Chrome 88+
- Uses `chrome.scripting` API

### Firefox
- Manifest V2
- Firefox 78+
- Uses `browser.tabs.executeScript`

## Error Handling

The extension includes comprehensive error handling:

- **No SCORM API**: Searches common locations for the API
- **Invalid Pages**: Only works on HTTP/HTTPS pages
- **API Errors**: Displays specific SCORM error messages
- **Network Issues**: Handles connection problems gracefully

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

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include browser version and error messages

## Privacy

This extension:
- ✅ Only runs on pages you visit
- ✅ Does not collect personal data
- ✅ Does not send data to external servers
- ✅ Only injects SCORM values when you click the button

## Changelog

### Version 1.0.0
- Initial release
- Chrome and Firefox support
- Beautiful gradient UI
- One-click SCORM injection
- Error handling and notifications

---

Made with ❤️ for e-learning professionals and students
