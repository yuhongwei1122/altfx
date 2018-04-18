import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import {message} from 'antd';
import './index.css';
import App from './components/content/content';
import Login from './views/login/login'
import registerServiceWorker from './registerServiceWorker';
import moment from 'moment';
import md5 from 'md5';
// 异步请求响应拦截器
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response);
    if(response.data.error && Number(response.data.error.returnCode) === 99){
        console.log("登陆失效");
        message.error(response.data.error.returnUserMessage);
        // window.location.href = "/";
    }else{
        if(Number(response.data.error.returnCode) === 0 || Number(response.data.error.returnCode) === 1 || Number(response.data.error.returnCode) === 2 || Number(response.data.error.returnCode) === 3 || Number(response.data.error.returnCode) === 4){
            return response.data;
        }else{
            console.log("错误");
            message.error(response.data.error.returnUserMessage);
            return response.data;
        }
    }
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
// 异步请求请求拦截器
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let userinfo = {};
    if(sessionStorage.getItem("altfx_user")){
        userinfo = JSON.parse(sessionStorage.getItem("altfx_user"));
    }
    console.log(config);
    let data = {};
    if(config.data!=undefined){
        let strs = config.data.split("&");
        for (var i = 0; i < strs.length; i++) {
            data[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
        // data = config.data;
    }
    if(userinfo['token']!== undefined && userinfo['token']!== '' && userinfo['token']!== null){
        data.token = userinfo['token'];
    }else{
        data.token = "";
    }
    if(config.method === 'post'){
        if(!data['account']){
            data['account'] = userinfo['account'] ? userinfo['account'] : "";
        }
    }
    data['ts'] = moment().unix();
    const keys = Object.keys(data).sort();
    console.log(keys);
    let sign = [];
    keys.forEach((key)=>{
        sign.push(data[key]);
    });
    sign.push("crm-front");
    // console.log(sign);
    console.log(sign.join("|"));
    sign = md5(sign.join("|"));
    // console.log(sign);
    data['sign'] = sign;
    // console.log(data);
    let keystr = [];
    Object.keys(data).forEach((key)=>{
        keystr.push(key + "=" + data[key]);
    });
    config.data = keystr.join("&");
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
}, function (error) {
    // Do something with request error
    console.log("报错");
    return Promise.reject(error);
});
ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" name="content" component={App}></Route>
        </Switch>
    </HashRouter>, 
    document.getElementById('root')
);
registerServiceWorker();
