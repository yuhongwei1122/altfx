import React, { Component } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;

class UpdatePasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            confirmDirty: false
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            axios.post('/api/user/update-pwd',qs.stringify(values)
            ).then((res) => {
                this.setState({loading: false});
                this.props.handleUpdateOk();
            });
          }
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleUpdateCancel();
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('new_password')) {
            callback('两次输入密码不一致!');
        } else {
          callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['re_password'], { force: true });
        }
        callback();
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
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
                    <FormItem
                        {...formItemLayout}
                        label="原密码"
                        >
                        {getFieldDecorator('old_password', {
                            rules: [{
                                required: true, message: '请输入原密码!',
                            }],
                        })(
                            <Input type="password" placeholder="请输入原密码"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新密码"
                        >
                        {getFieldDecorator('new_password', {
                            rules: [{
                                required: true, message: '请输入新密码!'
                            },{
                                validator: this.validateToNextPassword,
                            },{
                                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)([a-zA-Z0-9]{8,16})$/,message:"8-16位字符，必须由字母和数字组成"
                            }],
                        })(
                            <Input type="password" placeholder="请输入新密码"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码"
                        >
                        {getFieldDecorator('re_password', {
                            rules: [{
                                required: true, message: '请输入密码!'
                            },{
                                validator: this.compareToFirstPassword,
                            },{
                                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)([a-zA-Z0-9]{8,16})$/,message:"8-16位字符，必须由字母和数字组成"
                            }],
                        })(
                            <Input type="password" placeholder="请输入密码" onBlur={this.handleConfirmBlur}/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.handleReset}>取消</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">确认</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create()(UpdatePasswordForm);