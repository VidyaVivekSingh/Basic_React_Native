import {
  UPDATE_LOGIN_TYPE,
  UPDATE_OTP,
  UPDATE_USER_NAME,
  UPDATE_USER_ACCEPTANCE,
  UPDATE_USER_BMI,
  UPDATE_USER_DOB,
  UPDATE_USER_EMAIL,
  UPDATE_USER_GENDER,
  UPDATE_USER_HEIGHT,
  UPDATE_USER_IMAGE,
  UPDATE_USER_IMAGE_URL,
  UPDATE_USER_MOBILE,
  UPDATE_USER_PASSCODE,
  UPDATE_USER_TEMP_DOB,
  UPDATE_USER_TEMP_HEIGHT,
  UPDATE_USER_TEMP_WEIGHT,
  UPDATE_USER_TOKEN,
  UPDATE_USER_WEIGHT,
  RESET_STATE,
} from '../constants/constant';

const initialState = {
  name: '',
  acceptance: '',
  mobile: '',
  email: '',
  otp: '',
  passcode: '',
  gender: '',
  dob: '',
  loginType: '',
  socialImage: '',
  googleToken: '',
  fetchedURL: '',
  height: 0,
  weight: 0,
  bmi: '',
  tempheight: 0,
  tempweight: 0,
  tempDob: '',
  inviteCode: '',
  imageDetails: {
    secure_url: '',
    public_id: '',
    created_at: '',
  },
  leaderBoard: [],
  userGoals: 0,
  bloodPressure: 0,
  totalCholestrol: 0,
  bloodSugar: 0,
  userVitals: 4,
  userChangedScreen: false,
};

const UserReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case RESET_STATE: {
      newState = {
        ...state,
        name: '',
        mobile: '',
        acceptance: '',
        email: '',
        otp: '',
        passcode: '',
        gender: '',
        dob: '',
        socialImage: '',
        googleToken: '',
        fetchedURL: '',
        height: 0,
        weight: 0,
        bmi: '',
        tempheight: 0,
        tempweight: 0,
        tempDob: '',
        inviteCode: '',
        imageDetails: {
          secure_url: '',
          public_id: '',
          created_at: '',
        },
        leaderBoard: [],
        userGoals: 0,
        bloodPressure: 0,
        totalCholestrol: 0,
        bloodSugar: 0,
        userVitals: 4,
        userChangedScreen: false,
      };
      break;
    }

    case UPDATE_USER_NAME: {
      newState = {
        ...state,
        name: action.payload,
      };
      break;
    }
    default:
      return state;
  }
  return newState;
};

export default UserReducer;
