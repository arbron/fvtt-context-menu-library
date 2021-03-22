# Arbron's Context Menu Library

This library is designed to help module developers expand context menus in parts of Foundry VTT that do not currently support modifying those menus.

![Release Version](https://img.shields.io/github/v/release/arbron/fvtt-context-menu-library)
![Foundry Version](https://img.shields.io/badge/dynamic/json.svg?url=https://github.com/arbron/fvtt-context-menu-library/releases/latest/download/module.json&label=foundry%20version&query=$.compatibleCoreVersion&colorB=blueviolet)
![Downloads](https://img.shields.io/github/downloads/arbron/fvtt-context-menu-library/total)
[![Forge Install Base](https://img.shields.io/badge/dynamic/json?label=forge%20install%20base&query=package.installs&suffix=%&url=https://forge-vtt.com/api/bazaar/package/arbron-context-menus&colorB=brightgreen)](https://forge-vtt.com/bazaar#package=arbron-context-menus)
![GitHub issues](https://img.shields.io/github/issues/arbron/fvtt-context-menu-library?colorB=red)


### Hooks
- `Hooks.on('_getCompendiumEntryContext', (compendium, html, entryOptions) => {});`: This hook is called whenever a Compendium list is rendered. By modifying the contents of `entryOptions`, you can add, remove, or modify the contents of the context menu for each entry in the Compendium.
- `Hooks.on('_getModuleManagementEntryContext', (html, entryOptiosn) => {});`: This hook is called whenever the Module Management application is rendered. By default no context menu is displayed here, but by adding to `entryOptions` you can introduce your own menu items.


### Example Usage
The following code adds a new entry to the Compendium context menu. It finds the *Import Entry* option and inserts this new option after it (or at the beginning of the array if *Import Entry* isn't found for any reason).

```javascript
Hooks.on('_getCompendiumEntryContext', (compendium, html, entryOptions) => {
  let insertIndex = entryOptions.findIndex(element => element.name == 'COMPENDIUM.ImportEntry');
  entryOptions.splice(insertIndex + 1, 0, {
    name: 'CompendiumTools.replace.title',
    icon: '<i class="fas fa-sign-in-alt"></i>',
    callback: li => { }
  });
});
```


[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I2I53RGZS)
