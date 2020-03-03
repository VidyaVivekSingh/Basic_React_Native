/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import AppRoute from './src/config/routes/Navigation';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {setJSExceptionHandler} from 'react-native-exception-handler';
import configureStore from './src/store/configureStore';
import {errorHandler} from './src/components/common/utility/ErrorHandler/ErrorHandler';

const store = configureStore();

errorHandler();
setJSExceptionHandler(errorHandler, true);

console.disableYellowBox = true;

const RNRedux = () => (
  <Provider store={store}>
    <AppRoute />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
