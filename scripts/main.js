import { log } from './shared/messages.js';
import { Monkey } from './shared/Monkey.js';


Hooks.on('init', function() {
  patchCompendiumContextMenu();
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
  const is080 = !isNewerVersion("0.8.0", game.data.version);

  let patched = Monkey.patchFunction(Compendium.prototype._contextMenu, [
    { line: 1,
      original:  'new ContextMenu(html, ".directory-item", [',
      replacement: 'return [' },
    { line: is080 ? 26 : 25,
      original: ']);',
      replacement: '];' }
  ]);
  if (!patched) return;
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
