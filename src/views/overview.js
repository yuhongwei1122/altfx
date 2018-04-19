import React, { Component } from 'react';
import { Calendar, Spin } from 'antd';

class Overview extends Component {
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false
        }
    };
    componentWillMount(){
        this.setState({
            globalLoading: true
        });
    };
    componentDidMount(){
        this.setState({
            globalLoading: false
        });
    };
    render() {
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>
            <div className="overview">
                <p style={{fontSize:"20px",textAlign:"center"}}>亲爱的，欢迎登录管理后台,如有问题请联系技术支持～</p>
                <div style={{marginTop:10}}>
                    <Calendar/>
                </div>
            </div>
            </Spin>
        );
    }
};
export default Overview;