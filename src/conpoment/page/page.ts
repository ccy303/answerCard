import Header from '../header/header';
import AnswerFrame from '../answerFrame/answerFrame';
import GlobalData from '../global'
import SelQues from '../selQues/selQues';
import Write from '../writing/writing'
import './page.scss';

const dataJSON = require('../../data.json')
export default class Page {
   private _page: JQuery<HTMLElement> = null
   private colum: number
   private type: string;
   private data: any;
   private selQues: SelQues
   // private answerFrame: any = []; //本页面中所有的answerFrame对象
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
   private write: Write
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
      this.selQues = new SelQues(dataJSON.pageQus[0]);
      this.write = new Write(1200)
   }
   public get page(): JQuery<HTMLElement> {
      return this._page
   }
   public set page(val: JQuery<HTMLElement>) {
      this._page = val;
   }
   public async pageInit(addRow: boolean = true, renderHeader: boolean = true) {
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
      if (renderHeader) {//绘制答题卡头}
         let header = new Header({
            type: this.type,
            colum: this.colum
         })
         $(this.page).find('div.colum:first-child').append(header.initHeader());
      }

      if (addRow) { //增加空白行
         this.renderDeafultAnswerFrame(4, addRow, 'select')
         this.renderDeafultAnswerFrame(1, addRow, 'editor')
         this.renderDeafultAnswerFrame(2, addRow, 'editor')
         this.renderDeafultAnswerFrame(3, addRow, 'write', 700)
         // this.page.find('.header-box').after(this.selQues.selQuesBox);
         // this.selQues.initSelQues()


         // this.page.find('.colum:first-child').append(this.write.init());
         // this.renderDeafultAnswerFrame(3, addRow)
         // this.renderDeafultAnswerFrame(4, addRow)
         // this.renderDeafultAnswerFrame(5, addRow)
         // this.renderDeafultAnswerFrame(6, addRow)
         // this.renderDeafultAnswerFrame(7, addRow)
      } else { }

      $('.exam-title').on('keydown', (e) => {
         e.keyCode === 13 && e.preventDefault()
      })

      // return this;
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
   private renderDeafultAnswerFrame(bIndex: number, addRow: boolean, type: string, number?: number) {
      let answerFrame = new AnswerFrame().initAnswerFrame(bIndex, addRow, type, number);
      GlobalData.AnswerFrameObj.push(answerFrame)
      let page = $(this.page);
      // $('#answerCard').find('.select-box').last().parent().append(answerFrame.answerFrame)
      $(page.find('.colum').get(0)).append(answerFrame.answerFrame)
   }

   //监听每一列的dom改变 重要的话说3次：整个app的精华都在这里；整个app的精华都在这里；整个app的精华都在这里
   private observeColum(dom: JQuery<HTMLElement>) {
      let config = { attributes: false, childList: true, subtree: true };
      let observer = new MutationObserver((e: any) => {
         e.map(async (mutation: MutationRecord) => {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].nodeName === 'BR') return
            let innerHeight = dom.height();
            let pageHeight = this.page.height()
            if (pageHeight < innerHeight) {//回车和初始化布局
               // await !dom.find('div.editor-box').get(0) && this.moveDownSelQues(dom) //如果这一列中有editor-box先移动editor-box然后在移动select-box
               // 此列中最后一个editorBox
               let lastEditorBox = dom.find('div.editor-box').last().get(0);
               if (lastEditorBox) {
                  const type = $(lastEditorBox).attr('type')
                  //获取生成此editorBox的对象实例
                  let obj = GlobalData.AnswerFrameObj.filter((val: any) => {
                     return val.answerFrame.get(0) === lastEditorBox;
                  })[0];
                  let lastRow = obj.getLastRow()
                  let nextBox = this.checkoutEditorBox(dom.find('div.editor-box:last-child'), dom);
                  if (nextBox && nextBox.get(0)) {
                     lastRow.attr('hash', nextBox.attr('hash'))
                     nextBox.children(':first-child').before(lastRow);
                  } else {
                     let boxIndex = lastRow.parent().attr('boxIndex')
                     let box: JQuery<HTMLElement>
                     if (dom.next('.colum').get(0)) {//本页最后一栏
                        box = this.createEditorBoxInNextCol(dom.next('.colum'), boxIndex, type).answerFrame;
                     } else {
                        box = this.createEditorBoxInNextCol(this.page.next().find('.colum:first-child'), boxIndex, type).answerFrame
                     }
                     let boxFirstChild = box.children(':first-child');
                     lastRow.attr('hash', box.attr('hash'))
                     boxFirstChild.get(0) ? boxFirstChild.before(lastRow) : box.append(lastRow)
                  }
                  !obj.answerFrame.children().length && obj.answerFrame.remove()
               }
            } else if (pageHeight > innerHeight) {//删除
               if (!$(mutation.removedNodes[0]).attr('hash') || mutation.removedNodes[0] && mutation.removedNodes[0].nodeName === 'BR') { return }
               let hash = $(mutation.target).attr('hash');
               let editorBox = this.page.find(`div.editor-box[hash=${hash}]`) //触发删除事件的EditotBox
               let nextEditorBox = this.findNextEditorBox(editorBox.parent().children().last());
               if (!nextEditorBox) {
                  this.moveNextEditorBoxToThisColum(editorBox.parent()); return
               }
               let nextBoxFirstChild = nextEditorBox.children(':first-child').height();
               nextEditorBox.attr('type') === 'write' && (nextBoxFirstChild += 8)
               if (pageHeight - innerHeight > nextBoxFirstChild) {
                  if (nextEditorBox) {
                     this.moveRowToPrevEditorBox(nextEditorBox, editorBox.parent().children().last());
                  }
               }
               // else if (pageHeight - innerHeight > 40) {
               //    if (nextEditorBox) {
               //       this.moveRowToPrevEditorBox(nextEditorBox, editorBox.parent().children().last());
               //    } else {
               //       this.moveNextEditorBoxToThisColum(editorBox.parent());
               //    }
               // }
               nextEditorBox && !nextEditorBox.children().length && nextEditorBox.remove();
            }
         })
         if (!dom.parent().find('div.editor-box').get(0) && !dom.parent().find('div.select-box').get(0)) {
            dom.parent().remove()
         }
         if (!dom.find('div.select-box').children().last().children().first().children().get(0)) {
            dom.find('div.select-box').children().last().remove()
         }
         // clearTimeout(GlobalData.timer);
         // GlobalData.timer = setTimeout(() => {
         //    this.updatedBoxStyle(dom)
         //    clearTimeout(GlobalData.timer);
         //    GlobalData.timer = null;
         // }, 500)
      })
      observer.observe(dom.get(0), config)
   }
   private updatedBoxStyle(thisColum: JQuery<HTMLElement>) {
      let colum = $('#answerCard').find(`.colum`)
      let length = $('#answerCard').find(`.colum`).length;
      let i = 0;
      while (true) {
         if (i > length - 1) break;
         let rows = $(colum[i]).children(`.editor-box[type="select"]`).children('.row')
         let rowLen = rows.length
         let j = 4;
         while (true) {
            if (j > rowLen) break;
            $(rows.get(j)).children().css('padding-bottom', '7.5px')
            $(rows.get(j)).css('border-bottom', '1px solid #000')
            $(rows.get(j - 4)).children().css('padding-top', '7px')
            j += 5
         }
         i++
      }
   }

   private async moveDownSelQues(colum: JQuery<HTMLElement>) {//选择题下移
      let innerHeight = colum.height()
      let pageHieght = this.page.height();
      let nextColum = this.getNextColum(colum)
      // if (!nextColum) {
      //    await this.callback()
      //    nextColum = this.getNextColum(colum)
      // }
      if ((innerHeight - pageHieght) / 120 > 1) { //把框往下移
         let selGroupBox = colum.find('.select-box').children().last();
         if (!nextColum.find('div.select-box').get(0)) {
            let selBox = $(`<div class="select-box" selIndex="1"></div>`)
            selBox.append(selGroupBox);
            nextColum.children().first().get(0) ?
               await nextColum.children().first().before(selBox) :
               await nextColum.append(selBox)
         } else {
            await nextColum.find('.select-box').children(':nth-child(1)').before(selGroupBox);
         }
      } else if ((innerHeight - pageHieght) / 120 < 1 && (innerHeight - pageHieght) / 120 > 0) { //要移到下一栏的选择题不够5道
         let rowLength = Math.round((innerHeight - pageHieght) / 21)
         let dom = colum.children('.select-box').children().last().children()
         if (!nextColum.find('div.select-box').get(0)) { //下一栏中没有select-box            
            let selBox = $(`<div class="select-box" selIndex="${$('.select-box').length + 1}"></div>`)
            let selGroupBox = $(`<div class="sel-group-box" bIndex="1"></div>`)
            selBox.append(selGroupBox);
            for (let i = 0; i < dom.length; i++) {
               let j = rowLength;
               let selGroup = $(`<div style="width:${100 / dom.length}%" class="sel-group" bIndex="${i + 1}"></div>`);
               while (true) {
                  if (j <= 0) break;
                  let a = $(dom[i]).children().last();
                  !selGroup.children().first().get(0) ?
                     selGroup.append($(a)) :
                     selGroup.children().first().before($(a));
                  j--;
               }
               selGroupBox.append(selGroup)
            }
            await nextColum.append(selBox)
         } else { //下一栏中有selct-box
            let length = nextColum.find('div.select-box').children().first().children().first().children().length; //下一栏的select-box中第一个框的行数
            if (length < 5) {//下一栏中的select-box第一个框没有满
               for (let i = 0; i < dom.length; i++) {
                  let a = $(dom[i]).children().last();
                  nextColum.find('.select-box').children().first().children(`:nth-child(${i + 1})`).children(':nth-child(1)').before($(a))
               }
            } else {
               let selGroupBox = $(`<div class="sel-group-box" bIndex="1"></div>`)
               for (let i = 0; i < dom.length; i++) {
                  let j = rowLength;
                  let selGroup = $(`<div style="width:${100 / dom.length}%" class="sel-group" bIndex="${i + 1}"></div>`);
                  while (true) {
                     if (j <= 0) break;
                     let a = $(dom[i]).children().last();
                     !selGroup.children().first().get(0) ?
                        selGroup.append($(a)) :
                        selGroup.children().first().before($(a));
                     j--;
                  }
                  selGroupBox.append(selGroup)
               }
               if (!selGroupBox.children(':nth-child(1)').children().get(0)) return
               await nextColum.find('.select-box').children().first().before($(selGroupBox))
            }
         }
      }
   }

   private createEditorBoxInNextCol(colum: JQuery<HTMLElement>, bIndex: number, type: string): AnswerFrame {//在下一列中创建EditorBox
      // let answerFrame = new AnswerFrame().initAnswerFrame(bIndex, false, write, 0);
      let answerFrame = new AnswerFrame().initAnswerFrame(bIndex, false, type);
      GlobalData.AnswerFrameObj.push(answerFrame)
      //判断是否带头
      if (colum.children('div.header-box').get(0)) {
         colum.children('div.editor-box').get(0) ?
            colum.children('div.editor-box').first().before(answerFrame.answerFrame) :
            colum.append(answerFrame.answerFrame)
      } else {
         colum.children('div.editor-box').get(0) ?
            colum.children('div.editor-box').first().before(answerFrame.answerFrame) :
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
      let answerFrame = new AnswerFrame().initAnswerFrame(Number(nextColumFirstEditor.attr('boxIndex')), false, nextColumFirstEditor.attr('type'));
      GlobalData.AnswerFrameObj.push(answerFrame)
      thisColum.append(answerFrame.answerFrame);
      answerFrame.answerFrame.append(row)
      row.attr('hash', answerFrame.answerFrame.attr('hash'))
   }

   private getNextColum(thisColum: JQuery<HTMLElement>) {
      let colums = $('#answerCard').find('.colum');
      let nextColum: JQuery<HTMLElement> = null;
      for (let i = 0; i < colums.length; i++) {
         if (colums.get(i) === thisColum.get(0) && colums.get(i + 1)) {
            nextColum = $(colums.get(i + 1));
         }
      }
      return nextColum
   }

   private getprevColum(thisColum: JQuery<HTMLElement>) {
      let colums = $('#answerCard').find('.colum');
      let prevColum: JQuery<HTMLElement> = null;
      for (let i = 0; i < colums.length; i++) {
         if (colums.get(i) === thisColum.get(0) && i - 1 >= 0 && colums.get(i - 1)) {
            prevColum = $(colums.get(i - 1));
         }
      }
      return prevColum
   }
}