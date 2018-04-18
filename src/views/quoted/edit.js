import React, { PureComponent } from 'react';
import { InputNumber, Form, Spin, Radio, Modal } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class editForm extends PureComponent {
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
            axios.post('/platform/user/add',qs.stringify(values
            )).then((res) => {
                this.setState({loading: false});
                this.props.handleEditOk();
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
                visible={this.props.editVisable}
                title="新增外汇牌价"
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
                            label="类型"
                            >
                            {getFieldDecorator('rate_type',{
                                initialValue:1,
                                rules: [{
                                    required: true, message: '请选择类型!',
                                }],
                            })(
                                <RadioGroup>
                                    <Radio value={1}>入金</Radio>
                                    <Radio value={2}>出金</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="现汇买入价"
                            >
                            {getFieldDecorator('rate', {
                                rules: [{
                                    required: true, message: '请输入现汇买入价!',
                                }],
                            })(
                                <InputNumber style={{width:"100%"}} min={0} max={10} step={0.1} placeholder="请输入现汇买入价"/>
                            )}
                        </FormItem>
                        
                    </Form>
                </Spin>
            </Modal>
        );
    }
};
export default  Form.create()(editForm);