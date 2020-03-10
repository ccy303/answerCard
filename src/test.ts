let dataJSON = require('./data.json');
let _Obj: any = null;
let editor: any = null
let renderSel = true;
const renageChangeNum = () => {
  $('#answerCard').before(`<button id="changeNum">点击改变学号</button>`)
  $('#answerCard').before(`<button id="delPro">删除题目</button>`)
  $('#changeNum').click(() => {
    editor.reRenderHeader(Math.ceil(Math.random() * 10))
  })
  $('#delPro').click(() => {
    editor.delPro(
      editor.dataJson.operations[0].pnumArr[0].proId,
      editor.dataJson.operations[0].pnumArr[0].qusId,
      editor.dataJson.operations[0].operationId
    )
  })
}
const renderTestTypeCom = () => {
  $('#answerCard').before(`<select id="type">
    <option value="1">生成答题卡</option>
    <option value="2">新建答题卡</option>
  </select>`)
  $('#type').change((e) => {
    $("#answerCard").empty();
    //@ts-ignore
    if (e.target.value === '1') {
      dataJSON = require('./data.json');
    } else {
      dataJSON = require('./emptyData.json');
    }
    Test(_Obj)
  })
}
const renderTestQue = () => {
  $('#answerCard').before(`<select id="qus">
    <option selected value="0">添加题目操作</option>
    <option value="1">选择题</option>
    <option value="2">客观题(不合并题号。同框)</option>
    <option value="7">客观题(不合并题号。不同框)</option>
    <option value="3">客观题(合并题号，同框)</option>
    <option value="6">客观题(选做)</option>
    <option value="5">作文题</option>
    <option value="40">提空提(同框，不合并题号)</option>
    <option value="41">提空提(同框，合并题号)</option>
    <option value="42">提空提(不同框)</option>
    <option value="9">判断题</option>
  </select>`)
  $("#qus > option").click((e) => {
    $("#answerCard").empty();
    //@ts-ignore
    switch (e.target.value) {
      case "1":
        editor.addChoose(5, 4)
        break;
      case "2":
        editor.addFrame(false, false, true, 2)
        break;
      case "3":
        editor.addFrame(false, true, true, 2)
        break;
      case "40":
        editor.addBlankQues(true, false, [1, 2, 3, 1, 1])
        break
      case "41":
        editor.addBlankQues(true, true, [1, 1, 1, 1, 1, 1])
        break
      case "42":
        editor.addBlankQues(false, false, [2, 1, 3, 1, 1])
        break
      case "5":
        editor.addWrite()
        break
      case "6":
        editor.addFrame(true, false, false, 2)
        break;
      case "7":
        editor.addFrame(false, false, false, 2)
        break;
      case "9":
        editor.addChoose(5)
        break;
    }
  })
}

export let Test: any = (OBJ: any) => {
  if (renderSel) {
    renageChangeNum()
    renderTestTypeCom()
    renderTestQue()
    renderSel = false
  }
  _Obj = OBJ;
  editor = new OBJ({
    dataJSON: dataJSON,
    both: true,
    config: {
      uploadUrl: 'http://dev.api.teacher.ennnjoy.cn/Api/UploadFile/Policy',
      queryData: {
        Token: '692a65c3f6e7a933b9a32a6ce182f82d99fe4bde',
        inType: 41,
      }
    },
    dom: null
  })
}
