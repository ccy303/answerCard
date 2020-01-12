//单独打包样式文件
var fs = require("fs")
var basePath = "src";
var output = 'packStyle'
//创建文件夹
fs.mkdir(output, { recursive: true }, function (err) {
  if (err) {
    console.log(err)
  }
})
var exist = fs.existsSync(output + "/index.scss")
exist && fs.unlinkSync('packStyle/index.scss')
//读取文件
var readFile = function (path) {
  var fd = fs.openSync(path);
  var fileDetail = fs.readFileSync(fd)
  writeFile(path, fileDetail)
}

//写入文件
var writeFile = function (path, data) {
  var writePath = path.split('/')
  fs.writeFileSync(
    output + '/' + 'index.scss',
    `@import "./${writePath[writePath.length - 1]}";`,
    { flag: 'a' }
  )
  fs.writeFileSync(output + '/' + writePath[writePath.length - 1], data)
}

//获取文件信息
var getFileInfo = function (path) {
  var info = fs.statSync(path)
  if (info.isFile()) {
    if (path.indexOf('.scss') !== -1) {
      readFile(path)
    }
  } else {
    readDir(path)
  }
}

//读取目录
var readDir = function (path) {
  var fileList = fs.readdirSync(path)
  fileList.forEach(function (file) {
    getFileInfo(path + '/' + file)
  })
}

readDir(basePath)

var sass = require('node-sass')
sass.render({
  file: 'packStyle/index.scss',
  outputStyle: 'compressed'
}, function (err, res) {
  if (res) {
    fs.writeFileSync('packStyle/index.css', res.css, function (err) {
      console.log(err)
    })
  }
})