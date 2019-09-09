// import data from './data.json'
import GlobalData from './conpoment/global'
import Page from './conpoment/page/page';
import Tool from './tool/tool'
const dataJSON = require('./data.json');

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
      this.dataJson = obj.dataJSON;
      this.both = obj.both
      GlobalData.dataJSON = obj.dataJSON;
      GlobalData.config = obj.config;
      GlobalData.pageType = dataJSON.paperSize;
      GlobalData.dom = obj.dom ? $(obj.dom) : $('#answerCard');
      GlobalData.dom && GlobalData.dom.attr('id', 'answerCard');
      GlobalData.pageColum = parseInt(dataJSON.layoutType);
      let page = new Page(this.addPage.bind(this))
      page.pageInit()
      this.pages = page
      GlobalData.dom.on('click', () => {
         $('#contentText').remove()
      })
      // setTimeout(() => {
      //    this.reRenderHeader(10);
      // }, 2000)
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
   dataJSON: dataJSON, both: true, config: {
      uploadUrl: 'http://dev.api.teacher.ennnjoy.cn/Api/UploadFile/Policy',
      queryData: {
         Token: '4b3d81716803b73a2fe924e1d4feff389dd2bf7f',
         inType: 41,
      }
   }, dom: null
})