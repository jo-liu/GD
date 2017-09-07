/**
 * Created by Jo on 2017/9/7.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    WebView,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

// 引入外部文件
import CommunalNavBar from './GDCommunalNavBar'

export default class GDCommunalDetail extends Component {

    static propTypes = {
        url:PropTypes.string,
    };

    // 返回
    pop() {
        this.props.navigator.pop();
    }

    // 返回左边按钮
    renderLeftItem() {
        return(
            <TouchableOpacity
                onPress={() => this.pop()}
            >
                <Text>返回</Text>
            </TouchableOpacity>
        )
    }

    componentWillMount() {
        // 发送通知
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }

    componentWillUnmount() {
        // 发送通知
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    render() {
        return(
            <View style={styles.container}>
                {/* 导航栏 */}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                />

                {/* 初始化WebView */}
                <WebView
                    style={styles.webViewStyle}
                    source={{uri:this.props.url, method:'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },

    webViewStyle:{
        flex:1,
    },
});