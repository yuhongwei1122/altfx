import React, { PureComponent } from 'react';
import { Button, Input, Form, Spin, Checkbox } from 'antd';
import axios from 'axios';
import qs from 'qs';
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class editForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            roleList: [],
            role: "",
            checkedList: this.props.editData["role"] || [],
            indeterminate: true,
            checkAll: false,
            allCheck: []
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            //   console.log(values);
            values.role = this.state.checkedList.length>0?this.state.checkedList:this.props.editData.role;
            this.setState({loading: true});
            if(this.props.editData.id){
                values.id = this.props.editData.id;
                axios.post('/api/user/update',qs.stringify(values
                )).then((res) => {
                    this.setState({loading: false});
                    this.props.handleEditOk();
                });
            }else{
                axios.post('/api/user/add',qs.stringify(values
                )).then((res) => {
                    this.setState({loading: false});
                    this.props.handleEditOk();
                });
            }
          }
        });
    };
    onChange = (checkedList) => {
        console.log(checkedList.length);
        this.setState({
          checkedList,
          indeterminate: !!checkedList.length && (checkedList.length < this.state.roleList.length),
          checkAll: checkedList.length === this.state.roleList.length,
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
        axios.post('/api/user/role',qs.stringify({
            limit: 20
        }))
        .then((res) => {
            let list = [];
            let allCheck = [];
            if(res.data.result.length > 0){
                res.data.result.forEach((item)=>{
                    list.push({"label":item.role_name,"value":item.id});
                    allCheck.push(item.id);
                });
            }
            console.log(list);
            this.setState({
                roleList: list,
                allCheck: allCheck,
                checkAll: this.state.checkedList.length === list.length
            });
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
                        label="用户名称"
                        >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入英文用户名称!',
                            }],
                        })(
                            <Input placeholder="请输入英文用户名称"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户姓名"
                        >
                        {getFieldDecorator('chinessname', {
                            rules: [{
                                required: true, message: '请输入用户中文姓名!',
                            }],
                        })(
                            <Input placeholder="请输入中文用户姓名"/>
                        )}
                    </FormItem>
                    {!this.props.editData.id ? <FormItem
                            {...formItemLayout}
                            label="初始密码"
                            >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入账户初始密码!',
                                }],
                            })(
                                <Input placeholder="请输入账户初始密码"/>
                            )}
                    </FormItem> : null}
                    <FormItem
                        {...formItemLayout}
                        label="角色"
                        >
                        {getFieldDecorator('role',{
                            rules: [{
                                required: true, message: '请选择角色!',
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
                                <CheckboxGroup options={this.state.roleList} value={this.state.checkedList.length>0?this.state.checkedList:this.props.editData.role} onChange={this.onChange} />
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
            username: Form.createFormField({
                ...props.editData,
                value: props.editData['username'],
            }),
            chinessname: Form.createFormField({
                ...props.editData,
                value: props.editData['chinessname'],
            }),
            role: Form.createFormField({
                ...props.editData,
                value: props.editData['role'],
            }),
            note: Form.createFormField({
                ...props.editData,
                value: props.editData['note'],
            }),
        };
      },
})(editForm);