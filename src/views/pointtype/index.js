import React, { Component } from 'react';
import { Table, Button, Modal, notification, Select } from 'antd';
import axios from 'axios';
import RejectModal from '../register/reject'
const ButtonGroup = Button.Group;
const Option = Select.Option;

class PointTypeTable extends Component {
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
            confirmLoading: false,
            editVisable:false,
            checkMT4: "",
            checkType: ""
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/member/ucmr-list',{
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        }).then((res) => {
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
        console.log(value);
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
            axios.post('/api/validate/change-commission-model',{
                record_id: this.state.rejectId,
                status: 2,//拒绝的状态
                ...params
            }).then((res) => {
                notification['error']({
                    message: '审核拒绝',
                    description: '修改拒绝及拒绝原因邮件已发送至该用户邮箱～',
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
    handleEdit = (id,checkMT4,checkType) => {
        this.setState({
            checkMT4: checkMT4,
            checkType: checkType,
            rejectId: id,
            editVisable: true
        });
    };
    handleEditOk = () => {
        this.setState({confirmLoading:true});
        axios.post('/api/validate/change-commission-model',{
            record_id: this.state.rejectId,
            status: 1,//拒绝的状态
        }).then((res) => {
            notification['success']({
                message: '审核通过',
                description: '修改成功邮件已发送至该用户邮箱～',
                duration: 2.5
            });
            this.setState({
                checkMT4: "",
                checkType: "",
                rejectId: "",
                editVisable: false,
                confirmLoading:false
            });
        });
    };
    haneEditCancel= () => {
        this.setState({
            checkMT4: "",
            checkType: "",
            rejectId: "",
            editVisable: false,
            confirmLoading:false
        });
    };
    componentDidMount(){
        console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: '用户名',
                dataIndex: 'customer_name',
                key: 'customer_name',
                width:"120px"
            }, 
            {
                title: 'MT4账号',
                dataIndex: 'mt4_login',
                key: 'mt4_login',
                width:"120px"
            },
            {
                title: '申请时间',
                dataIndex: 'apply_time',
                key: 'apply_time',
                width:"110px"
            },
            {
                title: '电子邮箱',
                dataIndex: 'user_email',
                key: 'user_email',
                width:"140px"
            }, 
            {
                title: '申请修改类型',
                dataIndex: 'apply_commission_model',
                key: 'apply_commission_model',
                width:"80px"
            }, 
            {
                title: '原点差类型',
                dataIndex: 'legacy_commission_model',
                key: 'legacy_commission_model',
                width:"80px"
            }, 
            {
                title: '代理商',
                dataIndex: 'agent_name',
                key: 'agent_name',
                width:"100px"
            }, 
            {
                title: '代理商ID',
                dataIndex: 'agent_id',
                key: 'agent_id',
                width:"100px"
            }, 
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:"100px"
            }, 
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                width: 160,
                fixed:"right",
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Button style={{lineHeight:0}} onClick={this.handleEdit.bind(this,row.record_id,row.mt4_login,row.apply_commission_model)} disabled={row.status !== "待审核"} title="审核" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} onClick={this.handleReject.bind(this,row.record_id)} disabled={row.status !== "待审核"} title="驳回" type="danger" size="small" icon="close"></Button>
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
                        <Option value="3">审核通过</Option>
                        <Option value="4">审核拒绝</Option>
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
                <Modal
                    visible={this.state.editVisable}
                    title="审核"
                    onOk={this.handleEditOk}
                    onCancel={this.haneEditCancel}
                    confirmLoading={this.state.confirmLoading}
                    okText="确认"
                    cancelText="取消"
                    >
                    <p>您是否确定已经将MT4账户{this.state.checkMT4}的账户类型修改为{this.state.checkType}？</p>
                </Modal>
            </div>
        );
    }
};
export default PointTypeTable;