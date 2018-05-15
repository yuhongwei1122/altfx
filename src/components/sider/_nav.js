const menuData = [
    {
        key: 'userContact',
        name: '权限中心',
        path: '/userContact',
        icon: 'pushpin-o',
        role:["admin_tina"],
        children: [
            {
                key: 'role',
                name: '角色管理',
                path: '/userContact/role',
                icon: 'setting',
                role:["admin_tina"]
            },
            {
                key: 'perms',
                name: '权限管理',
                path: '/userContact/perms',
                icon: 'share-alt',
                role:["admin_tina"]
            },
            {
                key: 'user',
                name: '用户管理',
                path: '/userContact/user',
                icon: 'user',
                role:["admin_tina"]
            }
        ]
    },
    {
        key: 'register',
        name: '注册审核',
        path: '/register/index',
        icon: 'usergroup-add',
        role:["admin_tina","altmanager1-chenzheng","altmanager1-agent1","altmanager1-agent2"],
    },
    {
        key: 'quoted',
        name: '外汇牌价',
        path: '/rate/list',
        icon: 'pay-circle-o',
        role:["admin_tina","altmanager3-zhaofulong"],
    },
    {
        key: 'quoted',
        name: '返佣设置',
        path: '/commission/list',
        icon: 'form',
        role:["admin_tina","altmanager1-chenzheng","altmanager1-agent2"],
    },
    {
        key: 'quoted',
        name: '返佣报告',
        path: '/report/list',
        icon: 'file-text',
        role:["admin_tina","altmanager1-chenzheng"]
    },
    {
        key: 'pointtype',
        name: '点差审核',
        path: '/pointtype/list',
        icon: 'solution',
        role:["admin_tina","altmanager1-chenzheng","altmanager1-agent2"],
    },
    {
        key: 'sameaccount',
        name: '同名审核',
        path: '/same/list',
        icon: 'contacts',
        role:["admin_tina","altmanager1-chenzheng","altmanager1-agent1"],
    },
    {
        key: 'pay',
        name: '资金管理',
        path: '/pay',
        icon: 'pushpin-o',
        role:["admin_tina","altmanager3-zhaofulong","altmanager3-agent1","altmanager3-agent2","altmanager3-agent3","altmanager3-agent4"],
        children: [
            {
                key: 'payin',
                name: '入金管理',
                path: '/pay/in',
                icon: 'setting',
                role:["admin_tina","altmanager3-zhaofulong","altmanager3-agent1","altmanager3-agent2","altmanager3-agent3","altmanager3-agent4"],
            },
            {
                key: 'payout',
                name: '出金管理',
                path: '/pay/out',
                icon: 'shop',
                role:["admin_tina","altmanager3-zhaofulong","altmanager3-agent1","altmanager3-agent2","altmanager3-agent3","altmanager3-agent4"],
            },
            {
                key: 'bonus',
                name: '奖金管理',
                path: '/pay/list',
                icon: 'table',
                role:["admin_tina"],
            },
            {
                key: 'bonus_add',
                name: '奖金发放',
                path: '/pay/add',
                icon: 'plus',
                role:["admin_tina"],
            },
            {
                key: 'transfer',
                name: '转账审核',
                path: '/pay/transfer',
                icon: 'export',
                role:["admin_tina"]
            }
        ]
    },
    {
        key: 'group',
        name: '转组管理',
        path: '/group',
        icon: 'pushpin-o',
        role:["admin_tina"],
        children: [
            {
                key: 'crmchange',
                name: 'CRM转组',
                path: '/group/crm',
                icon: 'hourglass',
                role:["admin_tina"]
            },
            {
                key: 'agengtchange',
                name: '代理转组',
                path: '/group/agent',
                icon: 'api',
                role:["admin_tina"]
            },
        ]
    }
]

export default menuData;
