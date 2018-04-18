export default [
    {
        path: '/overview',
        name: '系统首页',
        private: true,
        component: () => import('../../views/overview')
    },
    {
        path: '/userContact/role',
        name: '角色管理',
        private: true,
        component: () => import('../../views/user/role/index')
    },
    {
        path: '/userContact/perms',
        name: '权限管理',
        private: true,
        component: () => import('../../views/user/perms/index')
    },
    {
        path: '/userContact/user',
        name: '用户管理',
        private: true,
        component: () => import('../../views/user/user/index')
    },
    {
        path: '/register/index',
        name: '注册审核',
        private: true,
        component: () => import('../../views/register/index')
    },
    {
        path: '/register/detail/:user_id',
        name: '注册审核详情',
        private: true,
        component: () => import('../../views/register/detail')
    },
    {
        path: '/rate/list',
        name: '外汇牌价',
        private: true,
        component: () => import('../../views/quoted/index')
    },
    {
        path: '/commission/list',
        name: '返佣设置',
        private: true,
        component: () => import('../../views/commission/index')
    },
    {
        path: '/commission/edit/:unique_code/:parent_code',
        name: '返佣设置编辑',
        private: true,
        component: () => import('../../views/commission/edit')
    },
    {
        path: '/report/list',
        name: '返佣报告',
        private: true,
        component: () => import('../../views/report/index')
    },
    {
        path: '/pointtype/list',
        name: '点差审核',
        private: true,
        component: () => import('../../views/pointtype/index')
    },
    {
        path: '/same/list',
        name: '同名审核',
        private: true,
        component: () => import('../../views/same/index')
    },
    {
        path: '/pay/in',
        name: '入金管理',
        private: true,
        component: () => import('../../views/pay/payin')
    },
    {
        path: '/pay/out',
        name: '出金管理',
        private: true,
        component: () => import('../../views/pay/payout')
    },
    {
        path: '/pay/list',
        name: '奖金管理',
        private: true,
        component: () => import('../../views/bonus/index')
    },
    {
        path: '/pay/add',
        name: '奖金发放',
        private: true,
        component: () => import('../../views/bonus/add')
    },
]
