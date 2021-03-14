import { error, log } from './shared/messages.js';
import * as patches from './patches.js';

Hooks.on('init', function() {
  patches.patchCompendiumContextMenu();
});
