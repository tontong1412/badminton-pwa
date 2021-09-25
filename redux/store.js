// store.js

import { createStore } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

const initialState = {
  user: {},
  tick: 'init',
  gang: null,
  activeMenu: 'home'
}

// create your reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    case 'TICK':
      return { ...state, tick: action.payload }
    case 'LOGIN':
      return { ...state, user: { ...action.payload } }
    case 'LOGOUT':
      return { ...state, user: {} }
    case 'GANG':
      return { ...state, gang: { ...action.payload } }
    case 'ACTIVE_MENU':
      return { ...state, activeMenu: action.payload }
    default:
      return state;
  }
};

// create a makeStore function
const makeStore = context => createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true });