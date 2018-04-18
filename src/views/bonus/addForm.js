import React, { PureComponent } from 'react';
import { InputNumber, Input, Form, Spin, Modal,message } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const { TextArea } = Input;

class addForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            //   console.log(values);
            this.setState({loading: true});
            axios.post('/api/bonus/create',qs.stringify(values
            )).then((res) => {
                if(Number(res.error.returnCode) === 0){
                    this.setState({loading: false});
                    this.props.handleEditOk();
                }else{
                    message.error(res.error.returnUserMessage);
                }
            });
          }
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleEditCancel();
    }
    
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
        return (
            <Modal
                visible={this.props.addVisable}
                title="奖金发放"
                onOk={this.handleSubmit}
                confirmLoading={this.state.loading}
                onCancel={this.handleReset}
                okText="确认"
                cancelText="取消"
                >
                <Spin spinning={this.state.loading}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem 
                            {...formItemLayout}
                            label="发放账户名"
                        >
                            <span style={{fontSize:"18px",color:"#000"}}>{this.props.bonus.agent_account}</span>
                        </FormItem>
                        <FormItem 
                            {...formItemLayout}
                            label="姓名---账户ID"
                        >
                            <span style={{fontSize:"16px",color:"#000"}}>{this.props.bonus.agent_name}</span>---<span style={{fontSize:"18px",color:"#000"}}>{this.props.bonus.agent_unique_code}</span>
                        </FormItem>
                        <FormItem 
                            {...formItemLayout}
                            label="邮箱---联系电话"
                        >
                            <span style={{fontSize:"14px",color:"#000"}}>{this.props.bonus.agent_email}</span>---<span style={{fontSize:"18px",color:"#000"}}>{this.props.bonus.agent_phone}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="发放金额"
                            >
                            {getFieldDecorator('bonus', {
                                rules: [{
                                    required: true, message: '请输入发放金额!',
                                }],
                            })(
                                <InputNumber style={{width:"100%"}} min={0} max={100} step={0.1} placeholder="请输入发放金额"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="发放人"
                            >
                            {getFieldDecorator('operator', {
                                rules: [{
                                    required: true, message: '请输入发放人!',
                                }],
                            })(
                                <Input placeholder="请输入发人"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="备注"
                            >
                            {getFieldDecorator('remark')(
                                <TextArea placeholder="可以设置备注" autosize={{ minRows: 3}}/>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        );
    }
};
export default  Form.create()(addForm);