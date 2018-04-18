import React, { Component } from 'react';
import { Table, Button, notification } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import SearchForm from './insearch';
import RejectModal from './inreject';
import FirstModal from './inFirstCheck';
import SecondModal from './inSecondCheck';
const ButtonGroup = Button.Group;

class PayinTable extends Component {
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
            cash_order: "",
            data:{
                apply_amount: "",
                converted_amount:"",
                before_balance: "",
                after_balance: ""
            },
            firstVisable: false,
            secondVisable: false
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        console.log(params);
        axios.post('/api/cash/all-record',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            cash_type:1,
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            this.setState({
                pagination: {
                    total : Number(res.data.result_count),
                    ...pager
                },
                tableData : res.data.result,
                total_volume:res.data.total_volume,
                total_commission:res.data.total_commission
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
    handleReject = (cash_order,apply_amount,converted_amount,before_balance,after_balance) => {
        this.setState({
            cash_order: cash_order,
            rejectVisable: true,
            data:{
                apply_amount: apply_amount,
                converted_amount: converted_amount,
                before_balance: before_balance,
                after_balance: after_balance
            }
        });
    };
    handleRejectOk = (params) => {
        if(params){
            axios.post('/api/cash/audit',qs.stringify({
                cash_order: this.state.cash_order,
                cash_type:1,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                notification['error']({
                    message: '拒绝',
                    description: '该笔入金拒绝及原因已发送至该用户邮箱～',
                    duration: 2.5
                });
                this.setState({
                    rejectVisable: false,
                    data:{
                        apply_amount: "",
                        converted_amount: "",
                        before_balance: "",
                        after_balance: ""
                    }
                });
                this.fetchData({page:1});
            });
        }else{
            this.setState({
                rejectVisable: false,
                data:{
                    apply_amount: "",
                    converted_amount: "",
                    before_balance: "",
                    after_balance: ""
                }
            });
        }
    };
    handleFirst = (cash_order,apply_amount,converted_amount,before_balance,after_balance) => {
        this.setState({
            cash_order: cash_order,
            firstVisable: true,
            data:{
                apply_amount: apply_amount,
                converted_amount: converted_amount,
                before_balance: before_balance,
                after_balance: after_balance
            }
        });
    };
    handleFirstOk = (params) => {
        if(params){
            axios.post('/api/cash/confirm',qs.stringify({
                cash_order: this.state.cash_order,
                cash_type:1,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                notification['success']({
                    message: '初审完成',
                    description: '请通知相关人员该笔入金初审已完成，请复审～',
                    duration: 2.5
                });
                this.setState({
                    firstVisable: false,
                    data:{
                        apply_amount: "",
                        converted_amount: "",
                        before_balance: "",
                        after_balance: ""
                    }
                });
                this.fetchData({page:1});
            });
        }else{
            this.setState({
                firstVisable: false,
                data:{
                    apply_amount: "",
                    converted_amount: "",
                    before_balance: "",
                    after_balance: ""
                }
            });
        }
    };
    handleSecond = (cash_order,apply_amount,converted_amount,before_balance,after_balance) => {
        this.setState({
            cash_order: cash_order,
            secondVisable: true,
            data:{
                apply_amount: apply_amount,
                converted_amount: converted_amount,
                before_balance: before_balance,
                after_balance: after_balance
            }
        });
    };
    handleSecondOk = (params) => {
        if(params){
            axios.post('/api/cash/audit',qs.stringify({
                cash_order: this.state.cash_order,
                cash_type:1,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                notification['success']({
                    message: '入金完成',
                    description: '入金成功通知邮件已发送至该用户邮箱～',
                    duration: 2.5
                });
                this.setState({
                    secondVisable: false,
                    data:{
                        apply_amount: "",
                        converted_amount: "",
                        before_balance: "",
                        after_balance: ""
                    }
                });
                this.fetchData({page:1});
            });
        }else{
            this.setState({
                secondVisable: false,
                data:{
                    apply_amount: "",
                    converted_amount: "",
                    before_balance: "",
                    after_balance: ""
                }
            });
        }
    };
    handleSearch = (params) => {
        this.fetchData({page:1,...params});
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:1});
    };
    render() {
        const columns = [
            {
                title: '流水号',
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
                title: '入金前余额($)',
                dataIndex: 'before_balance',
                key: 'before_balance',
                width:180
            },
            {
                title: '入金前余额($)',
                dataIndex: 'after_balance',
                key: 'after_balance',
                width:180
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
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !== 2} onClick={this.handleFirst.bind(this,row.cash_order,row.apply_amount,row.converted_amount,row.before_balance,row.after_balance)} title="初审" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !== 3} onClick={this.handleSecond.bind(this,row.cash_order,row.apply_amount,row.converted_amount,row.before_balance,row.after_balance)} title="复审" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) === 1 || Number(row.status) === 5 || Number(row.status) === 6 || Number(row.status) === 7 || Number(row.status) === 8} onClick={this.handleReject.bind(this,row.cash_order,row.apply_amount,row.converted_amount,row.before_balance,row.after_balance)} title="拒绝" type="primary" size="small" icon="close"></Button>
                    </ButtonGroup>);
                }
            } 
        ];
        return (
            <div className="report">
                <div style={{marginTop:10}}>
                    <SearchForm handleSearch={this.handleSearch}/>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}
                        scroll={{ x: 1370,y: 540 }} />
                </div>
                <RejectModal modalTitle="拒绝" rejectVisable={this.state.rejectVisable} handleRejectOk={this.handleRejectOk} inpay={this.state.data}/>
                <FirstModal modalTitle="初审" firstVisable={this.state.firstVisable} handleFirstOk={this.handleFirstOk} inpay={this.state.data}/>
                <SecondModal modalTitle="复审" secondVisable={this.state.secondVisable} handleSecondOk={this.handleSecondOk} inpay={this.state.data}/>
                
            </div>
        );
    }
};
export default PayinTable;