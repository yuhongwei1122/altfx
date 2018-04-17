import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import { timingSafeEqual } from 'crypto';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class OutSearchForm extends Component{
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
            values.time_start = day[0].unix();
            values.time_end = day[1].unix();
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
                    <Col span={10} key="status">
                        <FormItem 
                            {...formItemLayout}
                            label="入金状态"
                        >
                            {getFieldDecorator("status", {
                                initialValue: "0",
                                rules: [
                                    {required: false, message: '请选择审入金状态!',
                                }]
                            })(
                                <Select>
                                    <Option value="0">全部</Option>
                                    <Option value="1">待支付</Option>
                                    <Option value="2">已支付</Option>
                                    <Option value="3">财务确认</Option>
                                    <Option value="4">客服确认</Option>
                                    <Option value="5">已完成</Option>
                                    <Option value="6">拒绝</Option>
                                    <Option value="7">支付失败</Option>
                                    <Option value="8">取消</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10} key="unique_code">
                        <FormItem 
                            {...formItemLayout}
                            label="CRM账户ID"
                        >
                            {getFieldDecorator("unique_code", {
                                initialValue: "",
                                rules: [
                                    {required: false, message: '请输入CRM账户ID!',
                                }]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={10} key="search_date">
                        <FormItem 
                            {...formItemLayout}
                            label="出金时间"
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
                    <Col span={8} offset={3} style={{marginTop:5}} key="search">
                        <Button type="primary" htmlType="submit"><Icon type="search"></Icon>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
};
export default Form.create()(OutSearchForm);
