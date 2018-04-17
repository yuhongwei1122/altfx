import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { timingSafeEqual } from 'crypto';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
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
          const day = values.search_date;
          if(day){
            values.from = day[0].unix();
            values.to = day[1].unix();
            values.search_date = null;
          }
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
                    <Col span={8} key="symbol">
                        <FormItem 
                            {...formItemLayout}
                            label="交易类型"
                        >
                            {getFieldDecorator("symbol", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请选择注册类型!',
                                }]
                            })(
                                <Select>
                                    <Option value="">全部</Option>
                                    <Option value="USD">外汇</Option>
                                    <Option value="XAUUSD">贵金属</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="agent_code">
                        <FormItem 
                            {...formItemLayout}
                            label="代理账号ID"
                        >
                            {getFieldDecorator("agent_code", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入搜索的代理账户ID!',
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8} key="customer_code">
                        <FormItem 
                            {...formItemLayout}
                            label="客户账号ID"
                        >
                            {getFieldDecorator("customer_code", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入搜索客户账号ID!',
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} key="search_date">
                        <FormItem 
                            {...formItemLayout}
                            label="交易时间"
                        >
                            {getFieldDecorator("search_date", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入姓名!',
                                }]
                            })(
                                <RangePicker
                                    ranges={{ 今天: [moment(new Date(new Date().setHours(0,0,0,0))), moment()], '昨天':[moment().subtract('days', 1).hours(0).minutes(0).seconds(0),moment().subtract('days', 1).hours(23).minutes(59).seconds(59)], '本月': [moment().startOf('month'), moment()],'本周': [moment().startOf("week"), moment()],"上月":[moment().subtract("months",1).startOf('month').hours(0).seconds(0).milliseconds(0),moment().subtract("months",1).endOf('month').hours(23).seconds(59).milliseconds(59)]  }}
                                    showTime
                                    format="YYYY/MM/DD HH:mm:ss"
                                />
                            )}
                        </FormItem>
                    </Col>
                    
                </Row>
                <Row gutter={24}>
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
