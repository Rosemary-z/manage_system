import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/aside/user/Users'
import Rights from '@/components/aside/permission/Rights'
import Roles from '@/components/aside/permission/Roles'
import Categories from '@/components/aside/goods/Categories'
import GoodsList from '@/components/aside/goods/GoodsList'
import Params from '@/components/aside/goods/Params'
import Orders from '@/components/aside/order/Orders'
import Reports from '@/components/aside/data/Reports'
import HomePage from '@/components/main/HomePage'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  // {
  //   path: '/homepage',
  //   component: HomePage
  // },
  {
    path: '/home',
    component: Home,
    redirect: '/homepage',
    children: [{
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      // { path: '/goods/add', component: Add },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      },
      {
        path: '/home',
        component: HomePage //默认显示首页
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载导航守卫
router.beforeEach((to, from, next) => {
  // 判断用户访问的是哪个页面，如果是非登录页，判断是否当前有token值，有才允许放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next()
})
export default router