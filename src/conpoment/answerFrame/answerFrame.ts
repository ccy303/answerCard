import './answerFrame.scss'
import GlobalData from '../global'
import SelQues from '../selQues/selQues';
const dataJSON = require('../../data.json')
export default class AnswerFrame {
   _answerFrame: JQuery<HTMLElement> = null;
   selDom: any = null;
   number: number = 0;
   width: number = 0;
   constructor() {
   }
   public initAnswerFrame(bIndex: number, insertChild: boolean, type = "editor", number?: number) {
      // boxIndex 编辑当前框
      // boxRow 编辑当前此行属于哪个框
      this.number = number;
      this.width = GlobalData.pageType === 'A4' ? 672 :
         GlobalData.pageType === 'A3' && GlobalData.pageColum === 2 ? 704 : 448;
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      let dom: JQuery<HTMLElement> = null;
      if (type === 'editor') { //主观题
         dom = this.renderEditor(bIndex, insertChild, hash)
      } else if (type === 'write') {//作文题
         dom = this.renderWrite(bIndex, hash)
      } else if (type === 'select') {
         dom = this.renderSelect(bIndex, insertChild, hash)
      }
      this.answerFrame = dom
      return this
   }
   get answerFrame(): JQuery<HTMLElement> {
      return this._answerFrame;
   }
   set answerFrame(val: JQuery<HTMLElement>) {
      this._answerFrame = val;
   }
   private writeAddRow(dom: JQuery<HTMLElement>, hash: string) {
      let row = $(`<div class="row" hash="${hash}"></div>`);
      let i = 0;
      while (true) {
         if (i > Math.round(this.width / 32) - 1) break
         row.append(`<div class="write-item"></div>`)
         i++
      }
      dom.append(row)
   }
   renderWrite(bIndex: number, hash: string) {
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" class="editor-box" type="write" contenteditable="false"></div>`);
      let totlaCount = this.number ? this.number / (this.width / 32) + 1 : -1;
      let i = 0
      while (true) {
         if (i > totlaCount) break;
         this.writeAddRow(dom, hash)
         i++;
      }
      return dom
   }

   renderEditor(bIndex: number, insertChild: boolean, hash: string) {
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" contenteditable="true" type="editor" class="editor-box"></div>`)
      let i = 0;
      while (true && insertChild) {
         if (i > 5) break;
         dom.append($(`<div class="row" hash="${hash}"><br /></div>`))
         i++
      }
      // this.observeEditorBox(dom)
      dom.on('keydown', this.keyDowm)
      dom.on('paste', this.paste.bind(this))
      dom.on('click', () => { GlobalData.currentImage = null; })
      return dom
   }

   renderSelect(bIndex: number, insertChild: boolean, hash: string) {
      const option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
      const judge = '✓✗';
      let dom: JQuery<HTMLElement> = $(`<div boxIndex=${bIndex} hash="${hash}" type="select" class="editor-box" contenteditable="false"></div>`)
      const arg = new SelQues(dataJSON.pageQus[0]).initSelQues();
      insertChild && arg.map((arr: any, index: number) => {
         let length = arr.length;
         let arrItemLen = arr[0].length;
         let i = 0
         while (true) {
            if (i > arrItemLen) break;
            let row = $(`<div class="row" hash="${hash}"></div>`);
            let j = 0;
            while (true) {
               if (j > length - 1 || !arr[j][i]) break;
               const optLen = parseInt(arr[j][i].nums);
               //渲染选项
               let k = 0
               let opt = $(`<div class="opts"></div>`)
               while (true) {
                  if (k > optLen - 1) break
                  opt.append(`<div class="opt-item">[${arr[j][i].quType === '判断题' ? judge[k] : option[k]}]</div>`)
                  k++
               }
               let selItem = $(`<div class="sel-item" style="width:${100 / length}%"></div>`);
               selItem.append($(`<div class="pnum">${arr[j][i].pnum}</div>`));
               selItem.append(opt)
               row.append(selItem)
               dom.append(row)
               j++
            }
            i++
         }
      })
      return dom
   }

   public getLastRow() {
      return this.answerFrame.find('.row:last-child')
   }
   private paste(e: any) {
      e.preventDefault();
      let file = e.originalEvent.clipboardData.files[0]
      if (file && file.type == 'image/png') {
         let reader = new FileReader();
         reader.onload = () => {
            $(e.currentTarget).append($(`<div contenteditable="false" class="image-file-box" draggable ="false">
               <img src=${reader.result}  class="image-file" draggable ="false">
            </div>`))
            this.dealImage()
         }
         reader.readAsDataURL(file)
      } else {
         let html = e.originalEvent.clipboardData.getData('text/plain')
         html = html.replace(/\r|\n|\s/g, '')
         document.execCommand('insertText', false, html)
         return false
      }
   }
   private dealImage(dom?: any) {
      $('div.image-file-box').on('click', (imageEvent) => {
         imageEvent.stopPropagation()
         $(imageEvent.target).parent().addClass('active')
         !$(imageEvent.target).parent().children('span').get(0) && $(imageEvent.target).parent().append(`
            <span contenteditable="false" draggable ="false" class="bottom-right drag"></span>
         `)
         $(`span`).on('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault()
            this.selDom = e.target;
         })
         GlobalData.currentImage = imageEvent.target
         let obj: any = {};
         $(imageEvent.target).parent().on('mousedown', (mouseDownEvent) => {//包裹图片的div
            mouseDownEvent.stopPropagation()
            this.selDom = mouseDownEvent.target;
            obj.x0 = mouseDownEvent.offsetX;
            obj.y0 = mouseDownEvent.offsetY;
         })
         $(imageEvent.target).parent().parent().on('mousemove', (mouseMoveEvent) => {//editorBox
            if (!this.selDom) return
            if (mouseMoveEvent.target === this.selDom) {
               let e = mouseMoveEvent
               e.stopPropagation()
               $(e.target).parent()
                  .css('top', e.pageY - $(e.target).parent().parent().offset().top - obj.y0)
                  .css('left', e.pageX - $(e.target).parent().parent().offset().left - obj.x0)
            } else if ($(this.selDom).hasClass('drag')) {
               let imageSize = {
                  height: parseInt($(this.selDom).parent().children('.image-file').css('height')),
                  width: parseInt($(this.selDom).parent().children('.image-file').css('width')),
               }
               $(this.selDom).parent().children('.image-file')
                  .css('height', imageSize.height + mouseMoveEvent.pageY - $(this.selDom).offset().top)
            }
         })
         $(imageEvent.target).on('mouseup', (e) => {
            e.stopPropagation()
            $(imageEvent.target).parent().off('mousedown');
            $(imageEvent.target).parent().parent().off('mousemove')
            this.selDom = null;
            obj = {};
         })
      })
   }
   private postImageToOss(img: any) {

   }
   private keyDowm(event: any) {
      if (event.keyCode === 8) {
         //剩下最后一行时禁用删除
         $(event.target).children().length === 1 && event.preventDefault();
      }
   }
}