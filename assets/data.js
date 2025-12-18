// assets/data.js
// Data loading and utility functions for WCAG 2.2 Card Deck

export async function loadJSON(url) {
    try {
        // More detailed logging of the fetch attempt
        console.log(`Attempting to fetch: ${url}`);
        
        const res = await fetch(url);
        console.log(`Fetch response for ${url}:`, res.status, res.statusText);
        
        if (!res.ok) {
            console.error(`Error loading ${url}: ${res.status} ${res.statusText}`);
            return {};
        }
        
        try {
            const data = await res.json();
            console.log(`Successfully parsed JSON from ${url}`);
            return data;
        } catch (parseError) {
            console.error(`Failed to parse JSON from ${url}:`, parseError);
            return {};
        }
    } catch (fetchError) {
        console.error(`Fetch failed for ${url}:`, fetchError);
        return {};
    }
}
