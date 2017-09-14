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
    AsyncStorage,
} from 'react-native';

// 引用第三方框架
import TabNavigator from 'react-native-tab-navigator';
import {Navigator} from 'react-native-deprecated-custom-components';

// 引用外部文件
import Home from '../home/GDHome';
import HT from '../ht/GDHt';
import HourList from '../hourList/GDHourList';
import HTTPBase from '../http/HTTPBase';
import RealmStorage from '../storage/realmStorage'

export default class GD extends Component {
    // ES6
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab:'home',     // 首选页面
            isHiddenTabBar:false,   // 是否隐藏tabBar
            cnbadgeText:'',         // 首页Item角标文本
            usbadgeText:''          // 海淘Item角标文本
        };
      }

    // 获取最新数据个数网络请求
    loadDataNumber() {
        // 取出id
        AsyncStorage.multiGet(['cnfirstID', 'usfirstID'], (error, stores) => {

            // 拼接参数
            let params = {
                "cnmaxid": stores[0][1],
                "usmaxid": stores[1][1],
            };
            // 请求数据
            HTTPBase.get('http://guangdiu.com/api/getnewitemcount.php', params)
                .then((responseData) => {
                    this.setState({
                        cnbadgeText: responseData.cn,
                        usbadgeText: responseData.us,
                    })
                })
                .catch((error) => {

                })
        })

      // AsyncStorage.getItem('cnfirstID')
      //     .then((value) => {
      //         cnfirstID = parseInt(value);
      //     });
      // AsyncStorage.getItem('usfirstID')
      //     .then((value) => {
      //         usfirstID = parseInt(value);
      //     });

      // if (cnfirstID !== 0 && usfirstID !== 0) {
      //     // 拼接参数
      //     let params = {
      //         "cnmaxid": cnfirstID,
      //         "usmaxid": usfirstID,
      //     };
          // // 请求数据
          // HTTPBase.get('http://guangdiu.com/api/getnewitemcount.php', params)
          //     .then((responseData) => {
          //         console.log(responseData);
          //         this.setState({
          //             cnbadgeText:responseData.cn,
          //             usbadgeText:responseData.us,
          //         })
          //     })
          //     .catch((error) => {
          //
          //     })
      // }
    }

    // 设置 Navigator 转场动画
    setNavAnimationType(route) {
        if (route.animationType) {  // 有值
            let conf = route.animationType;
            conf.gestures = null;           // 关闭返回手势
            return conf;
        }else {
            return Navigator.SceneConfigs.PushFromRight;    // 默认转场动画
        }
    }

    // 隐藏 TabBar
    hiddenTabBar(data) {
        this.setState({
            isHiddenTabBar:data,
        })
    }
    // 点击了Item
    clickItem(selectedTab, subscription) {

        if (subscription !== "" && this.state.selectedTab == selectedTab) {
            // 发送通知
            DeviceEventEmitter.emit(subscription);
        }
        // 渲染页面
        this.setState({ selectedTab: selectedTab })
    }

    // 返回TabBar的Item
    renderTabBarItem(title, selectedTab, image, selectedImage, component, badgeText, subscription) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                badgeText={badgeText == 0 ? '' :badgeText}
                selectedTitleStyle={{color:'black'}}
                renderIcon={() => <Image source={{uri:image}} style={styles.tabbarIconStyle} />}
                renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabbarIconStyle} />}

                onPress={() => this.clickItem(selectedTab, subscription)}>
                <Navigator
                    initialRoute={{
                        name:selectedTab,
                        component:component,
                    }}

                    configureScene={(route) => this.setNavAnimationType(route)}

                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params}
                                          navigator={navigator}
                                        loadDataNumber={() => this.loadDataNumber()}/>
                    }}
                />

            </TabNavigator.Item>
        );
    }

    // 组件加载完成
    componentDidMount() {
        // 注册通知
        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar', (data)=>{this.hiddenTabBar(data)});

        // 最新数据的个数
        setInterval(() => {
            this.loadDataNumber();
        }, 30000);
    }

    // 组件即将销毁
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
                {this.renderTabBarItem("首页", 'home', 'tabbar_home_30x30', 'tabbar_home_selected_30x30', Home, this.state.cnbadgeText, "clickHomeItem")}
                {/* 海淘 */}
                {this.renderTabBarItem("海淘", 'ht', 'tabbar_abroad_30x30', 'tabbar_abroad_selected_30x30', HT, this.state.usbadgeText, "clickHTItem")}
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

