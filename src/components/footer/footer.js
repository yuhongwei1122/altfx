import React, { Component } from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;

class JdbFooter extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>
                ©2018 ALT-FX LIMITED ALL RIGHTS RESERVED
            </Footer>
        );
    }
};
export default JdbFooter;