import { log } from './shared/messages.mjs';
import { Monkey } from './shared/Monkey.mjs';


Hooks.on('init', function() {
  patchCompendiumContextMenu();
  patchModuleManagementContextMenu();
});


/* ----------------------------- */
/*             Patches           */
/* ----------------------------- */

/**
 * Rename Compendium._contextMenu to Compendium._getCompendiumContextOptions and alter
 * it to return an array of options instead of creating the menu, add replacement method
 * Compendium._ctContextMenu to call hook before generating menu, and alter
 * Compendium.activateListeners to call this custom method.
 */
function patchCompendiumContextMenu() {
  log('Patching Compendium._contextMenu');

  // Core has its own hook in v10
  if ( game.release?.generation >= 10 ) {
    Hooks.on("getCompendiumEntryContext", function(html, entryOptions) {
      if ( Hooks.events._getCompendiumEntryContext?.length ) {
        foundry.utils.logCompatibilityWarning(
          "Foundry has added a core hook for configuring the Compendium context: getCompendiumEntryContext. "
          + "That hook should be used rather than _getCompendiumEntryContext from Arbron’s Context Menu Library.",
          { since: "0.3", until: "0.4", stack: false }
        );
        const compendiumSheet = game.packs.get(html[0].dataset.pack)?.apps[0];
        Hooks.call('_getCompendiumEntryContext', compendiumSheet, html, entryOptions);
      }
    });
    return;
  }

  // V9 adds Compendium._getEntryContextOptions, so only replace _contextMenu to call the hook
  if ( game.release?.generation === 9 ) {
    return Monkey.replace("Compendium.prototype._contextMenu", function(html) {
      const entryOptions = this._getEntryContextOptions();
      Hooks.call('_getCompendiumEntryContext', this, html, entryOptions);
      if ( entryOptions ) ContextMenu.create(this, html, ".directory-item", entryOptions);
    });
  }

  const is080 = !isNewerVersion("0.8.0", game.version ?? game.data.version);

  let patched = Monkey.patchFunction(Compendium.prototype._contextMenu, [
    { line: 1,
      original:  'new ContextMenu(html, ".directory-item", [',
      replacement: 'return [' },
    { line: is080 ? 26 : 25,
      original: ']);',
      replacement: '];' }
  ]);
  if ( !patched ) return;
  Compendium.prototype._getCompendiumContextOptions = patched;

  let PatchedClass = Monkey.patchMethod(Compendium, 'activateListeners', [
    { line: is080 ? 9 : 12,
      original: 'this._contextMenu(html);',
      replacement: 'this._ctContextMenu(html);'
    }
  ]);
  if (!PatchedClass) return;
  Compendium.prototype.activateListeners = PatchedClass.prototype.activateListeners;

  Compendium.prototype._ctContextMenu = function(html) {
    const entryOptions = this._getCompendiumContextOptions();
    Hooks.call('_getCompendiumEntryContext', this, html, entryOptions);
    if (entryOptions) new ContextMenu(html, '.directory-item', entryOptions);
  };
}

/**
 * Monkey patch ModuleManagement.activateListeners to add the option of displaying
 * a context menu for each module listing.
 */
function patchModuleManagementContextMenu() {
  log('Patching ModuleManagement.activateListners');

  Monkey.wrap("ModuleManagement.prototype.activateListeners", function(wrapped, html) {
    wrapped(html);
    this._contextMenu(html);
  });

  ModuleManagement.prototype._contextMenu = function(html) {
    const entryOptions = [];
    Hooks.call('_getModuleManagementEntryContext', html, entryOptions);
    if (entryOptions) new ContextMenu(html, '.package', entryOptions);
  }
}
