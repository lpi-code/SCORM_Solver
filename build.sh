#!/bin/bash

# SCORM Completion Helper Build Script
# This script builds the extension for both Chrome and Firefox

set -e

echo "🚀 Building SCORM Completion Helper..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
mkdir -p dist/chrome dist/firefox

# Generate icons
echo "🎨 Generating icons..."
python3 create_icons.py

# Convert SVG to PNG
echo "🖼️ Converting SVG icons to PNG..."
if command -v convert &> /dev/null; then
    cd icons
    for size in 16 32 48 128; do
        convert icon-${size}.svg icon-${size}.png
        echo "  ✅ Created icon-${size}.png"
    done
    cd ..
else
    echo "  ⚠️ ImageMagick not found. PNG icons may not be available."
fi

# Build Chrome extension
echo "🔧 Building Chrome extension..."
cp manifest.json dist/chrome/
cp popup.html dist/chrome/
cp popup.css dist/chrome/
cp popup.js dist/chrome/
cp content.js dist/chrome/
cp -r icons dist/chrome/

# Build Firefox extension
echo "🦊 Building Firefox extension..."
cp manifest-firefox.json dist/firefox/manifest.json
cp popup.html dist/firefox/
cp popup.css dist/firefox/
cp popup.js dist/firefox/
cp content.js dist/firefox/
cp -r icons dist/firefox/

# Create ZIP packages
echo "📦 Creating distribution packages..."
cd dist/chrome
zip -r ../scorm-completion-helper-chrome.zip . -q
echo "  ✅ Created scorm-completion-helper-chrome.zip"
cd ../firefox
zip -r ../scorm-completion-helper-firefox.zip . -q
echo "  ✅ Created scorm-completion-helper-firefox.zip"
cd ../..

# Verify builds
echo "🔍 Verifying builds..."
echo "Chrome extension contents:"
unzip -l dist/scorm-completion-helper-chrome.zip | head -10

echo ""
echo "Firefox extension contents:"
unzip -l dist/scorm-completion-helper-firefox.zip | head -10

echo ""
echo "📊 Build Statistics:"
echo "Chrome package size: $(du -h dist/scorm-completion-helper-chrome.zip | cut -f1)"
echo "Firefox package size: $(du -h dist/scorm-completion-helper-firefox.zip | cut -f1)"

echo ""
echo "✅ Build completed successfully!"
echo "📁 Distribution files created in dist/ directory"
echo ""
echo "🚀 Next steps:"
echo "  • Test Chrome extension: Load dist/chrome/ as unpacked extension"
echo "  • Test Firefox extension: Load dist/firefox/manifest.json as temporary add-on"
echo "  • Release packages: Use dist/scorm-completion-helper-*.zip files"