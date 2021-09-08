import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'



Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    {path: '/',redirect: '/login'},
    {path: '/login',component: Login},
    {
      path: '/home',component: Home,
      redirect: '/welcome',
      children:[
        {path: '/welcome',component: Welcome},
        {path: '/users',component: Users},
        {path: '/rights',component: Rights},
        {path: '/roles',component: Roles},
        {path: '/categories',component: Cate},
        {path: '/params',component: Params},
        {path: '/goods',component: List},
        {path: '/goods/add',component: Add},
        {path: '/orders',component: Order},
      ]}
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  // to 表示将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行  next('/login') 强制跳转
  // 如果将要访问的路径是登录页面，那么就直接放行
  if(to.path === '/login') return next();
  // 如果不是访问登录页面，则验证token
  const tokenStr = window.sessionStorage.getItem('token');
  // 如果没有token，则强制跳转到登录页面
  if(!tokenStr) return next('/login')
  next()

})

// 时间戳
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


export default router
