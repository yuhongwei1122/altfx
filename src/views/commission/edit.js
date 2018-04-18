import React, { PureComponent } from 'react';
import { Button, Table, Input, Row, Col, Card, Form, Spin, Divider, Icon } from 'antd';
import axios from 'axios';
import qs from 'qs';
import './edit.css';
const FormItem = Form.Item;

class editForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            unique_code: "",
            parent_code: "",
            data: [
                {
                    key:"1",
                    id: "1",
                    "name":"外汇返佣金额(USD)"
                },
                {
                    id: "2",
                    key:"2",
                    "name":"贵金属返佣金额(USD)"
                }
            ]
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.agent_code = this.state.unique_code;
            values.parent_code = this.state.parent_code;
            this.setState({loading: true});
            axios.post('/api/validate/change-agent-commission',qs.stringify(values)
            ).then((res) => {
                this.props.history.push("/commission/list");
            });
          }
        });
    };
    handleReset = (e) => {
        this.props.form.resetFields();
        e.preventDefault();
        this.props.history.push("/commission/list");
    };
    getCommission = () => {
        axios.post('/api/member/agent-commission-configuration',qs.stringify({
            unique_code: this.props.match.params.unique_code
        })).then((res) => {
            this.setState({loading: false});
            // console.log(res);
            const temp =[...this.state.data];
            res.data.result.map((item,index)=>{
                temp[0][item.commission_model] = item.commission;
                temp[1][item.commission_model.replace("-XAUUSD","")] = item.commission;
            });
            // console.log(temp);
            this.setState({
                data: temp
            });
        });
    };
    onChange = (value,key,index) =>{
        console.log(value + "---key=" + key + "---index="+index);
        const temp = [...this.state.data];
        temp[index][key] = value;
        this.setState({
            data: temp
        },()=>{
            console.log(this.state.data);
        });
    }

    componentDidMount(){
        this.setState({
            unique_code: this.props.match.params.unique_code || "",
            parent_code: this.props.match.params.parent_code || ""
        });
        this.getCommission();
    };
    
    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
        };
        const columns = [
            {
                title: '点差类型',
                key:"key",
                dataIndex: 'name'
            }, 
            {
                title: 'ECN1',
                key:"key1",
                dataIndex: 'ECN1',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN1', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN1-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }, 
            {
                title: 'ECN2',
                key:"key2",
                dataIndex: 'ECN2',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN2', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN2-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            },
            {
                title: 'ECN3',
                key:"key3",
                dataIndex: 'ECN3',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN3', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN3-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }, 
            {
                title: 'ECN4',
                key:"key4",
                dataIndex: 'ECN4',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN4', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN4-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            },
            {
                title: 'ECN5',
                key:"key5",
                dataIndex: 'ECN5',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN5', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN5-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }, 
            {
                title: 'ECN6',
                key:"key6",
                dataIndex: 'ECN6',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN6', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('ECN6-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            },
        ];
        const columns_stp = [
            {
                title: '点差类型',
                key:"key",
                dataIndex: 'name'
            }, 
            {
                title: 'STP',
                key:"key1",
                dataIndex: 'STP',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }, 
            {
                title: 'STP1',
                key:"key6",
                dataIndex: 'STP1',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP1', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP1-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            },
            {
                title: 'STP2',
                key:"key2",
                dataIndex: 'STP2',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP2', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP2-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            },
            {
                title: 'STP3',
                key:"key3",
                dataIndex: 'STP3',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP3', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP3-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }, 
            {
                title: 'STP4',
                key:"key4",
                dataIndex: 'STP4',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP4', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP4-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            },
            {
                title: 'STP5',
                key:"key5",
                dataIndex: 'STP5',
                render: (text,row,index) => {
                    if(Number(index) === 0){
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP5', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }else{
                        return(
                            <FormItem
                                {...formItemLayout}
                                >
                                {getFieldDecorator('STP5-XAUUSD', {
                                    initialValue: text,
                                    rules: [{
                                        required: true, message: '请输入!',
                                    }],
                                })(
                                    <Input placeholder="请输入"/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }
        ];
        const { getFieldDecorator } = this.props.form;

        return (
            <Spin spinning={this.state.loading}>
                <div className="commission_edit">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="上级代理ID" style={{ width: 300 }}>
                                {this.state.unique_code}
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="当前代理ID" style={{ width: 300 }}>
                                {this.state.parent_code}
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Form onSubmit={this.handleSubmit}>
                    <Table bordered dataSource={this.state.data} columns={columns} pagination={false}/>
                    <Table style={{marginTop:"20px"}} bordered dataSource={this.state.data} columns={columns_stp} pagination={false}/>    
                </Form>
                <Divider orientation="left">操作<Icon type="edit"></Icon></Divider>
                <div style={{marginTop:10,marginBottom:"20px",textAlign:"center"}}>
                    <Button onClick={this.handleReset} size="large" icon="left-circle-o">取消</Button>
                    <Button onClick={this.handleSubmit} icon="check-circle-o" style={{margin:"0px 15px"}} type="primary" size="large">确定设置</Button>
                </div>
            </Spin>
        );
    }
};
export default  Form.create()(editForm);