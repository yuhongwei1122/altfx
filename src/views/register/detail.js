import React, { Component } from 'react';
import { Tabs, Row, Col, List, Card, Divider, Icon, Button, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import RejectModal from './reject';
import SuccessModal from './success';

const TabPane = Tabs.TabPane;

export default class Detail extends Component{
    constructor(props){
        super();
        this.state = {
            globalLoading: false,
            detail: {},
            rejectVisable: false,
            successVisable: false,
            user_id: "",
            identity_front_image: "",
            identity_back_image: "",
            risk_tips_image: ""
        };
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading,
        });
    };
    getRowItems = (colums,detail) => {
        return colums.map((item)=>{
            if(detail.account_type === 3){//代理
                if(!item.typeFlag){
                    return (
                        <List.Item key={item.key} style={{margin:"10px"}}>
                            <Card style={{lineHeight:1}} title={item.name}>{detail[item.key]}</Card>
                        </List.Item>
                    );
                }else{
                    return null;
                }
            }else{//普通用户
                return (
                    <List.Item key={item.key} style={{margin:"10px"}}>
                        <Card style={{lineHeight:1}} title={item.name}>{item.render ? item.render(detail[item.key],detail) : detail[item.key]}</Card>
                    </List.Item>
                );
            }
        });
    };
    getRowTrades = (detail) => {
        const mt4 = detail["mt4"] || [];
        return mt4.map((item,index) => {
            return (
                <Col span={8} key={index+"0"}>
                    <Card title={"交易账户-"+(index+1)}>
                        <div style={{lineHeight:"25px"}}>
                            <label style={{width:100,textAlign:"right",display:"inline-block"}}>交易账户名：</label>
                            <span>{item.mt4_name}</span>
                        </div>
                        <div style={{lineHeight:"25px"}}>
                            <label style={{width:100,textAlign:"right",display:"inline-block"}}>交易类型：</label>
                            <span>{item.platform}</span>
                        </div>
                        <div style={{lineHeight:"25px"}}>
                            <label style={{width:100,textAlign:"right",display:"inline-block"}}>账户货币：</label>
                            <span>{item.currency}</span>
                        </div>
                        <div style={{lineHeight:"25px"}}>
                            <label style={{width:100,textAlign:"right",display:"inline-block"}}>点差类型：</label>
                            <span>{item.commission_model}</span>
                        </div>
                        <div style={{lineHeight:"25px"}}>
                            <label style={{width:100,textAlign:"right",display:"inline-block"}}>杠杆：</label>
                            <span>{item.leverage === 1 ? "1:50" :(item.leverage === 2 ? "1:100" : (item.leverage === 3 ? "1:200" : "1:400"))}</span>
                        </div>
                    </Card>
                </Col>
            );
        });
    };
    handleBack = () => {
        this.props.history.push("/register/index");
    };
    handleReject = () => {
        this.setState({
            rejectVisable: true
        });
    };
    handleRejectOk = (params) => {
        if(params){
            axios.post('/api/register/audit',qs.stringify({
                user_id: this.state.detail.id,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    this.setState({
                        rejectVisable: false
                    });
                }else{
                    message.error("拒绝失败");
                }
            });
        }else{
            this.setState({
                rejectVisable: false
            });
        }
    };
    handleSuccess = () => {
        this.setState({
            successVisable: true
        });
    };
    handleSuccessOk = (params) =>{
        if(params){
            axios.post('/api/register/audit',qs.stringify({
                user_id: this.state.detail.id,
                ...params
            })).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    this.setState({
                        successVisable: false
                    });
                }else{
                    message.error("审核失败");
                }
            });
        }else{
            this.setState({
                successVisable: false
            });
        }
    };
    fetchFrontCard = () => {
        axios.post('/api/image/get-url',qs.stringify({
            account: this.state.detail.account || "",
            type:1
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    identity_front_image: res.data.image_url
                });
            }else{
                message.error(res.error.retrunUserMessage);
            }
        });
    };
    fetchBackCard = () => {
        axios.post('/api/image/get-url',qs.stringify({
            account: this.state.detail.account || "",
            type:2
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    identity_back_image: res.data.image_url
                });
            }else{
                message.error(res.error.retrunUserMessage);
            }
        });
    };
    fetchRiskCard = () => {
        axios.post('/api/image/get-url',qs.stringify({
            account: this.state.detail.account || "",
            type:3
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    risk_tips_image: res.data.image_url
                });
            }else{
                message.error(res.error.retrunUserMessage);
            }
        });
    };
    fetachImage = () => {
        axios.all([this.fetchFrontCard(), this.fetchBackCard(),this.fetchRiskCard()])
        .then(axios.spread(function (acct, perms) {
            // Both requests are now complete
            console.log(perms);
            console.log(acct);
        }));
    };
    componentWillMount(){
        this.toggleLoading();
        axios.post('/api/register/user-detail',qs.stringify({
            user_id: this.props.match.params.user_id || ""
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    detail: res.data,
                    user_id: this.props.match.params.user_id || ""
                });
                this.fetachImage();
            }else{
                message.error(res.error.retrunUserMessage);
                this.setState({
                    detail: {},
                    user_id: this.props.match.params.user_id || ""
                });
            }
        });
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render(){
        const colums = [
            {
                key: "invite_code",
                name: "上级代理ID"
            },
            {
                key: "account",
                name: "用户名",
                typeFlag: true,
            },
            {
                key: "english_name",
                name: "英文姓名",
                typeFlag: true,
            },
            {
                key: "phone",
                name: "手机号"
            },
            {
                key: "mail",
                name: "邮箱"
            },
            {
                key: "sex",
                name: "性别",
                typeFlag: true,
                render: (text) => {
                    if(text === 1){
                        return "男";
                    }else{
                        return "女";
                    }
                }
            },
            {
                key: "birthday",
                name: "出生日期",
                typeFlag: true
            },
            {
                key: "address",
                name: "地址",
                typeFlag: true,
                render: (text,row)=>{
                    return row.province + "--" + row.city + "--" + row.address;
                }
            },
            {
                key: "postcode",
                name: "邮编",
                typeFlag: true
            },
            {
                key: "wechat",
                name: "wechat",
                typeFlag: true,
                render: (text) => {
                    if(text !== undefined){
                        return text;
                    }else{
                        return "--"
                    }
                }
            }
        ];
        const { detail } = this.state;
        return(
            <Spin tip="Loading..." spinning={this.state.globalLoading}>            
            <div style={{marginBottom:20}}>
                <Tabs tabPosition="top">
                    <TabPane tab="基本信息" key="1">
                        <List grid={{ gutter: 24, column: 4, offset:2 }} small="small">
                            {this.getRowItems(colums,detail)} 
                        </List> 
                    </TabPane>
                    <TabPane tab="资料信息" key="2">
                        <Row gutter={24} key="4">
                            <Col span={6}>
                                <Card title="身份证号">{detail.identity}</Card>
                            </Col>
                            <Col span={6}>
                                <Card title="身份证正面照片"
                                cover={<img alt="" src={this.state.identity_front_image}/>}
                                >
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card title="身份证反面照片"
                                cover={<img alt="" src={this.state.identity_front_image}/>}
                                >
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card title="手持身份证照片"
                                cover={<img alt="" src={this.state.identity_front_image}/>}>
                                    
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    {
                        Number(detail.account_type) === 1 ?
                        <TabPane tab="交易账户" key="3">
                            <Row gutter={16} key="5">
                                {this.getRowTrades(detail)}
                            </Row>
                        </TabPane> : null
                    }
                </Tabs>
                <Divider orientation="left">操作<Icon type="edit"></Icon></Divider>
                <div style={{marginTop:10,textAlign:"center"}}>
                    <Button onClick={this.handleBack} size="large" icon="left-circle-o">关闭</Button>
                    {Number(detail.status)===2 ? <Button onClick={this.handleSuccess} icon="check-circle-o" style={{margin:"0px 15px"}} type="primary" size="large">通过</Button> : null}
                    {Number(detail.status)===2 ? <Button onClick={this.handleReject} icon="close-circle-o" type="danger" size="large">拒绝</Button> : null}
                </div>
                <RejectModal modalTitle="拒绝" rejectVisable={this.state.rejectVisable} handleRejectOk={this.handleRejectOk}/>
                <SuccessModal modalTitle="审核" successVisable={this.state.successVisable} handleSuccessOk={this.handleSuccessOk} type={detail.account_type}/>
            </div>
            </Spin>
        )
    }
};