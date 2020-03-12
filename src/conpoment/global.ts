import Header from './header/header';
import Page from './page/page';
export default class GlobalData {
   static AnswerFrameObj: any = [];
   static _currentImage: any = null;
   static pageType: string = '';
   static pageColum: number = 0
   static timer: any = null;
   static dataJSON: any = null;
   static dom: JQuery<HTMLElement> = null;
   static contentTextTarget: any = {};
   static haveRemoveDomParent: JQuery<HTMLElement> = null; //保存已经删掉的元素所在的列
   static config: any = {
   }
   static headerObj: Array<Header> = [];
   static _pageObject: Array<Page> = [];
   static selectionLastRow: boolean = false;
   static subjectId = '';
   static bindProTarget: any = {
      dom: null,
      pro: null,
      qus: null,
   }; //绑定题目时当前点击的题目
   static set currentImage(val) {
      val !== this._currentImage && $(this._currentImage).parent().removeClass('active')
      val !== this._currentImage && $(this._currentImage).parent().children('span').remove()
      this._currentImage = val;
   }
   static get currentImage() {
      return this._currentImage;
   }
   static set pageObject(val: any) {
      this._pageObject.push(val);
      let length = this._pageObject.length;
      let pageNum = $(`<p class="pageNum" style="margin: 0 auto 15px; width:100px; ">
         <span>第${length}页</span> / <span type="totalPage"></span>
      </p>`)
      val.page.append(pageNum);
      $('[type=totalPage]').html(`共${length}页`)
   }
   static get pageObject() {
      return this._pageObject
   }
   static pageObjectPop(val: any) {
      let arr = [...this.pageObject];
      this._pageObject = [];
      let i = 0;
      while (true) {
         if (i > arr.length - 1) break;
         arr[i] !== val && (this.pageObject = arr[i])
         i++;
      }
   }
   static clearProps() {
      this.dom && this.dom.empty();
      this.AnswerFrameObj = []
      this._currentImage = null
      this.pageType = ''
      this.pageColum = 0
      this.timer = null
      this.dataJSON = null
      this.dom = null
      this.contentTextTarget = {}
      this.haveRemoveDomParent = null
      this.config = {}
      this.headerObj = []
      this._pageObject = []
      this.selectionLastRow = false;
      this.subjectId = '';
      this.bindProTarget = {
         dom: null,
         pro: null,
         qus: null,
      };
   }
}