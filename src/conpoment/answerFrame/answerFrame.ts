import './answerFrame.scss'

export default class AnswerFrame {
   _answerFrame: JQuery<HTMLElement> = null;
   constructor() { }
   public initAnswerFrame(bIndex: number) {
      let dom = $(`<div box-index=${bIndex} contenteditable="true" class="editor-box">
      </div>`)
      let i = 0;
      while (true) {
         if (i > 5) break;
         dom.append($(`<div class="row"><br /></div>`))
         i++
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

   public getLastRow() {
      return this.answerFrame.find('.row:last-child')
   }

   public removeRow() {

   }
}