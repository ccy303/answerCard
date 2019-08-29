var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Header from '../header/header';
import AnswerFrame from '../answerFrame/answerFrame';
import GlobalData from '../global';
import './page.scss';
var Page = /** @class */ (function () {
    /**
     * @param type 纸张类型A3..
     * @param callback 函数，用于判断是否要添加新一页
     * @param colum 列数 1栏、2栏、3栏
     */
    function Page(callback) {
        this._page = null;
        //1->1,2->2,3->4,4->8
        this.pageNum = [
            [1],
            [2],
            [1, 2],
            [3],
            [1, 3],
            [2, 3],
            [1, 2, 3],
            [4],
            [1, 4],
            [2, 4],
            [1, 2, 4],
            [3, 4],
            [1, 3, 4],
            [2, 3, 4],
            [1, 2, 3, 4] //15
        ];
        this.type = GlobalData.dataJSON.paperSize;
        this.colum = GlobalData.dataJSON.layoutType;
        this.page = $('<div class="page"></div>');
        this.data = GlobalData.dataJSON;
        this.callback = callback;
    }
    Object.defineProperty(Page.prototype, "page", {
        get: function () {
            return this._page;
        },
        set: function (val) {
            this._page = val;
        },
        enumerable: true,
        configurable: true
    });
    Page.prototype.pageInit = function (addRow, renderHeader) {
        if (addRow === void 0) { addRow = true; }
        if (renderHeader === void 0) { renderHeader = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _colum, defaultColum, header;
            return __generator(this, function (_a) {
                this.page.addClass(this.type);
                $('#answerCard').append(this.page);
                this.page.attr('id', $('#answerCard .page').length + "p");
                _colum = this.colum - 1;
                while (true) {
                    if (_colum < 0)
                        break;
                    defaultColum = null;
                    if (_colum === this.colum - 1) {
                        defaultColum = $("<div class=\"colum " + this.type + "-" + this.colum + "\">\n            " + (renderHeader ? "<div contenteditable=\"true\" class=\"exam-title\">" + this.data.alias + "</div>" : '') + "\n            </div>");
                    }
                    else {
                        defaultColum = $("<div class=\"colum " + this.type + "-" + this.colum + "\"></div>");
                    }
                    this.observeColum(defaultColum);
                    this.page.append(defaultColum);
                    _colum--;
                }
                this.page.append(this.square());
                this.rectangle();
                this.rectangle(true);
                if (renderHeader) { //绘制答题卡头}
                    header = new Header({
                        type: this.type,
                        colum: this.colum
                    });
                    $(this.page).find('div.colum:first-child').append(header.initHeader());
                }
                if (addRow) { //增加空白行
                    this.whatRender(this.data, addRow);
                }
                else { }
                return [2 /*return*/];
            });
        });
    };
    Page.prototype.whatRender = function (data, addRow) {
        var _this = this;
        data.pageQus.map(function (pro, index) {
            // console.log(pro)
            if (!pro.pros.find(function (val) { return val.pureObjective !== '1'; })) { //选择题
                _this.renderDeafultAnswerFrame(index, addRow, 'select', pro);
            }
            else {
                if (pro.pros[0].qus[0].quType !== '作文题') {
                    _this.renderDeafultAnswerFrame(index, addRow, 'editor', pro);
                }
                else {
                    _this.renderDeafultAnswerFrame(index, addRow, 'write', pro, 800);
                }
            }
        });
    };
    Page.prototype.square = function () {
        var arr = [];
        arr.push($('<div class="square left-top"></div>'));
        arr.push($('<div class="square left-bottom"></div>'));
        arr.push($('<div class="square right-top"></div>'));
        arr.push($('<div class="square right-bottom"></div>'));
        return arr;
    };
    Page.prototype.rectangle = function (pageNum) {
        var _this = this;
        if (pageNum === void 0) { pageNum = false; }
        var height = pageNum ? '8px' : '25px';
        var width = pageNum ? '25px' : '8px';
        if (!pageNum) { //右边方块
            var innerHeight_1 = 0;
            innerHeight_1 = $(this.page.find('div.left-bottom')).position().top - $(this.page.find('div.left-top')).position().top - $(this.page.find('div.left-top')).height();
            innerHeight_1 = innerHeight_1 / 4;
            var i = 0;
            while (true) {
                if (i > 2)
                    break;
                var top_1 = 0;
                top_1 = innerHeight_1 * (i + 1) + $(this.page.find('div.left-top')).height() + $(this.page.find('div.left-top')).position().top - 12.5;
                this.page.append("<div style=\"height:" + height + ";width:" + width + ";top:" + top_1 + "px;left:32px\" class=\"rectangle\"></div>");
                i++;
            }
        }
        else { //顶部页数方块
            var innerWidth_1 = 0;
            innerWidth_1 = $(this.page.find('div.right-top')).position().left - $(this.page.find('div.left-top')).position().left - $(this.page.find('div.left-top')).width();
            innerWidth_1 = this.type === 'A4' ? innerWidth_1 / 5 : innerWidth_1 / 2 / 5;
            var pageIndex = parseInt(this.page.attr('id'));
            this.pageNum[pageIndex - 1].map(function (val) {
                var left = 0;
                left = innerWidth_1 * val + $(_this.page.find('div.left-top')).width();
                _this.page.append("<div style=\"height:" + height + ";width:" + width + ";top:" + 45 + "px;left:" + left + "px\" class=\"rectangle\"></div>");
            });
        }
    };
    Page.prototype.renderDeafultAnswerFrame = function (bIndex, addRow, type, data, number) {
        if (data === void 0) { data = {}; }
        if (number === void 0) { number = 800; }
        var answerFrame = new AnswerFrame(data).initAnswerFrame(bIndex, addRow, type, number);
        GlobalData.AnswerFrameObj.push(answerFrame);
        var page = $(this.page);
        // $('#answerCard').find('.select-box').last().parent().append(answerFrame.answerFrame)
        $(page.find('.colum').get(0)).append(answerFrame.answerFrame);
    };
    //监听每一列的dom改变 重要的话说3次：整个app的精华都在这里；整个app的精华都在这里；整个app的精华都在这里
    Page.prototype.observeColum = function (dom) {
        var _this = this;
        var config = { attributes: true, childList: true, subtree: true, attributeFilter: ['style'] };
        var observer = new MutationObserver(function (e) {
            e.map(function (mutation) { return __awaiter(_this, void 0, void 0, function () {
                var innerHeight, pageHeight, lastEditorBox_1, type, obj, lastRow, nextBox, boxIndex, box, boxFirstChild, hash, editorBox, nextEditorBox, nextBoxFirstChild;
                return __generator(this, function (_a) {
                    if (mutation.addedNodes[0] && mutation.addedNodes[0].nodeName === 'BR')
                        return [2 /*return*/];
                    innerHeight = dom.height();
                    pageHeight = this.page.height();
                    if (pageHeight < innerHeight) { //回车和初始化布局
                        lastEditorBox_1 = dom.find('div.editor-box').last().get(0);
                        if (lastEditorBox_1) {
                            type = $(lastEditorBox_1).attr('type');
                            obj = GlobalData.AnswerFrameObj.filter(function (val) {
                                return val.answerFrame.get(0) === lastEditorBox_1;
                            })[0];
                            lastRow = obj.getLastRow();
                            nextBox = this.checkoutEditorBox(dom.find('div.editor-box:last-child'), dom);
                            if (nextBox && nextBox.get(0)) {
                                lastRow.attr('hash', nextBox.attr('hash'));
                                nextBox.children(':first-child').before(lastRow);
                            }
                            else {
                                boxIndex = lastRow.parent().attr('boxIndex');
                                box = void 0;
                                if (dom.next('.colum').get(0)) { //本页最后一栏
                                    box = this.createEditorBoxInNextCol(dom.next('.colum'), boxIndex, type).answerFrame;
                                }
                                else {
                                    box = this.createEditorBoxInNextCol(this.page.next().find('.colum:first-child'), boxIndex, type).answerFrame;
                                }
                                box.attr('targetid', lastRow.parent().attr('targetid'));
                                boxFirstChild = box.children(':first-child');
                                lastRow.attr('hash', box.attr('hash'));
                                boxFirstChild.get(0) ? boxFirstChild.before(lastRow) : box.append(lastRow);
                            }
                            !obj.answerFrame.children().length && obj.answerFrame.remove();
                        }
                    }
                    else if (pageHeight > innerHeight) { //删除
                        if (!$(mutation.removedNodes[0]).attr('hash') || mutation.removedNodes[0] && mutation.removedNodes[0].nodeName === 'BR') {
                            return [2 /*return*/];
                        }
                        hash = $(mutation.target).attr('hash');
                        editorBox = this.page.find("div.editor-box[hash=" + hash + "]") //触发删除事件的EditotBox
                        ;
                        nextEditorBox = this.findNextEditorBox(editorBox.parent().children().last());
                        if (!nextEditorBox) {
                            this.moveNextEditorBoxToThisColum(editorBox.parent());
                            return [2 /*return*/];
                        }
                        nextBoxFirstChild = nextEditorBox.children(':first-child').height();
                        nextEditorBox.attr('type') === 'write' && (nextBoxFirstChild += 8);
                        if (pageHeight - innerHeight > nextBoxFirstChild) {
                            if (nextEditorBox) {
                                this.moveRowToPrevEditorBox(nextEditorBox, editorBox.parent().children().last());
                            }
                        }
                        nextEditorBox && !nextEditorBox.children().length && nextEditorBox.remove();
                    }
                    return [2 /*return*/];
                });
            }); });
            if (!dom.parent().find('div.editor-box').get(0) && !dom.parent().find('div.select-box').get(0)) {
                dom.parent().remove();
            }
            if (!dom.find('div.select-box').children().last().children().first().children().get(0)) {
                dom.find('div.select-box').children().last().remove();
            }
            GlobalData.timer && clearTimeout(GlobalData.timer);
            GlobalData.timer = setTimeout(function () {
                _this.setFrameIdx(dom);
                clearTimeout(GlobalData.timer);
                GlobalData.timer = null;
            }, 300);
        });
        observer.observe(dom.get(0), config);
    };
    Page.prototype.createEditorBoxInNextCol = function (colum, bIndex, type) {
        var answerFrame = new AnswerFrame({}).initAnswerFrame(bIndex, false, type);
        GlobalData.AnswerFrameObj.push(answerFrame);
        //判断是否带头
        if (colum.children('div.header-box').get(0)) {
            colum.children('div.editor-box').get(0) ?
                colum.children('div.editor-box').first().before(answerFrame.answerFrame) :
                colum.append(answerFrame.answerFrame);
        }
        else {
            colum.children('div.editor-box').get(0) ?
                colum.children('div.editor-box').first().before(answerFrame.answerFrame) :
                colum.append(answerFrame.answerFrame);
        }
        return answerFrame;
    };
    Page.prototype.checkoutEditorBox = function (dom, colum) {
        var boxIndex = dom.attr('boxIndex');
        if (colum.next('.colum').get(0)) {
            return colum.next('.colum').find("div[boxIndex=" + boxIndex + "]");
        }
        else {
            if (this.page.next('.page').get(0)) { //存在下一页
                return this.page.next('.page').find('.colum:first-child').find("div[boxIndex=" + boxIndex + "]");
            }
            else { //没有下一页
                this.callback();
            }
        }
    };
    Page.prototype.findNextEditorBox = function (dom) {
        var editorBoxs = $('#answerCard').find("div.editor-box[boxIndex=" + dom.attr('boxIndex') + "]");
        var nextEditorBox = null;
        for (var i = 0; i < editorBoxs.length; i++) {
            if (editorBoxs.get(i) === dom.get(0) && editorBoxs.get(i + 1)) {
                nextEditorBox = $(editorBoxs.get(i + 1));
            }
        }
        return nextEditorBox;
    };
    Page.prototype.moveRowToPrevEditorBox = function (targetEditorBox, prevEditorBox) {
        var row = targetEditorBox.find('div.row:first-child');
        prevEditorBox.append(row);
        row.attr('hash', prevEditorBox.attr('hash'));
    };
    Page.prototype.moveNextEditorBoxToThisColum = function (thisColum) {
        var colums = $('#answerCard').find('.colum');
        var nextColum = null;
        for (var i = 0; i < colums.length; i++) {
            if (colums.get(i) === thisColum.get(0) && colums.get(i + 1)) {
                nextColum = $(colums.get(i + 1));
            }
        }
        if (!nextColum || !nextColum.get(0))
            return;
        var nextColumFirstEditor = $(nextColum.children('div.editor-box').get(0));
        if (!nextColumFirstEditor.get(0))
            return;
        var row = nextColumFirstEditor.children().first();
        var answerFrame = new AnswerFrame({}).initAnswerFrame(Number(nextColumFirstEditor.attr('boxIndex')), false, nextColumFirstEditor.attr('type'));
        GlobalData.AnswerFrameObj.push(answerFrame);
        thisColum.append(answerFrame.answerFrame);
        answerFrame.answerFrame.append(row);
        row.attr('hash', answerFrame.answerFrame.attr('hash'));
    };
    Page.prototype.setFrameIdx = function (dom) {
        var colums = $('#answerCard').find('.colum');
        for (var i = 0; i < colums.length; i++) {
            var select = $(colums[i]).find("[type='select']");
            if (select.get(0) && i !== 0) {
                var prevColum = $(colums[i - 1]);
                var frame = Number(prevColum.find("[type='select']").children().last().children().last().attr('frame'));
                var thisSelectChild = $(colums[i]).find("[type='select']").children();
                for (var i_1 = 0; i_1 < thisSelectChild.length; i_1++) {
                    for (var j = 0; j < $(thisSelectChild[i_1]).children().length; j++) {
                        $(thisSelectChild[i_1]).children(":nth-child(" + (j + 1) + ")").attr('frame', frame + j + 1);
                    }
                    if ((i_1 + 1) % 5 == 0) {
                        frame += $(thisSelectChild[i_1]).children().length;
                    }
                }
            }
        }
    };
    return Page;
}());
export default Page;
