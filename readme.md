# Arbron's Context Menu Library

This library is designed to facilitate the modification of context menus throughout Foundry VTT. Currently it supports context menus on Compendium entries.


### Hooks
- `Hooks.on('_getCompendiumEntryContext', (compendium, html, menuOptions) => {});`: This hook is called whenever a Compendium list is rendered. By modifying the contents of `entryOptions`, you can add, remove, or modify the contents of the context menu for each entry in the Compendium.
