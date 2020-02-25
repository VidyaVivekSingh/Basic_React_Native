import {Alert, Platform, AsyncStorage, BackAndroid} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

export const errorHandler = (error, isFatal) => {
  let userName = '';
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `We have reported this to our team ! \n Please close the app and start again!`,
      [
        {
          text: 'Cancel',
          onPress: () => BackAndroid.exitApp(),
          style: 'cancel',
        },
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ],
    );
  } else {
    console.log(error);
  }
};

export const nativeException = exceptionString => {
  if (exceptionString) {
    Alert.alert(
      'Unexpected error occurred',
      `
      Error: ${exceptionString}
      We have reported this to our team ! Please close the app and start again!
      `,
      [
        {
          text: 'Cancel',
          onPress: () => BackAndroid.exitApp(),
          style: 'cancel',
        },
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.Restart();
          },
        },
      ],
    );
  }
};
setJSExceptionHandler(errorHandler, true);
setNativeExceptionHandler(nativeException);
