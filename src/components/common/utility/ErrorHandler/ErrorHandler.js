import {
  Alert, Platform, AsyncStorage, BackAndroid
} from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { BASE_URL, headers } from '../../../api/config/Config';
import AutoLogin from '../../../api/StartPage/AutoLogin';

export const errorHandler = (error, isFatal) => {
  let userName = '';
  if (isFatal) {
    Alert.alert(
      'Unexpected error occurred',
      `We have reported this to our team ! \n Please close the app and start again!`,
      [{
        text: 'Cancel',
        onPress: () => BackAndroid.exitApp(),
        style: 'cancel',
      }, {
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        }
      }]
    );
    AsyncStorage.getItem('userToken').then((token) => {
      AutoLogin.autoLogin(token).then((responseJson) => {
        try {
          userName = responseJson.name === 'JsonWebTokenError' ? 'Unregister' : responseJson.name;
          fetch(`${BASE_URL}/api/saveerror`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              errorMessage: error.message,
              errorStack: error.stack,
              time: moment().format('MMMM Do YYYY, h:mm:ss a'),
              platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
              user: userName,
              apiLevel: DeviceInfo.getAPILevel(),
              brand: DeviceInfo.getBrand(),
              buildNumber: DeviceInfo.getBuildNumber(),
              deviceCountry: DeviceInfo.getDeviceCountry(),
              deviceLocale: DeviceInfo.getDeviceLocale(),
              deviceName: DeviceInfo.getDeviceName(),
              freeDiskStorage: DeviceInfo.getFreeDiskStorage(),
              manufacturer: DeviceInfo.getManufacturer(),
              model: DeviceInfo.getModel(),
              systemVersion: DeviceInfo.getSystemVersion(),
              version: DeviceInfo.getVersion(),
              isLandscape: DeviceInfo.isLandscape(),
              networkName: DeviceInfo.getCarrier()
            })
          }).then(response => response.json());
        } catch (ex) {
          console.error(ex);
        }
      }).catch((err) => {
        console.log(err);
      });
    });
  } else {
    console.log(error);
  }
};

export const nativeException = ((exceptionString) => {
  if (exceptionString) {
    Alert.alert(
      'Unexpected error occurred',
      `
      Error: ${exceptionString}
      We have reported this to our team ! Please close the app and start again!
      `,
      [{
        text: 'Cancel',
        onPress: () => BackAndroid.exitApp(),
        style: 'cancel',
      }, {
        text: 'Restart',
        onPress: () => {
          RNRestart.Restart();
        }
      }]
    );
  }
  AsyncStorage.getItem('userToken').then((token) => {
    AutoLogin.autoLogin(token).then((responseJson) => {
      try {
        const userName = responseJson.name === 'JsonWebTokenError' ? 'Unregister' : responseJson.name;
        fetch(`${BASE_URL}/api/saveerror`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            errorMessage: exceptionString,
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
            user: userName,
            apiLevel: DeviceInfo.getAPILevel(),
            brand: DeviceInfo.getBrand(),
            buildNumber: DeviceInfo.getBuildNumber(),
            deviceCountry: DeviceInfo.getDeviceCountry(),
            deviceLocale: DeviceInfo.getDeviceLocale(),
            deviceName: DeviceInfo.getDeviceName(),
            freeDiskStorage: DeviceInfo.getFreeDiskStorage(),
            manufacturer: DeviceInfo.getManufacturer(),
            model: DeviceInfo.getModel(),
            systemVersion: DeviceInfo.getSystemVersion(),
            version: DeviceInfo.getVersion(),
            isLandscape: DeviceInfo.isLandscape(),
            networkName: DeviceInfo.getCarrier()
          })
        }).then(response => response.json());
      } catch (ex) {
        console.error(ex);
      }
    }).catch((err) => {
      console.log(err);
    });
  });
});
setJSExceptionHandler(errorHandler, true);
setNativeExceptionHandler(nativeException);
