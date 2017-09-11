/**
 * Created by Jo on 2017/9/11.
 */

import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    Image,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class GDCommunalCell extends Component {

    static propTypes = {
        image:PropTypes.string,
        title:PropTypes.string,
        mall:PropTypes.string,
        pubTime:PropTypes.string,
        fromSite:PropTypes.string,
    };

    renderDate(pubTime, fromSite) {

        // 时间差的计算
        let minute = 1000 * 60; // 1分钟
        let hour = minute * 60; // 1小时
        let day = hour * 24;    // 1天
        let week = day * 7;     // 1周
        let month = week * 30;  // 1个月

        // 计算时间差
        let now = new Date().getTime();     // 获取当前时间
        let diffvalue = now - Date.parse(pubTime.replace(/-/gi, "/"));  // 当前时间与数据时间时间戳差值

        if (diffvalue < 0) return;

        let monthC = diffvalue/month;   // 相差的月数
        let weekC = diffvalue/week;     // 相差的星期数
        let dayC = diffvalue/day;       // 相差的天数
        let hourC = diffvalue/hour;     // 相差的小时数
        let minuteC = diffvalue/minute; // 相差的分钟数

        let result;

        // Console.log(diffvalue);
        if (monthC >= 1) {
            result = parseInt(monthC) + "月前";
        } else if (weekC >= 1) {
            result = parseInt(weekC) + "周前";
        } else if (dayC >= 1) {
            result = parseInt(dayC) + "天前";
        } else if (hourC >= 1) {
            result = parseInt(hourC) + "小时前";
        } else if (minuteC > 1) {
            result = parseInt(minuteC) + "分钟前";
        } else {
            result = "刚刚";
        }

        // Console.log(result);
        return result + ' .' + fromSite;
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 左边图片 */}
                <Image source={{uri:this.props.image === '' ? 'defaullt_thumb_250x250' : this.props.image}} style={styles.imageStyle}/>
                {/* 中间 */}
                <View style={styles.centerViewStyle}>
                    {/* 标题 */}
                    <View>
                        <Text numberOfLines={3} style={styles.titleStyle}>{this.props.title}</Text>
                    </View >
                    {/* 详情 */}
                    <View style={styles.detailViewStyle}>
                        {/* 平台*/}
                        <Text style={styles.detailMallStyle}> {this.props.mall} </Text>
                        {/* 时间 + 来源*/}
                        <Text style={styles.detailTimeStyle}> {this.renderDate(this.props.pubTime, this.props.fromSite)} </Text>
                    </View>
                </View>
                {/* 右边的箭头 */}
                <Image source={{uri:'icon_cell_rightarrow'}} style={styles.arrowStyle}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        height:100,
        width:width,
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        marginLeft:15,
    },

    imageStyle:{
        width:70,
        height:70,
    },

    centerViewStyle:{
        // width:70,
        height:70,
        justifyContent:'space-around'
    },

    titleStyle:{
        width:width * 0.65,
    },

    detailViewStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },

    detailMallStyle:{
        fontSize:12,
        color:'green',
    },

    detailTimeStyle:{
        fontSize:12,
        color:'gray',
    },

    arrowStyle:{
        width:10,
        height:10,
        marginRight:30,
    }
});

