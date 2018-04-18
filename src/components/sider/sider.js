import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'react-router-dom';
import { urlToList } from './pathTools';
import Logo from './logo-blue.png';
import SmallLogo from './small-logo.png';
import './sider.less';
const { Sider } = Layout;
const { SubMenu } = Menu;

//获取图标，如果是外链图片，以图片显示，如果是string直接引用
const getIcon = (icon) => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className="sider-menu-item-img" />;
    }
    if (typeof icon === 'string') {
        return <Icon type={icon} />;
    }
    return icon;
};
export const getMeunMatcheys = (flatMenuKeys, path) => {
    return flatMenuKeys.filter((item) => {
        if (!item) {
            return false;
        }
        return pathToRegexp(item).test(path);
    });
};

export default class SiderMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.menus = props.menuData;
        this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);//遍历菜单，获取所有的路由，放在数组中
        let info = {};
        if(sessionStorage.getItem("altfx_user")){
            info = JSON.parse(sessionStorage.getItem("altfx_user"));
        }
        this.state = {
            role: info.account,
            openKeys: this.getDefaultCollapsedSubMenus(props),
        };
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.setState({
                openKeys: this.getDefaultCollapsedSubMenus(nextProps),
            });
        }
    }
    /**
     * Convert pathname to openKeys
     * /list/search/articles = > ['list','/list/search']
     * @param  props
     */
    getDefaultCollapsedSubMenus(props) {
        const { location: { pathname } } = props || this.props;
        return urlToList(pathname)
            .map((item) => {
                return getMeunMatcheys(this.flatMenuKeys, item)[0];
            })
            .filter(item => item);
    }
    /**
     * Recursively flatten the data
     * [{path:string},{path:string}] => {path,path2}
     * @param  menus
     */
    getFlatMenuKeys(menus) {
        let keys = [];
        menus.forEach((item) => {
            if (item.children) {
                keys = keys.concat(this.getFlatMenuKeys(item.children));
            }
            keys.push(item.path);
        });
        return keys;
    };
    /**
     * 第一步：获得菜单子节点
     * @memberof Sider
     */
    getNavMenuItems = (menusData) => {
        if (!menusData) {
            return [];
        }
        // console.log(menusData);
        return menusData
            .filter(item => item.name && !item.hideInMenu)
            .map((item) => {
                if(item.role.indexOf(this.state.role) !== -1){
                    const ItemDom = this.getSubMenuOrItem(item);
                    return ItemDom;
                }else{
                    return null;
                }

            })
            .filter(item => item);
    };
    /**
     * 第一步子集操作：获取孩子节点菜单
     */
    getSubMenuOrItem = item => {
        if (item.children && item.children.some(child => child.name)) {
          const childrenItems = this.getNavMenuItems(item.children);
          // 当无子菜单时就不展示菜单
          if (childrenItems && childrenItems.length > 0) {
            return (
              <SubMenu
                title={
                  item.icon ? (
                    <span>
                      {getIcon(item.icon)}
                      <span>{item.name}</span>
                    </span>
                  ) : (
                    item.name
                  )
                }
                key={item.path}
              >
                {childrenItems}
              </SubMenu>
            );
          }
          return null;
        } else {
          return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
        }
      };
    /**
     * 判断是否是http链接.返回 Link 或 a
     * Judge whether it is http link.return a or Link
     * @memberof SiderMenu
     */
    getMenuItemPath = (item) => {
        const itemPath = this.conversionPath(item.path);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link
                to={itemPath}
                target={target}
                replace={itemPath === this.props.location.pathname}
                onClick={
                    this.props.isMobile
                        ? () => {
                            this.props.onCollapse(true);
                        }
                        : undefined
                }
            >
                {icon}
                <span>{name}</span>
            </Link>
        );
    };
    // 转化路径
    conversionPath = (path) => {
        if (path && path.indexOf('http') === 0) {
            return path;
        } else {
            return `/${path || ''}`.replace(/\/+/g, '/');
        }
    };
    isMainMenu = (key) => {
        return this.menus.some(
            item =>
            key && (item.key === key || item.path === key),
        );
    };
    //打开关闭菜单
    handleOpenChange = (openKeys) => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
        this.setState({
            openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
        });
    };
    // Get the currently selected menu
    getSelectedMenuKeys = () => {
        const { location: { pathname } } = this.props;
        return urlToList(pathname).map(itemPath =>
            getMeunMatcheys(this.flatMenuKeys, itemPath).pop(),
        );
    };
    render() {
        const { collapsed, onCollapse } = this.props;
        const { openKeys } = this.state;
        // Don't show popup menu when it is been collapsed
        const menuProps = collapsed
            ? {}
            : {
                openKeys,
            };
        // if pathname can't match, use the nearest parent's key
        let selectedKeys = this.getSelectedMenuKeys();
        if (!selectedKeys.length) {
            selectedKeys = [openKeys[openKeys.length - 1]];
        }
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                onCollapse={onCollapse}
                width={200}
                className="jdb-sider"
            >
                <div className={collapsed ? "small-logo": "logo"}><img src={this.props.collapsed ? SmallLogo : Logo} alt="logo"/></div>
                <Menu
                    key="Menu"
                    theme="dark"
                    mode="inline"
                    {...menuProps}
                    inlineCollapsed={collapsed}
                    onOpenChange={this.handleOpenChange}
                    selectedKeys={selectedKeys}
                    style={{ padding: '0px', width: '100%' }}
                >
                    {this.getNavMenuItems(this.menus)}
                </Menu>
            </Sider>
        );
    }
}
