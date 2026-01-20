// natak.io Media Saver - Common Utilities

// Icons as SVG strings
const ICONS = {
    save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};

// Create save button element
function createSaveButton() {
    const btn = document.createElement('button');
    btn.className = 'natak-save-btn';
    btn.innerHTML = `${ICONS.save}<span>Save</span>`;
    return btn;
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.natak-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `natak-toast ${type}`;

    const icon = type === 'success' ? ICONS.check : ICONS.error;
    toast.innerHTML = `
        <div class="natak-toast-icon ${type}">${icon}</div>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Send save request to background script
async function saveMedia(url, type, source) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { action: 'saveMedia', data: { url, type, source } },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                if (response.success) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error));
                }
            }
        );
    });
}

// Handle save button click
async function handleSaveClick(btn, mediaUrl, mediaType, source) {
    if (btn.classList.contains('saving') || btn.classList.contains('saved')) return;

    btn.classList.add('saving');
    btn.innerHTML = `<div class="natak-spinner"></div><span>Saving...</span>`;

    try {
        await saveMedia(mediaUrl, mediaType, source);
        btn.classList.remove('saving');
        btn.classList.add('saved');
        btn.innerHTML = `${ICONS.check}<span>Saved!</span>`;
        showToast('Saved to natak.io Asset DAM!', 'success');
    } catch (error) {
        btn.classList.remove('saving');
        btn.innerHTML = `${ICONS.save}<span>Save</span>`;
        showToast(error.message || 'Failed to save', 'error');
    }
}

// Debounce utility
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Check if element is visible
function isElementVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}

console.log('natak.io Media Saver - Common utilities loaded');
