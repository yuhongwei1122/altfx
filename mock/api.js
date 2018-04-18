const express  = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.post('/api/login/login',(req, res) => {
    res.send(require('./data/login.json'));
});
app.post('/api/login/out',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//公共部分
app.post('/api/image/get-url',(req, res) => {
    res.send(require('./data/common/imgurl.json'));
});
//获取登录用户权限
app.post('/api/user/perms',(req, res) => {
    res.send(require('./data/common/perms.json'));
});
//-----角色管理-----
app.get('/api/user/role',(req, res) => {
    res.send(require('./data/user/role.json'));
});
app.post('/api/user/role/delete',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/role/add',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/role/update',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//-----权限管理-----
app.get('/api/user/perms',(req, res) => {
    res.send(require('./data/user/perms.json'));
});
app.post('/api/user/perms/delete',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/perms/add',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/perms/update',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//-----用户管理-----
app.get('/api/user/list',(req, res) => {
    res.send(require('./data/user/user.json'));
});
app.post('/api/user/delete',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/add',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/user/update',(req, res) => {
    res.send(require('./data/common/ok.json'));
});

//注册审核
app.post('/api/register/list',(req, res) => {
    res.send(require('./data/register/list.json'));
});
app.post('/api/register/user-detail',(req, res) => {
    res.send(require('./data/register/detail.json'));
});
app.post('/api/register/audit',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//重新发送激活邮件
app.post('/api/register/send',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//汇率设置
app.post('/api/cash/rate-record',(req, res) => {
    res.send(require('./data/quoted/list.json'));
});
app.post('/api/cash/rate-query',(req, res) => {
    res.send(require('./data/quoted/rate.json'));
});
//反佣设置
app.post('/api/member/all-agent',(req, res) => {
    res.send(require('./data/commission/list.json'));
});
app.post('/api/member/agent-commission-configuration',(req, res) => {
    res.send(require('./data/commission/detail.json'));
});
app.post('/api/validate/change-agent-commission', (req, res) => {
    res.send(require('./data/common/ok.json'));
});
//返佣报告
app.post('/api/commission/order-detail',(req, res) => {
    res.send(require('./data/report/list.json'));
});
//点差类型审核
app.post('/api/member/ucmr-list',(req, res) => {
    res.send(require('./data/pointtype/list.json'));
});
app.post('/api/validate/change-commission-model', (req, res) => {
    res.send(require('./data/common/ok.json'));
});
//同名账户审核
app.post('/api/user/mt4-list',(req, res) => {
    res.send(require('./data/same/list.json'));
});
app.post('/api/user/mt4-audit',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//入金/出金审核  cash_type:1|2  1:入金  2:出金
app.post('/api/cash/all-record',(req, res) => {
    res.send(require('./data/pay/payin.json'));
});
//入金拒绝
app.post('/api/cash/audit',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/cash/confirm',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
//奖金发放历史
app.post('/api/bonus/detail',(req, res) => {
    res.send(require('./data/bonus/list.json'));
});
app.post('/api/bonus/summary',(req, res) => {
    res.send(require('./data/bonus/summary.json'));
});
app.post('/api/bonus/agent-list',(req, res) => {
    res.send(require('./data/bonus/agentList.json'));
});
app.post('/api/bonus/create',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/bonus/cancel',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.post('/api/bonus/confirm',(req, res) => {
    res.send(require('./data/common/ok.json'));
});
app.listen(port, () => {console.log(`Lisening mockServer on port ${port}`)});

