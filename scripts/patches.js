import { log, uiError } from './shared/messages.js';
import { Monkey } from './shared/Monkey.js';

/**
 * Monkey patch private Compendium._contextMenu method to call a hook before
 * the context menu is generated.
 */
export function patchCompendiumContextMenu() {
  log('Patching Compendium._contextMenu');

  let patched = Monkey.patchFunction(Compendium.prototype._contextMenu, [
    { line: 1,
      original:  'new ContextMenu(html, ".directory-item", [',
      replacement: 'return [' },
    { line: 25,
      original: ']);',
      replacement: '];' }
  ]);
  if (!patched) return;
  Compendium.prototype._getCompendiumContextOptions = patched;

  let PatchedClass = Monkey.patchMethod(Compendium, 'activateListeners', [
    { line: 12,
      original: 'this._contextMenu(html);',
      replacement: 'this._ctContextMenu(html);'
    }
  ]);
  if (!PatchedClass) return;
  Compendium.prototype.activateListeners = PatchedClass.prototype.activateListeners;

  Compendium.prototype._ctContextMenu = function(html) {
    const entryOptions = this._getCompendiumContextOptions();
    Hooks.call('getCompendiumEntryContext', this, html, entryOptions);
    if (entryOptions) new ContextMenu(html, '.directory-item', entryOptions);
  };
}
