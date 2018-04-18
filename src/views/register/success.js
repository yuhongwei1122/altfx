import React, { Component } from 'react';
import { Form,Input, Modal } from 'antd';
const FormItem = Form.Item;

class SuccessForm extends Component{
    constructor(props){
        super(props);
    };
    handleSubmit = (e) => {
        e.preventDefault();
        if(Number(this.props.type) === 1){
            this.props.form.validateFields((err, values) => {
                if(!err){
                    console.log('Received values of form: ', values);
                    values.result = 1;
                    this.props.handleSuccessOk(values);
                    this.props.form.resetFields();
                }
            });
        }else{
            this.props.handleSuccessOk({reault:"1"});
        }
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleSuccessOk();
    };
    render(){
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
        return(
            <Modal
                title={this.props.modalTitle}
                visible={this.props.successVisable}
                onOk={this.handleSubmit}
                onCancel={this.handleReset}
                okText="确认"
                cancelText="取消"
            >
                {Number(this.props.type) === 1 ? <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSubmit}
                >
                    <FormItem 
                        {...formItemLayout}
                        label="MT4 Login"
                    >
                        {getFieldDecorator("mt4_login", {
                            initialValue: "",
                            rules: [
                                {required: true, message: '请输入MT4 Login!',
                            }]
                        })(
                            <Input placeholder="请输入MT4 Login"/>
                        )}
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="MT4主密码"
                    >
                        {getFieldDecorator("mt4_loginpwd", {
                            initialValue: "",
                            rules: [
                                {required: true, message: '请输入MT4主密码!',
                            }]
                        })(
                            <Input placeholder="请输入MT4主密码"/>
                        )}
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="MT4查看密码"
                    >
                        {getFieldDecorator("mt4_checkpwd", {
                            initialValue: "",
                            rules: [
                                {required: true, message: '请输入MT4查看密码!',
                            }]
                        })(
                            <Input placeholder="请输入MT4查看密码"/>
                        )}
                    </FormItem>
                </Form> : <p>您确认将该用户注册为代理商吗？</p>}
            
            </Modal>
        )
    }
};
export default Form.create()(SuccessForm);
