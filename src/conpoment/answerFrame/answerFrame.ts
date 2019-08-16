import './answerFrame.scss'
import GlobalData from '../global'
export default class AnswerFrame {
   _answerFrame: JQuery<HTMLElement> = null;
   selDom: any = null;
   constructor() {
   }
   public initAnswerFrame(bIndex: number, insertChild: boolean) {
      // boxIndex 编辑当前框
      // boxRow 编辑当前此行属于哪个框
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" contenteditable="true" class="editor-box">
      </div>`)
      let i = 0;
      while (true && insertChild) {
         if (i > 5) break;
         dom.append($(`<div class="row" hash="${hash}"><br /></div>`))
         i++
      }
      this.answerFrame = dom
      // this.observeEditorBox(dom)
      dom.on('keydown', this.keyDowm)
      dom.on('paste', this.paste.bind(this))
      dom.on('click', () => { GlobalData.currentImage = null; })
      return this
   }
   get answerFrame(): JQuery<HTMLElement> {
      return this._answerFrame;
   }
   set answerFrame(val: JQuery<HTMLElement>) {
      this._answerFrame = val;
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
   // private observeEditorBox(dom: JQuery<HTMLElement>) {
   //    let config = { attributes: false, childList: true };
   //    let observer = new MutationObserver((e: any) => {
   //       e.map((mutation: MutationRecord) => {
   //          if (mutation.removedNodes && mutation.removedNodes.length) {
   //             !$(mutation.target).children().get(0) && $(mutation.target).remove()
   //          }
   //       })
   //    })

   //    observer.observe(dom.get(0), config)
   // }
}