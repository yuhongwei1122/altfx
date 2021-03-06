import React, { Component } from 'react';
import { Table, Button, Modal, Tag, Card, Row, Col, notification, message, Spin } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
const ButtonGroup = Button.Group;

class TransferTable extends Component {
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
        axios.post('/api/cash/all-record',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            cash_type:1,
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
                title: '序号',
                key:"cash_order",
                dataIndex: 'cash_order',
                width:200
            },
            {
                title: '用户名',
                dataIndex: 'account',
                key: 'account',
                width:130
            },
            {
                title: 'MT4账户名',
                dataIndex: 'mt4_login',
                key: 'mt4_login',
                width:160
            },
            {
                title: '金额($)',
                dataIndex: 'apply_amount',
                key: 'apply_amount',
                width:130
            },
            {
                title: '金额(¥)',
                dataIndex: 'converted_amount',
                key: 'converted_amount',
                width:140
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width:130,
                render: (text) => {
                    let temp = "--";
                    switch(Number(text)){
                        case 1:
                            temp = "待支付";
                            break;
                        case 2:
                            temp = "已支付";
                            break;
                        case 3:
                            temp = "财务确认";
                            break;
                        case 4:
                            temp = "客服确认";
                            break;
                        case 5:
                            temp = "已完成";
                            break;
                        case 6:
                            temp = "拒绝";
                            break;
                        case 7:
                            temp = "失败";
                            break;
                        case 8:
                            temp = "取消";
                            break;
                        default:
                            break;
                    }
                    return temp;
                }
            },
            {
                title: '申请时间',
                dataIndex: 'create_time',
                key: 'create_time',
                width:140,
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '初审人',
                dataIndex: 'first_auditor',
                key: 'first_auditor',
                width:140
            }, 
            {
                title: '复审人',
                dataIndex: 'second_auditor',
                key: 'second_auditor',
                width:140
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'x',
                width:130,
                fixed:"right",
                render: (text,row,index) => {
                    return (<ButtonGroup> 
                        <Button style={{lineHeight:0}} disabled={Number(row.status) != 2} title="初审" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) != 3} title="复审" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) != 1 && Number(row.status) != 5 && Number(row.status) != 6 && Number(row.status) != 7 && Number(row.status) != 8} title="拒绝" type="primary" size="small" icon="close"></Button>
                    </ButtonGroup>);
                }
            } 
        ];
        return (
            <Spin tip="Loading..." spinning={this.state.globalLoading}>            
            <div className="report">
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}
                        scroll={{ x: 1370,y: 540 }} />
                </div>
            </div>
            </Spin>
        );
    }
};
export default TransferTable;