import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Menu, Dropdown, Icon, Avatar } from 'antd';
import "./header.css"
const { Header } = Layout;

class JdbHeader extends Component {
    constructor(){
        super();
        this.state = {
            username: ""
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
    render() {
        const menu = (
            <Menu className="menu" onClick={this.onMenuClick}>
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
            </Header>
        );
    }

}
export default JdbHeader;