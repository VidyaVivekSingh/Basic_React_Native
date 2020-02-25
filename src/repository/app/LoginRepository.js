import {AsyncStorage} from 'react-native';
// Repo implementation to store data in device
// TODO: To move login repo with Repository pattern
// @author: meshakti

export const saveLoginInfo = async userInfo => {
  try {
    AsyncStorage.removeItem('name');
    await AsyncStorage.setItem('name', userInfo.name);

    AsyncStorage.removeItem('passcode');
    await AsyncStorage.setItem('passcode', userInfo.passcode);

    AsyncStorage.removeItem('enableTouchId');
    await AsyncStorage.setItem('enableTouchId', userInfo.enableTouchId);

    AsyncStorage.removeItem('identityProvider');
    await AsyncStorage.setItem('identityProvider', userInfo.identityProvider);

    return true;
  } catch (ex) {
    return false;
  }
};

export const isTouchIdEnabled = async () => {
  const isTouchId = await AsyncStorage.getItem('enableTouchId');
  return isTouchId ? isTouchId === 'true' : false;
};

export const getLoggedInUserName = async () => {
  const name = await AsyncStorage.getItem('name');
  return name;
};

export const getLoggedInPassCode = async () => {
  const passcode = await AsyncStorage.getItem('passcode');
  return passcode;
};

export const getIdentityProvider = async () => {
  const identityProvider = await AsyncStorage.getItem('identityProvider');
  return identityProvider;
};

export const saveTouchIdInfo = async userInfo => {
  await AsyncStorage.removeItem('enableTouchId');
  await AsyncStorage.setItem('enableTouchId', userInfo.enableTouchId);
};

export const savePasscodeInfo = async passcode => {
  await AsyncStorage.removeItem('passcode');
  await AsyncStorage.setItem('passcode', passcode);
};

export const getUserToken = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  return userToken;
};

export const saveIdentityProviderInfo = async identityProvider => {
  await AsyncStorage.removeItem('identityProvider');
  await AsyncStorage.setItem('identityProvider', identityProvider);
};
