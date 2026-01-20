// natak.io Media Saver - Background Service Worker

const API_BASE_URL = 'http://localhost:3000'; // Change to production URL later

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveMedia') {
        handleSaveMedia(request.data)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    }

    if (request.action === 'checkAuth') {
        checkAuthentication()
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Handle media save request
async function handleSaveMedia(data) {
    const { url, type, source } = data;

    // Get API key from storage
    const { apiKey } = await chrome.storage.sync.get('apiKey');

    if (!apiKey) {
        throw new Error('Not authenticated. Please set your API key in the extension popup.');
    }

    // Send to natak.io API
    const response = await fetch(`${API_BASE_URL}/api/extension/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
        },
        body: JSON.stringify({
            url,
            type, // 'image' or 'video'
            source // 'instagram' or 'pinterest'
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save media');
    }

    return await response.json();
}

// Check if user is authenticated
async function checkAuthentication() {
    const { apiKey } = await chrome.storage.sync.get('apiKey');

    if (!apiKey) {
        return { authenticated: false };
    }

    // Verify API key with server
    try {
        const response = await fetch(`${API_BASE_URL}/api/extension/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { authenticated: true, user: data.user };
        }
    } catch (e) {
        console.error('Auth check failed:', e);
    }

    return { authenticated: false };
}

// Set badge on extension icon
function updateBadge(text, color = '#CCFF00') {
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color });
}

console.log('natak.io Media Saver - Background script loaded');
