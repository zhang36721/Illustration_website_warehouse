<template>
  <div>
    <!-- <Home></Home> -->
    <!-- <Guest v-if="globalVar == 1"></Guest>
    <Login v-if="globalVar == 2"></Login> -->
    <!-- 共享布局和全局元素 -->
    <router-view></router-view>
  </div>
</template>
<script  lang="ts">
import { inject } from "vue";
export default {
    setup() {
       // 在组件内部使用inject来获取全局变量
    const globalVar = inject('globalVar');
      return {
       globalVar,
      };
    },
  };
</script>

<style scoped>

</style>
