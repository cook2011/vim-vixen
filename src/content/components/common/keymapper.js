import * as inputActions from 'content/actions/input';
import * as operationActions from 'content/actions/operation';
import operations from 'shared/operations';

export default class KeymapperComponent {
  constructor(store) {
    this.store = store;
  }

  key(key) {
    this.store.dispatch(inputActions.keyPress(key));

    let state = this.store.getState();
    let input = state.input;
    let keymaps = state.setting.keymaps;

    let matched = Object.keys(keymaps).filter((keyStr) => {
      return keyStr.startsWith(input.keys);
    });
    if (!state.addon.enabled) {
      // available keymaps are only ADDON_ENABLE and ADDON_TOGGLE_ENABLED if
      // the addon disabled
      matched = matched.filter((keys) => {
        let type = keymaps[keys].type;
        return type === operations.ADDON_ENABLE ||
          type === operations.ADDON_TOGGLE_ENABLED;
      });
    }
    if (matched.length === 0) {
      this.store.dispatch(inputActions.clearKeys());
      return false;
    } else if (matched.length > 1 ||
      matched.length === 1 && input.keys !== matched[0]) {
      return true;
    }
    let operation = keymaps[matched];
    this.store.dispatch(operationActions.exec(operation));
    this.store.dispatch(inputActions.clearKeys());
    return true;
  }
}
