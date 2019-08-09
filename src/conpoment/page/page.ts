import Header from '../header/header';
import AnswerFrame from '../answerFrame/answerFrame';
import { AnswerFrameObj } from '../global'
import './page.scss';
export default class Page {
   private _page: JQuery<HTMLElement> = null
   private colum: number
   private type: string;
   private data: any;
   private answerFrame: any = []; //本页面中所有的answerFrame对象
   private callback: any; //用于判断是否要添加新一页
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
   /**
    * @param type 纸张类型A3..
    * @param callback 函数，用于判断是否要添加新一页
    * @param colum 列数 1栏、2栏、3栏
    */
   constructor(type: string, callback: any, colum?: number) {
      this.type = type;
      this.colum = colum
      this.page = $('<div class="page"></div>')
      this.data = require('../../data.json')
      this.callback = callback;
      this.answerFrame = AnswerFrameObj
   }
   public get page(): JQuery<HTMLElement> {
      return this._page
   }
   public set page(val: JQuery<HTMLElement>) {
      this._page = val;
   }
   public pageInit(addRow: boolean = true, renderHeader: boolean = true) {
      this.page.addClass(this.type);
      $('#answerCard').append(this.page);
      this.page.attr('id', `${$('#answerCard .page').length}p`)
      let _colum = this.colum - 1;
      while (true) {//渲染列
         if (_colum < 0) break;
         let defaultColum: JQuery<HTMLElement> = null
         if (_colum === this.colum - 1) {
            defaultColum = $(`<div class="colum ${this.type}-${this.colum}">
               ${renderHeader ? `<div contenteditable="true" class="exam-title">${this.data.alias}</div>` : ''}
            </div>`)
         } else {
            defaultColum = $(`<div class="colum ${this.type}-${this.colum}"></div>`)
         }
         this.observeColum(defaultColum);
         this.page.append(defaultColum)
         _colum--;
      }
      this.page.append(this.square());
      this.rectangle();
      this.rectangle(true);
      if (renderHeader) {
         let header = new Header({
            type: this.type,
            colum: this.colum
         })
         $(this.page).find('div.colum:first-child').append(header.initHeader());
      }
      if (addRow) {
         this.renderDeafultAnswerFrame(1, addRow)
         this.renderDeafultAnswerFrame(2, addRow)
         this.renderDeafultAnswerFrame(3, addRow)
         this.renderDeafultAnswerFrame(4, addRow)
         this.renderDeafultAnswerFrame(5, addRow)
         this.renderDeafultAnswerFrame(6, addRow)
         this.renderDeafultAnswerFrame(7, addRow)
         this.renderDeafultAnswerFrame(8, addRow)
      } else {

      }
      return this;
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
   private renderDeafultAnswerFrame(bIndex: number, addRow: boolean) {
      let answerFrame = new AnswerFrame().initAnswerFrame(bIndex, addRow);
      this.answerFrame.push(answerFrame)
      let page = $(this.page);
      $(page.find('.colum').get(0)).append(answerFrame.answerFrame)
   }
   //监听每一列的dom改变
   private observeColum(dom: JQuery<HTMLElement>) {
      let config = { attributes: true, childList: true, subtree: true, characterData: true, characterDataOldValue: true };
      let observer = new MutationObserver((e: any) => {
         e.map((mutation: MutationRecord) => {
            let innerHeight = dom.height();
            let pageHeight = this.page.height()
            if (pageHeight < innerHeight) {
               //此列中最后一个editorBox
               let lastEditorBox = dom.find('.editor-box:last-child').get(0);
               //获取生成此editorBox的对象实例
               let obj = this.answerFrame.filter((val: any) => {
                  return val.answerFrame.get(0) === lastEditorBox;
               })[0];
               let lastRow = obj.getLastRow()
               let nextBox = this.checkoutEditorBox(dom.find('.editor-box:last-child'), dom);
               if (nextBox && nextBox.get(0)) {
                  lastRow.attr('hash', nextBox.attr('hash'))
                  nextBox.children(':first-child').before(lastRow);
               } else {
                  let boxIndex = lastRow.parent().attr('boxIndex')
                  let box: JQuery<HTMLElement>
                  if (dom.next('.colum').get(0)) {//本页最后一栏
                     box = this.createEditorBoxInNextCol(dom.next('.colum'), boxIndex).answerFrame;
                  } else {
                     box = this.createEditorBoxInNextCol(this.page.next().find('.colum:first-child'), boxIndex).answerFrame
                  }
                  let boxFirstChild = box.children(':first-child');
                  lastRow.attr('hash', box.attr('hash'))
                  boxFirstChild.get(0) ? boxFirstChild.before(lastRow) : box.append(lastRow)
               }
            } else if (pageHeight > innerHeight && $(mutation.removedNodes[0]).hasClass('row')) {
               let hash = $(mutation.removedNodes[0]).attr('hash');
               let editorBox = this.page.find(`div.editor-box[hash=${hash}]`) //触发删除事件的EditotBox
               let nextEditorBox = this.findNextEditorBox(editorBox.parent().children().last());
               if (nextEditorBox) {
                  this.moveRowToPrevEditorBox(nextEditorBox, editorBox.parent().children().last());
               } else if (pageHeight - innerHeight > 40) {//没有由此editorBox拆分出的ediotrBox
                  this.moveNextEditorBoxToThisColum(editorBox.parent());
               }
            }
         })
        !dom.parent().find('div.editor-box').get(0) && dom.parent().remove()
      })
      observer.observe(dom.get(0), config)
   }
   private createEditorBoxInNextCol(colum: JQuery<HTMLElement>, bIndex: number): AnswerFrame {//在下一列中创建EditorBox
      let answerFrame = new AnswerFrame().initAnswerFrame(bIndex, false);
      this.answerFrame.push(answerFrame)
      //判断是否带头
      if (colum.children('div.header-box').get(0)) {
         colum.children('div.editor-box').get(0) ?
            colum.children('div.editor-box').first().before(answerFrame.answerFrame) :
            colum.append(answerFrame.answerFrame)
      } else {
         colum.children().get(0) ?
            colum.children(':first-child').before(answerFrame.answerFrame) :
            colum.append(answerFrame.answerFrame)
      }
      return answerFrame;
   }

   private checkoutEditorBox(dom: any, colum: JQuery<HTMLElement>) {//查找下一列是否存在由此dom(editorBox)拆分出的editorBox
      let boxIndex = dom.attr('boxIndex');
      if (colum.next('.colum').get(0)) {
         return colum.next('.colum').find(`div[boxIndex=${boxIndex}]`)
      } else {
         if (this.page.next('.page').get(0)) {//存在下一页
            return this.page.next('.page').find('.colum:first-child').find(`div[boxIndex=${boxIndex}]`)
         } else { //没有下一页
            this.callback()
         }
      }
   }

   private findNextEditorBox(dom: JQuery<HTMLElement>): JQuery<HTMLElement> | null {//查找由dom（此editorbox拆分出的editorBox）
      let editorBoxs = $('#answerCard').find(`div.editor-box[boxIndex=${dom.attr('boxIndex')}]`)
      let nextEditorBox: JQuery<HTMLElement> = null;
      for (let i = 0; i < editorBoxs.length; i++) {
         if (editorBoxs.get(i) === dom.get(0) && editorBoxs.get(i + 1)) {
            nextEditorBox = $(editorBoxs.get(i + 1));
         }
      }
      return nextEditorBox
   }

   private moveRowToPrevEditorBox(targetEditorBox: JQuery<HTMLElement>, prevEditorBox: JQuery<HTMLElement>) {
      let row = targetEditorBox.find('div.row:first-child');
      prevEditorBox.append(row)
      row.attr('hash', prevEditorBox.attr('hash'))
   }

   private moveNextEditorBoxToThisColum(thisColum: JQuery<HTMLElement>) {//删除后将下一个框移到上一列
      let colums = $('#answerCard').find('.colum');
      let nextColum: JQuery<HTMLElement> = null;
      for (let i = 0; i < colums.length; i++) {
         if (colums.get(i) === thisColum.get(0) && colums.get(i + 1)) {
            nextColum = $(colums.get(i + 1));
         }
      }
      if (!nextColum || !nextColum.get(0)) return;
      let nextColumFirstEditor = $(nextColum.children('div.editor-box').get(0))
      if (!nextColumFirstEditor.get(0)) return;
      let row = nextColumFirstEditor.children().first();
      let answerFrame = new AnswerFrame().initAnswerFrame(Number(nextColumFirstEditor.attr('boxIndex')), false);
      this.answerFrame.push(answerFrame)
      thisColum.append(answerFrame.answerFrame);
      answerFrame.answerFrame.append(row)
      row.attr('hash', answerFrame.answerFrame.attr('hash'))
   }
}