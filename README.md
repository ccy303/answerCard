## 发包步骤 
1.版本号修改；2.打包（npm run build）；3.发包（npm publish）
凡是修改了.scss(sass)样式文件都需要运行npm run css 独立打包所有样式文件，交由后端，用于生成PDF
## 项目中引用  
```javascript
import answerCard from answerCard
let editor = new answerCard({
  dom: '需要转化成editor的dom'
  dataJSON: '题目结构json，注意生成和新建两条使用路线json数据结构不一样，参照下面文档'
  both: '单/双面生成'
  config: { //'配置文件'
    uploadUrl: '文件上传url'
    queryData: {
      Token: '接口token'
      inType: 41
    }
  }
})
```
## 实际项目使用两条线路
### 生成答题卡
传递特定数据json; 如 ./src/data.json
```javascript
//动态修改学生考号位数
editor.reRenderHeader(考号位数)
```
### 新建答题卡
基本可参考test.ts
传递特定数据json; 如 ./src/emptyDate.json
添加题目操作中，每执行一个添加操作回在生成一个operation对象
此对象存放于dataJSON中的operations(Array类型)字段中，
对应的题目json结构中回存放此operation对象的operationId用于关联操作和题目结构；
且会为所添加的题目或小问生成随机proId和quId(唯一)用于方便题目操做如删除操作等。
```javascript
//添加选择题（单选）
editor.addChoose(添加数量, 选择个数)
//添加选择题（多选）
editor.addChoose(添加数量, 选择个数, true)
//添加判断题
editor.addChoose(添加数量)
/**
 * 添加填空题
 * argArr为一个数组，argArr.length 为要添加的题目数量, 每项的值为该题的空格数；（如：[1，2]表示添加两题，第一题一个空格，第二题两个空格）
*/
editor.addBlankQues(true/false(同框/不同框), true/false(合并题号/不合并题号), argArr)
//添加解答题
editor.addFrame(true/false(选做题/非选座题), true/false(合并小问/不合并小文), true/false(同框/不同框), 添加数量)
//添加作文题
editor.addWrite()
//删除添加操作的小题
editor.delPro(题目id,小题id,操作id)
```
