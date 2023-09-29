var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const multer = require("multer");
const mime = require("mime");
const fs = require("fs");
const cors = require("cors"); // 导入 cors 中间件
const bodyParser = require("body-parser"); // 导入 body-parser 模块

var app = express();

app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码的请求体

const dataFile = "serverdata.json";//数据存储路径
const uploadDir = path.join(__dirname, "uploads"); //存储上传文件夹的绝对路径

// 读取数据
function readData() {
  try {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // 如果文件不存在或解析失败，返回一个空数组或默认值
    return [];
  }
}

//调用multer模块下diskStorage 存储引擎，这个引擎允许你完全控制文件存储到磁盘的方式。该函数参数有两个方法分别是： destination 和 filename。这两个函数用于配置文件存储的目标目录和文件名。
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); //第一个参数是错误参数（通常用 null 表示没有错误），第二个参数是目标目录的路径。
  },
  filename: function (req, file, cb) {
    const uniqueFilename = file.originalname;
    if (fs.existsSync(path.join("uploads/", uniqueFilename))) {
      // 如果文件名已存在，触发失败
      // const error = new Error('文件名已存在');
      // error.code = 'FILE_EXISTS';
      // cb(error);
      cb(null, "已存在同名文件，可直接删除" + uniqueFilename);
    } else {
      cb(null, uniqueFilename);
    }
  },
});

const upload = multer({ storage: storage });

//设置跨域请求
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


//上传文件逻辑
app.post("/upload", upload.array("files", 11), (req, res) => {
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，需要加1，并保证两位数格式
    const day = now.getDate().toString().padStart(2, "0"); // 日期保证两位数格式
    const hour = now.getHours().toString().padStart(2, "0"); // 小时保证两位数格式
    const minute = now.getMinutes().toString().padStart(2, "0"); // 分钟保证两位数格式
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  // 文件上传成功，上传的文件列表存储在 req.files 中
  const files = req.files;
  // 遍历数组并为每个对象追加添加的时间属性属性
  files.forEach((obj) => {
    const uniqueSuffix = getCurrentDateTime(); // 获取时间
    const absoluteFilePaths = path.resolve(uploadDir, obj.filename); // 使用 resolve 方法获取文件的绝对路径
    obj.uploadtime = uniqueSuffix;
    obj.serverPath = absoluteFilePaths;
  });
  if (!files || req.files.some((file) => file instanceof multer.MulterError)) {
    res.status(400).json({ message: "文件上传失败" });
  } else {
    // 读取已有的数据（如果有的话）
    let existingData = [];
    try {
      const data = fs.readFileSync(dataFile, "utf8");
      existingData = JSON.parse(data);
    } catch (err) {
      // 如果文件不存在或解析失败，不需要处理
    }

    // 合并已有数据和新上传的数据
    const combinedData = existingData.concat(files);

    // 写入数据到json文件
    fs.writeFileSync(dataFile, JSON.stringify(combinedData), "utf8");
    console.log('文件上传成功')
    res.send({ files: req.files, content: req.body });
    res.json({
      message: "文件上传成功",
      file: req.files[0],
      files: combinedData,
      content: req.body,
    });
  }
});



//删除逻辑
app.delete("/deleteFile/:filename", (req, res) => {
  const filename = req.params.filename; // 获取文件名称
const absoluteFilePath = path.resolve(uploadDir, filename);// 使用 resolve 方法获取文件的绝对路径
  // 在这里执行删除文件的操作，根据文件名删除文件 ，使用fs模块来删除文件
  fs.unlink(
    absoluteFilePath,
    (err) => {
      if (err) {
        console.error("文件删除失败", err);
        res.status(500).json({ message: "文件删除失败" });
      } else {
        console.log("文件删除成功",absoluteFilePath);
        const newData = readData().filter((item) => item.filename !== filename);
        fs.writeFileSync(dataFile, JSON.stringify(newData), "utf8");
        res.json({ message: "文件删除成功" });
      }
    }
  );
});



//修改文件名称逻辑
app.post("/changeName/:filename", (req, res) => {
  const filename = req.params.filename;
  const NewName = req.body.NewName;
  if (!NewName) {
    return res.status(400).json({ error: "新名称不能为空" });
  }
  const oldFilePath = path.join(uploadDir, filename);
  const newFilePath = path.join(uploadDir, NewName);

  // 检查文件是否存在
  if (!fs.existsSync(oldFilePath)) {
    return res.status(404).json({ error: "文件不存在" });
  }

  // 重命名文件
  fs.renameSync(oldFilePath, newFilePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "文件重命名失败", details: err });
    }
  });
  const  newData = readData().map((item) => {
    console.log('???????????????????',item.filename === filename)
    if (item.filename === filename) {
      return {
        ...item,
        filename: NewName,
        path: `uploads//${NewName}`,
      };
    }
    return item;
  });
  fs.writeFileSync(dataFile, JSON.stringify(newData), "utf8");
  console.log("重命名文件成功：", newData);
  res.json({ message: "文件重命名成功" });
});




//向前端返回总文件数据
app.get("/serverdata", (req, res) => {
  const serverdata = readData();
  res.json(serverdata); // 发送核心数据给前端
});


















// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors()); // 启用 CORS 中间件，允许所有跨源请求
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
