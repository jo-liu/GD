/**
 * Created by Jo on 2017/9/5.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

// 获取屏幕的尺寸
const {width, height} = Dimensions.get('window');

// 引入外部文件
import Main from './GDMain'

export default class GDLaunchPage extends Component{

    componentDidMount() {
        setTimeout(() => {
            this.props.navigator.replace({
                component:Main
            })
        }, 1500)
    }

    render() {
        return(
            <Image source={{uri:'launchimage'}}  style={styles.imageStyle}/>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle:{
        width:width,
        height:height,
    }
})