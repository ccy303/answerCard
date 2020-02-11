let dataJSON = require('./data.json');
let Test: any = null;
let _Obj: any = null;
class proFrame {
  sort: any = null
  attribute: any = null
  content: any = null
  annexable: any = null
  group: any = "0"
  pIndex: any = null
  pros: any = []
  flag?: any; //编辑选择题1，标记填空题2
  rowCount?: any  //添加填空题时标记每行显示的填空题数量
}
/**
 * 添加选择题
 * @param number 添加数量
 */
const addChoose = (number: number) => {
  if (number <= 0) { return }
  if (dataJSON.pageQus[0] && dataJSON.pageQus[0].flag === 1) {//选择题
    let chooseQus: any = {
      proId: null,
      score: 0,
      pureObjective: "1",
      content: "",
      sort: null,
      pnum: "",
      group: "0",
      titleType: "选择题",
      qus: [
        {
          quId: null,
          score: 0,
          quType: "单选题",
          nums: "4",
          content: "",
          pnum: 1,
          visible: true,
          rIndex: null
        }
      ]
    }
    dataJSON.pageQus[0].pros.push(chooseQus)
  } else {
    let choosePro = new proFrame()
    choosePro.flag = 1;//选择题
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
    dataJSON.pageQus.unshift(choosePro)
  }
  addChoose(--number)
}
/**
 * 添加主观题
 * @param join 是否合并主观题小问
 * @param count 小问个数
 */
const addFrame = (join: boolean, count?: number) => {
  let proFrameObj = new proFrame();
  if (!join) {
    proFrameObj.pros.push({
      proId: null,
      score: 6,
      pureObjective: "2",
      content: "",
      sort: null,
      pnum: "",
      group: "0",
      titleType: "解答题",
      qus: [{
        quId: null,
        score: 6,
        quType: "解答题",
        nums: null,
        content: "",
        pnum: "",
        visible: true,
        rIndex: null
      }]
    })
  } else {
    proFrameObj.pros.push({
      proId: null,
      score: 6,
      pureObjective: "2",
      content: "",
      sort: null,
      pnum: "",
      group: "0",
      titleType: "解答题",
      qus: [{
        quId: null,
        score: 6,
        quType: "解答题",
        nums: null,
        content: "",
        pnum: "",
        visible: true,
        rIndex: null
      }, {
        quId: null,
        score: 6,
        quType: "解答题",
        nums: null,
        content: "",
        pnum: "",
        visible: true,
        rIndex: null
      }]
    })
  }
  dataJSON.pageQus.push(proFrameObj)
}
/**
 * 添加填空题
 * @param count 填空个数
 * @param rowCount 每行空格数
*/
const addBlankQues = (count: number, rowCount: number) => {
  let proFrameObj = new proFrame();
  proFrameObj.flag = 2;
  proFrameObj.rowCount = rowCount;
  proFrameObj.pros.push({
    proId: null,
    score: 6,
    pureObjective: "2",
    content: "",
    sort: null,
    pnum: "",
    group: "0",
    titleType: "填空题",
    qus: []
  });
  while (count > 0) {
    proFrameObj.pros[0].qus.push({
      quId: null,
      score: 6,
      quType: "填空题",
      nums: null,
      content: "",
      pnum: "",
      visible: true,
      rIndex: null
    })
    count--
  }
  dataJSON.pageQus.push(proFrameObj)
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
      dataJSON = require('./test.json');
    }
    Test(_Obj)
  })
}
const renderTestQue = () => {
  $('#answerCard').before(`<select id="qus">
    <option selected value="0">添加题目操作</option>
    <option value="1">选择题</option>
    <option value="2">客观题</option>
    <option value="3">合并观题</option>
    <option value="4">提空提</option>
  </select>`)
  $("#qus > option").click((e) => {
    $("#answerCard").empty();
    //@ts-ignore
    switch (e.target.value) {
      case "1":
        addChoose(5)
        break;
      case "2":
        addFrame(false)
        break;
      case "3":
        addFrame(true)
        break;
      case "4":
        addBlankQues(10, 3)
        break
    }
    let pnum = 1;
    dataJSON.pageQus.map((obj: any, obj_i: number) => {
      obj.sort = String(obj_i + 1);
      obj.pros.map((pro: any, pro_i: number) => {
        pro.sort = String(pro_i + 1);
        pro.pnum = pnum;
        if (pro.qus.length === 1 && obj.flag === 1) {
          pro.qus[0].pnum = pnum;
        } else if (pro.qus.length !== 1) {
          pro.qus.map((val: any, index: any) => {
            val.pnum = `(${index + 1})`
          })
        }
        pnum++;
      })
    })
    console.log(dataJSON)
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