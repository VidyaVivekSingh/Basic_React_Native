import {IS_TOUCH_ID_ENABLED} from '../constants/constant';
export function touchIDState(touchIdState) {
  return {
    type: IS_TOUCH_ID_ENABLED,
    payload: touchIdState,
  };
}
