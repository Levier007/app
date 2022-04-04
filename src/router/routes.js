const home = () =>
    import ('@/views/home');
const rank = () =>
    import ('@/views/rank');
const songlist = () =>
    import ('@/views/songlist');
const singer = () =>
    import ('@/views/singer');
const mv = () =>
    import ('@/views/mv');
const songListDetail = () =>
    import ('@/views/songListDetail');
/* 404 */
export const pageError = {
        path: '*',
        name: '404',
        meta: {
            title: '404-您访问的页面不存在'
        },
        component: () =>
            import ('@/views/pageError/404')
    }
    /* 登录 */
export const loginRouter = {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () =>
            import ('@/views/login')
    }
    /* 主路由 */
export const appRouter = [{
        path: '/',
        redirect: '/home',
    }, {
        path: '/home',
        name: 'home',
        component: home
    },
    {
        path: '/rank',
        name: 'rank',
        component: rank
    },
    {
        path: '/songlist',
        name: 'songlist',
        component: songlist
    },
    {
        path: '/singer',
        name: 'singer',
        component: singer
    },
    {
        path: '/mv',
        name: 'mv',
        component: mv
    },
    {
        path: '/songlist-detail',
        name: 'songlistdetail',
        component: songListDetail
    }
]

export const routes = [pageError, loginRouter, ...appRouter]