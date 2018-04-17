import React, { PureComponent } from 'react';
import { Button, Input, Form, Spin, Radio } from 'antd';
import axios from 'axios';
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class LockForm extends React.PureComponent {
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
            //   console.log(values);
            this.setState({loading: true});
            if(this.props.editData.id){
                values.id = this.props.editData.id;
                axios.post('/platform/user/update',values
                ).then((res) => {
                    this.setState({loading: false});
                    this.props.handleLockOk();
                });
            }else{
                axios.post('/platform/user/add',values
                ).then((res) => {
                    this.setState({loading: false});
                    this.props.handleLockOk();
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
                        label="用户名称"
                        >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入英文用户名称!',
                            }],
                        })(
                            <Input disabled placeholder="请输入英文用户名称"/>
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
                            <Input disabled placeholder="请输入中文用户姓名"/>
                        )}
                    </FormItem>
                    <FormItem
                            {...formItemLayout}
                            label="新密码"
                            >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入账户新密码!',
                                }],
                            })(
                                <Input placeholder="请输入账户新密码"/>
                            )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button onClick={this.props.handleLockCancel}>取消</Button>
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
            })
        };
      },
})(LockForm);