/**
 * Created by Jo on 2017/9/1.
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

export default class GDCommunalHotCell extends Component {

    static propTypes = {
        image:PropTypes.string,
        title:PropTypes.string,
    };

    render() {
        return (
            <View style={styles.container}>
                {/* 左边图片 */}
                <Image source={{uri:this.props.image === '' ? 'defaullt_thumb_250x250' : this.props.image}} style={styles.imageStyle}/>
                {/* 中间的文字 */}
                <View>
                    <Text numberOfLines={3} style={styles.titleStyle}>{this.props.title}</Text>
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
    titleStyle:{
      width:width * 0.65,
    },
    arrowStyle:{
        width:10,
        height:10,
        marginRight:30,
    }
});

