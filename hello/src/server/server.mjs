// const express = require('express');
import express from 'express';
import multer from 'multer';
import path from 'path';

// const multer = require('multer');
// const path = require('path');
const app = express();

// 配置Multer上传文件的目标目录
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // 将上传的文件保存到uploads目录中
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // 使用原始文件名作为上传后的文件名
//   },
// });

// const upload = multer({ storage: storage });

// // 设置Express中间件以解析JSON和处理表单数据
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 静态文件中间件，用于提供上传后的文件
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // 路由处理文件上传
// app.post('/upload', upload.single('file'), (req, res) => {
//   res.send('文件上传成功！');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动，正在监听端口 ${PORT}`);
});