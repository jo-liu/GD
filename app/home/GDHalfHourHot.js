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
    DeviceEventEmitter,
} from 'react-native';

// 第三方
import {PullList} from 'react-native-pull';

const {width, height} = Dimensions.get('window');

// 引用外部文件
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalHotCell from '../main/GDCommunalHotCell';
import NoDataView from '../main/GDNoDataView';

import HTTPBase from '../http/HTTPBase'

export default class GDHalfHourHot extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
            loaded:false,
        };
        this.fetchData = this.fetchData.bind(this);
      }

    static defaultProps = {
          removeModel:{},
    }

    // 网络请求的方法
    fetchData(resolve) {
          // setTimeout(() => {
              HTTPBase.get('http://guangdiu.com/api/gethots.php')
                  .then((responseData) => {
                      this.setState({
                          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                          loaded: true,
                      });
                      console.log(responseData);
                      if (resolve !== undefined) {
                          setTimeout(() => {
                              resolve();   // 关闭动画
                          }, 1000);
                      }
                  })
                  .catch((error) => {

                  });

          //     fetch('http://guangdiu.com/api/gethots.php')
          //     .then((response) => response.json())
          //     .then((responseData) => {
          //         this.setState({
          //             dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          //             loaded: true,
          //         });
          //         console.log(responseData);
          //         if (resolve !== undefined) {
          //             setTimeout(() => {
          //                 resolve();
          //             }, 1000);
          //         }
          //     })
          //     .done()
          // }, 1000);
    }

    popToHome(data) {
          // this.props.navigator.pop();
        this.props.removeModel(data);
    }

    // 返回中间按钮
    renderTitleItem() {
        return(
            <Text style={styles.navbarTitleItemStyle}>近半小时热门</Text>
        );
    }

    // 返回右边按钮
    renderRightItem() {
        return(
            <TouchableOpacity
                onPress={() => this.popToHome(false)}
            >
                <Text style={styles.navbarRightItemStyle}>关闭</Text>
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
                    onPullRelease={(resolve) => this.fetchData(resolve)}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    // showsHorizontalScrollIndicator={false}
                    style={styles.ListViewStyle}
                    initialListSize={5}
                    renderHeader={this.renderHeader}
                />
            );
        }
        {/* showsHorizontalScrollIndicator 隐藏水平线 （但是这个版本发现默认隐藏）*/}
    }

    // 返回listview头部
    renderHeader() {
        return(
            <View style={styles.headerPromptStyle}>
                <Text>根据每条折扣的点击进行统计,每5分钟更新一次</Text>
            </View>
        );

    }

    // 返回每一行cell的样式
    renderRow(rowData) {
          return(
            <CommunalHotCell
                image={rowData.image}
                title={rowData.title}
            />
          );
    }

    componentWillMount() {
        // 发送通知
        DeviceEventEmitter.emit('isHiddenTabBar', true);
    }

    componentWillUnmount() {
        // 发送通知
        DeviceEventEmitter.emit('isHiddenTabBar', false);
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <CommunalNavBar
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
    },
    navbarTitleItemStyle:{
        fontSize:17,
        color:'black',
        marginLeft:50,
    },
    navbarRightItemStyle:{
        fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight:15,
    },

    ListViewStyle:{
        width:width,
    },

    headerPromptStyle:{
        height:44,
        width:width,
        backgroundColor:'rgba(239,239,239,0.5)',
        justifyContent:'center',
        alignItems:'center',
    },
} );

