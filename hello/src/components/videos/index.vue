<template>
<el-row>
  <el-col :span="8" v-for="(o, index) in videoData" :key="o">
    <el-card :body-style="{ padding: '2px' }">
      <img :src="o.imageUrl" @click="clickImg(o)" class="image">
      <div style="padding: 14px;">
        <a :href="o.videoUrl" class="a_title">{{o.description}}</a>
        <div class="bottom">
          <!-- <time class="time">{{ currentDate }}</time> -->
          <!-- <el-button type="text" class="button">操作按钮</el-button> -->
        </div>
      </div>
    </el-card>
  </el-col>
</el-row>
  </template>
  
  <script lang="ts">
  import { ref,defineComponent  } from 'vue';
  import { videos } from './videos.ts'; // 导入视频数据
  export default {
    setup() {
         // 创建一个 ref 变量来存储视频数据
      const videoData = ref(videos);
      console.log(videoData);
        //点击图片触发跳转--o是点击的图片的信息
      const clickImg = (o)=>{
        window.location.href = o.videoUrl;
      }
      return {
        videoData,
        clickImg
      };
    },
  };
  </script>

  <style scoped>
  #h{
    width: 100px;
    height: 100px;
    background-color: rgb(21, 21, 195);
  }
  .a_title{
  text-decoration: none;
    
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .button {
    padding: 0;
    min-height: auto;
  }
  .image {
    width: 100%;
    display: block;
  }

  </style>
  