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
      GlobalData.clearProps();
      this.dataJson = obj.dataJSON;
      this.both = obj.both
      GlobalData.dataJSON = obj.dataJSON;
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
      // $('#btn').on('click', () => {
      //    let res = window.prompt();
      //    this.reRenderHeader(Number(res))
      // })
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
}
// $('body').before('<button id="btn">点击<button>')
export default AnswerCard
process.env.NODE_ENV == 'development' && new AnswerCard({
   dataJSON: dataJSON,
   both: true,
   config: {
      uploadUrl: 'http://dev.api.teacher.ennnjoy.cn/Api/UploadFile/Policy',
      queryData: {
         Token: '51b1542bdc0de745076c2a65b33a14fce896483f',
         inType: 41,
      }
   },
   dom: null
})
