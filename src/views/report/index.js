import React, { Component } from 'react';
import { Table, Card, Row, Col, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './search';
import './index.css'

class ReportTable extends Component {
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
            total_commission: "",
            total_volume: ""
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        // console.log(params);
        axios.post('/api/commission/order-detail',qs.stringify({
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
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: '账户ID',
                dataIndex: 'unique_code'
            },
            {
                title: 'MT4账号',
                dataIndex: 'mt4_login',
                key: 'mt4_login'
            },
            {
                title: '代理ID',
                dataIndex: 'agent_unique_code',
                key: 'agent_unique_code'
            },
            {
                title: '交易单号',
                dataIndex: 'trade_order',
                key: 'trade_order'
            },
            {
                title: '开仓时间',
                dataIndex: 'trade_open_time',
                key: 'trade_open_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '平仓时间',
                dataIndex: 'trade_close_time',
                key: 'trade_close_time',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '盈亏',
                dataIndex: 'trade_profit',
                key: 'trade_profit'
            }, 
            {
                title: '交易量',
                dataIndex: 'trade_volume',
                key: 'trade_volume'
            },
            {
                title: '佣金',
                dataIndex: 'commission_amount',
                key: 'commission_amount'
            } 
        ];
        return (
            <div className="report">
                <div>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="总成交量" style={{ width: 300 }}>
                                {this.state.total_volume}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="总佣金" style={{ width: 300 }}>
                                {this.state.total_commission}
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.trade_order}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
};
export default ReportTable;