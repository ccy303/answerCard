import GlobalData from './conpoment/global'
import Page from './conpoment/page/page';
import Tool from './tool/tool'
const dataJSON = require('./test.json');
class AnswerCard {
   dataJson: any
   both: boolean //是否双面
   set pages(val: any) {
      GlobalData.pageObject = val;
   }
   get pages() {
      return GlobalData.pageObject
   }
   constructor(obj: any) {
      if (obj.dataJSON) return
      if (obj.both) return
      if (obj.config) return
      if (obj.dataJSON.paperSize) return
      GlobalData.clearProps();
      this.dataJson = obj.dataJSON;
      this.both = obj.both
      GlobalData.dataJSON = obj.dataJSON;
      GlobalData.config = obj.config;
      GlobalData.pageType = obj.dataJSON.paperSize;
      GlobalData.dom = obj.dom ? $(obj.dom) : $('#answerCard');
      GlobalData.dom && GlobalData.dom.attr('id', 'answerCard');
      GlobalData.pageColum = parseInt(obj.dataJSON.layoutType);
      GlobalData.dom.on('click', () => {
         $('#contentText').remove()
      })
      // GlobalData.dom.on('dblclick', () => {
      //    this.getTitle()
      // })
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
   //重新绘制答题卡头: 参数count学号位数
   public reRenderHeader(count: number) {
      let length = GlobalData.headerObj.length;
      let i = 0;
      while (true) {
         if (i > length - 1) break
         GlobalData.headerObj[i].reRenderHeader(count)
         i++
      }
   }
}
export default AnswerCard
process.env.NODE_ENV == 'development' && new AnswerCard({
   dataJSON: dataJSON,
   both: false,
   config: {
      uploadUrl: 'http://dev.api.teacher.ennnjoy.cn/Api/UploadFile/Policy',
      queryData: {
         Token: '9a06366922a4135da0f2f1d2f714ea12bde1bde2',
         inType: 41,
      }
   },
   dom: null
})