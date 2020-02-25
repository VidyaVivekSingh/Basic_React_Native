/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/config/routes/Navigation';
import 'react-native-gesture-handler';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';

import configureStore from './src/store/configureStore';

const store = configureStore();
console.disableYellowBox = true;
const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
