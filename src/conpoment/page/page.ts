import Header from '../header/header'
import './page.scss';
// const data = require('./data.json')
export
   default class Page {
   private page: JQuery<HTMLElement> = null
   private colum: number
   private type: string;
   //1:1,2:2,3:4,4:8
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
      this.page.addClass(type);
      $('#app').append(this.page);
      this.page.attr('id', `${$('#app .page').length}p`)
      this.page.append($(`<div class="colum ${type}-${colum}">
         <div contenteditable="true" class="exam-title">123</div>
      </div>`))
      this.pageInit();
   }
   private pageInit() {
      this.page.append(this.square());
      this.rectangle();
      this.rectangle(true);
      let header = new Header({
         type: this.type,
         colum: this.colum
      })
      $(this.page).find('div.colum:first-child').append(header.initHeader())
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
}