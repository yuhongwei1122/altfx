import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Form, Spin, Divider, Icon, Modal, Notification, message, Col, Row} from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;

class ChangeGroupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fromVisable: false,
            toVisable: false,
            checkData: {},
            checkFlag: false,
            type: 1
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            if (!err && this.state.checkFlag) {
                console.log(values);
                axios.post('/api/trgroup/apply',qs.stringify(values))
                .then((res) => {
                    if(Number(res.error.returnCode) === 0){
                        this.props.form.resetFields();
                        Notification.success({
                            message: '成功',
                            description: '已完成转组～',
                        });
                        if(Number(this.state.type) === 1){
                            this.props.history.push("/group/crm");
                        }else{
                            this.props.history.push("/group/agent");
                        }
                    }else{
                        message.error(res.error.returnUserMessage);
                    }
                });
            }
        });
    };
    handleCheck = (type) => {
        const form = this.props.form;
        if(form.getFieldValue('from_unique_code')){
            axios.post('/api/trgroup/check',qs.stringify({
                from_unique_code: form.getFieldValue('from_unique_code'),
                to_unique_code : form.getFieldValue('to_unique_code'),
                type : this.state.type,  //转组类型：1为直客crm转组、2为代理转组
                object : type //校验对象：1为校验被转组用户，2为校验拟转入用户
            })).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    this.setState({
                        checkFlag: true,
                        checkText: "",
                        fromVisable: true,
                        checkData: res.data
                    });
                }else{
                    this.setState({
                        checkFlag: false,
                        checkData: {},
                        checkText : res.error.returnUserMessage
                    });
                    
                }
            });
        }else{
            message.warning("请先输入");
        }
    };
    handleCheckTo = (type) => {
        const form = this.props.form;
        if(form.getFieldValue('to_unique_code')){
            axios.post('/api/trgroup/check',qs.stringify({
                from_unique_code: form.getFieldValue('from_unique_code'),
                to_unique_code : form.getFieldValue('to_unique_code'),
                type : this.state.type,  //转组类型：1为直客crm转组、2为代理转组
                object : type //校验对象：1为校验被转组用户，2为校验拟转入用户
            })).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    this.setState({
                        checkFlag: true,
                        checkText: "",
                        toVisable: true,
                        checkData: res.data
                    });
                }else{
                    this.setState({
                        checkFlag: false,
                        checkData: {},
                        checkText : res.error.returnUserMessage
                    });
                }
            });
        }else{
            message.warning("请先输入");
        }
    };
    handleClose = () => {
        this.setState({
            toVisable: false,
            fromVisable : false,
            checkData: {}
        });
    };
    componentWillMount(){
        this.setState({
            loading:true,
            type: this.props.match.params.type || 1
        });
    };
    componentDidMount(){
        this.setState({loading:false});
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
          labelCol: {
            xs: { span: 8 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 8 },
            sm: { span: 8 },
          },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
        };
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <Divider className="reg_title" orientation="left"><Icon type="user"></Icon>账户信息</Divider>
                    <FormItem
                        {...formItemLayout}
                        label={Number(this.state.type) === 1 ? "被转组客户ID" : "被转组代理ID"}
                        >
                        {getFieldDecorator('from_unique_code', {
                            initialValue: "",
                            rules: [{
                                required: true, message: '请输入ID!'
                            },{
                                pattern: /^(\d)+$/,message:"ID必须全是数字"
                            }]
                        })(
                            <Input placeholder="请输入转组ID"/>
                        )}
                        <Button onClick={this.handleCheck.bind(this,1)} type="primary">校验</Button>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新转入代理ID"
                        >
                        {getFieldDecorator('to_unique_code', {
                            initialValue: "",
                            rules: [{
                                required: true, message: '请输入ID!'
                            },{
                                pattern: /^(\d)+$/,message:"ID必须全是数字"
                            }]
                        })(
                            <Input placeholder="请输入新转入代理ID"/>
                        )}
                        <Button onClick={this.handleCheckTo.bind(this,2)} type="primary">校验</Button>
                    </FormItem>
                    {   this.state.checkText ?
                        <FormItem {...tailFormItemLayout}>
                            {this.state.checkText}
                        </FormItem> : null
                    }
                    
                    <Divider className="reg_title" orientation="left"><Icon type="info-circle-o"></Icon>特别提示</Divider>
                    <FormItem {...tailFormItemLayout}>
                        <p>转组后请重新确认返佣关系是否正确，如不正确请及时修改，否则会有影响。</p>
                        <p>点击提交按钮后，将立即转组，若客户现在还存在交易，则该笔交易将返佣给转组后的代理。</p>
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        {
                            Number(this.state.type) === 1 ? 
                            <Link to="/gourp/crm"><Button style={{marginRight:40}}>取消</Button></Link> :
                            <Link to="/gourp/agent"><Button type="primary">取消</Button></Link>
                        }
                        
                        <Button type="primary" htmlType="submit">确认转组</Button>
                    </FormItem>
                </Form>
                <Modal
                    visible={this.state.fromVisable}
                    title= {Number(this.state.type)===1?"转组客户信息":"转组代理信息"}
                    footer={null}
                    >
                    <div style={{lineHeight:"40px"}}>
                        {   Number(this.state.type)===1 ?
                            <div>
                            <Row gutter={16}>
                                <Col span={8} style={{textAlign:"right"}}>客户ID:</Col>
                                <Col span={10}>{this.state.checkData.from_unique_code}</Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8} style={{textAlign:"right"}}>客户姓名:</Col>
                                <Col span={10}>{this.state.checkData.from_username}</Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8} style={{textAlign:"right"}}>客户余额:</Col>
                                <Col span={10}>{this.state.checkData.balance}</Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8} style={{textAlign:"right"}}>持仓金额:</Col>
                                <Col span={10}>{this.state.checkData.trading_amount}</Col>
                            </Row>
                            </div> : 
                            <div>
                                <Row gutter={16}>
                                    <Col span={8} style={{textAlign:"right"}}>代理ID:</Col>
                                    <Col span={10}>{this.state.checkData.from_unique_code}</Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8} style={{textAlign:"right"}}>代理姓名:</Col>
                                    <Col span={10}>{this.state.checkData.from_username}</Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={8} style={{textAlign:"right"}}>余额:</Col>
                                    <Col span={10}>{this.state.checkData.balance}</Col>
                                </Row>
                            </div> 
                        }
                        
                        <Row gutter={16}>
                            <Col span={8} style={{textAlign:"right"}}>上级代理ID:</Col>
                            <Col span={10}>{this.state.checkData.parent_unique_code}</Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8} style={{textAlign:"right"}}>上级代理姓名:</Col>
                            <Col span={10}>{this.state.checkData.parent_username}</Col>
                        </Row>
                        <Row gutter={16} style={{marginBottom:20}}>
                            <Col span={6}></Col>
                            <Col span={10}>
                                <Button type="primary" onClick={this.handleClose}>知道了</Button>
                            </Col>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.toVisable}
                    title= "新转入代理信息"
                    footer={null}
                    >
                    <div style={{lineHeight:"40px"}}>
                        <Row gutter={16}>
                            <Col span={8} style={{textAlign:"right"}}>上级代理ID:</Col>
                            <Col span={10}>{this.state.checkData.to_unique_code}</Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8} style={{textAlign:"right"}}>上级代理姓名:</Col>
                            <Col span={10}>{this.state.checkData.to_username}</Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8} style={{textAlign:"right"}}>余额:</Col>
                            <Col span={10}>{this.state.checkData.balance}</Col>
                        </Row>
                        <Row gutter={16} style={{marginBottom:20}}>
                            <Col span={6}></Col>
                            <Col span={10}>
                                <Button type="primary" onClick={this.handleClose}>知道了</Button>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </Spin>
        );
    }
};
export default  Form.create()(ChangeGroupForm);