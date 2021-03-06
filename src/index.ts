import 'babel-polyfill'
import GlobalData from './conpoment/global'
import Page from './conpoment/page/page';
import Tool from './tool/tool'
import { Test } from './test';
let chooseGroup = 1;
class proFrame {
   sort: any = null
   attribute: any = null
   content: any = null
   annexable: any = null
   group: any = "0"
   pIndex: any = null
   pros: any = []
   flag?: any; //标记选择题1，标记填空题2
   rowCount?: any  //添加填空题时标记每行显示的填空题数量
}
class Operations {
   type: any = null;
   multiple: any = null
   title: any = null
   optNum: any = null
   count: any = null
   operationId: any = null
   pnum: any = [0, 0] //[1,5] 1-5题
   pnumArr: any = [];
   constructor(type: any, multiple: any, title: any, optNum: any, count: any) {
      this.type = type
      this.multiple = multiple
      this.title = title
      this.optNum = optNum
      this.count = count
      this.operationId = parseInt(String(new Date().getTime() + parseInt(String(Math.random() * 10000000))).substr(-7));
   }
}
class AnswerCard {
   dataJson: any
   both: boolean //是否双面
   obj: any
   set pages(val: any) {
      GlobalData.pageObject = val;
   }
   get pages() {
      return GlobalData.pageObject
   }
   constructor(obj: any) {
      this.init(obj)
   }
   public init(obj: any, a?: any) {
      GlobalData.clearProps();
      this.obj = obj
      this.dataJson = this.obj.dataJSON;
      this.both = this.obj.both
      GlobalData.dataJSON = this.dataJson;
      GlobalData.config = this.obj.config;
      GlobalData.pageType = this.obj.dataJSON.paperSize;
      GlobalData.subjectId = this.obj.dataJSON.subjectId;
      GlobalData.dom = this.obj.dom ? $(this.obj.dom) : $('#answerCard');
      GlobalData.dom && GlobalData.dom.attr('id', 'answerCard');
      GlobalData.pageColum = parseInt(this.obj.dataJSON.layoutType);
      GlobalData.dom.on('click', () => {
         $('#contentText').remove()
      })
      let html = this.dataJson.cardHtml
      if (html) {
         html = JSON.parse(html)
         let i = 0;
         while (true) {
            if (i > html.length - 1) break;
            let page = new Page(this.addPage.bind(this), html[i])
            page.pageInit()
            this.pages = page
            i++
         }
         return
      }
      let page = new Page(this.addPage.bind(this))
      page.pageInit()
      this.pages = page
   }
   private addPage() {
      let page = new Page(this.addPage.bind(this));
      if (this.both) { //双面打印
         $('#answerCard .page').length % 2 === 0 ?
            page.pageInit(false, true) :
            page.pageInit(false, false)
      } else {
         page.pageInit(false, true)
      }
      this.pages = page
   }
   public htmlToJson(): string {//把html 转化成json返回
      GlobalData.currentImage = null // 保存是取消图片选中时的boder样式
      let pages = $('#answerCard').children('.page');
      pages.removeClass('boxShadow')
      let arr = [];
      for (let i = 0; i < pages.length; i++) {
         arr.push(pages[i].outerHTML)
      }
      return JSON.stringify(arr)
   }
   public getLayoutData() {//获取新的json
      this.dataJson.pageQus.map((pros: any) => {
         pros.pros.map((qus: any) => {
            if (qus.pureObjective === '1') {//客观题
               pros.pIndex = Tool.selPIndex()
               qus.qus.map((_ques: any) => {
                  let rIndex = Tool.selectProRIndex($(`[targetID='${_ques.quId}${_ques.pnum}']`))
                  _ques.rIndex = rIndex
               })
            } else {
               let pIndex = Tool.subjectiveQuestionsPindex($(`[targetID='${pros.pros[0].proId}']`))
               pros.pIndex = pIndex
            }
         })
      })
   }
   public reRenderHeader(count: number) {//重新绘制答题卡头: 参数count学号位数
      let length = GlobalData.headerObj.length;
      let i = 0;
      while (true) {
         if (i > length - 1) break
         GlobalData.headerObj[i].reRenderHeader(count)
         i++
      }
   }
   /**
   * 添加选择题 只传number为判断题
   * @param number 添加数量
   * @param chooseCount 选项个数
   * @param multiple 是否多选题
   */
   public addChoose(number: number, chooseCount: number, multiple: boolean = false) {
      let opera = new Operations(
         !chooseCount && !multiple ? 'judge' : 'sel',
         multiple,
         (!chooseCount && !multiple) ? '判断题' : multiple ? '多选题' : '单选题',
         chooseCount,
         number,
      )
      if (!chooseCount && !multiple) {
         opera.type = 'judge'
      }
      GlobalData.dataJSON.operations.push(opera)
      this.chooseFun(number, chooseCount, multiple, opera)
      return GlobalData.dataJSON.operations
   }
   private chooseFun(number: number, chooseCount: number, multiple: boolean, opera: any) {
      if (number <= 0) {
         this.init(this.obj);
         return
      }
      let dataJSON = GlobalData.dataJSON
      if (dataJSON.pageQus[0] && dataJSON.pageQus[0].flag === 1) {//选择题
         let chooseQus: any = {
            joinProNum: false,
            proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
            score: 0,
            pureObjective: "1",
            content: "",
            sort: null,
            pnum: "",
            group: "0",
            titleType: "选择题",
            operationId: opera.operationId,
            qus: [
               {
                  answer: '',
                  quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                  score: 0,
                  quType: !chooseCount && !multiple ? '判断题' : multiple ? "多选题" : "单选题",
                  nums: !chooseCount && !multiple ? '2 ' : String(chooseCount),
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               }
            ]
         }
         opera.pnumArr.push({
            title: opera.count - number + 1,
            opt: !chooseCount && !multiple ? ['对', '错'] : 'ABCDEFGHIJKLNMOPRSTUVWXYZ'.slice(0, chooseCount).split(''),
            answer: '',
            score: '',
            proId: chooseQus.proId,
            qusId: chooseQus.qus[0].quId,
         })
         dataJSON.pageQus[0].pros.push(chooseQus)
      } else {
         let choosePro = new proFrame()
         choosePro.flag = 1;//选择题
         let chooseQus: any = {
            joinProNum: false,
            proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
            score: 0,
            pureObjective: "1",
            content: "",
            sort: null,
            pnum: "",
            group: "0",
            titleType: "选择题",
            operationId: opera.operationId,
            qus: [
               {
                  answer: '',
                  quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                  score: 0,
                  quType: !chooseCount && !multiple ? '判断题' : multiple ? "多选题" : "单选题",
                  nums: !chooseCount && !multiple ? '2 ' : String(chooseCount),
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               }
            ]
         }
         opera.pnumArr.push({
            title: opera.count - number + 1,
            opt: !chooseCount && !multiple ? ['对', '错'] : 'ABCDEFGHIJKLNMOPRSTUVWXYZ'.slice(0, chooseCount).split(''),
            answer: '',
            score: '',
            proId: chooseQus.proId,
            qusId: chooseQus.qus[0].quId,
         })
         choosePro.pros.push(chooseQus)
         dataJSON.pageQus.unshift(choosePro)
      }
      this.calculationPnum();
      this.chooseFun(--number, chooseCount, multiple, opera)
   }
   /**
   * 添加主观题
   * @param join 是否合并主观题小问
   * @param joinFrame 是否同框
   * @param count 小问个数
   * @param choose 是否为选做题
   */
   public addFrame(choose: boolean, join: boolean, joinFrame: boolean, count: number) {
      let dataJSON = GlobalData.dataJSON
      let proFrameObj: any = new proFrame();
      let operation = new Operations(
         choose ? 'choosePro' : 'normalPro',
         false,
         choose ? '选做题' : '解答题',
         null,
         count
      );
      if (choose) {//选做题
         proFrameObj.group = String(chooseGroup)
         let flag = 0;
         while (flag < count) {
            proFrameObj.pros.push({
               proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
               score: 0,
               pureObjective: "2",
               content: "",
               sort: null,
               pnum: "",
               group: String(chooseGroup),
               titleType: "解答题",
               joinProNum: join, //标记是否合并题号
               operationId: operation.operationId,
               qus: [{
                  answer: '',
                  quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                  score: 0,
                  quType: "解答题",
                  nums: null,
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               }]
            })
            operation.pnumArr.push({
               title: flag + 1,
               opt: '',
               answer: '',
               score: '',
               proId: proFrameObj.pros[flag].proId,
               qusId: proFrameObj.pros[flag].qus[0].quId,
            })
            flag++
         }
         chooseGroup++;
      } else {
         if (joinFrame) { // 同框
            proFrameObj.pros.push({
               proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
               score: 0,
               pureObjective: "2",
               content: "",
               sort: null,
               pnum: "",
               group: "0",
               titleType: "解答题",
               joinProNum: join, //标记是否合并题号
               operationId: operation.operationId,
               qus: []
            })
            let flag = 0
            while (flag < count) {
               proFrameObj.pros[0].qus.push({
                  answer: '',
                  quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                  score: 0,
                  quType: "解答题",
                  nums: null,
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               })
               operation.pnumArr.push({
                  title: flag + 1,
                  opt: '',
                  answer: '',
                  score: '',
                  proId: proFrameObj.pros[0].proId,
                  qusId: proFrameObj.pros[0].qus[flag].quId,
               })
               flag++
            }
         } else { //不同框
            let flag = 0;
            proFrameObj = [];
            while (flag < count) {
               let frame = new proFrame();
               frame.pros.push({
                  proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                  score: 0,
                  pureObjective: "2",
                  content: "",
                  sort: null,
                  pnum: "",
                  group: "0",
                  titleType: "解答题",
                  operationId: operation.operationId,
                  qus: [{
                     answer: '',
                     quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                     score: 0,
                     quType: "解答题",
                     nums: null,
                     content: "",
                     pnum: "",
                     visible: true,
                     rIndex: null
                  }]
               })
               operation.pnumArr.push({
                  title: flag + 1,
                  opt: '',
                  answer: '',
                  score: '',
                  proId: frame.pros[0].proId,
                  qusId: frame.pros[0].qus[0].quId,
               })
               proFrameObj.push(frame)
               flag++
            }
         }
      }
      Array.isArray(proFrameObj) ? dataJSON.pageQus.push(...proFrameObj) : dataJSON.pageQus.push(proFrameObj)
      GlobalData.dataJSON.operations.push(operation)
      this.calculationPnum();
      this.init(this.obj);
      return GlobalData.dataJSON.operations
   }
   /**
    * 添加填空题
    * @param joinFrame 同框
    * @param joinProNum 合并题号
    * @param argArr 每题空格数
   */
   public addBlankQues(joinFrame: boolean, joinProNum: boolean, argArr: any[]) {
      let operation = new Operations(
         'blank',
         false,
         '填空题',
         null,
         argArr.length
      );
      let dataJSON = GlobalData.dataJSON
      let proFrameObj: any = new proFrame();
      proFrameObj.flag = 2;
      if (joinFrame) { //同框
         proFrameObj.pros.push({
            proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
            score: 0,
            pureObjective: "2",
            content: "",
            sort: null,
            pnum: "",
            group: "0",
            titleType: "填空题",
            joinProNum: joinProNum, //标记是否合并题号
            operationId: operation.operationId,
            qus: []
         })
         for (let i = 0; i < argArr.length; i++) {
            proFrameObj.pros[0].qus.push({
               answer: '',
               quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
               score: 0,
               quType: "填空题",
               nums: null,
               blankNums: argArr[i],
               content: "",
               pnum: "",
               visible: true,
               rIndex: null
            })
            operation.pnumArr.push({
               title: i + 1,
               opt: '',
               answer: '',
               score: '',
               proId: proFrameObj.pros[0].proId,
               qusId: proFrameObj.pros[0].qus[i].quId,
            })
         }
      } else { //不同框（只能不合并题号）
         proFrameObj = [];
         for (let i = 0; i < argArr.length; i++) {
            let frame = new proFrame();
            frame.flag = 2;
            frame.pros.push({
               proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
               score: 0,
               pureObjective: "2",
               content: "",
               sort: null,
               pnum: "",
               group: "0",
               titleType: "填空题",
               operationId: operation.operationId,
               qus: [{
                  answer: '',
                  quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
                  score: 0,
                  quType: "填空题",
                  nums: null,
                  blankNums: argArr[i],
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               }]
            })
            operation.pnumArr.push({
               title: i + 1,
               opt: '',
               answer: '',
               score: '',
               proId: frame.pros[0].proId,
               qusId: frame.pros[0].qus[0].quId,
            })
            proFrameObj.push(frame)
         }

      }
      Array.isArray(proFrameObj) ? dataJSON.pageQus.push(...proFrameObj) : dataJSON.pageQus.push(proFrameObj)
      GlobalData.dataJSON.operations.push(operation)
      this.calculationPnum();
      this.init(this.obj);
      return GlobalData.dataJSON.operations
   }
   /**
    * 添加作文题
   */
   public addWrite() {
      let operation = new Operations(
         'write',
         false,
         '作文题',
         null,
         1
      );
      let dataJSON = GlobalData.dataJSON
      let proFrameObj = new proFrame();
      proFrameObj.pros.push({
         proId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
         score: null,
         pureObjective: "2",
         content: "",
         sort: null,
         pnum: null,
         group: "0",
         titleType: "作文",
         operationId: operation.operationId,
         qus: [{
            answer: '',
            quId: 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5),
            score: 0,
            quType: "作文题",
            nums: null,
            content: "",
            pnum: null,
            visible: true,
            rIndex: null
         }]
      })
      operation.pnumArr.push({
         title: 1,
         opt: '',
         answer: '',
         score: '',
         proId: proFrameObj.pros[0].proId,
         qusId: proFrameObj.pros[0].qus[0].quId,
      })
      dataJSON.pageQus.push(proFrameObj)
      GlobalData.dataJSON.operations.push(operation)
      this.calculationPnum();
      this.init(this.obj);
      return GlobalData.dataJSON.operations
   }
   /**
    * 删除题目
    * @param proId 题目id
    * @param queId 小题id
    * @param operationId 操作id
   */
   public delPro(proId: any, queId: any, operationId: any) {
      this.obj.dataJSON.pageQus = this.obj.dataJSON.pageQus.filter((obj: any) => {
         obj.pros = obj.pros.filter((pro: any) => {
            if (pro.operationId == operationId && pro.proId == proId) {
               pro.qus = pro.qus.filter((qus: any) => {
                  return qus.quId != queId;
               })
            }
            return pro.qus.length > 0
         })
         return obj.pros.length > 0
      })
      let flag: any = null;
      this.obj.dataJSON.operations.map((opera: Operations, index: any, arr: Array<Operations>) => {
         if (opera.operationId == operationId) {
            opera.count -= 1;
            opera.pnumArr = opera.pnumArr.filter((pnum: any) => {
               return pnum.qusId != queId;
            })
         }
      })
      this.obj.dataJSON.operations = this.obj.dataJSON.operations.filter((val: Operations) => {
         return val.pnumArr.length > 0
      })
      this.calculationPnum(this.obj.dataJSON);
      this.init(this.obj);
   }
   /**
    * 获取dataJSON.operations
   */
   public getOperations() {
      return GlobalData.dataJSON.operations
   }

   public calculationPnum(dataJSON?: any) {
      if (!dataJSON) {
         dataJSON = GlobalData.dataJSON
      }
      let pnum = 1;
      let proSort = 1;
      dataJSON.pageQus.map((obj: any, obj_i: number) => {
         obj.sort = String(obj_i + 1); //每一个框的排序
         obj.pros.map((pro: any, pro_i: number) => {
            let opera: Operations = dataJSON.operations.find((val: Operations) => {
               return val.operationId === pro.operationId;
            })
            pro.sort = String(proSort); //pro结构中的sort排序
            pro.qus.map((val: any, index: any) => {
               if (pro.joinProNum) {
                  pro.pnum = pnum
                  val.pnum = `(${index + 1})`
                  index == pro.qus.length - 1 && pnum++
                  opera.pnumArr.map((pnumArr: any, index: any) => {
                     if (pnumArr.qusId == val.quId) {
                        if (index == 0) {
                           opera.pnum[0] = `${pro.pnum}(${index + 1})`;
                        }
                        opera.pnum[1] = `${pro.pnum}(${index + 1})`;
                        pnumArr.title = `第${pro.pnum}(${index + 1})题`
                     }
                  })
               } else {
                  val.pnum = String(pnum)
                  opera.pnumArr.map((pnumArr: any, index: any) => {
                     if (pnumArr.qusId == val.quId) {
                        if (index == 0) {
                           opera.pnum[0] = String(val.pnum);
                        }
                        opera.pnum[1] = String(val.pnum);
                        pnumArr.title = `第${val.pnum}题`
                     }
                  })
                  pnum++;
               }
            })
            proSort++;
         })
      })
      console.log(GlobalData.dataJSON)
   }
   /**
    * 绑定题目,两个参数传空值表示解绑
    * @param proId 需要绑定题目的Id
    * @param qusId 需要绑定小题的Id
    */
   public bindPro(proId: any, qusId: any) {
      let _proId = GlobalData.bindProTarget.dom.attr('proId')
      let _qusId = GlobalData.bindProTarget.dom.attr('qusId')
      let pro = GlobalData.bindProTarget.pro.pros.find((pro: any) => {
         return pro.proId === _proId
      })
      if (!qusId && !proId) {
         let initProId = 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5);
         let initQusId = 'init' + String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5)
         //修改operations中的proId,qusId
         this.dataJson.operations.forEach((operation: any) => {
            if (operation.operationId === pro.operationId) {
               operation.pnumArr.forEach((pnum: any) => {
                  if (pnum.qusId === GlobalData.bindProTarget.qus.quId) {
                     pnum.proId = initProId
                     pnum.qusId = initQusId
                  }
               })
            }
         })
         //修改样式
         GlobalData.bindProTarget.dom.css('background', '#F08080')
         $(`[proId=${_proId}][qusId=${_qusId}]`).css('background', '#F08080')
         //修改dataJson.pageQus中的数据
         pro.proId = String(initProId)
         GlobalData.bindProTarget.qus.quId = initQusId
         if (GlobalData.bindProTarget.qus.proId) {
            GlobalData.bindProTarget.qus.proId = String(initProId)
         }
         //改变Arrt
         let oldProId = GlobalData.bindProTarget.dom.attr('proId');
         $(`[proId=${oldProId}]`).attr('proId', initProId)
         GlobalData.bindProTarget.dom.attr('qusId', initQusId)
      } else {
         //修改operations中的proId,qusId
         this.dataJson.operations.forEach((operation: any) => {
            if (operation.operationId === pro.operationId) {
               operation.pnumArr.forEach((pnum: any) => {
                  if (pnum.qusId === GlobalData.bindProTarget.qus.quId) {
                     pnum.qusId = String(qusId);
                     pnum.proId = String(proId);
                  }
               })
            }
         })
         //修改样式
         GlobalData.bindProTarget.dom.css('background', '#32CD32')
         $(`[proId=${_proId}][qusId=${_qusId}]`).css('background', '#32CD32')
         //修改dataJson.pageQus中的数据
         pro.proId = String(proId)
         GlobalData.bindProTarget.qus.quId = String(qusId);
         if (GlobalData.bindProTarget.qus.proId) {
            GlobalData.bindProTarget.qus.proId = String(proId)
         }
         //改变Attr
         let oldProId = GlobalData.bindProTarget.dom.attr('proId');
         $(`[proId=${oldProId}]`).attr('proId', proId)
         GlobalData.bindProTarget.dom.attr('qusId', qusId)
      }
   }
}
export default AnswerCard
process.env.NODE_ENV == 'development'
if (process.env.NODE_ENV === 'development') {
   // console.log(test)
   Test(AnswerCard)
}