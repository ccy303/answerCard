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
   private init(obj: any, a?: any) {
      GlobalData.clearProps();
      this.obj = obj
      this.dataJson = obj.dataJSON;
      this.both = obj.both
      GlobalData.dataJSON = this.dataJson;
      GlobalData.config = obj.config;
      GlobalData.pageType = obj.dataJSON.paperSize;
      GlobalData.subjectId = obj.dataJSON.subjectId;
      GlobalData.dom = obj.dom ? $(obj.dom) : $('#answerCard');
      GlobalData.dom && GlobalData.dom.attr('id', 'answerCard');
      GlobalData.pageColum = parseInt(obj.dataJSON.layoutType);
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
      console.log(GlobalData.dataJSON)
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
   * 添加选择题
   * @param number 添加数量
   * @param chooseCount 选项个数
   * @param multiple 是否多选题
   */
   public addChoose(number: number, chooseCount: number = 4, multiple: boolean = false) {
      // console.log(GlobalData.dataJSON.pageQus[0])
      let opera = new Operations(
         'sel',
         multiple,
         multiple ? '多选题' : '单选题',
         chooseCount,
         number,
      )
      GlobalData.dataJSON.operations.push(opera)
      this.chooseFun(number, chooseCount, multiple, opera.operationId)
      return GlobalData.dataJSON.operations
   }
   private chooseFun(number: number, chooseCount: number, multiple: boolean, operationId: any) {
      if (number <= 0) {
         this.init(this.obj, 1);
         return
      }
      let dataJSON = GlobalData.dataJSON
      if (dataJSON.pageQus[0] && dataJSON.pageQus[0].flag === 1) {//选择题
         let chooseQus: any = {
            joinProNum: false,
            proId: null,
            score: 0,
            pureObjective: "1",
            content: "",
            sort: null,
            pnum: "",
            group: "0",
            titleType: "选择题",
            operationId: operationId,
            qus: [
               {
                  quId: null,
                  score: 0,
                  quType: multiple ? "多选题" : "单选题",
                  nums: String(chooseCount),
                  content: "",
                  pnum: "",
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
            joinProNum: false,
            proId: null,
            score: 0,
            pureObjective: "1",
            content: "",
            sort: null,
            pnum: "",
            group: "0",
            titleType: "选择题",
            operationId: operationId,
            qus: [
               {
                  quId: null,
                  score: 0,
                  quType: multiple ? "多选题" : "单选题",
                  nums: String(chooseCount),
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               }
            ]
         }
         choosePro.pros.push(chooseQus)
         dataJSON.pageQus.unshift(choosePro)
      }
      this.calculationPnum();
      this.chooseFun(--number, chooseCount, multiple, operationId)
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
         let flag = count;
         while (flag > 0) {
            proFrameObj.pros.push({
               proId: null,
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
                  quId: null,
                  score: 0,
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
      } else {
         if (joinFrame) { // 同框
            proFrameObj.pros.push({
               proId: null,
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
            let flg = count
            while (flg > 0) {
               proFrameObj.pros[0].qus.push({
                  quId: null,
                  score: 0,
                  quType: "解答题",
                  nums: null,
                  content: "",
                  pnum: "",
                  visible: true,
                  rIndex: null
               })
               flg--
            }
         } else { //不同框
            let flag = count;
            proFrameObj = [];
            while (flag > 0) {
               let frame = new proFrame();
               frame.pros.push({
                  proId: null,
                  score: 0,
                  pureObjective: "2",
                  content: "",
                  sort: null,
                  pnum: "",
                  group: "0",
                  titleType: "解答题",
                  operationId: operation.operationId,
                  qus: [{
                     quId: null,
                     score: 0,
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
      }
      Array.isArray(proFrameObj) ? dataJSON.pageQus.push(...proFrameObj) : dataJSON.pageQus.push(proFrameObj)
      GlobalData.dataJSON.operations.push(operation)
      this.calculationPnum();
      this.init(this.obj);
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
            proId: null,
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
               quId: null,
               score: 0,
               quType: "填空题",
               nums: null,
               blankNums: argArr[i],
               content: "",
               pnum: "",
               visible: true,
               rIndex: null
            })
         }
      } else { //不同框（只能不合并题号）
         proFrameObj = [];
         for (let i = 0; i < argArr.length; i++) {
            let frame = new proFrame();
            frame.flag = 2;
            frame.pros.push({
               proId: null,
               score: 0,
               pureObjective: "2",
               content: "",
               sort: null,
               pnum: "",
               group: "0",
               titleType: "填空题",
               operationId: operation.operationId,
               qus: [{
                  quId: null,
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
         proId: null,
         score: null,
         pureObjective: "2",
         content: "",
         sort: null,
         pnum: null,
         group: "0",
         titleType: "作文",
         operationId: operation.operationId,
         qus: [{
            quId: null,
            score: 0,
            quType: "作文题",
            nums: null,
            content: "",
            pnum: null,
            visible: true,
            rIndex: null
         }]
      })
      dataJSON.pageQus.push(proFrameObj)
      GlobalData.dataJSON.operations.push(operation)
      this.calculationPnum();
      this.init(this.obj);
      return GlobalData.dataJSON.operations
   }

   private calculationPnum() {
      let dataJSON = GlobalData.dataJSON
      let pnum = 1;
      let proSort = 1;
      dataJSON.pageQus.map((obj: any, obj_i: number) => {
         obj.sort = String(obj_i + 1); //每一个框的排序
         obj.pros.map((pro: any, pro_i: number) => {
            let opera: Operations = dataJSON.operations.find((val: Operations) => {
               return val.operationId === pro.operationId;
            })
            pro.proId = String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5);
            pro.sort = String(proSort); //pro结构中的sort排序
            pro.qus.map((val: any, index: any) => {
               val.quId = String(new Date().getTime() + parseInt(String(Math.random() * 100000))).substr(-5);
               if (pro.joinProNum) {
                  if (opera.operationId === pro.operationId) {
                     if (opera.pnum[0] == 0) {
                        opera.pnum[0] = `${pnum}(${index + 1})`;
                     }
                     opera.pnum[1] = `${pnum}(${index + 1})`;
                  }
                  pro.pnum = pnum
                  val.pnum = `(${index + 1})`
                  index == pro.qus.length - 1 && pnum++
               } else {
                  if (opera.operationId === pro.operationId) {
                     if (opera.pnum[0] == 0) {
                        opera.pnum[0] = `${pnum}`;
                     }
                     opera.pnum[1] = `${pnum}`;
                  }
                  val.pnum = String(pnum)
                  pnum++;
               }
            })
            // if (!obj.pnum.length) {
            //    console.log(123)
            //    obj.pnum[0]
            // }
            proSort++;
         })
      })
   }
}
export default AnswerCard
process.env.NODE_ENV == 'development'
if (process.env.NODE_ENV === 'development') {
   // console.log(test)
   Test(AnswerCard)
}