import Header from '../header/header'
import AnswerFrame from '../answerFrame/answerFrame';
import './page.scss';
export default class Page {
   private _page: JQuery<HTMLElement> = null
   private colum: number
   private type: string;
   private data: any;
   private answerFrame: any = []; //本页面中所有的answerFrame对象
   //1->1,2->2,3->4,4->8
   private pageNum: Array<any> = [
      [1], //1
      [2], //2
      [1, 2], //3
      [3], //4
      [1, 3], //5
      [2, 3], //6
      [1, 2, 3], //7
      [4], //8
      [1, 4], //9
      [2, 4], //10
      [1, 2, 4], //11
      [3, 4], //12
      [1, 3, 4], //13
      [2, 3, 4], //14
      [1, 2, 3, 4] //15
   ]
   constructor(type: string, colum?: number) {
      this.type = type;
      this.colum = colum
      this.page = $('<div class="page"></div>')
      this.data = require('../../data.json')
      this.pageInit();
   }
   public get page(): JQuery<HTMLElement> {
      return this._page
   }
   public set page(val: JQuery<HTMLElement>) {
      this._page = val;
   }
   private async pageInit() {
      this.page.addClass(this.type);
      $('#app').append(this.page);
      this.page.attr('id', `${$('#app .page').length}p`)
      let _colum = this.colum - 1;
      while (true) {//渲染列
         if (_colum < 0) break;
         let defaultColum: JQuery<HTMLElement> = null
         if (_colum === this.colum - 1) {
            defaultColum = $(`<div class="colum ${this.type}-${this.colum}">
               <div contenteditable="true" class="exam-title">${this.data.alias}</div>
            </div>`)
         } else {
            defaultColum = $(`<div class="colum ${this.type}-${this.colum}"></div>`)
         }
         this.observePage(defaultColum);
         this.page.append(defaultColum)
         _colum--;
      }
      this.page.append(this.square());
      this.rectangle();
      this.rectangle(true);
      let header = new Header({
         type: this.type,
         colum: this.colum
      })
      await $(this.page).find('div.colum:first-child').append(header.initHeader());
      this.renderAnswerFrame(1)
      this.renderAnswerFrame(2)
      this.renderAnswerFrame(3)
      this.renderAnswerFrame(4)
   }
   private square(): Array<JQuery<HTMLElement>> {
      let arr: Array<JQuery<HTMLElement>> = [];
      arr.push($('<div class="square left-top"></div>'));
      arr.push($('<div class="square left-bottom"></div>'));
      arr.push($('<div class="square right-top"></div>'));
      arr.push($('<div class="square right-bottom"></div>'));
      return arr
   }
   private rectangle(pageNum: boolean = false) {
      let height = pageNum ? '8px' : '25px';
      let width = pageNum ? '25px' : '8px';
      if (!pageNum) {//右边方块
         let innerHeight: number = 0;
         innerHeight = $(this.page.find('div.left-bottom')).position().top - $(this.page.find('div.left-top')).position().top - $(this.page.find('div.left-top')).height();
         innerHeight = innerHeight / 4;
         let i = 0;
         while (true) {
            if (i > 2) break;
            let top = 0;
            top = innerHeight * (i + 1) + $(this.page.find('div.left-top')).height() + $(this.page.find('div.left-top')).position().top - 12.5;
            this.page.append(`<div style="height:${height};width:${width};top:${top}px;left:32px" class="rectangle"></div>`)
            i++;
         }
      } else {//顶部页数方块
         let innerWidth: number = 0;
         innerWidth = $(this.page.find('div.right-top')).position().left - $(this.page.find('div.left-top')).position().left - $(this.page.find('div.left-top')).width()
         innerWidth = this.type === 'A4' ? innerWidth / 5 : innerWidth / 2 / 5;
         let pageIndex = parseInt(this.page.attr('id'));
         this.pageNum[pageIndex - 1].map((val: any) => {
            let left = 0;
            left = innerWidth * val + $(this.page.find('div.left-top')).width();
            this.page.append(`<div style="height:${height};width:${width};top:${45}px;left:${left}px" class="rectangle"></div>`)
         })

      }
   }
   private renderAnswerFrame(bIndex: number) {
      let answerFrame = new AnswerFrame().initAnswerFrame(bIndex);
      this.answerFrame.push(answerFrame)
      let page = $(this.page);
      $(page.find('.colum').get(0)).append(answerFrame.answerFrame)
   }
   //监听dom改变
   private observePage(dom: JQuery<HTMLElement>) {
      let config = { attributes: false, childList: true, subtree: true, characterData: true, characterDataOldValue: true };
      let observer = new MutationObserver((e: any) => {
         let lineHeight = $('.editor-box>div').get(0) ? $('.editor-box>div').get(0).offsetHeight : null
         e.map((mutation: MutationRecord) => {
            let childrenLen = dom.children().length - 1
            let innerHeight = 0;
            let pageHeight = this.page.height()
            while (true) {
               if (childrenLen < 0) break
               innerHeight += $(dom.children().get(childrenLen)).height();
               childrenLen--
            }
            if (pageHeight < innerHeight) {
               let row = dom.find('.editor-box:last-child').get(0)
               let obj = this.answerFrame.filter((val: any) => {
                  return val.answerFrame.get(0) === row;
               })[0];
               console.log(obj.getLastRow())
               this.checkoutEditorBox(dom.find('.editor-box:last-child'), dom);
            }
         })
      })
      observer.observe(dom.get(0), config)
   }

   private checkoutEditorBox(dom: any, colum: any) {//查找页面中是否存在由此editorBox拆分出的editorBox
      console.log(colum)
      console.log(colum.next('.colum').find())
      let boxIndex = dom.attr('box-index');

   }
}