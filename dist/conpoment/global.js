var GlobalData = /** @class */ (function () {
    function GlobalData() {
    }
    Object.defineProperty(GlobalData, "currentImage", {
        get: function () {
            return this._currentImage;
        },
        set: function (val) {
            val !== this._currentImage && $(this._currentImage).parent().removeClass('active');
            val !== this._currentImage && $(this._currentImage).parent().children('span').remove();
            this._currentImage = val;
        },
        enumerable: true,
        configurable: true
    });
    GlobalData.AnswerFrameObj = [];
    GlobalData._currentImage = null;
    GlobalData.pageType = '';
    GlobalData.pageColum = 0;
    GlobalData.timer = null;
    GlobalData.dataJSON = null;
    GlobalData.config = {};
    return GlobalData;
}());
export default GlobalData;
