# WCAG 2.2 Card Deck - Localization Configuration

## language-config.json

This file contains configuration options for the WCAG 2.2 Card Deck application:

### Configuration Options

- `ignore`: Array of language codes to exclude from the language selector
  - Example: `["nl", "sk"]` will hide Dutch and Slovak from the language dropdown

- `devMode`: Boolean that controls the visibility of a data loading test panel
  - `true`: Shows a data loading test panel at the top of the page
  - `false`: (Default) Hides the data loading test panel

## Developer Mode

The dev mode feature adds a test panel that shows information about loaded data, which is useful for debugging data loading issues.

### How to Enable/Disable Dev Mode

#### Method 1: Edit the Configuration File
```json
{
  "ignore": ["nl", "sk"],
  "devMode": true  // Set to true to enable, false to disable
}
```

#### Method 2: Keyboard Shortcut
You can toggle dev mode at runtime using **Ctrl+Shift+D** without needing to edit any files.

## Localization Folder Structure

- `data-relations.json`: Common relationships between criteria (shared across all languages)
- `language-config.json`: Application configuration
- `{language-code}/`: Language-specific files
  - `translations.json`: UI text translations
  - `success-criteria.json`: WCAG success criteria in the specified language
  - `principles_guidelines.json`: WCAG principles and guidelines in the specified language
  - `qr/`: Directory containing QR code SVG files
