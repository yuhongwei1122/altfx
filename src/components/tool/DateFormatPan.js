import React, { Component } from 'react';

export default class DateFormatPan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            format: this.props.format || 'yyyy-MM-dd',
            date: this.props.date || "",
            fmt: ""
        }
    };
    componentDidMount(){
        let date = new Date();
        if(this.props.date){
            date.setTime(this.props.date * 1000);
        }
        const o = {
            "M+" : date.getMonth() + 1, // 月份
            "d+" : date.getDate(), // 日
            "h+" : date.getHours(), // 小时
            "m+" : date.getMinutes(), // 分
            "s+" : date.getSeconds(), // 秒
            "q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
            "S" : date.getMilliseconds()
        // 毫秒
        };
        let fmt = this.state.format;
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
        Object.keys(o).forEach((item)=>{
            if (new RegExp("(" + item + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[item])
                        : (("00" + o[item]).substr(("" + o[item]).length)));
        });
        // console.log(fmt);
        this.setState({
            fmt: fmt
        });
    };
    render() {
        return (
            <span>{this.state.fmt}</span>
        );
    }
}