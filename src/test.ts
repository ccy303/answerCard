let dataJSON = require('./data.json');
let Test: any = null;
let _Obj: any = null;
let chooseGroup = 1;
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
 * @param chooseCount 选项个数
 */
const addChoose = (number: number, chooseCount: number = 4) => {
  if (number <= 0) { return }
  if (dataJSON.pageQus[0] && dataJSON.pageQus[0].flag === 1) {//选择题
    let chooseQus: any = {
      proId: null,
      score: null,
      pureObjective: "1",
      content: "",
      sort: null,
      pnum: "",
      group: "0",
      titleType: "选择题",
      qus: [
        {
          quId: null,
          score: null,
          quType: "单选题",
          nums: String(chooseCount),
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
      score: null,
      pureObjective: "1",
      content: "",
      sort: null,
      pnum: "",
      group: "0",
      titleType: "选择题",
      qus: [
        {
          quId: null,
          score: null,
          quType: "单选题",
          nums: String(chooseCount),
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
 * @param joinFrame 是否同框
 * @param count 小问个数
 * @param choose 是否为选做题
 */
const addFrame = (choose: boolean, join: boolean, joinFrame: boolean, count: number) => {
  let proFrameObj: any = new proFrame();
  if (choose) {//选做题
    console.log(20)
    proFrameObj.group = String(chooseGroup)
    let flag = count;
    while (flag > 0) {
      proFrameObj.pros.push({
        proId: null,
        score: null,
        pureObjective: "2",
        content: "",
        sort: null,
        pnum: "",
        group: String(chooseGroup),
        titleType: "解答题",
        joinProNum: join, //标记是否合并题号
        qus: [{
          quId: null,
          score: null,
          quType: "解答题",
          nums: null,
          content: "",
          pnum: "",
          visible: true,
          rIndex: null
        }]
      })
      flag--
    }
    chooseGroup++;
1  } else {
    if (!join) {//不合并题号
      if (joinFrame) {//同框
        proFrameObj.pros.push({
          proId: null,
          score: null,
          pureObjective: "2",
          content: "",
          sort: null,
          pnum: "",
          group: "0",
          titleType: "解答题",
          joinProNum: join, //标记是否合并题号
          qus: []
        })
        let flg = count
        while (flg > 0) {
          proFrameObj.pros[0].qus.push({
            quId: null,
            score: null,
            quType: "解答题",
            nums: null,
            content: "",
            pnum: "",
            visible: true,
            rIndex: null
          })
          flg--
        }
      } else {//不同框
        let flag = count;
        proFrameObj = [];
        while (flag > 0) {
          let frame = new proFrame();
          frame.pros.push({
            proId: null,
            score: null,
            pureObjective: "2",
            content: "",
            sort: null,
            pnum: "",
            group: "0",
            titleType: "解答题",
            qus: [{
              quId: null,
              score: null,
              quType: "解答题",
              nums: null,
              content: "",
              pnum: "",
              visible: true,
              rIndex: null
            }]
          })
          proFrameObj.push(frame)
          flag--;
        }
      }
    } else {//合并题号
      proFrameObj.pros.push({
        proId: null,
        score: null,
        pureObjective: "2",
        content: "",
        sort: null,
        pnum: "",
        group: "0",
        titleType: "解答题",
        joinProNum: join,
        qus: []
      })
      let flag = count;
      while (flag > 0) {
        proFrameObj.pros[0].qus.push({
          quId: null,
          score: null,
          quType: "解答题",
          nums: null,
          content: "",
          pnum: "",
          visible: true,
          rIndex: null
        })
        flag--;
      }
    }
  }
  Array.isArray(proFrameObj) ? dataJSON.pageQus.push(...proFrameObj) : dataJSON.pageQus.push(proFrameObj)

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
    score: null,
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
      score: null,
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
/**
 * 添加作文题
*/
const addWrite = () => {
  let proFrameObj = new proFrame();
  proFrameObj.pros.push({
    proId: null,
    score: null,
    pureObjective: "2",
    content: "",
    sort: null,
    pnum: null,
    group: "0",
    titleType: "作文",
    qus: [{
      quId: null,
      score: null,
      quType: "作文题",
      nums: null,
      content: "",
      pnum: null,
      visible: true,
      rIndex: null
    }]
  })
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
    <option value="8">客观题(选做题)</option>
    <option value="4">提空提</option>
    <option value="5">作文题</option>
    <option value="6">选做题</option>
  </select>`)
  $("#qus > option").click((e) => {
    $("#answerCard").empty();
    //@ts-ignore
    switch (e.target.value) {
      case "1":
        addChoose(5)
        break;
      case "2":
        addFrame(false, false, true, 2)
        break;
      case "3":
        addFrame(false, true, true, 2)
        break;
      case "4":
        addBlankQues(10, 3)
        break
      case "5":
        addWrite()
        break
      case "6":
        addFrame(true, false, false, 2)
        break;
      case "7":
        addFrame(false, false, false, 2)
        break;

    }
    calculationPnum()
  })
}

const calculationPnum = () => {
  let pnum = 1;
  let proSort = 1;
  //计算题号
  dataJSON.pageQus.map((obj: any, obj_i: number) => {
    obj.sort = String(obj_i + 1); //每一个框的排序
    obj.pros.map((pro: any, pro_i: number) => {
      let flag = pnum;
      pro.sort = String(proSort); //pro结构中的sort排序
      pro.pnum = pnum;
      if (pro.qus.length === 1 && obj.flag === 1) {
        pro.qus[0].pnum = pnum;
      } else if (pro.qus.length !== 1) {
        pro.qus.map((val: any, index: any) => {
          if (!pro.joinProNum) {
            val.pnum = String(pnum)
            pro.pnum = '';
            pnum++;
          } else {
            val.pnum = `(${index + 1})`
          }
        })
      }
      proSort++;
      pnum === flag && pnum++
    })
  })
  console.log(dataJSON)
  Test(_Obj)
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