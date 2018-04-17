import React, { Component } from 'react';
import { Button, Input, Form, Spin, Checkbox } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class editForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            permList:[],
            checkedList: this.props.editData["perms"] || [],
            indeterminate: true,
            checkAll: false,
            allCheck: []
        }
        console.log(this.state.checkedList);
    };
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            values.perms = this.state.checkedList.length>0?this.state.checkedList:this.props.editData.perms;
            this.setState({loading: true});
            if(this.props.editData.id){
                values.id = this.props.editData.id;
                axios.post('/platform/user/role/update',values
                ).then((res) => {
                    this.setState({loading: false,checkedList:[]});
                    this.props.handleEditOk();
                });
            }else{
                axios.post('/platform/user/role/add',values
                ).then((res) => {
                    this.setState({loading: false,checkedList:[]});
                    this.props.handleEditOk();
                });
            }
          }
        });
    };
    onChange = (checkedList) => {
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < this.state.permList.length),
          checkAll: checkedList.length === this.state.permList.length,
        });
    };
    onCheckAllChange = (e) => {
        this.setState({
          checkedList: e.target.checked ? this.state.allCheck : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
    };
    componentDidMount(){
        axios.get('/platform/user/perms',{
            params:{
                limit: 20
            }
        })
        .then((res) => {
            let list = [];
            let allCheck = [];
            if(res.data.list.length > 0){
                res.data.list.forEach((item)=>{
                    list.push({"label":item.perm_name,"value":item.id});
                    allCheck.push(item.id);
                });
            }
            console.log(list);
            this.setState({
                permList: list,
                allCheck: allCheck,
                checkAll: this.state.checkedList.length === list.length
            });
            console.log(this.state.checkedList);
        });
    };
    
    render() {
        const { getFieldDecorator } = this.props.form;

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
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 16,
                offset: 8,
              },
            },
        };
        return (
            <Spin spinning={this.state.loading}>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="角色名称"
                        >
                        {getFieldDecorator('role_name', {
                            rules: [{
                                required: true, message: '请输入角色名称!',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="拥有权限"
                        >
                        {getFieldDecorator('perms', {
                            rules: [{
                                required: true, message: '请输入权限!',
                            }],
                        })(
                            <div style={{lineHeight:"20px",marginTop:"10px"}}>
                                <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.onCheckAllChange}
                                    checked={this.state.checkAll}
                                >
                                    全部
                                </Checkbox>
                                </div>
                                <br />
                                <CheckboxGroup options={this.state.permList} value={this.state.checkedList.length>0?this.state.checkedList:this.props.editData.perms} onChange={this.onChange} />
                            </div>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        >
                        {getFieldDecorator('note', {
                            rules: [{
                                required: false, message: '请输入备注!',
                            }],
                        })(
                            <TextArea placeholder="可以设置备注信息" autosize={{ minRows: 2}} />
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.props.handleEditCancel}>取消</Button>
                        <Button type="primary" style={{marginLeft:40}} htmlType="submit">确认</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
};
export default  Form.create({
    mapPropsToFields(props) {
        return {
            role_name: Form.createFormField({
                ...props.editData,
                value: props.editData['role_name'],
            }),
            perms: Form.createFormField({
                ...props.editData,
                value: props.editData['perms'],
            }),
            note: Form.createFormField({
                ...props.editData,
                value: props.editData['note'],
            }),
        };
      },
})(editForm);