// natak.io Media Saver - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
    const authSection = document.getElementById('auth-section');
    const connectedSection = document.getElementById('connected-section');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const userEmailEl = document.getElementById('user-email');

    // Check current auth status
    async function checkAuth() {
        const { apiKey } = await chrome.storage.sync.get('apiKey');

        if (apiKey) {
            // Verify with server
            const response = await chrome.runtime.sendMessage({ action: 'checkAuth' });

            if (response.success && response.data.authenticated) {
                showConnected(response.data.user?.email || 'Connected');
                return;
            }
        }

        showDisconnected();
    }

    // Show connected state
    function showConnected(email) {
        authSection.classList.add('hidden');
        connectedSection.classList.remove('hidden');
        userEmailEl.textContent = email;
    }

    // Show disconnected state
    function showDisconnected() {
        authSection.classList.remove('hidden');
        connectedSection.classList.add('hidden');
        apiKeyInput.value = '';
    }

    // Save API key
    saveKeyBtn.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            alert('Please enter an API key');
            return;
        }

        // Save to storage
        await chrome.storage.sync.set({ apiKey });

        // Verify
        const response = await chrome.runtime.sendMessage({ action: 'checkAuth' });

        if (response.success && response.data.authenticated) {
            showConnected(response.data.user?.email || 'Connected');
        } else {
            await chrome.storage.sync.remove('apiKey');
            alert('Invalid API key. Please try again.');
        }
    });

    // Handle Enter key
    apiKeyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveKeyBtn.click();
        }
    });

    // Disconnect
    disconnectBtn.addEventListener('click', async () => {
        await chrome.storage.sync.remove('apiKey');
        showDisconnected();
    });

    // Initial check
    checkAuth();
});
