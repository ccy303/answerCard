import Header from '../header/header';
import AnswerFrame from '../answerFrame/answerFrame';
import GlobalData from '../global';
import './page.scss';

export default class Page {
   private _page: JQuery<HTMLElement> = null
   private colum: number
   private type: any;
   private data: any;
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
   /**
    * @param type 纸张类型A3..
    * @param callback 函数，用于判断是否要添加新一页
    * @param colum 列数 1栏、2栏、3栏
    */
   constructor(callback: any) {
      this.type = GlobalData.dataJSON.paperSize;
      this.colum = GlobalData.dataJSON.layoutType;
      this.page = $('<div class="page boxShadow"></div>')
      this.data = GlobalData.dataJSON
      this.callback = callback;
   }
   public get page(): JQuery<HTMLElement> {
      return this._page
   }
   public set page(val: JQuery<HTMLElement>) {
      this._page = val;
   }
   public async pageInit(addRow: boolean = true, renderHeader: boolean = true) {
      this.page.addClass(this.type);
      GlobalData.dom.append(this.page);
      this.page.attr('id', `${$('#answerCard .page').length}p`)
      //渲染列
      let _colum = this.colum - 1;
      while (true) {
         if (_colum < 0) break;
         let defaultColum: JQuery<HTMLElement> = null
         if (_colum === this.colum - 1) {
            defaultColum = $(`<div class="colum ${this.type}-${this.colum}">
            ${renderHeader ? `<div contenteditable="true" class="exam-title" hash="examTitle">${this.data.alias}</div>` : ''}
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
         GlobalData.headerObj.push(header);
         $(this.page).find('div.colum:first-child').append(header.initHeader());
      }
      if (addRow) { //增加空白行
         this.whatRender(this.data, addRow)
      } else { }
   }
   private whatRender(data: any, addRow: boolean) {
      data.pageQus.map((pro: any, index: number) => {
         // console.log(pro)
         if (!pro.pros.find((val: any) => { return val.pureObjective !== '1' })) {//选择题
            this.renderDeafultAnswerFrame(index, addRow, 'select', pro)
         } else {
            if (pro.pros[0].qus[0].quType !== '作文题') {
               this.renderDeafultAnswerFrame(index, addRow, 'editor', pro)
            } else {
               this.renderDeafultAnswerFrame(index, addRow, 'write', pro, 800)
            }
         }
      })
   }
   private square(): Array<JQuery<HTMLElement>> {
      let arr: Array<JQuery<HTMLElement>> = [];
      arr.push($('<div style="width:20px;height:20px" class="square left-top"></div>'));
      arr.push($('<div style="width:20px;height:20px" class="square left-bottom"></div>'));
      arr.push($('<div style="width:20px;height:20px" class="square right-top"></div>'));
      arr.push($('<div style="width:20px;height:20px" class="square right-bottom"></div>'));
      return arr
   }
   private rectangle(pageNum: boolean = false) {
      let height = pageNum ? '8px' : '25px';
      let width = pageNum ? '25px' : '8px';
      if (!pageNum) {//右边方块
         let innerHeight: number = 0;
         innerHeight = $(this.page.find('div.left-bottom')).position().top - $(this.page.find('div.left-top')).position().top + $(this.page.find('div.left-top')).height();
         innerHeight = innerHeight / 4;
         let i = 0;
         while (true) {
            if (i > 2) break;
            let top = 0;
            top = innerHeight * (i + 1) + $(this.page.find('div.left-top')).position().top
            this.page.append(`<div style="height:${height};width:${width};top:${top}px;left:25px" class="rectangle"></div>`)
            i++;
         }
      } else {//顶部页数方块
         let innerWidth: number = 0;
         innerWidth = $(this.page.find('div.right-top')).position().left - $(this.page.find('div.left-top')).position().left + $(this.page.find('div.right-top')).width();
         innerWidth = this.type === 'A4' ? innerWidth / 5 : innerWidth / 2 / 5;
         let pageIndex = parseInt(this.page.attr('id'));
         this.pageNum[pageIndex - 1].map((val: any) => {
            let left = 0;
            left = innerWidth * val + $(this.page.find('div.left-top')).position().left
            this.page.append(`<div style="height:${height};width:${width};top:${40}px;left:${left}px" class="rectangle"></div>`)
         })

      }
   }
   private renderDeafultAnswerFrame(bIndex: number, addRow: boolean, type: string, data: any = {}, number: number = 800) {
      let answerFrame = new AnswerFrame(data).initAnswerFrame(bIndex, addRow, type, number);
      GlobalData.AnswerFrameObj.push(answerFrame)
      let page = $(this.page);
      // $('#answerCard').find('.select-box').last().parent().append(answerFrame.answerFrame)
      $(page.find('.colum').get(0)).append(answerFrame.answerFrame)
   }
   //监听每一列的dom改变 重要的话说3次：整个app的精华都在这里；整个app的精华都在这里；整个app的精华都在这里
   private observeColum(dom: JQuery<HTMLElement>) {
      let config: any = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };
      let observer = new MutationObserver((e: any) => {
         e.map(async (mutation: MutationRecord) => {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].nodeName === 'BR') return
            let innerHeight = dom.height();
            let pageHeight = this.page.height()
            if (pageHeight < innerHeight) {//回车和初始化布局 
               // 此列中最后一个editorBox
               let lastEditorBox = dom.find('div.editor-box').last().get(0);
               if (lastEditorBox) {
                  const type = $(lastEditorBox).attr('type')
                  //获取生成此editorBox的对象实例
                  let obj = GlobalData.AnswerFrameObj.filter((val: any) => { return val.answerFrame.get(0) === lastEditorBox; })[0];
                  let lastRow = null;
                  obj && (lastRow = obj.getLastRow())
                  if (!obj && $(lastEditorBox).attr('proTitle')) {
                     lastRow = $(lastEditorBox).find('.row:last-child')
                  }
                  let nextBox = this.checkoutEditorBox(dom.find('div.editor-box:last-child'), dom);
                  if (nextBox && nextBox.get(0)) {
                     lastRow.attr('hash', nextBox.attr('hash'))
                     nextBox.children(':first-child').before(lastRow);
                  } else {
                     let boxIndex = lastRow.parent().attr('boxIndex')
                     let box: JQuery<HTMLElement>
                     if (dom.next('.colum').get(0)) {//本页最后一栏
                        box = this.createEditorBoxInNextCol(dom.next('.colum'), boxIndex, type, $(lastEditorBox).attr('proTitle'));
                     } else {
                        box = this.createEditorBoxInNextCol(this.page.next().find('.colum:first-child'), boxIndex, type, $(lastEditorBox).attr('proTitle'))
                     }
                     box.attr('targetid', lastRow.parent().attr('targetid'))
                     let boxFirstChild = box.children(':first-child');
                     lastRow.attr('hash', box.attr('hash'))
                     boxFirstChild.get(0) ? boxFirstChild.before(lastRow) : box.append(lastRow)
                  }
                  obj && !obj.answerFrame.children().length && obj.answerFrame.remove()
                  !obj && !$(lastEditorBox).find('.row').length && $(lastEditorBox).remove()
               }
            } else if (pageHeight > innerHeight) {//删除
               let hash = $(mutation.target).attr('hash');
               let editorBox: any = this.page.find(`div.editor-box[hash=${hash}],div.exam-title[hash=${hash}],.header-box[hash=${hash}]`)//触发删除事件的EditotBox
               if (!editorBox.get(0) && GlobalData.haveRemoveDomParent) {
                  editorBox = GlobalData.haveRemoveDomParent.find('div.editor-box:first-child');
               }
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
               if (nextEditorBox && !nextEditorBox.children().length) {
                  GlobalData.haveRemoveDomParent = nextEditorBox.parent()
                  nextEditorBox.remove();
               }
            }
         })
         if (!dom.parent().find('div.editor-box').get(0) && !dom.parent().find('div.select-box').get(0)) {
            dom.parent().remove()
            $('[type=totalPage]').html(`共${$('.colum').length}页`)
            GlobalData.pageObjectPop(this);
         }
         if (!dom.find('div.select-box').children().last().children().first().children().get(0)) {
            dom.find('div.select-box').children().last().remove()
         }
         GlobalData.timer && clearTimeout(GlobalData.timer);
         GlobalData.timer = setTimeout(() => {
            this.setFrameIdx(dom)
            clearTimeout(GlobalData.timer);
            GlobalData.timer = null;
         }, 300)
      })
      observer.observe(dom.get(0), config)
   }

   private createEditorBoxInNextCol(colum: JQuery<HTMLElement>, bIndex: number, type: string, proTitle: string): JQuery<HTMLElement> {//在下一列中创建EditorBox
      if (!proTitle) {
         let answerFrame = new AnswerFrame({}).initAnswerFrame(bIndex, false, type);
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
         return answerFrame.answerFrame;
      } else {
         let answerFrame = new AnswerFrame({}).initAnswerFrame(bIndex, false, type);
         let proTitle = answerFrame.addContent(false, bIndex)
         //判断是否带头
         if (colum.children('div.header-box').get(0)) {
            colum.children('div.editor-box').get(0) ?
               colum.children('div.editor-box').first().before(proTitle) :
               colum.append(proTitle)
         } else {
            colum.children('div.editor-box').get(0) ?
               colum.children('div.editor-box').first().before(proTitle) :
               colum.append(proTitle)
         }
         return proTitle
      }

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
      let answerFrame = new AnswerFrame({}).initAnswerFrame(Number(nextColumFirstEditor.attr('boxIndex')), false, nextColumFirstEditor.attr('type'));
      GlobalData.AnswerFrameObj.push(answerFrame)
      thisColum.append(answerFrame.answerFrame);
      answerFrame.answerFrame.append(row)
      row.attr('hash', answerFrame.answerFrame.attr('hash'))
   }

   private setFrameIdx(dom: JQuery<HTMLElement>) {
      let colums = $('#answerCard').find('.colum');
      for (let i = 0; i < colums.length; i++) {
         let select = $(colums[i]).find(`[type='select']`)
         if (select.get(0) && i !== 0) {
            let prevColum = $(colums[i - 1])
            let frame = Number(prevColum.find(`[type='select']`).children().last().children().last().attr('frame'));
            let thisSelectChild = $(colums[i]).find(`[type='select']`).children();
            for (let i = 0; i < thisSelectChild.length; i++) {
               for (let j = 0; j < $(thisSelectChild[i]).children().length; j++) {
                  $(thisSelectChild[i]).children(`:nth-child(${j + 1})`).attr('frame', frame + j + 1)
               }
               if ((i + 1) % 5 == 0) {
                  frame += $(thisSelectChild[i]).children().length;
               }
            }
         }
      }
   }
}