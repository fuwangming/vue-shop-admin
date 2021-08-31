import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    {path: '/',redirect: '/login'},
    {path: '/login',component: Login},
    {path: '/home',component: Home}
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


export default router
