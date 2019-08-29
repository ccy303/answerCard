var Tool = /** @class */ (function () {
    function Tool() {
    }
    Tool.prototype.selectProRIndex = function (dom) {
        var page = null;
        var pageDom = null;
        for (var i = 0; i < $('#answerCard>.page').length; i++) { //查找页数
            if ($($('#answerCard>.page').get(i)).find(dom).get(0)) {
                page = i + 1;
                pageDom = $($('#answerCard>.page').get(i));
            }
        }
        if (!page)
            return null;
        var bigFrame = null;
        for (var i = 0; i < pageDom.find('.colum').children().length; i++) { //查找大框
            if ($(pageDom.find('.colum').children().get(i)).find(dom).get(0)) {
                bigFrame = i + 1;
                if (pageDom.find('.colum').children('.header-box').get(0)) {
                    bigFrame -= 2;
                }
            }
        }
        if (!bigFrame)
            return null;
        var frame = dom.attr('frame');
        return page + "-" + bigFrame + "-" + frame;
    };
    Tool.prototype.subjectiveQuestionsPindex = function (dom) {
        var pIndex = [];
        var pages = $('#answerCard>.page');
        for (var i = 0; i < dom.length; i++) {
            var f = null;
            var p = null;
            for (var j = 0; j < pages.length; j++) {
                if ($(pages[j]).find(dom[i]).get(0)) {
                    p = j + 1;
                    var frame = $(pages[j]).find('.colum').children();
                    for (var k = 0; k < frame.length; k++) {
                        if (frame[k] === dom[i]) {
                            f = k + 1;
                            $(pages[j]).find('.colum').children('.header-box').get(0) && (f -= 2);
                        }
                    }
                }
            }
            pIndex.push(p + "@" + f);
        }
        return pIndex.join('-');
    };
    return Tool;
}());
export default new Tool();
