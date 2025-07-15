document.addEventListener('DOMContentLoaded', function() {
    const injectButton = document.getElementById('injectButton');
    const statusMessage = document.getElementById('status');
    const buttonText = document.querySelector('.button-text');
    const buttonIcon = document.querySelector('.button-icon');

    function showStatus(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.className = `status-message show ${type}`;
        
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 3000);
    }

    function setButtonLoading(loading) {
        if (loading) {
            injectButton.classList.add('loading');
            injectButton.disabled = true;
            buttonIcon.textContent = '⏳';
            buttonText.textContent = 'Injecting...';
        } else {
            injectButton.classList.remove('loading');
            injectButton.disabled = false;
            buttonIcon.textContent = '💉';
            buttonText.textContent = 'Inject SCORM Values';
        }
    }

    injectButton.addEventListener('click', async function() {
        try {
            setButtonLoading(true);
            
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('No active tab found');
            }

            // Check if we're on a supported protocol
            if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
                throw new Error('Extension only works on web pages (http/https)');
            }

            // For Manifest V3 (Chrome)
            if (chrome.scripting) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: injectScormCode
                });
            } else {
                // For Manifest V2 (Firefox)
                await chrome.tabs.executeScript(tab.id, {
                    code: `(${injectScormCode})()`
                });
            }

            showStatus('SCORM values injected successfully!', 'success');
            
        } catch (error) {
            console.error('Error injecting SCORM code:', error);
            showStatus(`Error: ${error.message}`, 'error');
        } finally {
            setButtonLoading(false);
        }
    });

    // The function that will be injected into the page
    function injectScormCode() {
        try {
            // Check if API_1484_11 exists
            if (typeof API_1484_11 === 'undefined') {
                // Try to find it in common locations
                const api = window.API_1484_11 || 
                           window.parent.API_1484_11 || 
                           window.top.API_1484_11 ||
                           (window.parent && window.parent.parent && window.parent.parent.API_1484_11);
                
                if (!api) {
                    throw new Error('SCORM API (API_1484_11) not found on this page');
                }
                
                window.API_1484_11 = api;
            }

            // Inject the SCORM values
            const results = [];
            
            results.push(API_1484_11.SetValue("cmi.score.raw", "100"));
            results.push(API_1484_11.SetValue("cmi.score.scaled", "1.0"));
            results.push(API_1484_11.SetValue("cmi.success_status", "passed"));
            results.push(API_1484_11.SetValue("cmi.completion_status", "completed"));
            results.push(API_1484_11.Commit(""));

            // Check if any calls failed
            const failedCalls = results.filter(result => result !== "true");
            if (failedCalls.length > 0) {
                const errorCode = API_1484_11.GetLastError();
                const errorString = API_1484_11.GetErrorString(errorCode);
                throw new Error(`SCORM API calls failed. Error: ${errorCode} - ${errorString}`);
            }

            // Add visual feedback to the page
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                font-family: 'Segoe UI', sans-serif;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(79, 172, 254, 0.4);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;
            
            notification.innerHTML = '✅ SCORM values injected successfully!';
            document.body.appendChild(notification);

            // Add animation styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);

            return true;
        } catch (error) {
            console.error('SCORM injection error:', error);
            
            // Show error notification
            const errorNotification = document.createElement('div');
            errorNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
                color: #d63384;
                padding: 16px 24px;
                border-radius: 12px;
                font-family: 'Segoe UI', sans-serif;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(255, 154, 158, 0.4);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;
            
            errorNotification.innerHTML = `❌ Error: ${error.message}`;
            document.body.appendChild(errorNotification);

            setTimeout(() => {
                errorNotification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (errorNotification.parentNode) {
                        errorNotification.parentNode.removeChild(errorNotification);
                    }
                }, 300);
            }, 5000);

            throw error;
        }
    }
});