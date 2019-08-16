export default class GlobalData {
   static AnswerFrameObj: any = [];
   static _currentImage: any = null;
   static pageType: string = '';
   static pageColum: number = 0
   static set currentImage(val) {
      val !== this._currentImage && $(this._currentImage).parent().removeClass('active')
      val !== this._currentImage && $(this._currentImage).parent().children('span').remove()
      this._currentImage = val;
   }
   static get currentImage() {
      return this._currentImage;
   }
}