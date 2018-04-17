import React, { Component } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const { TextArea } = Input;

class editForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({loading: true});
            if(this.props.editData.id){
                values.id = this.props.editData.id;
                axios.post('/platform/user/perms/update',values
                ).then((res) => {
                    this.setState({loading: false});
                    this.props.handleEditOk();
                });
            }else{
                axios.post('/platform/user/perms/add',values
                ).then((res) => {
                    this.setState({loading: false});
                    this.props.handleEditOk();
                });
            }
          }
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
                        label="权限名称"
                        >
                        {getFieldDecorator('perm_name', {
                            rules: [{
                                required: true, message: '请输入权限名称!',
                            }],
                        })(
                            <Input placeholder="请输入权限名称"/>
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
            perm_name: Form.createFormField({
                ...props.editData,
                value: props.editData['perm_name'],
            }),
            note: Form.createFormField({
                ...props.editData,
                value: props.editData['note'],
            }),
        };
      },
})(editForm);