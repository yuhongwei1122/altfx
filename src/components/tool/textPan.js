import React, { Component } from 'react';

export default class TextPan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styleProp: 'nowrap',
            count: 1
        }
    };
    _handleClick = () => {
        if(this.state.styleProp === 'nowrap') {
            this.setState({
                styleProp : 'normal'
            });
        }else{
            this.setState({
                styleProp : 'nowrap'
            });
        }
        console.log(this.state.styleProp);
    };
    render() {
        return (
            <div style={{maxWidth: this.props.width, whiteSpace: this.state.styleProp, textOverflow:'ellipsis', overflow:'hidden'}} onClick={this._handleClick}>{this.props.text}</div>
        );
    }
}