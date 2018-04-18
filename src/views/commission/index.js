import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Tag, Row, Col,message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
const Search = Input.Search;

class CommissionTable extends Component {
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
            }
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        axios.post('/api/member/all-agent',qs.stringify({
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
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: '账户ID',
                dataIndex: 'unique_code',
                key: 'unique_code'
            },
            {
                title: 'CRM账户名',
                dataIndex: 'account',
                key: 'account'
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '上级代理ID',
                dataIndex: 'parent_code',
                key: 'parent_code'
            }, 
            {
                title: '注册时间',
                dataIndex: 'regist_date',
                key: 'regist_date',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                render: (text, row, index) => (
                    <Link to={{pathname:'/commission/edit/'+row.unique_code+'/'+row.parent_code}}><Button style={{lineHeight:0}} title="设置" type={Number(row.has_set_commission)===1?"primary":"danger"} size="small" icon="edit">设置反佣</Button></Link>
                )
            }
        ];
        return (
            <div className="quoted">
                <div style={{width:"300px"}}>
                    <Search placeholder="请输入要搜索的账户ID" enterButton="搜索" onSearch={value => {this.fetchData({page:1,unique_code:value})}}/>
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
        );
    }
};
export default CommissionTable;