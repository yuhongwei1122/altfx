import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Modal, Card, Divider } from 'antd';
const FormItem = Form.Item;

class OutBankInfoForm extends Component{
    constructor(props){
        super(props);
    };
    handleCancel = () => {
        this.props.handleBankOk();
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
                visible={this.props.bankVisable}
                footer={null}
                >
                <Form
                    className="ant-advanced-search-form"
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
                <Divider/>
                <div style={{marginTop:10,marginBottom:"20px",textAlign:"center"}}>
                    <Button onClick={this.handleCancel} size="large" icon="left-circle-o">关闭</Button>
                </div>
            </Modal>
            
        )
    }
};
export default Form.create()(OutBankInfoForm);
