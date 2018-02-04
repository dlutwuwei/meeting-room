import { combineReducers } from 'redux';
import moment from 'moment';

const initState = {
  showTimezone: false
}

const TOGGLE_TIMEZONE = 'TOGGLE_TIMEZONE';
const CHANGE_RECEIVERS = 'CHANGE_RECEIVERS';
const CHANGE_STARTTIME = 'CHANGE_STARTTIME';
const CHANGE_ENDTIME = 'CHANGE_ENDTIME';
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
  to: [],
  startTime: moment(),
  endTime: moment(),
  
}
function appointmentReducer(state = appointment, action) {
  switch(action.type) {
    case CHANGE_RECEIVERS:
      return {
        ...state,
        to: action.to
      };
    case CHANGE_STARTTIME:
      return {
        ...state,
        startTime: action.startTime
      };
    case CHANGE_ENDTIME:
      return {
        ...state,
        endTime: action.endTime
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

const changeReceivers = (to) => {
  return {
    type: CHANGE_RECEIVERS,
    to
  }
}

const changeStartTime = (startTime) => {
  return {
    type: CHANGE_STARTTIME,
    startTime
  }
}

const changeEndTime = (endTime) => {
  return {
    type: CHANGE_ENDTIME,
    endTime
  }
}

export {
  toggleTimezone,
  changeReceivers,
  changeStartTime,
  changeEndTime
};