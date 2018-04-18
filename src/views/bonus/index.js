import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Modal, Tag, Card, Row, Col } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
const ButtonGroup = Button.Group;

class BonusTable extends Component {
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
            total_bonus: "",
            total_count: "",
            total_users: ""
        }
    };
    fetchTotal = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/bonus/summary',qs.stringify({
            login_unique_code: "",  //登录用户的ID
            ...params
        })).then((res) => {
            this.setState({
                total_bonus: res.data.total_bonus,
                total_users: res.data.total_users,
                total_count: res.data.total_count
            });
        });
    };
    fetchTable = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/bonus/detail',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            pager.total = Number(res.data.result_count);
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.result
            });
        });
    };
    fetchData = (params) => {
        console.log("一起执行了吗");
        axios.all([this.fetchTotal(params), this.fetchTable(params)])
        .then(axios.spread(function (acct, perms) {
            // Both requests are now complete
            console.log(perms);
            console.log(acct);
        }));
    };
    handleSearch = (params)=>{
        this.fetchData({
            page:1,
            ...params
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
    handleCanel = (bonus_order,agent_unique_code)=>{
        Modal.confirm({
            title: '取消发放',
            content: '您确认是要取消该奖金发放吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                axios.post('/api/bonus/cancel',qs.stringify({
                    bonus_order: bonus_order,
                    agent_unique_code: agent_unique_code
                })).then((res) => {
                    console.log("取消奖金发放成功---");
                });
            }
        });
    };
    handleConfirm = (row)=>{
        Modal.confirm({
            title: '确认发放',
            content: '您确认向 '+row.agent_account+' 账户发放'+row.bonus+'美元吗？一经确认将无法追回!',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                axios.post('/api/bonus/confirm',qs.stringify({
                    bonus_order: row.bonus_order,
                    agent_unique_code: row.agent_unique_code
                })).then((res) => {
                    console.log("奖金发放成功---");
                });
            }
        });
    };
    componentDidMount(){
        console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: 'CRM账户名',
                dataIndex: 'agent_account',
                key: 'agent_account',
                width:140
            },
            {
                title: '账户ID',
                key:"agent_unique_code",
                dataIndex: 'agent_unique_code',
                width:140
            },
            {
                title: '流水号',
                dataIndex: 'bonus_order',
                key: 'bonus_order',
                width:180
            },
            {
                title: '发放时间',
                dataIndex: 'bonus_time',
                key: 'bonus_time',
                width:140,
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '发放金额',
                dataIndex: 'bonus',
                key: 'bonus',
                width:140
            }, 
            {
                title: '发放状态',
                dataIndex: 'bonus_status',
                key: 'bonus_status',
                width:140,
                render: (text) => {
                    if(Number(text) === 0){
                        return <Tag color="red">待发放</Tag>
                    }else if(Number(text) === 1){
                        return <Tag color="blue">已发放</Tag>
                    }else{
                        return <Tag color="grey">已取消</Tag>
                    }
                }
            },
            {
                title: '发放人',
                dataIndex: 'operator',
                key: 'operator',
                width:140
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width:140
            },
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                width: 160,
                fixed:"right",
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Button style={{lineHeight:0}} onClick={this.handleConfirm.bind(this,row)} disabled={Number(row.bonus_status) !== 0} title="发放" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} onClick={this.handleCanel.bind(this,row.bonus_order,row.agent_unique_code)} disabled={Number(row.bonus_status) !== 0} title="取消" type="danger" size="small" icon="close"></Button>
                    </ButtonGroup>
                )
            }
        ];
        return (
            <div className="report">
                <div>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card title="累计发放金额" style={{ width: 300 }}>
                                {this.state.total_bonus}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="累计发放次数" style={{ width: 300 }}>
                                {this.state.total_count}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="累计发放人数" style={{ width: 300 }}>
                                {this.state.total_users}
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginBottom:"10px",overflow:"hidden"}}>
                    <Link to="/pay/add"><Button type="primary" style={{float:"right"}} icon="plus">新增奖金发放</Button></Link>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}
                        scroll={{ x: 1170,y: 240 }} />
                </div>
            </div>
        );
    }
};
export default BonusTable;