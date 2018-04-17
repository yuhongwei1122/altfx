const menuData = [
    {
        key: 'userContact',
        name: '权限中心',
        path: '/userContact',
        icon: 'pushpin-o',
        children: [
            {
                key: 'role',
                name: '角色管理',
                path: '/userContact/role',
                icon: 'setting'
            },
            {
                key: 'perms',
                name: '权限管理',
                path: '/userContact/perms',
                icon: 'share-alt'
            },
            {
                key: 'user',
                name: '用户管理',
                path: '/userContact/user',
                icon: 'user'
            }
        ]
    },
    {
        key: 'register',
        name: '注册审核',
        path: '/register/index',
        icon: 'usergroup-add'
    },
    {
        key: 'quoted',
        name: '外汇牌价',
        path: '/rate/list',
        icon: 'pay-circle-o'
    },
    {
        key: 'quoted',
        name: '返佣设置',
        path: '/commission/list',
        icon: 'form'
    },
    {
        key: 'quoted',
        name: '返佣报告',
        path: '/report/list',
        icon: 'file-text'
    },
    {
        key: 'pointtype',
        name: '点差审核',
        path: '/pointtype/list',
        icon: 'solution'
    },
    {
        key: 'sameaccount',
        name: '同名审核',
        path: '/same/list',
        icon: 'contacts'
    },
    {
        key: 'pay',
        name: '资金管理',
        path: '/pay',
        icon: 'pushpin-o',
        children: [
            {
                key: 'payin',
                name: '入金管理',
                path: '/pay/in',
                icon: 'setting'
            },
            {
                key: 'payout',
                name: '出金管理',
                path: '/pay/out',
                icon: 'shop'
            },
            {
                key: 'bonus',
                name: '奖金管理',
                path: '/pay/list',
                icon: 'table'
            },
            {
                key: 'bonus_add',
                name: '奖金发放',
                path: '/pay/add',
                icon: 'plus'
            }
        ]
    },
]

export default menuData;
