import './test.scss'
// import data from './data.json'
import GlobalData from './conpoment/global'
import SelQues from './conpoment/selQues/selQues';
import './test'
import Page from './conpoment/page/page';
const dataJSON = require('./data.json')
class answerCard {
   pages: Array<Page> = [];
   constructor() {
      // console.log(dataJSON)
      GlobalData.pageType = dataJSON.paperSize;
      GlobalData.pageColum = parseInt(dataJSON.layoutType);
      let page = new Page('A3', this.addPage.bind(this), 2)
      page.pageInit()
      this.pages.push(page)
   }
   private addPage() {
      let page = new Page('A3', this.addPage.bind(this), 2);
      page.pageInit(false, false)
      this.pages.push(page)
   }

   dataSplit() {
      new SelQues(dataJSON.pageQus[0])
   }
}
new answerCard()