import { createApp,ref } from 'vue'
import '@/style/reset.scss'
import ElementPlus from 'element-plus'
import router from './router/router.ts';
import axios from 'axios'
import 'element-plus/dist/index.css'; // 导入 Element Plus 样式
//引入全局组件，在组件中直接使用  不需要再次引入
import top from '@/components/TOP/index.vue';
import Login from "@/Login.vue";
import Home from "@/Home.vue";
import Guest from "@/Guest.vue";
axios.defaults.baseURL = 'http://127.0.0.1:3000'; // 你的后端服务器地址
const globalVar = ref(1);//初始化页面状态为guest
import App from '@/App.vue'
const app =createApp(App)
app.component('top',top)
app.component('Login', Login);
app.component('Home', Home);
app.component('Guest', Guest);
app.provide('globalVar', globalVar);//设置为全局变量
app.use(ElementPlus); // 注册 Element Plus 插件
app.use(router); 
app.mount('#app')
