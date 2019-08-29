import './test.scss'
// import data from './data.json'
import GlobalData from './conpoment/global'
import './test'
import Page from './conpoment/page/page';
import Tool from './tool/tool'
const dataJSON = require('./data.json')

class answerCard {
   pages: Array<Page> = [];
   dataJson: any
   both: boolean //是否双面
   constructor(dataJson: any, both: boolean = false) {
      this.dataJson = dataJson;
      this.both = both
      GlobalData.dataJSON = dataJson
      GlobalData.pageType = dataJSON.paperSize;
      GlobalData.pageColum = parseInt(dataJSON.layoutType);
      let page = new Page(this.addPage.bind(this))
      page.pageInit()
      this.pages.push(page)
      // setTimeout(() => {
      //    console.log(this.htmlToJson())
      // }, 1000);
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
      this.pages.push(page)
   }
   public htmlToJson(): string {//把html 转化成json返回
      let pages = $('#answerCard').children('.page');
      let arr = [];
      for (let i = 0; i < pages.length; i++) {
         arr.push(pages[i].outerHTML)
      }
      return JSON.stringify(arr)
      // return JSON.stringify($('#answerCard').get(0).outerHTML)
   }
   public getLayoutData() {//获取新的json
      this.dataJson.pageQus.map((pros: any) => {
         pros.pros.map((qus: any) => {
            if (qus.pureObjective === '1') {//客观题
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
}


export default answerCard

new answerCard(dataJSON, true)