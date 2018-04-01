import { combineReducers } from 'redux';
import moment from 'moment';

const initState = {
  showTimezone: false
}

const TOGGLE_TIMEZONE = 'TOGGLE_TIMEZONE';
const CHANGE_PROP = 'CHANGE_PROP';
const BATCH_CHANGE_PROP = 'BATCH_CHANGE_PROP';

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
const curHour = moment().hours();

const appointment = {
  receivers: [],
  location: [],
  startTime: moment().hours( curHour >= 9 ? curHour + 1 : 9).minute(0),
  endTime: moment().hours(curHour >= 9 ? curHour + 1 : 9).minute(30),
  subject: '',
  content: '',
  receiverOptions: [],
  locationOptions: [],
  attendeesCheckedList: [],
  roomsCheckedList: [],
  isRecurrence: false,
  recurrenceJson: ''
}
function appointmentReducer(state = appointment, action) {
  switch(action.type) {
    case CHANGE_PROP:
      return {
        ...state,
        [action.prop]: action.data
      };
    case BATCH_CHANGE_PROP:
      return {
        ...state,
        ...action.data
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

const batchChangeProp = (data) => {
  return {
    type: BATCH_CHANGE_PROP,
    data
  }
}


export {
  toggleTimezone,
  changeProp,
  batchChangeProp
};