import React, { Component } from 'react';
import { Button, Modal } from 'antd';

export default class DeleteModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: this.props.msg || "您确认删除此记录吗？",
            title: this.props.title || "删除"
        }
    };
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
                    <Button key="submit" type="primary" onClick={this.props.handleOk}>确认</Button>
                ]}
                >
                <p>{this.state.msg}</p>
            </Modal>
        );
    }
}