// assets/main.js
// Main entry point for WCAG 2.2 Card Deck

import { loadJSON } from './data.js';
import { renderCards, formatDescription } from './render.js';
import { setupFilters } from './filters.js';

// Global config variable
let appConfig = {
    languages: {
        hiddenLanguages: [],
        defaultLanguage: "en"
    },
    developer: {
        devMode: false,
        verboseLogging: false
    },
    ui: {
        cardsPerPage: 0,
        enableAnimation: true,
        colorScheme: "auto",
        highContrastMode: false
    },
    features: {
        enableQrCodes: true,
        enableFilters: true,
        enableSearch: true
    },
    cache: {
        enabled: true,
        duration: 86400
    }
};

async function loadAppConfig() {
    try {
        const config = await loadJSON('config/app-config.json');
        appConfig = { 
            ...appConfig,
            ...config
        };
        
        if (appConfig.developer?.verboseLogging) {
            console.log('App config loaded:', appConfig);
        }
        
        return config;
    } catch (error) {
        console.warn('Failed to load app config:', error);
        return appConfig;
    }
}

async function loadAndRender() {
    try {
        console.log('Starting data loading...');
        const lang = document.getElementById('language').value;
        console.log(`Selected language: ${lang}`);
        document.documentElement.setAttribute('lang', lang);
        
        console.log('Loading JSON files...');
        const [relations, translations, criteria, principles] = await Promise.all([
            loadJSON('localization/data-relations.json'),
            loadJSON(`localization/${lang}/translations.json`),
            loadJSON(`localization/${lang}/success-criteria.json`),
            loadJSON(`localization/${lang}/principles_guidelines.json`)
        ]);
        
        console.log('Data loaded:', {
            relationsEntries: Object.keys(relations).length,
            translationsEntries: Object.keys(translations).length,
            criteriaEntries: Object.keys(criteria).length,
            principlesEntries: Object.keys(principles).length
        });
        
        // Only show the test panel if devMode is enabled
        if (appConfig.developer?.devMode) {
            const testEl = document.createElement('div');
            testEl.id = 'data-loading-test';
            testEl.style.padding = '20px';
            testEl.style.margin = '20px';
            testEl.style.border = '2px solid red';
            testEl.style.background = '#fff';
            testEl.style.borderRadius = '5px';
            testEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin-top: 0;">Data Loading Test Panel (Dev Mode)</h3>
                    <button id="close-test-panel" style="padding: 5px 10px;">×</button>
                </div>
                <div style="display: flex; gap: 20px;">
                    <div>
                        <h4>Data Loading</h4>
                        <p>Relations: ${Object.keys(relations).length} entries</p>
                        <p>Translations: ${Object.keys(translations).length} entries</p>
                        <p>Criteria: ${Object.keys(criteria).length} entries</p>
                        <p>Principles: ${Object.keys(principles).length} entries</p>
                    </div>
                    <div>
                        <h4>Active Configuration</h4>
                        <p>Language: ${lang} (Default: ${appConfig.languages?.defaultLanguage || 'en'})</p>
                        <p>Hidden Languages: ${(appConfig.languages?.hiddenLanguages || []).join(', ') || 'None'}</p>
                        <p>UI Settings: ${appConfig.ui?.colorScheme || 'auto'} mode, Animations: ${appConfig.ui?.enableAnimation ? 'On' : 'Off'}</p>
                    </div>
                </div>
                <p><small>To disable this panel, set "developer.devMode": false in config/app-config.json or press Ctrl+Shift+D</small></p>
            `;
            document.body.insertBefore(testEl, document.getElementById('main-content'));
            
            // Add event listener to close button
            document.getElementById('close-test-panel').addEventListener('click', () => {
                document.getElementById('data-loading-test').style.display = 'none';
            });
        }
        
        setupFilters({ relations, translations, criteria, principles, renderCards });
    } catch (error) {
        console.error('Error in loadAndRender:', error);
        document.getElementById('cards-overview').innerHTML = 
            `<div class="no-results-message">
                <h3>Error loading JSON data</h3>
                <p>Details: ${error.message || 'Unknown error'}</p>
                <p><strong>Solution:</strong> This is most likely due to CORS restrictions when loading files directly from the filesystem.</p>
                <p>Please use one of the following methods to run the application:</p>
                <ol>
                    <li><strong>Python server:</strong> Run <code>python server.py</code> in the terminal</li>
                    <li><strong>Node.js server:</strong> Run <code>node server.js</code> in the terminal</li>
                    <li><strong>VS Code:</strong> Use the Live Server extension</li>
                </ol>
                <p>Then access the application at <a href="http://localhost:8000">http://localhost:8000</a></p>
            </div>`;
    }
}


async function getAvailableLanguages() {
    // Simulate folder list (since JS can't read folders directly in browser)
    const allLangs = ['de', 'en', 'es', 'fr', 'id', 'it', 'nl', 'sk'];
    
    // Use the hiddenLanguages setting from the config
    const hiddenLanguages = appConfig.languages?.hiddenLanguages || [];
    
    return allLangs.filter(lang => !hiddenLanguages.includes(lang));
}

async function populateLanguageSelect() {
    const select = document.getElementById('language');
    select.innerHTML = '';
    const langs = await getAvailableLanguages();
    const labels = {
        de: 'Deutsch',
        en: 'English',
        es: 'Español',
        fr: 'Français',
        id: 'Bahasa Indonesia',
        it: 'Italiano',
        nl: 'Nederlands',
        sk: 'Slovenský'
    };
    langs.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = labels[lang] || lang;
        select.appendChild(option);
    });
}

// Debug mode toggle function
function toggleDevMode() {
    // Ensure the developer object exists
    if (!appConfig.developer) {
        appConfig.developer = {};
    }
    
    // Toggle the devMode flag
    appConfig.developer.devMode = !appConfig.developer.devMode;
    
    console.log(`Dev mode ${appConfig.developer.devMode ? 'enabled' : 'disabled'}`);
    
    // Remove existing test panel if it exists
    const existingPanel = document.getElementById('data-loading-test');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Reload the application
    loadAndRender();
}

window.addEventListener('DOMContentLoaded', async () => {
    // Load app configuration first
    await loadAppConfig();
    
    // Add keyboard shortcut for toggling dev mode (Ctrl+Shift+D)
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            toggleDevMode();
        }
    });
    
    await populateLanguageSelect();
    document.getElementById('language').addEventListener('change', loadAndRender);
    loadAndRender();
});
