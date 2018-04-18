import axios from 'axios';


const PREXFIX_LOGIN = 'altfx_user';

const Auth = {

    // instance auth in PrivateRoute
    checkLogin(){
        let info = {};
        if(sessionStorage.getItem(PREXFIX_LOGIN)){
            info = JSON.parse(sessionStorage.getItem(PREXFIX_LOGIN));
        }
        if(Object.keys(info).length > 0){
            // info = JSON.parse(info);
            // this.info = info;
            // this.menuMap = this._getMenuMap(info.menus);
            return true;
        }else{
            return false;
        }
    },
    getInfo() {
        return this.info;
    },
    _getMenuMap(menus) {
        if(menus){
            return _menus2Map(menus);
        }

        return new Map();

        function _menus2Map(menus){
            menus =  menus || [];
            const urlMap = new Map();

            function walk(menus){
                menus.forEach(item => {
                    if(item.url) {

                        // sso系统不能添加/开头的路径, 处理下
                        if(!item.url.startsWith('/')) {
                            item.url = `/${item.url}`;
                        }

                        urlMap.set(item.url, item);
                    }

                    if(item.children) {
                        walk(item.children);
                    }
                })
            }
            walk(menus);

            return urlMap;
        }
    },
    checkMenuPermissions(url) {
        if(!url) {
            throw new Error('param is not exist!');
        }

        let menus = this.menuMap || new Map();

        if(menus.has(url)){
            return true;
        }

        for (let key of menus.keys()) {

            // if key endwith * , eg:"/a/b/*"
            // remove *
            if (key.endsWith('*')) {
                key = key.substring(0, key.length - 1);
            }

            if(url.indexOf(key) === 0){
                return true;
            }

            return false;
        }
    },
    async signin(success, fail) {
        let res = [];

        try {
            res = await Promise.all([
                axios.post('/pubsmart/user/profile/list'),
                axios.post('/pubsmart/system/navigation/list')
            ]);
        }
        catch (e) {
            fail && fail('登录失效，请重新登录！');
            return;
        }

        if (0 !== res[0].data.error.returnCode && 0 !== res[1].data.error.returnCode) {
            fail && fail(res[0].data.error + res[1].data.error );
            return;
        }

        let data = {
            info: res[0].data.data,
            menus: res[1].data.data.list
        }
        sessionStorage.setItem(PREXFIX_LOGIN, JSON.stringify(data));
        success && success(data);


    },
    signout(success, fail) {
        axios.post('/surveyrouter/profile/logout')
            .then((res) => {
                if (0 !== res.data.error.returnCode) {
                    fail && fail(res.data.error);
                    return;
                }

                sessionStorage.removeItem(PREXFIX_LOGIN);
                success && success(res);
            })
            .catch((res) => {
                fail && fail(res);
                return;
            })
    }
}


export  default Auth;
