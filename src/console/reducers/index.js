import actions from 'console/actions';

const defaultState = {
  mode: '',
  messageText: '',
  commandText: '',
  completions: [],
  groupSelection: -1,
  itemSelection: -1,
};

const nextSelection = (state) => {
  if (state.groupSelection < 0) {
    return [0, 0];
  }

  let group = state.completions[state.groupSelection];
  if (state.groupSelection + 1 >= state.completions.length &&
    state.itemSelection + 1 >= group.items.length) {
    return [-1, -1];
  }
  if (state.itemSelection + 1 >= group.items.length) {
    return [state.groupSelection + 1, 0];
  }
  return [state.groupSelection, state.itemSelection + 1];
};

const prevSelection = (state) => {
  if (state.groupSelection < 0) {
    return [
      state.completions.length - 1,
      state.completions[state.completions.length - 1].items.length - 1
    ];
  }
  if (state.groupSelection === 0 && state.itemSelection === 0) {
    return [-1, -1];
  } else if (state.itemSelection === 0) {
    return [
      state.groupSelection - 1,
      state.completions[state.groupSelection - 1].items.length - 1
    ];
  }
  return [state.groupSelection, state.itemSelection - 1];
};

export default function reducer(state = defaultState, action = {}) {
  switch (action.type) {
  case actions.CONSOLE_SHOW_COMMAND:
    return Object.assign({}, state, {
      mode: 'command',
      commandText: action.text,
      errorShown: false,
      completions: []
    });
  case actions.CONSOLE_SHOW_ERROR:
    return Object.assign({}, state, {
      mode: 'error',
      messageText: action.text,
    });
  case actions.CONSOLE_SHOW_INFO:
    return Object.assign({}, state, {
      mode: 'info',
      messageText: action.text,
    });
  case actions.CONSOLE_HIDE_COMMAND:
    return Object.assign({}, state, {
      mode: state.mode === 'command' ? '' : state.mode,
    });
  case actions.CONSOLE_SET_COMPLETIONS:
    return Object.assign({}, state, {
      completions: action.completions,
      groupSelection: -1,
      itemSelection: -1,
    });
  case actions.CONSOLE_COMPLETION_NEXT: {
    let next = nextSelection(state);
    return Object.assign({}, state, {
      groupSelection: next[0],
      itemSelection: next[1],
    });
  }
  case actions.CONSOLE_COMPLETION_PREV: {
    let next = prevSelection(state);
    return Object.assign({}, state, {
      groupSelection: next[0],
      itemSelection: next[1],
    });
  }
  default:
    return state;
  }
}
