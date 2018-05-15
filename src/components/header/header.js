import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Menu, Dropdown, Icon, Avatar, Modal, Notification} from 'antd';
import "./header.css"
import UpdatePasswordForm from './password'
const { Header } = Layout;

class JdbHeader extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            passwordVisabled: false
        };
    };
    componentDidMount(){
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        this.setState({
            username: info.account || "altfx"
        });
    };
    onMenuClick = () => {
        sessionStorage.setItem("altfx_user","");
        axios.post('/api/login/out').then((res) => {
            if(Number(res.error.returnCode) === 0){
                window.location.href = "/";
            }else{
                window.location.href = "/"
            }
        });
    };
    handleClick = (e) => {
        console.log('click ', e);
        if(e.key === 'forget'){
            this.forgetClick();
        }
        if(e.key === 'logout'){
            this.onMenuClick();
        }
    };
    forgetClick = () => {
        console.log("zheli");
        this.setState({
            passwordVisabled: true
        });
    };
    handleUpdateCancel = () => {
        this.setState({
            passwordVisabled: false
        });
    };
    handleUpdateOk = () => {
        this.setState({
            passwordVisabled: false
        });
        Notification.success({
            message: '成功',
            description: '密码修改成功，下次登录请使用新密码',
        });
    };
    render() {
        const menu = (
            <Menu className="menu" onClick={this.handleClick}>
                <Menu.Item key="forget">
                    <Icon type="edit"/>修改密码
                </Menu.Item>
                <Menu.Item key="logout">
                    <Icon type="logout" />退出登录
                </Menu.Item>
            </Menu>
        );
        return (
            <Header className="header" style={{height:'60px', lineHeight:'60px', background: '#fff', padding: 0 }} >
                <Icon
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />    
                <div className="right">    
                    <Dropdown overlay={menu}>
                        <span className="action account">
                        <Avatar size="small" className="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                        <span className="name">{this.state.username}</span>
                        </span>
                    </Dropdown>  
                </div>
                <Modal
                    visible={this.state.passwordVisabled}
                    title="修改密码"
                    confirmLoading={this.state.confirmLoading}
                    footer={null}
                    >
                    <div>
                        <UpdatePasswordForm handleUpdateCancel={this.handleUpdateCancel} handleUpdateOk={this.handleUpdateOk}/>
                    </div>
                </Modal>
            </Header>
        );
    }

}
export default JdbHeader;