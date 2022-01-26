import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/login/Login.vue";
import Home from "../components/home/Home.vue";
import Teacher from "../components/teacher/Teacher.vue";
import Index from "../components/index/Index.vue";
import User from "../components/user/User.vue";
import Course from "../components/course/Course.vue";
import Student from "../components/student/Student.vue";
import Data from "../components/data/Data.vue";
import Role from "../components/role/Role.vue";
import Right from "../components/right/Right.vue";


Vue.use(Router)

/**
 * 路由配置
 */
//定义路由
const router = new Router({
  routes: [{path:'/',redirect:'/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home,
      children:[
        {path:'/',redirect:'/index'},
        {path:'/index',component:Index},
        {path:'/teacher',component:Teacher},
        {path:'/user',component:User},
        {path:'/course',component:Course},
        {path:'/student',component:Student},
        {path:'/data',component:Data},
        {path:'/role',component:Role},
        {path:'/right',component:Right},
      ]
    },
  ]
})
//抛出路由
export default router;

//配置路由守卫
router.beforeEach((to,from,next)=>{
  //是否要到登录去
  if(to.path=="/login"){
    //如果要去登录，直接放行
    next();
  }else{
    let token=localStorage.getItem("token");
    token?next():next("/login");
  }
})
