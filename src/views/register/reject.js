import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Modal } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

class RejectForm extends Component{
    constructor(props){
        super(props);
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log('Received values of form: ', values);
                this.props.handleRejectOk(values);
            }
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleRejectOk();
    }
    
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
                visible={this.props.rejectVisable}
                onOk={this.handleSubmit}
                onCancel={this.handleReset}
                okText="确认"
                cancelText="取消"
                >
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSubmit}
                >
                    <FormItem 
                        {...formItemLayout}
                        label="拒绝原因"
                    >
                        {getFieldDecorator("reason", {
                            initialValue: "",
                            rules: [
                                {required: true, message: '请输入审核拒绝通过的原因!',
                            }]
                        })(
                            <TextArea placeholder="请输入审核拒绝的原因" autosize={{ minRows: 3}} />
                        )}
                    </FormItem>
                </Form>     
            </Modal>
            
        )
    }
};
export default Form.create()(RejectForm);
