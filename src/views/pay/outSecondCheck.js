import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Modal, Card } from 'antd';
const FormItem = Form.Item;

class OutSecondCheckForm extends Component{
    constructor(props){
        super(props);
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                console.log('Received values of form: ', values);
                values.real_amount = this.props.inpay.apply_amount;
                this.props.handleSecondOk(values);
            }
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.handleSecondOk();
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
                visible={this.props.secondVisable}
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
                        label="姓名"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>{this.props.inpay.username}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="银行-开户行"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>{this.props.inpay.bank_name}</span>---<span style={{fontSize:"18px",color:"#000"}}>{this.props.inpay.opening_bank}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="开户行省市"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>{this.props.inpay.province}</span>---<span style={{fontSize:"18px",color:"#000"}}>{this.props.inpay.city}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="银行卡号"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>{this.props.inpay.card_no}</span>
                    </FormItem>
                    {this.props.inpay.bank_img ? <FormItem 
                        {...formItemLayout}
                        label="银行卡照片"
                    >
                        <Card
                            hoverable
                            style={{ width: "280px",overflow:"hidden",height:"150px"}}
                            cover={<img alt="example" style={{width: "280px",height: "150px"}} src={this.props.inpay.bank_img} />}
                        />
                    </FormItem> : null
                    }
                    <FormItem 
                        {...formItemLayout}
                        label="出金金额"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>${this.props.inpay.apply_amount}</span><Icon type="swap" style={{fontSize:"14px",color:"#40a9ff"}}></Icon><span style={{fontSize:"18px",color:"#000"}}>¥{this.props.inpay.converted_amount}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="出金前余额"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>${this.props.inpay.before_balance}</span>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="出金后余额"
                    >
                        <span style={{fontSize:"18px",color:"#000"}}>${this.props.inpay.after_balance}</span>
                    </FormItem>
                </Form> 
                <p style={{textAlign:"center",fontSize:"14px"}}>您确定该笔出金复审通过吗？</p>   
            </Modal>
            
        )
    }
};
export default Form.create()(OutSecondCheckForm);
