import React, { Component } from 'react';
import { Form, Icon, Modal } from 'antd';
const FormItem = Form.Item;

class InFirstCheckForm extends Component{
    constructor(props){
        super(props);
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log('Received values of form: ', values);
                values.real_amount = this.props.inpay.apply_amount;
                this.props.handleFirstOk(values);
            }
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleFirstOk();
    }
    
    render(){
        // const { getFieldDecorator } = this.props.form;
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
                visible={this.props.firstVisable}
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
                        label="入金金额"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>${this.props.inpay.apply_amount}</span><Icon type="swap" style={{fontSize:"14px",color:"#40a9ff"}}></Icon><span style={{fontSize:"18px",color:"#000"}}>¥{this.props.inpay.converted_amount}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="入金前余额"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>${this.props.inpay.before_balance}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="入金后余额"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>${this.props.inpay.after_balance}</span>
                    </FormItem>
                </Form> 
                <p style={{textAlign:"center",fontSize:"14px"}}>您确定该笔入金初审通过吗？</p>   
            </Modal>
            
        )
    }
};
export default Form.create()(InFirstCheckForm);
