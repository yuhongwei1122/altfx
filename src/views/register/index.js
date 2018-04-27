import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, notification, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
const ButtonGroup = Button.Group;

class RegisterTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            globalLoading: false,
            tableData: [],
            pagination: {
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 10,
                defaultCurrent: 1,
                current: 1,
                showSizeChanger:true,
                pageSizeOptions:['10', '20', '30', '40', '50', '100']
            },
            sendMailText:"您确认重新给用户发送激活邮件吗？"
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading,
        });
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        // console.log(params);
        axios.post('/api/register/list',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                let pager = { ...this.state.pagination };
                pager.total = Number(res.data.result_count);
                this.setState({
                    pagination: {
                        total : Number(res.data.result_count),
                        ...pager
                    },
                    tableData : res.data.result
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    handleSearch = (params) => {
        this.fetchData({page:1,...params});
    };
    handleChange = (pagination, filters, sorter) => {
        // console.log(filters);
        // const type = {type: filters['type'].join("") || ''};
        
        this.setState({
            pagination : Object.assign(this.state.pagination, pagination)
        });
        this.fetchData({
            page:this.state.pagination.current
        });
    };
    //重新发送邮件
    handleSendMail = (id) => {
        Modal.confirm({
            title: '发送邮件',
            content: "您确认重新给用户发送激活邮件？",
            okText: '确认',
            cancelText: '取消',
            onOk() {
                console.log("点击了确认。。。开始处理发送");
                axios.post('/api/register/send',qs.stringify({
                    user_id: id
                })).then((res) => {
                    
                    return new Promise((resolve, reject) => {
                        setTimeout(resolve,1000);
                        notification['success']({
                            message: '发送成功',
                            description: '已经成功给该用户发送了激活邮件～',
                            duration: 2.5
                        });
                    }).catch(() => console.log('Oops errors!'));
                });
                
            }
        });
    };
    componentWillMount(){
        this.toggleLoading();
        this.fetchData({page:1});
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'account',
                key: 'account',
                fixed:"left",
            },
            {
                title: '申请时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '联系电话',
                dataIndex: 'phone',
                key: 'phone',
                width: 130,
                render: (text,row) => {
                    if(row.status=== 4 || row.status === 3){
                        return "****";
                    }else{
                        return text;
                    }
                }
            }, 
            {
                title: '邮箱',
                dataIndex: 'mail',
                key: 'mail',
                width: 130
            }, 
            {
                title: '注册类型',
                dataIndex: 'account_type',
                key: 'account_type',
                width: 100,
                render: (text) => {
                    if(Number(text) === 1){
                        return "普通用户";
                    }else if(Number(text) === 2){
                        return "代理商";
                    }else{
                        return "模拟账户";
                    }
                }
            }, 
            {
                title: '账户ID',
                dataIndex: 'unique_code',
                key: 'unique_code',
                width: 90,
                render: (text,row) => {
                    if(Number(row.status) === 3){
                        return text;
                    }else{
                        return "--"
                    }
                }
            }, 
            {
                title: '姓名',
                dataIndex: 'username',
                key: 'username',
                width: 100,
            }, 
            {
                title: '上级代理ID',
                dataIndex: 'invite_code',
                key: 'invite_code',
                width: 120,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text) => {
                    if(Number(text) === 2){
                        return <Tag color="#2db7f5">待审核</Tag>;
                    }else if(Number(text) === 3){
                        return <Tag color="#87d068">已通过</Tag>;
                    }else if(Number(text) === 4){
                        return <Tag color="#f50">未通过</Tag>;
                    }else{
                        return "--"
                    }
                }
            }, 
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                width: 160,
                fixed:"right",
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Link to={{pathname:"/register/detail/"+row.id}}><Button style={{lineHeight:0}} disabled={Number(row.status) !== 2} title="审核" type="primary" size="small" icon="edit"></Button></Link>
                        <Link to={{pathname:"/register/detail/"+row.id}}><Button style={{lineHeight:0}} title="详情" type="primary" size="small" icon="eye"></Button></Link>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !== 1} onClick={this.handleSendMail.bind(this,row.id)} title="重新发送验证邮件" type="primary" size="small" icon="reload"></Button>
                    </ButtonGroup>
                )
            }
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>            
            <div className="overview">
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}
                        scroll={{ x: 1000}} />
                </div>
            </div>
            </Spin>
        );
    }
};
export default RegisterTable;