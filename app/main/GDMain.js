/**
 * Created by Jo on 2017/8/30.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    DeviceEventEmitter,
} from 'react-native';

// 引用第三方框架
import TabNavigator from 'react-native-tab-navigator';
import {Navigator} from 'react-native-deprecated-custom-components';

// 引用外部文件
import Home from '../home/GDHome';
import HT from '../ht/GDHt';
import HourList from '../hourList/GDHourList';

export default class GD extends Component {
    // ES6
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab:'home',
            isHiddenTabBar:false,   // 是否隐藏tabbar
        };
      }

    // 设置Navigator跳转动画
    setNavAnimationType(route) {
        if (route.animationType) {  // 有值
            let conf = route.animationType;
            conf.gestures = null;
            return conf;
        } else {
            return Navigator.SceneConfigs.PushFromRight;
        }
    }
    // 返回TabBar的Item
    renderTabBarItem(title, selectedTab, image, selectedImage, component) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={{color:'black'}}
                renderIcon={() => <Image source={{uri:image}} style={styles.tabbarIconStyle} />}
                renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabbarIconStyle} />}

                onPress={() => this.setState({ selectedTab: selectedTab })}>
                <Navigator
                    initialRoute={{
                        name:selectedTab,
                        component:component,
                    }}

                    configureScene={(route) => this.setNavAnimationType(route)}

                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator}/>

                    }}
                />

            </TabNavigator.Item>
        );
    }

    tongZhi(data) {
        this.setState({
            isHiddenTabBar:data,
        })
    }

    componentDidMount() {
        // 注册通知
        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar', (data)=>{this.tongZhi(data)});
    }

    componentWillUnmount() {
        // 销毁
        this.subscription.remove();
    }

    render() {
        return (
            <TabNavigator
                tabBarStyle={this.state.isHiddenTabBar !== true ? {} : {height:0, overflow:'hidden'} }
                sceneStyle={this.state.isHiddenTabBar !== true ? {} : {paddingBottom : 0}}
            >
                {/* 首页 */}
                {this.renderTabBarItem("首页", 'home', 'tabbar_home_30x30', 'tabbar_home_selected_30x30', Home)}
                {/* 海淘 */}
                {this.renderTabBarItem("海淘", 'ht', 'tabbar_abroad_30x30', 'tabbar_abroad_selected_30x30', HT)}
                {/* 小时风云榜 */}
                {this.renderTabBarItem("小时风云榜", 'hourList', 'tabbar_rank_30x30', 'tabbar_rank_selected_30x30', HourList)}
            </TabNavigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabbarIconStyle:{
        width:Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25,
    }
});
