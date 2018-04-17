import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select } from 'antd';
import { timingSafeEqual } from 'crypto';
const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            status: "0",
            type: ""
        };
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
          this.props.handleSearch(values);
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          console.log('Received values of form: ', values);
          this.props.handleSearch(values);
        });
    }
    
    render(){
        const { getFieldDecorator } = this.props.form;
        const state = this.state;
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
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>
                    <Col span={8} key="status">
                        <FormItem 
                            {...formItemLayout}
                            label="审核状态"
                        >
                            {getFieldDecorator("status", {
                                initialValue: "0",
                                rules: [
                                    {required: false, message: '请选择审核状态!',
                                }]
                            })(
                                <Select>
                                    <Option value="0">全部</Option>
                                    <Option value="2">待审核</Option>
                                    <Option value="3">已通过</Option>
                                    <Option value="4">未通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="account_type">
                        <FormItem 
                            {...formItemLayout}
                            label="注册类型"
                        >
                            {getFieldDecorator("account_type", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择注册类型!',
                                }]
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="1">普通用户</Option>
                                    <Option value="2">普通代理</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="search_account">
                        <FormItem 
                            {...formItemLayout}
                            label="用户名"
                        >
                            {getFieldDecorator("search_account", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入用户名!',
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} key="search_unique_code">
                        <FormItem 
                            {...formItemLayout}
                            label="账户ID"
                        >
                            {getFieldDecorator("search_unique_code", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入账户ID!',
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="search_username">
                        <FormItem 
                            {...formItemLayout}
                            label="姓名"
                        >
                            {getFieldDecorator("search_username", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入姓名!',
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6} offset={2} key="search">
                        <Button type="primary" htmlType="submit"><Icon type="search"></Icon>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
};
export default Form.create()(SearchForm);
