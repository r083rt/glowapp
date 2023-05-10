/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './patch-console-warn';

AppRegistry.registerComponent(appName, () => App);
