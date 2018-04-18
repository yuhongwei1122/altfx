import React, { Component } from 'react';
import { Icon, Form, Input, Button, Alert,message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import JdbFooter from '../../components/footer/footer';
import Logo from './logo-blue.png';
import './login.css';
const FormItem = Form.Item;

class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state={
            error:"",
            submiting: false
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.setState({
                submiting: true
            });
            axios.post('/api/login/login',qs.stringify(values))
            .then((res) => {
                if(Number(res.error.returnCode) === 0){
                    this.setState({
                        submiting: false,
                        error: ""
                    });
                    console.log("跳转首页");
                    // axios.post('/api/user/perms',qs.stringify(values))
                    // .then((resr) => {
                    //     if(Number(resr.error.returnCode) === 0){
                    //         values.perms = resr.data;
                    //         sessionStorage.setItem("altfx_user",JSON.stringify(values));
                    //         this.props.history.push("/overview");
                    //     }else{
                    //         message.error(resr.error.returnUserMessage);
                    //     }
                    // });
                    values.token = res.data.token;
                    values.user_id = res.data.user_id;
                    sessionStorage.setItem("altfx_user",JSON.stringify(values));
                    this.props.history.push("/overview");
                }else{
                    this.setState({
                        submiting: false,
                        error: res.error.returnUserMessage
                    });
                }
            }).catch((error) => {
                this.setState({
                    submiting: false
                });
            });
          }
        });
      }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="main">
                <div className="altfx-login">
                    <div style={{textAlign:"center",marginBottom:35}}><img src={Logo} style={{marginBottom:20,height:60}} alt="logo"/></div>
                    {this.state.error?<Alert style={{marginBottom:24}} message={this.state.error} type="error" showIcon />:null}
                    <div> 
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                            )}
                            </FormItem>
                            <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                            )}
                            </FormItem>
                            <Button type="primary" loading={this.state.submiting} size="large" style={{width:"100%"}} htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form>
                    </div> 
                    <div style={{padding:"0 16px",margin:"48px 0 24px",textAlign:"center",color: "rgba(0,0,0,.45)",fontSize: "14px"}}>
                        <JdbFooter/>
                    </div>
                </div>
            </div>
        );
    }
};
export default Form.create()(LoginForm);