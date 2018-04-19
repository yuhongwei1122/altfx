import React, { Component } from 'react';
import { Table, Button, message, Spin } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';

class GroupCrmTable extends Component {
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
            }
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
        axios.post('/api/trgroup/record',qs.stringify({
            type: 2,
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
                    tableData : res.data.result,
                    total_volume:res.data.total_volume,
                    total_commission:res.data.total_commission
                });
            }else{
                message.error(res.error.returnUserMessage);
            }
        });
    };
    handleSearch = (params)=>{
        this.fetchData({
            page:1,
            ...params
        });
    }
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
                title: '被转组代理ID',
                dataIndex: 'from_unique_code',
                key: 'from_unique_code'
            },
            {
                title: '转组前上级ID',
                dataIndex: 'parent_unique_code',
                key: 'parent_unique_code'
            },
            {
                title: '转组后上级ID',
                dataIndex: 'to_unique_code',
                key: 'to_unique_code'
            },
            {
                title: '余额',
                dataIndex: 'balance',
                key: 'balance'
            },
            {
                title: '转组时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => {
                    if(Number(text) === 0){
                        return "初始";
                    }else if(Number(text) === 1){
                        return "成功";
                    }else{
                        return "失败";
                    }
                }
            },
            {
                title: '操作人',
                dataIndex: 'operator',
                key: 'operator'
            } 
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>            
            <div className="report">
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch} labelText="被转组代理ID"/>
                </div>
                <div style={{marginTop:10}}>
                    <Link to={{pathname:"/group/change/2"}}><Button type="primary">新增转组</Button></Link>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>
            </div>
            </Spin>
        );
    }
};
export default GroupCrmTable;