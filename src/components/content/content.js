import React, { Component } from 'react';
import Loadable from 'react-loadable';
import {Route, Switch, Redirect} from 'react-router-dom';
import Async from 'react-code-splitting';
import { Layout, Spin } from 'antd';
import JdbHeader from '../header/header';
import JdbFooter from '../footer/footer'
import JdbSider from '../sider/sider';
import PrivateRoute from './privateRoute';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import routerList from './router';
import Auth from '../auth/auth';
import menuData from '../sider/_nav';
const { Content } = Layout;

const routers = routerList.filter(item => {
    return item.type !== 'Redirect'
})

let redirects = []
const getRedirect = (item) => {
    if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
            redirects.push({
                from: `${item.path}`,
                to: `${item.children[0].path}`,
            });
            item.children.forEach((children) => {
                getRedirect(children);
            });
        }
    }
};
menuData.forEach(getRedirect);
redirects.reverse(redirects);
console.log(redirects);
redirects = redirects.concat(routerList.filter(item => {
    return item.type === 'Redirect'
}));

const MyLoadingComponent = ({ isLoading, error }) => {
    // Handle the loading state
    if (isLoading) {
        return (
            <div className="loading-box">
                <Spin style={{margin: "0 auto"}} tip="亲，正在努力加载中，请稍后..."></Spin>;
            </div>
        );
    }
    // Handle the error state
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    else {
        return null;
    }
};

class JdbContent extends Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: false
        }
        console.log(this.props.location);
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout hasSider style={{minHeight:"100vh"}}>
                <JdbSider 
                    menuData={menuData}
                    collapsed={this.state.collapsed}
                    onCollapse={this.toggle}
                    location={this.props.location}
                    Authorized={Auth}
                />
                <Layout>
                    <JdbHeader 
                    collapsed={this.state.collapsed}
                    toggle={this.toggle}
                    />
                    <Breadcrumb menuData={menuData} location={this.props.location}  />
                    <Content style={{ margin: '10px 10px 0', padding:"10px 10px 0px", height: '100%' , background:"#fff" }}>
                        <Switch>
                            {routers.map(item => {
                                let props = {
                                    key: item.path,
                                    path: item.path,
                                    // component: (props)=> <Async componentProps={props} load={item.component()} />
                                    component: Loadable({
                                        loader: () => item.component(),
                                        loading: MyLoadingComponent
                                    })
                                }

                                if(item.private === false) {
                                    return <Route {...props} />
                                }

                                return <PrivateRoute {...props} />
                            })}
                            
                            {redirects.map(item => {
                                return <Redirect key={item.from} from={item.from} to={item.to} />
                            })}
                            <Redirect key="login" from="/" to="/login" />
                        </Switch>
                    </Content>
                    <JdbFooter/>
                </Layout>
            </Layout>
        );
    }
}

export default JdbContent;