import React, { Component } from 'react';
import { Table, Button, Tag, Card, Row, Col, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import EditForm from './edit';
import './index.css'

class QuotedTable extends Component {
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
            inRate: "",
            outRate: "",
            editVisable: false
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
        axios.post('/api/cash/rate-record',qs.stringify({
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
    getInRate = () => {
        axios.post('/api/cash/rate-query',qs.stringify({
            rate_type: 1
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    inRate : res.data.rate.rate
                });
            }
        });
    };
    getOutRate = () => {
        axios.post('/api/cash/rate-query',qs.stringify({
            rate_type: 2
        })).then((res) => {
            if(Number(res.error.returnCode) === 0){
                this.setState({
                    outRate : res.data.rate.rate
                });
            }
        });
    };
    initCurrentRate = () => {
        console.log("执行了吗");
        axios.all([this.getOutRate(), this.getInRate()])
        .then(axios.spread(function (acct, perms) {
            // Both requests are now complete
            console.log(perms);
            console.log(acct);
        }));
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
    handleEdit = () => {
        this.setState({
            editVisable: true
        });
    };
    handleEditCancel = () => {
        this.setState({
            editVisable: false
        });
    };
    handleEditOk = () => {
        this.setState({
            editVisable: false
        });
        this.fetchData({page:1});
        this.getOutRate();
        this.getInRate();
    };
    componentWillMount(){
        this.toggleLoading();
        this.getOutRate();
        this.getInRate();
        this.fetchData({page:1});
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.toggleLoading();
    };
    render() {
        const columns = [
            {
                title: '货币名称',
                dataIndex: 'id',
                key: 'id',
                render: (text)=>{
                    return "USD"
                }
            },
            {
                title: '交易单位',
                dataIndex: 'id',
                key: 'y',
                render: (text)=>{
                    return "$(美元)"
                }
            },
            {
                title: '现汇买入价',
                dataIndex: 'rate',
                key: 'rate'
            },
            {
                title: '类型',
                dataIndex: 'rate_type',
                key: 'rate_type',
                render: (text) => {
                    if(Number(text) === 1){
                        return <Tag color="#f50">入金</Tag>;
                    }else{
                        return <Tag color="#2db7f5">出金</Tag>;
                    }
                }
            },
            {
                title: '操作人',
                dataIndex: 'account',
                key: 'account'
            }, 
            {
                title: '添加时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            }
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>
            <div className="quoted">
                <div>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="入金外汇牌价" style={{ width: 300 }}>
                                $1=¥{this.state.inRate}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="出金外汇牌价" style={{ width: 300 }}>
                                $1=¥{this.state.outRate}
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div style={{marginBottom:"10px",overflow:"hidden"}}>
                    <Button onClick={this.handleEdit.bind(this)} type="primary" style={{float:"right"}} icon="plus">新增牌价</Button>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>
                <EditForm editVisable={this.state.editVisable} handleEditOk={this.handleEditOk} handleEditCancel={this.handleEditCancel}/>
            </div>
            </Spin>
        );
    }
};
export default QuotedTable;