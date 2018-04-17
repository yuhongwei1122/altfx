import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Icon } from 'antd';
import { urlToList } from '../sider/pathTools';
import './Breadcrumb.less';


export default class Breadcrumbs extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {

        }
    }
    getMenuItemPath(item){
        const { target, name, path, icon } = item;

        // Is it a http link
        if (/^https?:\/\//.test(path)) {
            return (
                <a href={path} target={target}>
                    <span>{name}</span>
                </a>
            );
        }

        return (
            <Link
                to={path}
                target={target}
                replace={path === this.props.location.pathname}
            >
                <Icon type={icon} />
                <span>{name}</span>
            </Link>
        );
    }
    render() {
        const pathSnippets = urlToList(this.props.location.pathname);

        const menuMap = {};
        const getMenuMap = (items)=> {
            items.forEach(item=>{
                if(item.children && item.children.length > 0) {
                    getMenuMap(item.children);
                }
                if(item.path) {
                    menuMap[item.path] = item;
                }
            })
        }
        getMenuMap(this.props.menuData);

        return (
            <div className="wrap">
                <Breadcrumb >
                    {pathSnippets.map(path => {
                        if(!menuMap[path]) {
                            return null;
                        }
                        return (
                            <Breadcrumb.Item key={menuMap[path].path}>
                                {this.getMenuItemPath(menuMap[path])}
                            </Breadcrumb.Item>
                        )
                    })}
                </Breadcrumb>
            </div>
        )

    }
}

