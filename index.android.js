/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

// 引用外部文件
import LaunchPage from './app/main/GDLaunchPage'
import {Navigator} from 'react-native-deprecated-custom-components';

export default class GD extends Component {
  render() {
    return (
        <Navigator
            initialRoute={{
                name:'launchPage',
                component:LaunchPage
            }}
            renderScene={(route, navigator) => {
              let Component = route.component;
              return <Component {...route.params} navigator={navigator}/>
            }}
        />
    );
  }
}

AppRegistry.registerComponent('GD', () => GD);
