let dataJSON = require('./data.json');
let Test: any = null;
let _Obj: any = null;
const addChoose = () => {
  if (dataJSON.pageQus[0] && dataJSON.pageQus[0].flag === 1) {//选择题
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
    dataJSON.pageQus[0].pros.push(chooseQus)
  } else {
    let choosePro: any = {
      sort: null,
      attribute: null,
      content: null,
      annexable: null,
      group: "0",
      pIndex: null,
      flag: 1,//选择题
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
    dataJSON.pageQus.unshift(choosePro)
  }
}
const addFrame = (join: boolean) => {
  let proFrame: any = {
    sort: null,
    attribute: null,
    content: null,
    annexable: null,
    group: "0",
    pIndex: null,
    pros: []
  };

  if (!join) {
    proFrame.pros.push({
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
    proFrame.pros.push({
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
  dataJSON.pageQus.push(proFrame)
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
  </select>`)
  $("#qus > option").click((e) => {
    $("#answerCard").empty();
    //@ts-ignore
    switch (e.target.value) {
      case "1":
        addChoose()
        break;
      case "2":
        addFrame(false)
        break;
      case "3":
        addFrame(true)
        break;
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