import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Radio, Button, Tag, Select } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class AndroidVersion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type || "0",
            versionDate: []
        }
    };
    _handleChange = (e) => {
        this.setState({
            type: e.target.value 
        });
    };
    _handleStartSelect = (value) => {
        console.log(value);
    };
    _handleEndSelect = (value) => {
        console.log(value);
    };
    _fetchVersion = () => {
        axios.get('/management/version/range').then((res) => {
            console.log(res.data);
            this.setState({
                versionDate: res.data.android
            });
        });
    };
    componentDidMount(){
        this._fetchVersion();
    };
    render() {
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div>
                <RadioGroup onChange={this._handleChange} defaultValue={this.state.type}>
                    <Radio value="0">全部版本</Radio>
                    <Radio value="1">版本区间</Radio>
                </RadioGroup>
                {this.state.type === '1' ? 
                    <div>
                        <Select defaultValue="" style={{ width: 120,marginRight:20 }} onChange={this._handleStartSelect}>
                            {this.state.versionDate.map(d => <Option key={d.value} value={d.value}>{d.title}</Option>)}
                        </Select>
                        ---
                        <Select defaultValue="" style={{ width: 120,marginLeft:20 }} onChange={this._handleEndSelect}>
                            {this.state.versionDate.map(d => <Option key={d.value} value={d.value}>{d.title}</Option>)}
                        </Select>
                    </div> : null}
            </div>
        )
    }
};