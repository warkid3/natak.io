// natak.io Media Saver - Pinterest Content Script

(function () {
    'use strict';

    const SOURCE = 'pinterest';
    const PROCESSED_ATTR = 'data-natak-processed';

    // Selectors for Pinterest media
    // Selectors for Pinterest media
    const SELECTORS = {
        // Broad media selectors
        image: 'img[src*="pinimg.com"]',
        video: 'video',

        // Exclusions
        exclude: '.Header, .Navbar, [role="banner"], [alt*="profile"], [alt*="Profile"]'
    };

    // Extract best quality image URL from Pinterest
    function getBestImageUrl(img) {
        let url = img.src;

        // Pinterest uses different sizes in URL: /236x/, /474x/, /564x/, /736x/, /originals/
        // Try to get the largest version
        if (url.includes('/236x/')) {
            url = url.replace('/236x/', '/originals/');
        } else if (url.includes('/474x/')) {
            url = url.replace('/474x/', '/originals/');
        } else if (url.includes('/564x/')) {
            url = url.replace('/564x/', '/originals/');
        } else if (url.includes('/736x/')) {
            url = url.replace('/736x/', '/originals/');
        }

        // Also try srcset
        if (img.srcset) {
            const sources = img.srcset.split(',').map(s => {
                const parts = s.trim().split(' ');
                return { url: parts[0], size: parseInt(parts[1]) || 0 };
            });
            sources.sort((a, b) => b.size - a.size);
            if (sources.length > 0 && sources[0].size > 0) {
                return sources[0].url;
            }
        }

        return url;
    }

    // Extract video URL
    function getVideoUrl(video) {
        return video.src || video.querySelector('source')?.src;
    }

    // Find pin container
    function findPinContainer(mediaElement) {
        // Try known Pinterest containers first
        const specificContainer = mediaElement.closest('div[data-test-id="pin"], div[data-test-id="pinWrapper"], div[data-grid-item="true"]');
        if (specificContainer) return specificContainer;

        // Heuristic fallback
        const mediaRect = mediaElement.getBoundingClientRect();
        if (mediaRect.width < 100 || mediaRect.height < 100) return null;

        let current = mediaElement.parentElement;
        while (current && current !== document.body) {
            const rect = current.getBoundingClientRect();

            // Check if dimensions match closely
            const widthMatch = Math.abs(rect.width - mediaRect.width) < 30;
            const heightMatch = Math.abs(rect.height - mediaRect.height) < 30;

            if (widthMatch && heightMatch) {
                // Pinterest often has a "mask" or overlay div
                return current;
            }

            if (rect.width > mediaRect.width * 2) break;
            current = current.parentElement;
        }

        return mediaElement.parentElement;
    }

    // Add save button to media element
    function addSaveButton(mediaElement, isVideo = false) {
        if (mediaElement.hasAttribute(PROCESSED_ATTR)) return;
        if (!mediaElement.src || mediaElement.src.includes('data:')) return; // Skip placeholder images

        mediaElement.setAttribute(PROCESSED_ATTR, 'true');

        const container = findPinContainer(mediaElement);
        if (!container) return;

        // Ensure container is positioned
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') {
            container.style.position = 'relative';
        }

        // Create save button
        const btn = createSaveButton();
        container.appendChild(btn);

        // Show/hide on hover
        container.addEventListener('mouseenter', () => {
            btn.classList.add('visible');
        });

        container.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('saved')) {
                btn.classList.remove('visible');
            }
        });

        // Handle click
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const mediaUrl = isVideo ? getVideoUrl(mediaElement) : getBestImageUrl(mediaElement);
            if (mediaUrl && !mediaUrl.includes('data:')) {
                handleSaveClick(btn, mediaUrl, isVideo ? 'video' : 'image', SOURCE);
            } else {
                showToast('Could not find media URL', 'error');
            }
        });
    }

    // Process all media on page
    function processMedia() {
        // Process images
        document.querySelectorAll(SELECTORS.image).forEach(img => {
            if (img.width < 100 || img.height < 100) return;
            if (img.closest(SELECTORS.exclude)) return;

            addSaveButton(img, false);
        });

        // Process videos
        document.querySelectorAll(SELECTORS.video).forEach(video => {
            if (video.closest(SELECTORS.exclude)) return;
            addSaveButton(video, true);
        });
    }

    // Debounced processor
    const debouncedProcess = debounce(processMedia, 500);

    // Observe DOM changes for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }

        if (shouldProcess) {
            debouncedProcess();
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial processing
    processMedia();

    // Also process on scroll (for lazy loading)
    window.addEventListener('scroll', debouncedProcess, { passive: true });

    console.log('natak.io Media Saver - Pinterest content script loaded');
})();
