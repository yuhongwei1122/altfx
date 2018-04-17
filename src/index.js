import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import './index.css';
import App from './components/content/content';
import Login from './views/login/login'
import registerServiceWorker from './registerServiceWorker';
// 异步请求响应拦截器
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response);
    if(response.data.error && Number(response.data.error.returnCode) === 5002){
        console.log("登陆失效");
        window.location.href = response.data.data.loginRedirectUrl;
    }else{
        if(Number(response.data.error.returnCode) === 0 || Number(response.data.error.returnCode) === 1){
            return response.data;
        }else{
            console.log("错误");
            return response.data;
        }
    }
}, function (error) {
    // Do something with response error
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
