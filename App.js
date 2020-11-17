// import {AppRegistry} from 'react-native';
// import App from './src';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';

// import './config/ReactotronConfig';
import Routes from './src/routes';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e3e" />

      <Routes />
    </>
  );
};
