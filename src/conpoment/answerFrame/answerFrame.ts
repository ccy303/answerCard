import './answerFrame.scss'
import GlobalData from '../global'
import SelQues from '../selQues/selQues';
import tool from '../../tool/tool';
import ContentText from '../contentText/content';
export default class AnswerFrame {
   _answerFrame: JQuery<HTMLElement> = null;
   _selDom: any = null;
   number: number = 0;
   width: number = 0;
   data: any;
   constructor(data: any) {
      this.data = data;
   }
   public initAnswerFrame(bIndex: number, insertChild: boolean, type = "editor", number?: number) {
      // boxIndex 编辑当前框
      // boxRow 编辑当前此行属于哪个框
      this.number = number;
      this.width = GlobalData.pageType === 'A4' ? 672 :
         GlobalData.pageType === 'A3' && GlobalData.pageColum === 2 ?
            704 : 448;
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      let dom: JQuery<HTMLElement> = null;
      if (type === 'editor') { //主观题
         dom = this.renderEditor(bIndex, insertChild, hash)
      } else if (type === 'write') {//作文题
         dom = this.renderWrite(bIndex, hash)
      } else if (type === 'select') {//客观题
         dom = this.renderSelect({ bIndex, insertChild, hash })
      }
      this.answerFrame = dom
      this.answerFrame.on('contextmenu', this.contextmenu.bind(this))
      return this
   }
   private contextmenu(e: any) {//右键菜单
      e.preventDefault();
      GlobalData.contentTextTarget = { targetObj: this, targetDom: $(e.currentTarget), targetRow: $(e.target) };
      let contentText = new ContentText().init()
      GlobalData.dom.append(contentText);
      $('#contentText').css('display', 'block').css('top', e.pageY).css('left', e.pageX)
   }
   get answerFrame(): JQuery<HTMLElement> {
      return this._answerFrame;
   }
   set answerFrame(val: JQuery<HTMLElement>) {
      this._answerFrame = val;
   }
   get selDom() {
      return this._selDom;
   }
   set selDom(val) {
      this._selDom = val
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
   private renderWrite(bIndex: number, hash: string) {
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" class="editor-box" type="write" contenteditable="false"></div>`);
      if (Object.keys(this.data).length) {
         dom.attr("targetid", `${this.data.pros[0].proId}`)
      }
      let totlaCount = this.number ? this.number / (this.width / 32) + 1 : -1;
      let i = 0
      while (true) {
         if (i > totlaCount) break;
         this.writeAddRow(dom, hash)
         i++;
      }
      return dom
   }
   private renderEditor(bIndex: number, insertChild: boolean, hash: string) {
      const flg = ['判断题', '单选题', '多选题'];
      const option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
      const judge = '✓✗';
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" contenteditable="true" type="editor" class="editor-box"></div>`)
      if (Object.keys(this.data).length) {
         dom.attr("targetid", `${this.data.pros[0].proId}`)
         this.data.pros[0].qus.map((val: any) => {
            let pnum = $(`<div class="row" hash="${hash}">${val.pnum}：(${val.score}分)</div>`)
            if (flg.indexOf(val.quType) !== -1 && val.visible) {
               let j = 0;
               let opt = $(`<div class="opts"  style="margin-left:15px"></div>`)
               while (true) {
                  if (j > val.nums - 1) break
                  opt.append($(`<div class="opt-item">[${val.quType === '判断题' ? judge[j] : option[j]}]</div>`))
                  j++;
               }
               pnum.append(opt)
            }
            dom.append(pnum)
            let i = 0;
            while (true && insertChild && flg.indexOf(val.quType) === -1) {
               if (i > 6) break;
               dom.append($(`<div class="row" hash="${hash}"><br /></div>`))
               i++
            }
         })
      }
      dom.on('keydown', this.keyDowm.bind(this, false))
      dom.on('paste', this.paste.bind(this, true))
      dom.on('click', () => { GlobalData.currentImage = null; })
      return dom
   }
   private renderSelect({ bIndex, insertChild, hash }: { bIndex: number; insertChild: boolean; hash: string }) {
      const option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
      const judge = '✓✗';
      let dom: JQuery<HTMLElement> = $(`<div boxIndex=${bIndex} hash="${hash}" type="select" class="editor-box" contenteditable="false"></div>`)
      const arg = new SelQues(GlobalData.dataJSON.pageQus[0]).initSelQues();
      insertChild && arg.map((arr: any, index: number) => {
         let length = arr.length;
         let arrItemLen = arr[0].data.length;
         let i = 0
         while (true) {
            if (i > arrItemLen) break;
            let row = $(`<div class="row" hash="${hash}"></div>`);
            let j = 0;
            while (true) {
               if (j > length - 1 || !arr[j].data[i]) break;
               const optLen = parseInt(arr[j].data[i].nums);
               //渲染选项
               let k = 0
               let opt = $(`<div class="opts"></div>`)
               while (true) {//选项
                  if (k > optLen - 1 || isNaN(optLen)) break
                  opt.append(`<div class="opt-item">[${arr[j].data[i].quType === '判断题' ? judge[k] : option[k]}]</div>`)
                  k++
               }
               let selItem = $(`<div class="sel-item" frame="${arr[j].frame}" targetID="${arr[j].data[i].quId}${arr[j].data[i].pnum}" style="width:${100 / length}%"></div>`);
               selItem.append($(`<div class="pnum">${arr[j].data[i].pnum || ''}</div>`));
               selItem.append(opt)
               row.append(selItem)
               dom.append(row)
               j++;
            }
            i++
         }
      })
      return dom
   }
   public getLastRow() {
      return this.answerFrame.find('.row:last-child')
   }
   private paste(canPasteImg: boolean = true, e: any) {
      e.preventDefault();
      let file = e.originalEvent.clipboardData.files[0]
      if (file && file.type == 'image/png' && canPasteImg) {
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
   private keyDowm(contentText: boolean, event: any) { //contentText：来自右键菜单
      if (event.keyCode === 8) {
         //剩下最后一行时禁用删除
         if (GlobalData.currentImage) {
            event.preventDefault();
            $(GlobalData.currentImage).parent().remove()
         }
         $(event.target).children('.row').length === 1 && $(event.target).children('.row').get(0).innerHTML.indexOf('<b') != -1 && event.preventDefault();
      }
   }
   /**
    * @param  addrow  是否给新创建的标题栏添加一行
    * @param  bIndex  由上一个标题栏跨栏产生的标题栏创建时需要传递的发生跨列的标题栏的boxIndex，空则表示不是跨列调用
    */
   public addContent(addrow: boolean = true, bIndex?: any) {
      let proTitle = GlobalData.contentTextTarget.targetDom.prev().attr('proTitle');
      let isSplit = tool.checkBoxIsSplit(GlobalData.contentTextTarget.targetDom);
      if (!bIndex && (proTitle || isSplit)) { return }
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      !bIndex && (bIndex = (new Date().getTime() + Math.random() * 1000000000000).toFixed(0))
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" proTitle="true" contenteditable="true" type="editor" class="editor-box"></div>`)
      let row = $(`<div class="row" hash="${hash}">1</div>`)
      let del = $(`<span class="del" contenteditable="false">×</span>`)
      dom.append(del)
      addrow && dom.append(row);
      dom.on('keydown', this.keyDowm.bind(this, true))
      dom.on('paste', this.paste.bind(this, false))
      del.on('click', () => {
         GlobalData.haveRemoveDomParent = $(`div[proTitle="true"][boxIndex=${bIndex}]`).parent();
         $(`div[proTitle="true"][boxIndex=${bIndex}]`).remove()
      })
      GlobalData.contentTextTarget.targetDom.before(dom)
      return dom
   }
   public addGrid(count: number) {
      if (GlobalData.contentTextTarget.targetDom.attr('type') !== 'editor') {
         return
      }
      if (GlobalData.contentTextTarget.targetRow.get(0).innerHTML === '<br>') {
         GlobalData.contentTextTarget.targetRow.get(0).innerHTML = ''
      }
      let _count = count;
      let i = 0;
      while (true) {
         if (i > _count - 1) break;
         let grid = $(`<div 
            contenteditable="false"
            style="height:32px;width:32px;box-sizing:border-box;border:1px solid #000;display:inline-block;margin-right:2px"
         ></div>`)
         i == 0 && grid.css('border-left', '1px solid #000')
         GlobalData.contentTextTarget.targetRow.append(grid)
         i++
      }
   }
   public changeLineHeight(height: number) {
      if (GlobalData.contentTextTarget.targetDom.attr('type') !== 'editor') {
         return
      }
      let attr = GlobalData.contentTextTarget.targetDom.attr('boxindex');
      $(`div[boxindex=${attr}]`).find('.row').css('line-height', height + 'px')
   }
}