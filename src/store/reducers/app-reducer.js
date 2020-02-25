import {IS_TOUCH_ID_ENABLED} from '../constants/constant';
const initialState = {
  touchIdState: false,
};
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case IS_TOUCH_ID_ENABLED:
      return {
        ...state,
        count: action.payload,
      };
    default:
      return state;
  }
};
export default appReducer;
