import React, { Component } from 'react';
import { Table, Button, Tag, notification, Select } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import RejectModal from '../register/reject';
import SuccessModal from '../register/success';
const ButtonGroup = Button.Group;
const Option = Select.Option;

class SameAccountTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: [],
            pagination: {
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 10,
                defaultCurrent: 1,
                current: 1,
                showSizeChanger:true,
                pageSizeOptions:['10', '20', '30', '40', '50', '100']
            },
            rejectVisable: false,
            rejectId:"",
            successVisable: false
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        // console.log(params);
        axios.post('/api/user/mt4-list',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.result
            });
        });
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
    handleSearch = (value) => {
        // console.log(value);
        this.fetchData({page:1,status:value});
    };
    handleReject = (id) => {
        this.setState({
            rejectId: id,
            rejectVisable: true
        });
    };
    handleRejectOk = (params) => {
        if(params){
            axios.post('/api/user/mt4-audit',qs.stringify({
                login_id: this.state.rejectId,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                notification['error']({
                    message: '审核拒绝',
                    description: '审核拒绝及拒绝原因邮件已发送至该用户邮箱～',
                    duration: 2.5
                });
                this.setState({
                    rejectId:"",
                    rejectVisable: false
                });
            });
        }else{
            this.setState({
                rejectId:"",
                rejectVisable: false
            });
        }
    };
    handleSuccess = (id) => {
        this.setState({
            rejectId: id,
            successVisable: true
        });
    };
    handleSuccessOk = (params) =>{
        console.log(params);
        if(params){
            axios.post('/api/user/mt4-audit',qs.stringify({
                user_id: this.state.rejectId,
                ...params
            })).then((res) => {
                this.setState({
                    rejectId:"",
                    successVisable: false
                });
            });
        }else{
            this.setState({
                rejectId:"",
                successVisable: false
            });
        }
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'account',
                key: 'account',
                width:"120px"
            }, 
            {
                title: '用户ID',
                dataIndex: 'unique_code',
                key: 'unique_code',
                width:"120px"
            },
            {
                title: '申请时间',
                dataIndex: 'create_time',
                key: 'create_time',
                width:"110px"
            },
            {
                title: '姓名',
                dataIndex: 'username',
                key: 'username',
                width:"110px"
            }, 
            {
                title: 'MT4昵称',
                dataIndex: 'mt4_name',
                key: 'mt4_name',
                width:"100px"
            }, 
            {
                title: '交易类型',
                dataIndex: 'platform_type',
                key: 'platform_type',
                width:"80px"
            }, 
            {
                title: '点差类型',
                dataIndex: 'commission_model',
                key: 'commission_model',
                width:"100px"
            }, 
            {
                title: '杠杆',
                dataIndex: 'leverage',
                key: 'leverage',
                width:"100px",
                render: (text) => {
                    if(Number(text) === 1){
                        return "1:50";
                    }else if(Number(text) === 2){
                        return "1:100";
                    }else if(Number(text) === 3){
                        return "1:200";
                    }else{
                        return "1:400";
                    }
                }
            }, 
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:"100px",
                render: (text) => {
                    if(Number(text) === 1){
                        return <Tag color="#2db7f5">待审核</Tag>;
                    }else if(Number(text) === 2){
                        return <Tag color="#87d068">已通过</Tag>;
                    }else{
                        return <Tag color="#f50">未通过</Tag>;
                    }
                }
            }, 
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                width: "160px",
                fixed:"right",
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Button style={{lineHeight:0}} onClick={this.handleSuccess.bind(this,row.record_id)} disabled={Number(row.status) !== 1} title="审核" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} onClick={this.handleReject.bind(this,row.record_id)} disabled={Number(row.status) !== 1} title="驳回" type="danger" size="small" icon="close"></Button>
                    </ButtonGroup>
                )
            }
        ];
        return (
            <div className="overview">
                <div style={{marginBottom:"10px",overflow:"hidden"}}>
                    <label>审核状态：</label>  
                    <Select defaultValue="0" style={{ width: 120 }} onChange={this.handleSearch}>
                        <Option value="0">全部</Option>
                        <Option value="1">待审核</Option>
                        <Option value="2">审核通过</Option>
                        <Option value="3">审核拒绝</Option>
                    </Select>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.record_id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}
                        scroll={{ x: 1170,y: 240 }} />
                </div>
                <RejectModal modalTitle="拒绝" rejectVisable={this.state.rejectVisable} handleRejectOk={this.handleRejectOk}/>                
                <SuccessModal modalTitle="审核" successVisable={this.state.successVisable} handleSuccessOk={this.handleSuccessOk} type="1"/>                
            </div>
        );
    }
};
export default SameAccountTable;