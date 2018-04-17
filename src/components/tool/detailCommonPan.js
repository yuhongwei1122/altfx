import React, { Component } from 'react';
import DateFormatPan from '../../components/tool/DateFormatPan';
import './detailCommonPan.css'

export default class DetailCommonPan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: props.detail,
            colums: props.colums
        }
    };

    ItemDtail = (colums) => {
        return colums.map((colum,index)=>{
            const text = '';
            switch(colum.type){
                case 'text':
                    if(this.state.detail[colum.name]){
                        return (
                            <div key={index} className="detail-common-pan">
                                <div className="colum-title">{colum.content}:</div>
                                <div className="colum-content">{this.state.detail[colum.name]}</div>
                            </div>
                        )
                    }
                    break;
                case 'image':
                    return (
                        <div key={index} className="detail-common-pan">
                            <div className="colum-title">{colum.content}:</div>
                            <div className="colum-content"><img src={this.state.detail[colum.name]} className="cloum-img" alt=""/></div>
                        </div>
                    )
                    break;
                case 'status':
                    return (
                        <div key={index} className="detail-common-pan">
                            <div className="colum-title">{colum.content}:</div>
                            <div className="colum-content">{colum.value[this.state.detail[colum.name]]}</div>
                        </div>
                    )
                    break; 
                case 'weight':
                    return (
                        <div key={index} className="detail-common-pan">
                            <div className="colum-title">{colum.content}:</div>
                            <div className="colum-content">{Number(this.state.detail[colum.name])== 0 ? 'N/A' : this.state.detail[colum.name]}</div>
                        </div>
                    )
                    break;
                case 'version':
                    return (
                        <div key={index} className="detail-common-pan">
                            <div className="colum-title">{colum.content}:</div>
                            <div className="colum-content">{this.state.detail[colum.name] === '' ? '全部版本' : this.state.detail[colum.name]}</div>
                        </div>
                    )
                    break;
                case 'datetime':
                    return (
                        <div key={index} className="detail-common-pan">
                            <div className="colum-title">{colum.content}:</div>
                            <div className="colum-content"><DateFormatPan date={this.state.detail[colum.name]} format="yyyy-MM-dd hh:mm:ss"/></div>
                        </div>
                    )
                    break;
                case 'special':
                    if(this.state.detail[colum.name] === 0){
                        return (
                            <div key={index} className="detail-common-pan">
                                <div className="colum-title">{colum.content}:</div>
                                <div className="colum-content">{colum.value[this.state.detail[colum.name]]}</div>
                            </div>
                        )
                    }else if(this.state.detail[colum.name] === 1){
                        const temp = colum.value[this.state.detail[colum.name]];//{"start_time":"时段展示","end_time":"时段展示"}
                        
                    }else{
                        <div key={index} className="detail-common-pan">
                            <div className="colum-title">{colum.content}:</div>
                            <div className="colum-content">{colum.value[this.state.detail[colum.name]]}</div>
                        </div>
                    }
                    
                    break;
                default:
                    break;
            }
            
        }); 
    };
    
    render() {
        return (
            <div>{this.ItemDtail(this.state.colums)}</div>
        );
    }
}