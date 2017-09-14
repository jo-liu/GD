/**
 * Created by Jo on 2017/8/30.
 */
/**
 * Created by Jo on 2017/8/30.
 */
/**
 * Created by Jo on 2017/8/30.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions,
    ActivityIndicator,
    Modal,
    AsyncStorage,
} from 'react-native';

// 第三方
import {PullList} from 'react-native-pull';
import {Navigator} from 'react-native-deprecated-custom-components';

const {width, height} = Dimensions.get('window');

// 引用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalCell from '../main/GDCommunalCell';
import CommunalDetail from '../main/GDCommunalDetail';
import NoDataView from '../main/GDNoDataView';
import Settings from './GDSettings'

import HTTPBase from '../http/HTTPBase';

export default class GDHourList extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
            loaded:false,
            prompt:'',
            isNextTouch:false,
        };

        this.nexthourhour = '';
        this.nexthourdate = '';
        this.lasthourhour = '';
        this.lasthourdate = '';
        this.nowHour = 0;
    }

    // 加载最新数据网络请求
    loadData(resolve, date, hour) {
        let params = {};

        if (date) {
            params = {
                "date" : date,
                "hour" : hour,
            }
        }

        HTTPBase.get('https://guangdiu.com/api/getranklist.php', params)
            .then((responseData) => {

                let isNextTouch = true;

                if (responseData.hasnexthour == 1) {
                    isNextTouch = false;
                }


                // 重新渲染
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded: true,
                    prompt:responseData.displaydate + responseData.rankhour + "点档" + '(' + responseData.rankduring + ')',
                    isNextTouch:isNextTouch,
                });

                // 关闭刷新动画
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }

                // 暂时保留一些数据
                this.nexthourhour = responseData.nexthourhour;
                this.nexthourdate = responseData.nexthourdate;
                this.lasthourhour = responseData.lasthourhour;
                this.lasthourdate = responseData.lasthourdate;
            })
            .catch((error) => {
            })
    }

    // 跳转到设置
    pushToSettings() {
        this.props.navigator.push({
            component:Settings,
        })
    }


    // 返回中间标题
    renderTitleItem() {
        return(
            <Image source={{uri:'navtitle_rank_107x20'}} style={styles.navbarTitleItemStyle}/>
        );
    }

    // 返回右边按钮
    renderRightItem() {
        return(
            <TouchableOpacity
                onPress={() => this.pushToSettings()}
            >
                <Text style={styles.navbarRightItemStyle}>设置</Text>
            </TouchableOpacity>
        );
    }

    /* 根据网络状态决定是否渲染listview*/
    renderListView() {
        if (this.state.loaded === false) {
            return (
                <NoDataView />
            );
        } else {
            return (
                <PullList
                    onPullRelease={(resolve) => this.loadData(resolve)}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    // showsHorizontalScrollIndicator={false}
                    style={styles.ListViewStyle}
                    initialListSize={7}
                />
            );
        }
    }

    pushToDetail(value) {
        this.props.navigator.push({
            component:CommunalDetail,
            params:{
                url:'https://guangdiu.com/api/showdetail.php' + '?' + 'id='+value,
                // url:'https://guangdiu.com/api/showdetail.php?id=4440798',
            }
        });
    }

    // 返回每一行cell的样式
    renderRow(rowData) {
        return(
            <TouchableOpacity
                onPress={() => this.pushToDetail(rowData.id)}
            >
                <CommunalCell
                    image={rowData.image}
                    title={rowData.title}
                    mall={rowData.mall}
                    pubTime={rowData.pubtime}
                    fromSite={rowData.fromsite}
                />
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        this.loadData();
    }

    nowDate () {
        let date = new Date();  // 获取当前时间
        let year = date.getFullYear();  // 年
        let month = date.getMonth();    // 月
        let day = date.getDate();    // 日

        if (month >= 1 && month <= 8) {     // 在10以内，我们手动添加0
            month = "0" + (month + 1);      // 注意，js中月份是以 0 开始的
        }

        if (day >= 1 && day <= 9) {
            day = "0" + day;
        }

        return year + month + day;
    }

    lastHour() {
        this.loadData(undefined, this.lasthourdate, this.lasthourhour);
    }

    nextHour() {
        this.loadData(undefined, this.nexthourdate, this.nexthourhour);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <CommunalNavBar
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />

                {/* 提醒栏 */}
                <View style={styles.promptViewStyle}>
                    <Text>{this.state.prompt}</Text>
                </View>
                {/* 根据网络状态决定是否渲染 listview */}
                {this.renderListView()}

                {/* 操作栏 */}
                <View style={styles.operationViewStyle}>
                    <TouchableOpacity
                        onPress={() => this.lastHour()}
                    >
                        <Text style={{marginRight:10, fontSize:17, color:'green'}}>{"< " + "上1小时"} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.nextHour()}
                        disabled={this.state.isNextTouch}
                    >
                        <Text style={{marginLeft:10, fontSize:17, color:this.state.isNextTouch == false ? 'green' : 'gray'}}>{"下1小时" + " >"} </Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    navbarTitleItemStyle:{
        width:106,
        height:20,
        marginLeft:50,
    },
    navbarRightItemStyle:{
        fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight:15,
    },
    promptViewStyle:{
        width:width,
        height:44,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(251,251,251,1.0)',
    },
    operationViewStyle:{
        width:width,
        height:44,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },

});

