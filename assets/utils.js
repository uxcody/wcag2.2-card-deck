// assets/utils.js
// Utility functions for localization and formatting

/**
 * Localizes an ID (principle, guideline, or success criteria number) based on the provided mapping
 * @param {string|number} id - The ID to localize (e.g., "1", "1.4", "1.4.10")
 * @param {Object} localizedIds - Mapping object with keys like "1.4.10": "۱۰-۴-۱"
 * @returns {string} The localized ID string, or the original if no mapping exists (Latin fallback)
 */
export function localizeNumber(id, localizedIds) {
    if (!localizedIds || Object.keys(localizedIds).length === 0) {
        return String(id);
    }
    
    // Direct lookup - if mapping exists, use it; otherwise return original (Latin fallback)
    return localizedIds[String(id)] || String(id);
}

/**
 * Scrolls to a target element or position within the scrollable container
 * @param {Element|'top'} target - Element to scroll to, or 'top' to scroll to top
 * @param {Object} options - Scroll options
 * @param {boolean} options.highlight - Whether to highlight the target element (default: false)
 * @param {number} options.highlightDuration - Duration of highlight in ms (default: 2000)
 */
export function scrollToTarget(target, options = {}) {
    const { highlight = false, highlightDuration = 2000 } = options;
    const container = document.querySelector('.results-area');
    
    if (!container) return;
    
    // Scroll to top
    if (target === 'top') {
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    // Scroll to element
    if (target instanceof Element) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect if requested
        if (highlight) {
            target.classList.add('card--highlighted');
            setTimeout(() => {
                target.classList.remove('card--highlighted');
            }, highlightDuration);
        }
    }
}

/**
 * Dynamically loads a stylesheet if not already loaded
 * @param {string} href - The path to the stylesheet
 * @param {string} id - Unique identifier for the stylesheet link element
 */
function loadStylesheet(href, id) {
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

/**
 * Removes a dynamically loaded stylesheet
 * @param {string} id - The id of the stylesheet link element to remove
 */
function removeStylesheet(id) {
    const link = document.getElementById(id);
    if (link) {
        link.remove();
    }
}

/**
 * Applies RTL direction and font family to the document based on language settings from localization
 * Dynamically loads required stylesheets only when needed
 * @param {Object|null} localization - The localization object that contains direction and fontFamily settings
 */
export function applyLanguageStyles(localization) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // If no localization data, default to LTR with no custom font
    if (!localization) {
        htmlElement.setAttribute('dir', 'ltr');
        bodyElement.classList.remove('rtl');
        htmlElement.removeAttribute('data-font');
        removeStylesheet('rtl-styles');
        removeStylesheet('language-font');
        return;
    }
    
    // Apply RTL direction if specified
    if (localization.direction === 'rtl') {
        htmlElement.setAttribute('dir', 'rtl');
        bodyElement.classList.add('rtl');
        // Load RTL stylesheet only when needed
        loadStylesheet('assets/css/rtl.css', 'rtl-styles');
    } else {
        htmlElement.setAttribute('dir', 'ltr');
        bodyElement.classList.remove('rtl');
        removeStylesheet('rtl-styles');
    }
    
    // Apply language-specific font via data attribute
    if (localization.fontStylesheet) {
        // Set data attribute for CSS to hook into
        htmlElement.setAttribute('data-font', localization.fontStylesheet);
        
        // Load language-specific font stylesheet
        // Construct path: localization.json just contains font name (e.g., "vazirmatn")
        // Adjust this path if your project structure differs
        const stylesheetPath = `assets/css/fonts/${localization.fontStylesheet}.css`;
        loadStylesheet(stylesheetPath, 'language-font');
    } else {
        htmlElement.removeAttribute('data-font');
        removeStylesheet('language-font');
    }
}
