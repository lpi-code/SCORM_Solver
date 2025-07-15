// Content script for SCORM Score Injector
// This runs on all pages and can be used for additional functionality

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkScormApi') {
        // Check if SCORM API is available
        const apiAvailable = !!(
            window.API_1484_11 || 
            window.parent.API_1484_11 || 
            window.top.API_1484_11 ||
            (window.parent && window.parent.parent && window.parent.parent.API_1484_11)
        );
        
        sendResponse({ available: apiAvailable });
    }
});

// Optional: Add a console log to indicate the extension is active
console.log('SCORM Score Injector extension loaded');