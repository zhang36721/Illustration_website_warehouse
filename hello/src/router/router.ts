// router/index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../Home.vue';
import Login from '../Login.vue';
import Guest from '../Guest.vue';
const routes: Array<RouteRecordRaw> = [
         {
        path: '/Guest',
        name: 'Guest',
        component: Guest,
      },
      {
        path: '/Login', 
        name: 'Login',
        component: Login,
      }, 
      {
        path: '/Home',
        name: 'Home',
        component: Home,
      },
      {
        path: '/',
        redirect: '/Guest',
      },
];
const router = createRouter(
    {
  history: createWebHashHistory(),
  routes,
}
);
export default router;