# Arbron's Context Menu Library

This library is designed to help module developers expand context menus in parts of Foundry VTT that do not currently support modifying those menus.


### Hooks
- `Hooks.on('_getCompendiumEntryContext', (compendium, html, entryOptions) => {});`: This hook is called whenever a Compendium list is rendered. By modifying the contents of `entryOptions`, you can add, remove, or modify the contents of the context menu for each entry in the Compendium.


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
  return entryOptions;
});
```


[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/I2I53RGZS)
