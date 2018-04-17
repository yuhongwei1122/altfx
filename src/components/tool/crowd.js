import React, { Component } from 'react';
import { Radio, Upload, Button, Icon, Row, Col, Select, Table, Modal } from 'antd';
import axios from 'axios';
import TextPan from './textPan';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class Crowd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crowd: this.props.crowd || 'all',
            total: this.props.crowd || "all",
            fileList: [{
                uid: -1,
                name: 'xxx.png',
                status: 'done',
                url: 'http://www.baidu.com/xxx.png',
            }],
            crowdList: [],
            tableData: [],
            pagination: {
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 10,
                defaultCurrent: 1,
                current: 1
            },
            crowdVisable: false, //开关
        }
    };
    _handleChange = (e) => {
        // console.log('radio checked', e.target.value);
        this.setState({
            crowd: e.target.value 
        });
        if(e.target.value === 'accurate' && this.state.crowdList.length === 0){
            this._fetchCrowd();
        }
        if(e.target.value !== 'all'){
            this.setState({
                total: "--"
            });
        }else{
            this.setState({
                total: "all"
            });
        }
    };
    _handleFileChange = (info) => {
        let fileList = info.fileList;

        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);
    
        // 2. read from response and show file link
        fileList = fileList.map((file) => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });
    
        // 3. filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
          if (file.response) {
            return file.response.status === 'success';
          }
          return true;
        });
    
        this.setState({ fileList });
    };
    _fetchCrowd = () => {
        axios.get('/platform/crowd/get-all-crowd',{
            params:{
                
            }
        }).then((res) => {
            console.log(res.data.list);
            this.setState({
                crowdList: res.data.list
            });
        });
    };
    _handleSelectChange = (value,option) =>{
        this.setState({
            crowdId: value + "",
            ruleName: option.props.children,
            total: option.props['date-scalar']
        });
    };
    //列表接口
    _fetchData = (params = {}) => {
        // console.log("fetchData中page=："+this.state.pagination.current);
        // console.log(params);
        axios.get('/platform/crowd/get-all-crowd',{
            params: {
				limit: this.state.pagination.pageSize,  //每页数据条数
                ...params
            }
        }).then((res) => {
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
    _handleCrowdOk = () => {
        this.setState({
            crowdVisable: false
        });
        // console.log(this.state.crowdId);
    };
    _handleCrowdCancel = () => {
        if(!this.state.crowdVisable){
            this._fetchData();
        }
        this.setState({
            crowdVisable: !this.state.crowdVisable
        });
    };
    render() {
        const props = {
            action: '//jsonplaceholder.typicode.com/posts/',
            onChange: this._handleFileChange,
            multiple: false,
        };
        const columns = [
            {
                title: '人群名称',
                dataIndex: 'rule_name',
                key: 'rule_name',
            }, 
            {
                title: '标签数量',
                dataIndex: 'tags',
                key: 'tags',
                render: (text) => {
                    return <TextPan text={text} width={220}></TextPan>
                }
            },
            {
                title: '圈定人群',
                dataIndex: 'scalar',
                key: 'scalar'
            }, 
            {
                title: '创建时间',
                dataIndex: 'time_created',
                key: 'time_created'
            }
        ];
        // 弹窗列表选择
        const rowSelection = {
            type: "radio",
            selectedRowKeys: this.state.crowdId,
            onChange: (selectedRowKeys, selectedRows) => {
                if(selectedRowKeys.length > 0){
                    this.setState({
                        crowdId: selectedRowKeys[0],
                        ruleName: selectedRows[0].rule_name,
                        total: selectedRows[0].scalar
                    });
                }
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                id: record.id,
            }),
        };
        const {crowdId} = this.state;
        return (
            <div>
                <RadioGroup onChange={this._handleChange} defaultValue={this.state.crowd}>
                    <Radio value="all">所有用户</Radio>
                    <Radio value="accurate">精准运营用户</Radio>
                    <Radio value="import">手动导入</Radio>
                </RadioGroup>
                {this.state.crowd === 'accurate' ? 
                    <div>
                        <Select
                            showSearch
                            value={crowdId}
                            style={{ width: 350 }}
                            placeholder="请选择人群，支持关键字搜索"
                            optionFilterProp="children"
                            onChange={this._handleSelectChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                        {this.state.crowdList.map(d => <Option key={d.id} value={d.id} date-scalar={d.scalar}>{d.rule_name}</Option>)}
                        </Select>
                        <Button type="primary" onClick={this._handleCrowdCancel} style={{marginLeft:10}}>人群列表</Button>
                    </div> : null}
                {this.state.crowd === 'import' ? 
                    <Row>
                        <Col xs={2} sm={4} md={4} lg={6} xl={6}>
                            <Upload {...props} fileList={this.state.fileList}>
                                <Button>
                                <Icon type="upload" /> 上传文件
                                </Button>
                            </Upload>
                        </Col>
                        <Col><a href="javascript:void(0);">下载模版</a></Col>
                    </Row> : null}
                <div>共计{this.state.total}人</div>
                <Modal
                    visible={this.state.crowdVisable}
                    title="营销人群列表"
                    width="680px"
                    onOk={this._handleCrowdOk}
                    onCancel={this._handleCrowdCancel}
                    footer={[
                        <Button key="cancel" onClick={this._handleCrowdCancel}>关闭</Button>,
                        <Button key="submit" type="primary" onClick={this._handleCrowdOk}>确定</Button>
                    ]}
                    >
                    <Table 
                        rowKey={record => record.id}
                        columns={columns} 
                        rowSelection={rowSelection}
                        dataSource={this.state.tableData} 
                        pagination={this.state.pagination} 
                        onChange={this.handleChange}/>
                </Modal>
            </div>
        )
    }
};