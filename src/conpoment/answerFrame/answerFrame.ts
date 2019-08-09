import './answerFrame.scss'
export default class AnswerFrame {
   _answerFrame: JQuery<HTMLElement> = null;
   constructor() { }
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
      this.observeEditorBox(dom)
      dom.on('keydown', this.keyDowm)
      dom.on('paste', this.paste)
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
      // console.log(e.originalEvent)
      //图文混合粘贴clipboardData.item
      //单独图片粘贴clipboardData.files

      e.preventDefault();
      console.log(e.originalEvent.clipboardData.files[0])
      for (let i = 0; i < e.originalEvent.clipboardData.items.length; i++) {
         e.originalEvent.clipboardData.items[i].getAsString((str: any) => {
            console.log(str)
         })
      }
      // let html = e.originalEvent.clipboardData.getData('text/plain')
      // html = html.replace(/\r|\n|\s/g, '')
      // document.execCommand('insertText', false, html)
      // return false
   }

   private keyDowm(event: any) {
      if (event.keyCode === 8) {
         //剩下最后一行时禁用删除
         $(event.target).children().length === 1 && event.preventDefault();
      }
   }

   private observeEditorBox(dom: JQuery<HTMLElement>) {
      let config = { attributes: false, childList: true };
      let observer = new MutationObserver((e: any) => {
         e.map((mutation: MutationRecord) => {
            if (mutation.removedNodes && mutation.removedNodes.length) {
               !$(mutation.target).children().get(0) && $(mutation.target).remove()
            }
         })
      })

      observer.observe(dom.get(0), config)
   }
}