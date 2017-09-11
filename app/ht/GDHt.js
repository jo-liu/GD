/**
 * Created by Jo on 2017/8/30.
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
import USHalfHourHot from './GDUSHalfHourHot';
import Search from '../main/GDSearch';
import NoDataView from '../main/GDNoDataView';

import HTTPBase from '../http/HTTPBase';

export default class GDHt extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
            loaded:false,
            isModal:false,
        };

        this.data = [];
        this.loadData = this.loadData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    // 加载最新数据网络请求
    loadData(resolve) {

        let params = {
            "count" : 10,
            "country" : "us",
        };

        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
            .then((responseData) => {

                // 拼接数据
                this.data = this.data.concat(responseData.data);

                // 重新渲染
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });

                // 关闭刷新动画
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                }

                // 存储数组中最后一个元素的id
                let uslastID = responseData.data[responseData.data.length - 1].id;
                console.log(responseData.data);
                // 只能存储字符或者字符串
                AsyncStorage.setItem('uslastID', uslastID.toString());

                // 存储数组中第一个元素的id
                let usfirstID = responseData.data[0].id;
                AsyncStorage.setItem('usfirstID', usfirstID.toString());

                // 清除本地存储的数据
                RealmBase.removeAllData('HomeData');

                // 存储数据到本地
                RealmBase.create('HomeData', responseData);
            })
            .catch((error) => {
                // 拿到本地存储的数据，展示出来，如果没有存储，那就显示无数据页面
                this.data = RealmBase.loadAll('HomeData');

                // 重新渲染
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });
            })
    }

    // 加载更多数据的网络请求
    loadMoreData(value) {

        // 读取存储的id
        let params = {
            "count" : 10,
            "sinceid": value,
            "country" : "us",
        };

        // 加载更多数据请求
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
            .then((responseData) => {
                // 清空数组
                this.data = {};

                // 拼接数据
                this.data = this.data.concat(responseData.data);

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data),
                    loaded: true,
                });
                console.log(responseData);

                // 存储数组中最后一个元素的id
                let uslastID = responseData.data[responseData.data.length - 1].id;
                console.log(responseData.data);
                // 只能存储字符或者字符串
                AsyncStorage.setItem('uslastID', uslastID.toString());
            })
            .catch((error) => {
            })
    }

    // 加载更多数据操作
    loadMore() {
        // 读取存储的ID
        AsyncStorage.getItem('uslastID')
            .then((value) => {
                // 数据加载操作
                this.loadMoreData(value);
            })
    }

    // 跳转到近半小时热门
    pushToHalfHourHot() {
        // this.props.navigator.push({
        //     component:HalfHourHot,
        //     animationType:Navigator.SceneConfigs.FloatFromBottom,
        // })
        // 使用模态跳转
        this.setState({
            isModal:true,
        })
    }

    // 跳转到搜索
    pushToSearch() {
        this.props.navigator.push({
            component:Search,
        })
    }

    // 安卓模态销毁处理
    onRequestClose() {
        this.setState({
            isModal:false,
        })
    }

    // 关闭模态
    closeModal(data) {
        this.setState({
            isModal:data,
        })
    }

    // 返回左边按钮
    renderLeftItem() {
        return(
            <TouchableOpacity
                onPress={() => this.pushToHalfHourHot()}
            >
                <Image source={{uri:'hot_icon_20x20'}} style={styles.navbarLeftItemStyle}/>
            </TouchableOpacity>
        );
    }

    // 返回中间按钮
    renderTitleItem() {
        return(
            <TouchableOpacity>
                <Image source={{uri:'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle}/>
            </TouchableOpacity>
        );
    }

    // 返回右边按钮
    renderRightItem() {
        return(
            <TouchableOpacity
                onPress={() => this.pushToSearch()}
            >
                <Image source={{uri:'search_icon_20x20'}} style={styles.navbarRightItemStyle}/>
            </TouchableOpacity>
        );
    }

    // 返回listview尾部
    renderFooter() {
        return(
            <View style={{height:100}}>
                <ActivityIndicator/>
            </View>
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
                    initialListSize={5}
                    renderHeader={this.renderHeader}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={60}
                    renderFooter={this.renderFooter}
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

    render() {
        return (
            <View style={styles.container}>
                {/* 初始化模态 用于跳转到 半小时热门界面 以及 回退回来*/}
                <Modal
                    // 动画类型 none 没有动画 slide 从底部滑入 fade 淡入视野
                    animationType='slide'
                    // 透明度
                    transparent={false}
                    // 可见性
                    visible={this.state.isModal}
                    // 被销毁时会调用此函数 在Android平台，必须使用次函数
                    // Platform.OS === 'android' ? PropTypes.func.isRequired: PropTypes.func
                    onRequestClose={() => this.onRequestClose()}
                >
                    <Navigator
                        initialRoute={{
                            name:'halfHourHot',
                            component:USHalfHourHot,
                        }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            return <Component
                                removeModal={(data) => this.closeModal(data)}
                                {...route.params}
                                navigator={navigator}/>
                        }}/>
                </Modal>

                {/* 导航栏样式 */}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
                />

                {/* 根据网络状态决定是否渲染 listview */}
                {this.renderListView()}
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
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        width:66,
        height:20,
    },
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight:15,
    },

    ListViewStyle:{
        width:width,
    },
} );

