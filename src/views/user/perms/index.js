import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import qs from 'qs';
import DeleteModel from '../../../components/tool/deleteCommonModel';
import DateFormate from '../../../components/tool/DateFormatPan';
import EditForm from './edit';
const ButtonGroup = Button.Group;

class PermsTable extends Component {
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
            deleteVisable: false,//删除开关
            delId: "",//删除id
            confirmLoading: false,//加载中开关
            detail: {},
            editTitle: "",
            editVisabled: false
        }
    };
    fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        // console.log(params);
        axios.post('/api/user/perms',qs.stringify({
            limit: this.state.pagination.pageSize,  //每页数据条数
            ...params
        })).then((res) => {
            let pager = { ...this.state.pagination };
            this.setState({
                pagination: {
                    total : res.data.pagination.amount,
                    ...pager
                },
                tableData : res.data.list
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
            page:this.state.pagination.current - 1
        });
    };
    //删除操作
    showDelModal = (id) => {
        // console.log("需要下线的id="+id);
        this.setState({
            delId: id,
            deleteVisable: true
        });
    };
    handleDelOk = () => {
        this.setState({
            confirmLoading: true
        });
        axios.post('/api/user/perms/delete',qs.stringify({
            id: this.state.delId
        })).then((res) => {
            this.setState({
                delId : '',
                deleteVisable: false,
                confirmLoading: false
            });
            this.fetchData({page:0});
        });
    };
    handelDelCancel = () => {
        this.setState({
            delId : '',
            deleteVisable: false,
            confirmLoading: false
        });
    };
    showEditModal = (item) => {
        console.log(item);
        this.setState({
            detail: Object.assign({},item),
            editVisabled: true,
            editTitle: item.id ? "编辑" : "新增"
        });
        
    };
    handleEditOk = () => {
        this.fetchData();
        this.setState({ 
            editVisabled: false
        });
    };
    handleEditCancel = () => {
        this.setState({
            detail: {},
            editVisabled: false
        });
    };
    componentDidMount(){
        // console.log("did mount 中当前的页："+this.state.pagination.current);
        this.fetchData({page:0});
    };
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: '权限名称',
                dataIndex: 'perm_name',
                key: 'perm_name',
            },
            
            {
                title: '描述',
                dataIndex: 'note',
                key: 'note',
            }, 
            {
                title: '创建时间',
                dataIndex: 'time_create',
                key: 'time_create',
                render:(text) => {
                    return <DateFormate date={text} format="yyyy-MM-dd hh:mm:ss"/>;
                }
            },
            {
                title: '操作',
                dataIndex: '', 
                key: 'x', 
                width: '160px',
                render: (text, row, index) => (
                    <ButtonGroup> 
                        <Button onClick={this.showEditModal.bind(this,row)} style={{lineHeight:0}} title="编辑" type="primary" size="small" icon="edit"></Button>
                        <Button onClick={this.showDelModal.bind(this,row.id)} style={{lineHeight:0}} title="删除" type="primary" size="small" icon="delete"></Button>
                    </ButtonGroup>
                )
            },
        ];
        return (
            <div className="overview">
                <div style={{marginBottom:"10px",overflow:"hidden"}}>
                    <Button type="primary" style={{float:"right"}} onClick={this.showEditModal.bind({})} icon="plus">新增</Button>
                </div>
                <div style={{marginTop:10}}>
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange} />
                </div>
                <DeleteModel visible={this.state.deleteVisable} id={this.state.delId} confirmLoading={this.state.confirmLoading} handleOk={this.handleDelOk} handleCancel={this.handelDelCancel}/>
                <Modal
                    visible={this.state.editVisabled}
                    title={this.state.editTitle}
                    onOk={this.handleEditOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleEditCancel}
                    footer={null}
                    >
                    <div style={{marginTop:30}}>
                        <EditForm handleEditCancel={this.handleEditCancel} handleEditOk={this.handleEditOk} editData={this.state.detail}/>
                    </div>
                </Modal>
            </div>
        );
    }
};
export default PermsTable;