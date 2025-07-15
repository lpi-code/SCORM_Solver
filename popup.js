document.addEventListener('DOMContentLoaded', async () => {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const completeButton = document.getElementById('completeButton');

  // Check if we have an active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      updateStatus('unavailable', 'No active tab found');
      return;
    }

    // Check SCORM API availability
    await checkScormAvailability(tab.id);
  } catch (error) {
    console.error('Error checking SCORM availability:', error);
    updateStatus('unavailable', 'Error checking SCORM API');
  }

  // Handle button click
  completeButton.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await injectScormCompletion(tab.id);
    } catch (error) {
      console.error('Error injecting SCORM completion:', error);
      showError('Failed to inject SCORM completion');
    }
  });
});

async function checkScormAvailability(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        // Check for SCORM API availability
        const checkAPI = () => {
          // Check for SCORM 2004 API
          if (typeof API_1484_11 !== 'undefined') {
            return { version: '2004', available: true };
          }
          
          // Check for SCORM 1.2 API
          if (typeof API !== 'undefined') {
            return { version: '1.2', available: true };
          }
          
          // Check in parent frames
          let currentWindow = window;
          for (let i = 0; i < 10; i++) {
            try {
              if (currentWindow.parent && currentWindow.parent !== currentWindow) {
                currentWindow = currentWindow.parent;
                if (typeof currentWindow.API_1484_11 !== 'undefined') {
                  return { version: '2004', available: true };
                }
                if (typeof currentWindow.API !== 'undefined') {
                  return { version: '1.2', available: true };
                }
              } else {
                break;
              }
            } catch (e) {
              break;
            }
          }
          
          return { version: null, available: false };
        };

        return checkAPI();
      }
    });

    const result = results[0].result;
    
    if (result.available) {
      updateStatus('available', `SCORM ${result.version} API detected`);
      document.getElementById('completeButton').disabled = false;
    } else {
      updateStatus('unavailable', 'SCORM API not found');
    }
  } catch (error) {
    console.error('Error checking SCORM API:', error);
    updateStatus('unavailable', 'Error checking SCORM API');
  }
}

async function injectScormCompletion(tabId) {
  const button = document.getElementById('completeButton');
  const originalText = button.querySelector('.button-text').textContent;
  
  // Update button state
  button.disabled = true;
  button.querySelector('.button-text').textContent = 'Injecting...';
  button.querySelector('.button-icon').textContent = '⏳';

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        const injectScorm = () => {
          let api = null;
          
          // Find SCORM API
          if (typeof API_1484_11 !== 'undefined') {
            api = API_1484_11;
          } else if (typeof API !== 'undefined') {
            api = API;
          } else {
            // Check parent frames
            let currentWindow = window;
            for (let i = 0; i < 10; i++) {
              try {
                if (currentWindow.parent && currentWindow.parent !== currentWindow) {
                  currentWindow = currentWindow.parent;
                  if (typeof currentWindow.API_1484_11 !== 'undefined') {
                    api = currentWindow.API_1484_11;
                    break;
                  }
                  if (typeof currentWindow.API !== 'undefined') {
                    api = currentWindow.API;
                    break;
                  }
                } else {
                  break;
                }
              } catch (e) {
                break;
              }
            }
          }

          if (!api) {
            return { success: false, error: 'SCORM API not found' };
          }

          try {
            // For SCORM 2004 (API_1484_11)
            if (typeof api.SetValue === 'function') {
              api.SetValue("cmi.score.raw", "100");
              api.SetValue("cmi.score.scaled", "1.0");
              api.SetValue("cmi.success_status", "passed");
              api.SetValue("cmi.completion_status", "completed");
              api.Commit("");
              
              return { success: true, version: '2004' };
            }
            // For SCORM 1.2 (API)
            else if (typeof api.LMSSetValue === 'function') {
              api.LMSSetValue("cmi.core.score.raw", "100");
              api.LMSSetValue("cmi.core.lesson_status", "completed");
              api.LMSCommit("");
              
              return { success: true, version: '1.2' };
            } else {
              return { success: false, error: 'Invalid SCORM API' };
            }
          } catch (error) {
            return { success: false, error: error.message };
          }
        };

        return injectScorm();
      }
    });

    const result = results[0].result;
    
    if (result.success) {
      // Success state
      button.querySelector('.button-text').textContent = 'Completed!';
      button.querySelector('.button-icon').textContent = '✅';
      button.classList.add('success-animation');
      
      setTimeout(() => {
        button.querySelector('.button-text').textContent = originalText;
        button.querySelector('.button-icon').textContent = '✓';
        button.disabled = false;
        button.classList.remove('success-animation');
      }, 2000);
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error injecting SCORM completion:', error);
    showError('Failed to inject SCORM completion');
    
    // Reset button
    button.querySelector('.button-text').textContent = originalText;
    button.querySelector('.button-icon').textContent = '✓';
    button.disabled = false;
  }
}

function updateStatus(status, message) {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  
  // Remove all status classes
  statusIndicator.classList.remove('checking', 'available', 'unavailable');
  
  // Add new status class
  statusIndicator.classList.add(status);
  
  // Update content based on status
  if (status === 'available') {
    statusIndicator.innerHTML = '✓';
  } else if (status === 'unavailable') {
    statusIndicator.innerHTML = '✗';
  } else {
    statusIndicator.innerHTML = '<div class="spinner"></div>';
  }
  
  statusText.textContent = message;
}

function showError(message) {
  const button = document.getElementById('completeButton');
  button.classList.add('error-state');
  button.querySelector('.button-text').textContent = 'Error!';
  button.querySelector('.button-icon').textContent = '⚠️';
  
  setTimeout(() => {
    button.classList.remove('error-state');
    button.querySelector('.button-text').textContent = 'Mark as Completed';
    button.querySelector('.button-icon').textContent = '✓';
  }, 2000);
}