// natak.io Media Saver - Instagram Content Script

(function () {
    'use strict';

    const SOURCE = 'instagram';
    const PROCESSED_ATTR = 'data-natak-processed';

    // Selectors for Instagram media
    // Selectors for Instagram media
    const SELECTORS = {
        // Broad media selectors with specific Instagram targets
        image: 'img[src*="cdninstagram"], img[src*="fbcdn"], ._aagv img, ._aagu img, article img',
        video: 'video[src*="cdninstagram"], video[src*="fbcdn"], video[poster*="cdninstagram"], article video',

        // Exclusions
        exclude: '.profile-photo, .circle, [alt*="profile"], [alt*="Profile"], header img, nav img'
    };

    // Extract best quality image URL
    function getBestImageUrl(img) {
        // Try srcset first for best quality
        if (img.srcset) {
            const sources = img.srcset.split(',').map(s => {
                const [url, size] = s.trim().split(' ');
                return { url, size: parseInt(size) || 0 };
            });
            sources.sort((a, b) => b.size - a.size);
            if (sources.length > 0) {
                return sources[0].url;
            }
        }
        return img.src;
    }

    // Extract video URL
    function getVideoUrl(video) {
        return video.src || video.querySelector('source')?.src;
    }

    // Find the best container for the button (overlay)
    function findMediaContainer(mediaElement) {
        // If it's already in a known container structure
        const specificContainer = mediaElement.closest('div._aagv, div._aagu');
        if (specificContainer) return specificContainer;

        // Heuristic: Find the first parent that has roughly the same dimensions as the media
        // and is positioned (or can be). This is usually the wrapper.
        const mediaRect = mediaElement.getBoundingClientRect();
        if (mediaRect.width < 150 || mediaRect.height < 150) return null; // Too small (avatar/icon)

        let current = mediaElement.parentElement;
        while (current && current !== document.body) {
            const rect = current.getBoundingClientRect();

            // Check if dimensions match closely (within 10px)
            const widthMatch = Math.abs(rect.width - mediaRect.width) < 20;
            const heightMatch = Math.abs(rect.height - mediaRect.height) < 20;

            if (widthMatch && heightMatch) {
                return current;
            }

            // Don't go too far up
            if (rect.width > mediaRect.width * 1.5) break;
            current = current.parentElement;
        }

        return mediaElement.parentElement;
    }

    // Add save button to media element
    function addSaveButton(mediaElement, isVideo = false) {
        if (mediaElement.hasAttribute(PROCESSED_ATTR)) return;

        const container = findMediaContainer(mediaElement);
        if (!container) {
            // console.warn('natak.io: Could not find container for', mediaElement);
            return;
        }

        // console.log('natak.io: Found container:', container);
        mediaElement.setAttribute(PROCESSED_ATTR, 'true');

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
            if (mediaUrl) {
                handleSaveClick(btn, mediaUrl, isVideo ? 'video' : 'image', SOURCE);
            } else {
                showToast('Could not find media URL', 'error');
            }
        });
    }

    // Process all media on page
    function processMedia() {
        // console.log('natak.io: Processing media...'); 
        const images = document.querySelectorAll(SELECTORS.image);
        // console.log(`natak.io: Found ${images.length} images matching selectors`);

        // Process images
        images.forEach(img => {
            if (img.closest(SELECTORS.exclude)) return;
            if (img.width < 100 || img.height < 100) return; // Skip small icons

            // console.log('natak.io: Attempting to add button to image', img);
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

    console.log('natak.io Media Saver - Instagram content script loaded');
})();
