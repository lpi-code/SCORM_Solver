// Content script for SCORM API detection and injection
(function() {
    'use strict';

    // Check for SCORM API availability
    function checkScormAPI() {
        // Check for SCORM 2004 API
        if (typeof API_1484_11 !== 'undefined') {
            return { version: '2004', available: true, api: API_1484_11 };
        }
        
        // Check for SCORM 1.2 API
        if (typeof API !== 'undefined') {
            return { version: '1.2', available: true, api: API };
        }
        
        // Check in parent frames
        let currentWindow = window;
        for (let i = 0; i < 10; i++) {
            try {
                if (currentWindow.parent && currentWindow.parent !== currentWindow) {
                    currentWindow = currentWindow.parent;
                    if (typeof currentWindow.API_1484_11 !== 'undefined') {
                        return { version: '2004', available: true, api: currentWindow.API_1484_11 };
                    }
                    if (typeof currentWindow.API !== 'undefined') {
                        return { version: '1.2', available: true, api: currentWindow.API };
                    }
                } else {
                    break;
                }
            } catch (e) {
                break;
            }
        }
        
        return { version: null, available: false, api: null };
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'checkScormAPI') {
            const result = checkScormAPI();
            sendResponse(result);
        } else if (request.action === 'injectScormCompletion') {
            const result = injectScormCompletion();
            sendResponse(result);
        }
    });

    // Function to inject SCORM completion values
    function injectScormCompletion() {
        try {
            const scormCheck = checkScormAPI();
            
            if (!scormCheck.available) {
                return { success: false, error: 'SCORM API not found' };
            }

            const api = scormCheck.api;

            // For SCORM 2004 (API_1484_11)
            if (scormCheck.version === '2004') {
                api.SetValue("cmi.score.raw", "100");
                api.SetValue("cmi.score.scaled", "1.0");
                api.SetValue("cmi.success_status", "passed");
                api.SetValue("cmi.completion_status", "completed");
                api.Commit("");
                
                showNotification('✅ SCORM 2004 completion injected successfully!', 'success');
                return { success: true, version: '2004' };
            }
            // For SCORM 1.2 (API)
            else if (scormCheck.version === '1.2') {
                api.LMSSetValue("cmi.core.score.raw", "100");
                api.LMSSetValue("cmi.core.lesson_status", "completed");
                api.LMSCommit("");
                
                showNotification('✅ SCORM 1.2 completion injected successfully!', 'success');
                return { success: true, version: '1.2' };
            }

            return { success: false, error: 'Invalid SCORM API version' };
        } catch (error) {
            showNotification(`❌ Error: ${error.message}`, 'error');
            return { success: false, error: error.message };
        }
    }

    // Function to show notification on the page
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.scorm-helper-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'scorm-helper-notification';
        
        const isSuccess = type === 'success';
        const bgColor = isSuccess ? 
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)';
        const textColor = isSuccess ? 'white' : '#d63384';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: ${textColor};
            padding: 16px 24px;
            border-radius: 12px;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 2147483647;
            animation: scormSlideIn 0.3s ease-out;
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = message;
        
        // Add animation styles if not already present
        if (!document.querySelector('#scorm-helper-styles')) {
            const style = document.createElement('style');
            style.id = 'scorm-helper-styles';
            style.textContent = `
                @keyframes scormSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes scormSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'scormSlideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Optional: Add a visual indicator when SCORM API is detected
    function addScormIndicator() {
        const scormCheck = checkScormAPI();
        
        if (scormCheck.available) {
            const indicator = document.createElement('div');
            indicator.id = 'scorm-api-indicator';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 12px;
                height: 12px;
                background: #4caf50;
                border-radius: 50%;
                z-index: 2147483647;
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
                animation: scormPulse 2s infinite;
            `;
            
            // Add pulse animation
            if (!document.querySelector('#scorm-indicator-styles')) {
                const style = document.createElement('style');
                style.id = 'scorm-indicator-styles';
                style.textContent = `
                    @keyframes scormPulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(indicator);
            
            // Remove indicator after 5 seconds
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 5000);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addScormIndicator);
    } else {
        addScormIndicator();
    }

})();