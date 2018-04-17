import React, { Component } from 'react';
import { Button, Modal, Input, Row, Col, Alert } from 'antd';

export default class OnlineProitityModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: this.props.msg || "您确认上线此记录吗？",
            title: this.props.title || "上线",
            isProitity: this.props.isProitity || false,
            proitity: "",
            max:this.props.maxValue || 100,
            error: false,
            errormsg: "",
            value: ""
        }
    };
    checkValid = (event) => {
        console.log(event.target.value);
        if(event.target.value > 0 && event.target.value < this.state.max){
            this.setState({proitity: event.target.value});
            this.setState({
                value: event.target.value,
                error: false,
                errormsg: "请输入0～"+this.state.max + "内的数字"
            });
        }else{
            this.setState({
                error: true,
                errormsg: "请输入0～"+this.state.max + "内的数字"
            });
        }
    };
    handleOk = () =>{
        this.props.handleOk(this.state.value);
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                title={this.state.title}
                onOk={this.handleOk}
                confirmLoading={this.props.confirmLoading}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.props.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>
                ]}
                >
                <p style={{textAlign:"center"}}>{this.state.msg}</p>
                <div style={this.state.isProitity ? {display:"block"} : {display: "none"}}>
                    <Row type="flex" justify="center" align="middle">
                        <Col xs={{ span: 3, offset: 1 }} sm={{ span: 3, offset: 1 }}>优先级:</Col>
                        <Col xs={{ span: 18, offset: 0 }} sm={{ span: 18, offset: 0 }}>
                            <Input type="number" size="large" onKeyUp={this.checkValid}/>
                        </Col>
                    </Row> 
                    <Row type="flex" justify="center" align="middle">
                        <Col xs={{ span: 3, offset: 1 }} sm={{ span: 3, offset: 1 }}></Col>
                        <Col xs={{ span: 18, offset: 0 }} sm={{ span: 18, offset: 0 }}>
                            {this.state.error ? <Alert message={this.state.errormsg} type="error" showIcon/> : ""}
                        </Col>
                    </Row> 
                </div>
            </Modal>
        );
    }
}