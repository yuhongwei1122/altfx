import React, { Component } from 'react';
import { Radio, Button, Icon, Tabs} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
            <Tabs defaultActiveKey="2">
                <TabPane tab={<span><Icon type="apple" />iphone X</span>} key="1">
                T
                </TabPane>
                <TabPane tab={<span><Icon type="apple" />iphone6+</span>} key="2">
                Tab 1
                </TabPane>
                <TabPane tab={<span><Icon type="apple" />iphone6</span>} key="3">
                Tab 1
                </TabPane>
                <TabPane tab={<span><Icon type="apple" />iphone5&4</span>} key="4">
                Tab 1
                </TabPane>
                <TabPane tab={<span><Icon type="android" />android</span>} key="5">
                Tab 2
                </TabPane>
            </Tabs>
        );
    }
}