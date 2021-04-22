import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'

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
    component:Home,
    redirect:'/welcome',
    children:[{
      path:'/welcome',
      component:Welcome,
    },
    {
      path:'/users',
      component:Users
    },
    {
      path:'/rights',
      component:Rights
    },
  ]
  },
  
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

