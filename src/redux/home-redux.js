import { combineReducers } from 'redux';

const initState = {
  showTimezone: false
}

const TOGGLE_TIMEZONE = 'TOGGLE_TIMEZONE';
// ---------------- export default is reducer -------------
// reducers
function navReducer(state = initState, action) {
  switch(action.type) {
    case TOGGLE_TIMEZONE:
      return {
        showTimezone: action.toggle
      };
    default:
      return state;
  }
  return {};
}

function reducer2(state, action) {
  return {};
}

export default combineReducers(
  {
    navReducer,
    reducer2
  }
);

// ------------------ export others is action creators ---------------------

// action creators
const toggleTimezone = (toggle) => {
  return {
    type: TOGGLE_TIMEZONE,
    toggle
  }
}

export {
  toggleTimezone
};