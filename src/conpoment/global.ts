export default class GlobalData {
   static AnswerFrameObj: any = [];
   static _currentImage: any = null;
   static pageType: string = '';
   static pageColum: number = 0
   static timer: any = null;
   static dataJSON: any = null;
   static dom: JQuery<HTMLElement> = null;
   static config: any = {

   }
   static set currentImage(val) {
      val !== this._currentImage && $(this._currentImage).parent().removeClass('active')
      val !== this._currentImage && $(this._currentImage).parent().children('span').remove()
      this._currentImage = val;
   }
   static get currentImage() {
      return this._currentImage;
   }
}