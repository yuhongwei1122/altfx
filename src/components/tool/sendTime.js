import React, { Component } from 'react';
import moment from 'moment';
import { Radio, Button, Row, Col, DatePicker, InputNumber, Tag } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class SendTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendType: this.props.sendType || "0",
            startValue: null,
            endValue: null,
            endOpen: false,
            rate: this.props.rate || ""
        }
    };
    _handleChange = (e) => {
        this.setState({
            sendType: e.target.value 
        });
    };
    disabledStartDate = (current) => {
        // const endValue = this.state.endValue;
        // if (!startValue || !endValue) {
        //   return false;
        // }
        //今天之前的日期禁止选择
        return  current < moment().subtract(1,'days');
        // return startValue.valueOf() > endValue.valueOf();
    }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    
    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
    }
    
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }
    
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }
    
    handleStartOpenChange = (open) => {
        if (!open) {
          this.setState({ endOpen: true });
        }
    }
    
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    render() {
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div>
                <RadioGroup onChange={this._handleChange} defaultValue={this.state.sendType}>
                    <Radio value="0">一直展示</Radio>
                    <Radio value="1">时段展示</Radio>
                    <Radio value="2">频率展示</Radio>
                </RadioGroup>
                {this.state.sendType === "1" ? 
                    <div>
                        <DatePicker
                            style={{marginRight:20,width:200}}
                            disabledDate={this.disabledStartDate}
                            disabledTime={this.disabledDateTime}
                            showTime={{format:"HH:mm"}}
                            format="YYYY-MM-DD HH:mm"
                            value={startValue}
                            placeholder="开始时间"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                        />
                        ---
                        <DatePicker
                            style={{marginLeft:20,width:200}}
                            disabledDate={this.disabledEndDate}
                            showTime={{format:"HH:mm"}}
                            format="YYYY-MM-DD HH:mm"
                            value={endValue}
                            placeholder="结束时间"
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                        />
                    </div> : null}
                {this.state.sendType === '2' ? 
                    <div>
                        <InputNumber style={{width:200}} min={1} max={100} placeholder="请输入1-100的整数" defaultValue={this.state.rate}/>
                        <div>
                            <Tag color="blue">展示频率为全部频率</Tag>
                        </div>
                    </div> : null}
            </div>
        )
    }
};