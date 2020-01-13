let dataJSON = require('./data.json');
let Test: any = null;
let _Obj: any = null;
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
      dataJSON = require('./test.json');
    }
    Test = (OBJ: any) => {
      _Obj = OBJ;
      new OBJ({
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
    Test(_Obj)
  })
}
const renderTestQue = () => {
  $('#answerCard').before(`<select id="qus">
    <option value="1">选择题</option>
    <option value="2">客观题</option>
  </select>`)
  $("#qus").change((e) => {
    $("#answerCard").empty();
    //@ts-ignore
    if (e.target.value === "1") {
      let choosePro: any = {
        sort: null,
        attribute: null,
        content: null,
        annexable: "1",
        group: "0",
        pIndex: null,
        pros: []
      }
      let chooseQus: any = {
        proId: null,
        score: 5,
        pureObjective: "1",
        content: "",
        sort: null,
        pnum: "",
        group: "0",
        titleType: "选择题",
        qus: [
          {
            quId: null,
            score: 5,
            quType: "单选题",
            nums: "4",
            content: "",
            pnum: 1,
            visible: true,
            rIndex: null
          }
        ]
      }
      choosePro.pros.push(chooseQus)
      dataJSON.pageQus.push(choosePro)
    }
    Test(_Obj)
  })
}
Test = (OBJ: any) => {
  _Obj = OBJ;
  new OBJ({
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

renderTestTypeCom()
renderTestQue()
module.exports = Test