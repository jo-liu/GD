/**
 * Created by Jo on 2017/9/13.
 */
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Text,
} from 'react-native';

// 引用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';
import SettingCell from './GDSettingsCell';

export default class GDSettings extends Component {

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
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image source={{uri:'back'}} style={styles.navbarLeftItemStyle}/>
                    <Text>返回</Text>
                </View>
            </TouchableOpacity>
        );
    }

    // 返回中间按钮
    renderTitleItem() {
        return(
            <Text style={styles.navbarTitleItemStyle}>设置</Text>
        );
    }

    render() {
        return(
            <View style={styles.container}>

                {/* 导航栏样式 */}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                />

                {/* 内容 */}
                <ScrollView
                    style={styles.scrollViewStyle}
                >
                    {/* 第一个Cell */}
                    <SettingCell
                        leftTitle="淘宝天猫快捷下单"
                        isShowSwitch={true}
                    />

                    {/* 第二个Cell */}
                    <SettingCell
                        leftTitle="清理图片缓存"
                        isShowSwitch={false}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles =  StyleSheet.create({
    container:{
        flex:1,
    },
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },

    navbarTitleItemStyle:{
        fontSize:17,
        color:'black',
        marginRight:50,
    },
    scrollViewStyle:{
        backgroundColor:'white',
    },
});