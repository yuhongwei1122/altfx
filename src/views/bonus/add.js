import React, { Component } from 'react';
import { Table, Button, Input, message, Spin} from 'antd';
import axios from 'axios';
import qs from 'qs';
import AddForm from './addForm';
const Search = Input.Search;

class AddBounsTable extends Component {
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
            addVisable: false,
            bonus:{}
        }
    };
    toggleLoading = () => {
        this.setState({
            globalLoading: !this.state.globalLoading,
        });
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/bonus/agent-list',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                let pager = { ...this.state.pagination };
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
    handleEdit = (row) => {
        this.setState({
            addVisable: true,
            bonus: {...row}
        });
    };
    handleEditOk = (params) => {
        this.setState({
            addVisable: false,
            bonus: {}
        });
        this.fetchData({page:1});
    };
    handleEditCancel = () => {
        this.setState({
            addVisable: false,
            bonus: {}
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
                title: 'CRM账户名',
                dataIndex: 'agent_account',
                key: 'agent_account'
            },
            {
                title: '账户ID',
                dataIndex: 'agent_unique_code',
                key: 'agent_unique_code'
            },
            {
                title: '姓名',
                dataIndex: 'agent_name',
                key: 'agent_name'
            },
            {
                title: '联系电话',
                dataIndex: 'agent_phone',
                key: 'agent_phone'
            }, 
            {
                title: '邮箱',
                dataIndex: 'agent_email',
                key: 'agent_email'
            }, 
            {
                title: '累计发放金额',
                dataIndex: 'total_bonus',
                key: 'total_bonus'
            },
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                render: (text, row, index) => (
                    <Button style={{lineHeight:0}} onClick={this.handleEdit.bind(this,row)} title="设置" type="primary" size="small" icon="edit">发放</Button>
                )
            }
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>            
            <div className="quoted">
                <div style={{width:"300px"}}>
                    <Search placeholder="请输入要搜索的代理账户ID" enterButton="搜索" onSearch={value => {this.fetchData({page:1,agent_unique_code:value})}}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.agent_unique_code}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>
                <AddForm addVisable={this.state.addVisable} handleEditOk={this.handleEditOk} handleEditCancel={this.handleEditCancel} bonus={this.state.bonus}/>
            </div>
            </Spin>
        );
    }
};
export default AddBounsTable;