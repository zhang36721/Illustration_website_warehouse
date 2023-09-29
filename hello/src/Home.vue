<template>
  <div :class="bgc">
     <el-row>
    <el-col :span="8" v-for="(o, index) in data" :key="o">
      <el-card :body-style="{ padding: '2px' }">
        <img :src="o.serverPath" @click="clickImg(o)" class="image" />
        <div style="padding: 14px">
          <a :href="o.path" class=".a_title">{{ o.filename }}</a>
          <div class="bottom">
            <time class="time">{{ o.uploadtime }}</time>
            <el-button link class="button" @click="delist(o)">下架</el-button>
            <el-button link class="button" @click="changName(o)">更名</el-button>
         
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>  
  <el-upload
    ref="upload"
    class="upload-demo"
    multiple
    :limit="10"
    show-file-list
    :on-exceed="handleExceed"
    :before-upload="BeforeUpload"
    :auto-upload="false"
  >
    <template #trigger>
      <el-button type="primary">select file</el-button>
    </template>
    <el-button class="ml-3" type="success" @click="submitUpload">
      upload to server
    </el-button>
    <template #tip>
      <div class="el-upload__tip text-red">
        文件限制一次最多上传10个，若为视频建议分开上传
      </div>
    </template>
  </el-upload>
  </div> 
  <div class="form-container" v-if="showing">
      <form class="form">
        <div class="form-group">
          <label for="email">原名称：</label>
          <input type="text" id="email" :placeholder="OriginalName">
        </div>
        <div class="form-group">
          <label for="textarea">更改为：</label>
          <input type="text" id="email" class="NewName" name="NewName">
        </div>
        <button class="form-submit-btn" type="submit" @click="ToSubmit">Submit</button>
      </form>
    </div>



    <!-- <div v-if="showingimg">
  <el-upload
    ref="uploadRef"
    class="upload-demo"
    :before-upload="BeforeUploadImg"
    :auto-upload="false"
  >
    <template #trigger>
      <el-button type="primary">选择该视频得封面</el-button>
    </template>

    <el-button class="ml-3" type="success" @click="submitUploadImg">
      确定上传
    </el-button>

    <template #tip>
      <div class="el-upload__tip">
        只能选择图片！
      </div>
    </template>
  </el-upload>
</div> -->


</template>

<script lang="ts" setup>
import { ref , onMounted } from "vue";
import axios from "axios";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
// import { videos } from "@/components/videos/videos.ts"; // 导入视频数据

// 发送HTTP GET 请求到后端以获取serverdata数据
async function getServerData() {
  try {
    const response = await axios.get('/serverdata'); //GET路由来获取核心数据
    const serverdata = response.data; 
    console.log(serverdata,'核心文件夹数据');
    return serverdata
  } catch (error) {
    // 处理错误
    console.error('获取核心数据失败:', error);
  }
}
const data = ref()
onMounted (async ()=>{
 data.value = await getServerData()
 console.log(data.value,'总数据！！！！！！！！！！！！！！！！！！！！');
})



// const videoData = ref(videos);

const clickImg = (o:any) => {
  window.location.href = o.videoUrl;
};

//文件上传之前触发
const BeforeUpload = (files: any) => {
  if (files) {
    // 使用 Promise 确保文件准备好后再执行上传
    new Promise((resolve) => {
      resolve(uploadFiles(files));
    });
  }
};

//上传文件处理成数组
async function uploadFiles(files: any) {
  try {
    const formData = new FormData();
    const filesArray = [files];
    // 遍历文件数组并添加到formData中
    filesArray.forEach((file, index) => {
      console.log("正在遍历文件，即将合成数组", `${file.name} + ${index}`);
      formData.append("files", file);
    });
    // 使用axios发送multipart/form-data请求到后端    
    const response = await axios.post("/upload", formData, {
 
      baseURL: "http://127.0.0.1:3000",
      headers: {
        "Content-Type": "multipart/form-data", // 设置请求头
      },
    });

    // 处理后端响应
    console.log(response.data, "文件上传成功");
    data.value = await getServerData()
  } catch (error) {
    // 处理错误
    console.error("上传文件失败:", error);
  }
}

const upload = ref<UploadInstance>();
//当超出限制时的钩子
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
//提交时触发
const submitUpload = () => {
upload.value!.submit();
getServerData();
data.value = getServerData()

};

//上传图片（上传文件后触发）
//文件上传之前触发
// const BeforeUploadImg = (fileImg: any) => {
//   console.log(fileImg,'?????????????????');
//   if (fileImg) {
//     // 使用 Promise 确保文件准备好后再执行上传
//     new Promise((resolve) => {
//       resolve(uploadFilesImg(fileImg));
//     });
//   }
  
// };


// function uploadFilesImg(fileImg:any) {
//   console.log(fileImg,'上传得图片是');
  
// }

// const submitUploadImg = ()=>{
//   upload.value!.submit();
// }













const delist = (o:any)=>{
  console.log(o,'你要删除的文件信息');
  deleteFile(o)
}

//删除逻辑
 async function deleteFile(o:any) { 
  const filename  = o.filename
      try {
        const response =await axios.delete(`/deleteFile/${filename }`);
        console.log('文件删除成功', response.data);
      } catch (error) {
        console.error('文件删除失败', error);
      }
      getServerData()
      data.value = getServerData()
    }


 
//更改名称逻辑   
    const bgc = ref('')
    const OriginalName = ref('')
    const showing = ref(false)
    const ovalue = ref()
 function changName(o:any) {
  showing.value = true
  ovalue.value = o
  bgc.value = 'background-blur'
  OriginalName.value = o.filename
  ToSubmit()
  
}
async function ToSubmit() {
  const filename  = ovalue.value.filename //获取原来得文件名称
  const fileType = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);//获取文件类型
  const NewName = (document.getElementsByClassName('NewName')[0] as HTMLInputElement).value+'.'+fileType;//获取新文件名称
  //如果输入新名称
if (NewName) {
  console.log(NewName,'有新名称输入了');
      try {
        const response = await axios.post(`/changeName/${filename}`,{ NewName: NewName });
        console.log('修改文件名成功', response.data);
        showing.value = false
        bgc.value = ''


      } catch (error) {
        alert('修改失败')
        console.error('修改文件名失败', error);
        showing.value = false 
        bgc.value = ''
      
      }
}
getServerData()
data.value = getServerData() }
</script>

<style scoped>
.background-blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('your-background-image.jpg'); /* 设置你的背景图像 */
  background-size: cover;
  filter: blur(10px); /* 背景模糊效果 */
  z-index: -1; /* 确保模糊背景在最底层 */
  opacity: 0.8; /* 控制模糊背景的透明度 */
  pointer-events: none; /* 防止模糊背景上的元素被点击 */
}
#h {
  width: 100px;
  height: 100px;
  background-color: rgb(21, 21, 195);
}
.a_title {
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
.form-container {
  width: 400px;
  background: linear-gradient(#212121, #212121) padding-box,
              linear-gradient(145deg, transparent 35%,#e81cff, #40c9ff) border-box;
  border: 2px solid transparent;
  padding: 32px 24px;
  font-size: 14px;
  font-family: inherit;
  color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  border-radius: 16px;
  z-index: 100;
}

.form-container button:active {
  scale: 0.95;
}

.form-container .form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-container .form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.form-container .form-group label {
  display: block;
  margin-bottom: 5px;
  color: #717171;
  font-weight: 600;
  font-size: 12px;
}

.form-container .form-group input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  background-color: transparent;
  border: 1px solid #414141;
}

.form-container .form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  resize: none;
  color: #fff;
  height: 96px;
  border: 1px solid #414141;
  background-color: transparent;
  font-family: inherit;
}

.form-container .form-group input::placeholder {
  opacity: 0.5;
}

.form-container .form-group input:focus {
  outline: none;
  border-color: #e81cff;
}

.form-container .form-group textarea:focus {
  outline: none;
  border-color: #e81cff;
}

.form-container .form-submit-btn {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  align-self: flex-start;
  font-family: inherit;
  color: #717171;
  font-weight: 600;
  width: 40%;
  background: #313131;
  border: 1px solid #414141;
  padding: 12px 16px;
  font-size: inherit;
  gap: 8px;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 6px;
}

.form-container .form-submit-btn:hover {
  background-color: #fff;
  border-color: #fff;
}



</style>
