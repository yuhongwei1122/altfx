import React, { Component } from 'react';
import { Table, Button, notification } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DateFormate from '../../components/tool/DateFormatPan';
import OutSearchForm from './outsearch';
import OutRjectModal from './outreject';
import OutFirstModal from './outFirstCheck';
import OutSecondModal from './outSecondCheck';
import OutBankInfoModal from './outBankInfo';
const ButtonGroup = Button.Group;

class PayoutTable extends Component {
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
            secondVisable: false,
            bankvisable: false
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        axios.post('/api/cash/all-record',qs.stringify({
            size: this.state.pagination.pageSize,  //每页数据条数
            cash_type:2,
            ...params
        })).then((res) => {
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
    handleReject = (row) => {
        axios.post('/api/image/get-url',qs.stringify({
            account: row.account,
            type:5,
            bank_no: row.bank_no
        })).then((res) => {
            // return res.data.image_url || "";
            row.bank_img = res.data.image_url || "";
            this.setState({
                cash_order: row.cash_order,
                rejectVisable: true,
                data:{...row}
            });
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
                Notification['error']({
                    message: '拒绝',
                    description: '该笔出金拒绝及原因已发送至该用户邮箱～',
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
    handleFirst = (row) => {
        axios.post('/api/image/get-url',qs.stringify({
            account: row.account,
            type:5,
            bank_no: row.bank_no
        })).then((res) => {
            // return res.data.image_url || "";
            row.bank_img = res.data.image_url || "";
            this.setState({
                cash_order: row.cash_order,
                firstVisable: true,
                data:{...row}
            });
        });
    };
    handleFirstOk = (params) => {
        if(params){
            axios.post('/api/cash/audit',qs.stringify({
                cash_order: this.state.cash_order,
                cash_type:1,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                Notification['success']({
                    message: '初审完成',
                    description: '请通知相关人员该笔出金初审已完成，请复审～',
                    duration: 2.5
                });
                this.setState({
                    firstVisable: false,
                    data:{}
                });
                this.fetchData({page:1});
            });
        }else{
            this.setState({
                firstVisable: false,
                data:{}
            });
        }
    };
    handleSecond = (row) => {
        axios.post('/api/image/get-url',qs.stringify({
            account: row.account,
            type:5,
            bank_no: row.bank_no
        })).then((res) => {
            // return res.data.image_url || "";
            row.bank_img = res.data.image_url || "";
            this.setState({
                cash_order: row.cash_order,
                secondVisable: true,
                data:{...row}
            });
        });
    };
    handleSecondOk = (params) => {
        if(params){
            axios.post('/api/cash/confirm',qs.stringify({
                cash_order: this.state.cash_order,
                cash_type:1,
                result: 2,//拒绝的状态
                ...params
            })).then((res) => {
                notification['success']({
                    message: '入金完成',
                    description: '出金成功通知邮件已发送至该用户邮箱～',
                    duration: 2.5
                });
                this.setState({
                    secondVisable: false,
                    data:{}
                });
                this.fetchData({page:1});
            });
        }else{
            this.setState({
                secondVisable: false,
                data:{}
            });
        }
    };
    handleBank = (row) => {
        axios.post('/api/image/get-url',qs.stringify({
            account: row.account,
            type:5,
            bank_no: row.bank_no
        })).then((res) => {
            // return res.data.image_url || "";
            row.bank_img = res.data.image_url || "";
            this.setState({
                cash_order: row.cash_order,
                bankVisable: true,
                data:{...row}
            });
        });
    };
    handleBankOk = () => {
        this.setState({
            bankVisable: false,
            data:{}
        });
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
                title: '出金前余额($)',
                dataIndex: 'before_balance',
                key: 'before_balance',
                width:180
            },
            {
                title: '出金前余额($)',
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
                width:160,
                fixed:"right",
                render: (text,row,index) => {
                    return (<ButtonGroup> 
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !== 1} onClick={this.handleFirst.bind(this,row)} title="初审" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !==4} onClick={this.handleSecond.bind(this,row)} title="复审" type="primary" size="small" icon="check"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !== 1} onClick={this.handleReject.bind(this,row)} title="拒绝" type="primary" size="small" icon="close"></Button>
                        <Button style={{lineHeight:0}} disabled={Number(row.status) !== 1 && Number(row.status) !== 2 && Number(row.status) !== 3 && Number(row.status) !== 4} onClick={this.handleBank.bind(this,row)} title="银行信息" type="primary" size="small" icon="idcard"></Button>
                    </ButtonGroup>);
                }
            } 
        ];
        return (
            <div className="report">
                <div style={{marginTop:10}}>
                    <OutSearchForm handleSearch={this.handleSearch}/>
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
                <OutRjectModal modalTitle="拒绝" rejectVisable={this.state.rejectVisable} handleRejectOk={this.handleRejectOk} inpay={this.state.data}/>
                <OutFirstModal modalTitle="初审" firstVisable={this.state.firstVisable} handleFirstOk={this.handleFirstOk} inpay={this.state.data}/>
                <OutSecondModal modalTitle="复审" secondVisable={this.state.secondVisable} handleSecondOk={this.handleSecondOk} inpay={this.state.data}/>
                <OutBankInfoModal modalTitle="银行信息" bankVisable={this.state.bankVisable} handleBankOk={this.handleBankOk} inpay={this.state.data}/>
            </div>
        );
    }
};
export default PayoutTable;