// import data from './data.json'
import GlobalData from './conpoment/global';
import Page from './conpoment/page/page';
import Tool from './tool/tool';
var dataJSON = require('./data.json');
var answerCard = /** @class */ (function () {
    function answerCard(dataJson, both) {
        if (both === void 0) { both = false; }
        this.pages = [];
        this.dataJson = dataJson;
        this.both = both;
        GlobalData.dataJSON = dataJson;
        GlobalData.pageType = dataJSON.paperSize;
        GlobalData.pageColum = parseInt(dataJSON.layoutType);
        var page = new Page(this.addPage.bind(this));
        page.pageInit();
        this.pages.push(page);
        // setTimeout(() => {
        //    console.log(this.htmlToJson())
        // }, 1000);
    }
    answerCard.prototype.addPage = function () {
        var page = new Page(this.addPage.bind(this));
        if (this.both) { //双面打印
            $('#answerCard .page').length % 2 === 0 ?
                page.pageInit(false, true) :
                page.pageInit(false, false);
        }
        else {
            page.pageInit(false, true);
        }
        this.pages.push(page);
    };
    answerCard.prototype.htmlToJson = function () {
        var pages = $('#answerCard').children('.page');
        var arr = [];
        for (var i = 0; i < pages.length; i++) {
            arr.push(pages[i].outerHTML);
        }
        return JSON.stringify(arr);
        // return JSON.stringify($('#answerCard').get(0).outerHTML)
    };
    answerCard.prototype.getLayoutData = function () {
        this.dataJson.pageQus.map(function (pros) {
            pros.pros.map(function (qus) {
                if (qus.pureObjective === '1') { //客观题
                    qus.qus.map(function (_ques) {
                        var rIndex = Tool.selectProRIndex($("[targetID='" + _ques.quId + _ques.pnum + "']"));
                        _ques.rIndex = rIndex;
                    });
                }
                else {
                    var pIndex = Tool.subjectiveQuestionsPindex($("[targetID='" + pros.pros[0].proId + "']"));
                    pros.pIndex = pIndex;
                }
            });
        });
    };
    return answerCard;
}());
export default answerCard;
// new answerCard(dataJSON, true)
