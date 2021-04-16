import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'


Vue.use(Router)



const router= new Router({
  //mode: 'history',
  
  routes:[
  { path:'/',
    redirect:'/login'
  
},
  {
    path:'/login',
    component:login
  },
  {
    path:'/home',
    component:Home
  }
  ]
})
router.beforeEach((to,from,next)=>{
  if(to.path==='/login'){
    return next()

  };
  const tokenStr =window.sessionStorage.getItem('token');
  if(!tokenStr){
    return next('/login')
  }else{
    next()
  };

}
)

export default router

