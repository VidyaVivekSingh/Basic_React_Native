import {COUNTER_CHANGE} from '../constants/constant';
export function changeCount(count) {
  return {
    type: COUNTER_CHANGE,
    payload: count,
  };
}
