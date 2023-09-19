

<template>
  <div class="box">
  </div>

  <span class="vx">&nbsp; &nbsp; &nbsp;微信：19965250741&nbsp; &nbsp; &nbsp; QQ：825083540 &nbsp;</span>

  <div class="click-me" > 
  <span ><a href="https://item.taobao.com/item.htm?spm=a21dvs.23580594.0.0.621e3d0dfgFbBU&ft=t&id=706369430549
" id="a">点击进入官方店铺</a></span>
  </div>
</template>

<script lang="ts">
import { ref , onMounted} from 'vue';
export default {
  setup() {  
    onMounted(()=>{
    const aa = document.getElementById("a")
      setInterval(()=>{ 
      aa.style.opacity = aa.style.opacity > 0.2 ?aa.style.opacity - 0.1 : 1
    },100)
    })
    return {
    };
  }
};
</script>
<style scoped>
.box{
    margin-top:10px;
    width:100%;
    height:175px;
    background-color:rgb(239, 229, 229);
    background-image: url('./center.png');
    background-size: cover; /* 将背景图片缩放以覆盖整个容器 */
    background-repeat: no-repeat; /* 防止背景图片重复显示 */
}
.vx{
display:inline-block;
margin-top:10px
}
.click-me{
    width:100%;
    height:48px;
    background-color:rgb(253, 93, 0);
    color:white;
    margin-top: 10px;
    font-size:30px; 
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
} 
a{
  /* background-color: #000; */
  color:#fff; 
  text-decoration: none;
  transition: opacity 0.3s; /* 添加过渡效果 */
  opacity: 1;
   
}
</style>
