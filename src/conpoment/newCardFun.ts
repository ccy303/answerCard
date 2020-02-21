import GlobalData from './global';
let chooseGroup = 1;
let dataJSON = GlobalData.dataJSON;
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
/**
 * 添加选择题
 * @param number 添加数量
 * @param chooseCount 选项个数
 * @param multiple 是否多选题
 */
export let addChoose = (number: number, chooseCount: number = 4, multiple: boolean = false) => {
   if (number <= 0) { return }
   !dataJSON && (dataJSON = GlobalData.dataJSON)
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
   addChoose(--number)
}
/**
 * 添加主观题
 * @param join 是否合并主观题小问
 * @param joinFrame 是否同框
 * @param count 小问个数
 * @param choose 是否为选做题
 */
export let addFrame = (choose: boolean, join: boolean, joinFrame: boolean, count: number) => {
   !dataJSON && (dataJSON = GlobalData.dataJSON)
   let proFrameObj: any = new proFrame();
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
}
/**
 * 添加填空题
 * @param joinFrame 同框
 * @param joinProNum 合并题号
 * @param argArr 每行空格数
*/
export let addBlankQues = (joinFrame: boolean, joinProNum: boolean, argArr: any[]) => {
   !dataJSON && (dataJSON = GlobalData.dataJSON)
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
}
/**
 * 添加作文题
*/
export let addWrite = () => {
   !dataJSON && (dataJSON = GlobalData.dataJSON)
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
}
