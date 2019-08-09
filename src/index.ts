import './test.scss'
// import data from './data.json'
import { Pages } from './conpoment/global'
import './test'
import Page from './conpoment/page/page';
class answerCard {
   pages: Array<Page> = [];
   constructor() {
      let page = new Page('A3', this.addPage.bind(this), 2).pageInit();
      this.pages.push(page)
   }
   private addPage() {
      let page = new Page('A3', this.addPage.bind(this), 2).pageInit(false, false);
      this.pages.push(page)
   }
}
new answerCard()