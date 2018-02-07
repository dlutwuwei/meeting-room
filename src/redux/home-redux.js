import { combineReducers } from 'redux';
import moment from 'moment';

const initState = {
  showTimezone: false
}

const TOGGLE_TIMEZONE = 'TOGGLE_TIMEZONE';
const CHANGE_PROP = 'CHANGE_PROP';

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
}

const appointment = {
  receivers: [],
  startTime: moment(),
  endTime: moment(),
  subject: '',
  location: [],
  content: ''
}
function appointmentReducer(state = appointment, action) {
  switch(action.type) {
    case CHANGE_PROP:
      return {
        ...state,
        [action.prop]: action.data
      };
    default:
      return state;
  }
}

export default combineReducers(
  {
    navReducer,
    appointmentReducer
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

const changeProp = (prop, data) => {
  return {
    type: CHANGE_PROP,
    prop,
    data
  }
}


export {
  toggleTimezone,
  changeProp
};