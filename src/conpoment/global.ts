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
      let pageNum = $(`<p class="pageNum">
         <span>第${length}页</span> / <span type="totalPage"></span>
      </p>`)
      val.page.append(pageNum);
      $('[type=totalPage]').html(`共${length}页`)
   }

   static get pageObject() {
      return this._pageObject
   }

   static pageObjectPop(val: any) {
      let arr = [...this._pageObject];
      this._pageObject = [];
      let i = 0;
      while (true) {
         if (i > arr.length - 1) break;
         arr[i] !== val && this._pageObject.push(val);
         i++;
      }
   }

}