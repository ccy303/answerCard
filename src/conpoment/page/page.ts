import Header from '../header/header';
import AnswerFrame from '../answerFrame/answerFrame';
import GlobalData from '../global';
import Tool from '../../tool/tool';
import './page.scss';

export default class Page {
   private _page: JQuery<HTMLElement> = null
   private colum: number
   private type: any;
   private data: any;
   // private answerFrame: any = []; //本页面中所有的answerFrame对象
   private callback: any; //用于判断是否要添加新一页
   private html: any;
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
   constructor(callback: any, html?: string) {
      this.type = GlobalData.dataJSON.paperSize;
      this.colum = GlobalData.dataJSON.layoutType;
      this.page = $('<div class="page boxShadow"></div>')
      this.data = GlobalData.dataJSON
      this.callback = callback;
      this.html = html;
   }
   public get page(): JQuery<HTMLElement> {
      return this._page
   }
   public set page(val: JQuery<HTMLElement>) {
      this._page = val;
   }
   public pageInit(addRow: boolean = true, renderHeader: boolean = true) {
      this.page.addClass(this.type);
      GlobalData.dom.append(this.page);
      this.page.attr('id', `${$('#answerCard .page').length}p`)
      if (!this.html) {
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
         addRow && this.whatRender(addRow) //增加空白行
      } else {
         this.page.append(this.square());
         this.rectangle();
         this.rectangle(true);
         let colums = $(this.html).children('.colum')
         let colLen = colums.length;
         let i = 0;
         while (true) {
            if (i > colLen - 1) break
            let _colum = $(colums[i]).clone();
            _colum.children().remove();
            let columChildren = $(colums[i]).children() //element of colum
            let j = 0;
            while (true) {
               if (j > columChildren.length - 1) break;
               let item = columChildren[j];
               if ($(item).hasClass('editor-box') && !$(item).attr('proTitle')) {
                  if ($(item).attr('type') === 'select') {
                     let index = $(item).attr('boxindex');
                     let answerFrame = new AnswerFrame({}, item).initAnswerFrame(Number(index), false, 'select');
                     GlobalData.AnswerFrameObj.push(answerFrame)
                     _colum.append(answerFrame.answerFrame)
                  } else if ($(item).attr('type') === 'editor') {
                     let index = $(item).attr('boxindex');
                     let answerFrame = new AnswerFrame({}, item).initAnswerFrame(Number(index), false, 'editor');
                     GlobalData.AnswerFrameObj.push(answerFrame)
                     _colum.append(answerFrame.answerFrame)
                  } else if ($(item).attr('type') === 'write') {
                     let index = $(item).attr('boxindex');
                     let answerFrame = new AnswerFrame({}, item).initAnswerFrame(Number(index), false, 'write');
                     GlobalData.AnswerFrameObj.push(answerFrame)
                     _colum.append(answerFrame.answerFrame)
                  }
               } else {
                  if ($(item).attr('protitle')) {
                     let bindex = $(item).attr('boxindex');
                     $(item).find('.del').on('click', () => {
                        GlobalData.haveRemoveDomParent = $(`div[proTitle="true"][boxIndex=${bindex}]`).parent().first();
                        Tool.removeBox($(`div[proTitle="true"][boxIndex=${bindex}]`))
                     })
                  }
                  _colum.append(item)
               }
               j++
            }
            this.page.append(_colum);
            this.observeColum(_colum);
            i++
         }
      }
   }
   private whatRender(addRow: boolean) {
      this.data.pageQus.map((pro: any, index: number) => {
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
      $(page.find('.colum').get(0)).append(answerFrame.answerFrame)
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
      let row = targetEditorBox.find('div.row:nth(0)');
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
      if (!nextColumFirstEditor.attr('protitle')) {
         let row = nextColumFirstEditor.children().first();
         let answerFrame = new AnswerFrame({}).initAnswerFrame(Number(nextColumFirstEditor.attr('boxIndex')), false, nextColumFirstEditor.attr('type'));
         GlobalData.AnswerFrameObj.push(answerFrame)
         answerFrame.answerFrame.attr('targetid', nextColumFirstEditor.attr('targetid'))
         thisColum.append(answerFrame.answerFrame);
         answerFrame.answerFrame.append(row)
         row.attr('hash', answerFrame.answerFrame.attr('hash'))
      } else {
         let answerFrame = new AnswerFrame({}).initAnswerFrame(Number(nextColumFirstEditor.attr('boxIndex')), false, nextColumFirstEditor.attr('type'));
         let proTitle = answerFrame.addContent(false, Number(nextColumFirstEditor.attr('boxIndex')));
         let row = nextColumFirstEditor.children('.row').first()
         thisColum.append(proTitle)
         proTitle.append(row)
         row.attr('hash', proTitle.attr('hash'))
      }
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
   private insertHeight(dom: JQuery<HTMLElement>, observe: any, callback?: any) {// Add an element to make the colums height equal
      let heightdiff = this.page.height() - dom.height();
      let lineHeight = dom.children('[type="editor"]:last-child,[type="write"]:last-child').children('.row').css('line-height')
      let lastFrame = dom.children('[type="editor"]:last-child,[type="write"]:last-child');
      if (heightdiff > 0 && heightdiff < parseInt(lineHeight) && lastFrame.get(0)) {
         let height = this.page.height() - dom.height()
         let div = $(`<div style="height:${height}px" contenteditable="false" swapHeight="true"></div>`)
         observe.disconnect() // insertHeight should be stop to observe colum change
         dom.children('[type="editor"]:last-child,[type="write"]:last-child').append(div)
      }
      callback && typeof callback == 'function' && callback();
   }
   //Observe change of every colums dom. It is must important of this Project ! So I want to say three times, but I not 
   private observeColum(dom: JQuery<HTMLElement>) {
      let config: any = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };
      let observer = new MutationObserver(this.observeColumFun.bind(this, dom, config))
      observer.observe(dom.get(0), config)
   }
   private observeColumFun(dom: any, config: any, e: any, observe: any) {
      e.map((mutation: MutationRecord) => {
         if ($(mutation.removedNodes[0]).attr('swapHeight') == 'true') return
         if ($(mutation.addedNodes[0]).attr('swapHeight') == 'true') return
         // if ($(mutation.target).hasClass('write-item')) return
         if (mutation.addedNodes[0] && mutation.addedNodes[0].nodeName === 'BR') return
         let innerHeight = dom.height();
         let pageHeight = this.page.height()
         if (pageHeight < innerHeight) {//回车和初始化布局 
            // 此列中最后一个editorBox
            let lastEditorBox = dom.find('div.editor-box').last().get(0);
            if (!lastEditorBox) { return }
            dom.find('[swapheight=true]').remove()
            const type = $(lastEditorBox).attr('type')
            //获取生成此editorBox的对象实例
            let obj = GlobalData.AnswerFrameObj.filter((val: any) => { return val.answerFrame.get(0) === lastEditorBox })[0];
            let lastRow = null;
            obj && (lastRow = obj.getLastRow())
            if (!obj && $(lastEditorBox).attr('proTitle')) {
               lastRow = $(lastEditorBox).find('.row').last();
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
            obj && !obj.answerFrame.children('.row').length && obj.answerFrame.remove()
            !obj && !$(lastEditorBox).find('.row').length && $(lastEditorBox).remove()
         } else if (pageHeight > innerHeight) {//删除
            dom.find('[swapheight=true]').remove()
            let hash = $(mutation.target).attr('hash');
            let editorBox: any = this.page.find(`div.editor-box[hash=${hash}],div.exam-title[hash=${hash}],.header-box[hash=${hash}]`)//触发删除事件的EditotBox
            if (!editorBox.get(0) && GlobalData.haveRemoveDomParent) {
               editorBox = GlobalData.haveRemoveDomParent.find('div.editor-box:first-child');
            }
            let nextEditorBox = this.findNextEditorBox(editorBox.parent().children().last()); // 由此框分割出的框
            //57一个editor只有一行所需最小距离
            if (!nextEditorBox) {
               pageHeight - innerHeight >= 57 && this.moveNextEditorBoxToThisColum(editorBox.parent());
               !editorBox.children('.row').get(0) && editorBox.remove();
               return;
            } else {
               let nextBoxFirstChild = nextEditorBox.children(':first-child').height();
               nextEditorBox.attr('type') === 'write' && (nextBoxFirstChild += 8)
               if (pageHeight - innerHeight > nextBoxFirstChild) {
                  nextEditorBox && this.moveRowToPrevEditorBox(nextEditorBox, editorBox.parent().children().last());
               }
               if (nextEditorBox && !nextEditorBox.children().length) {
                  GlobalData.haveRemoveDomParent = nextEditorBox.parent()
                  nextEditorBox.remove();
               }
            }
            !editorBox.children('.row').get(0) && editorBox.remove();
         }
      })
      if (!dom.parent().find('div.editor-box').get(0) && !dom.parent().find('div.select-box').get(0)) {//render page count
         dom.parent().remove()
         GlobalData.pageObjectPop(this);
         $('[type=totalPage]').html(`共${$('.page').length}页`)
      }
      GlobalData.timer && clearTimeout(GlobalData.timer);
      GlobalData.timer = setTimeout(() => {
         this.setFrameIdx(dom)
         clearTimeout(GlobalData.timer);
         GlobalData.timer = null;
         //font number
         let t = parseInt(String($('div.write-item').length / 400));
         let i = 1;
         while (true) {
            if (i > t) break;
            let d = $($('div.write-item')[i * 400])
            d.css('position', 'relative')
            if (!d.children().length) {
               d.append(`<div style="position:absolute;top:31.5px;height:10px;width:30px;line-height:6px">\
                     <span style="font-size:10px;color:#888">${i * 400}</span>
                  </div>`)
            }
            i++
         }
      }, 0)
      this.insertHeight(dom, observe, () => {
         observe.observe(dom.get(0), config)
      })
      if ($(window.getSelection().anchorNode).hasClass('editor-box')) {
         let last = $(window.getSelection().anchorNode).children('.row').last();
         last.focus();
         let range = new Range();
         range.selectNodeContents(last.get(0));
         range.collapse(false);
         let sel = window.getSelection();
         sel.removeAllRanges();
         sel.addRange(range);
      }
   }
}