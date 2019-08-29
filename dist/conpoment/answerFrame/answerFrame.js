import './answerFrame.scss';
import GlobalData from '../global';
import SelQues from '../selQues/selQues';
var AnswerFrame = /** @class */ (function () {
    function AnswerFrame(data) {
        this._answerFrame = null;
        this._selDom = null;
        this.number = 0;
        this.width = 0;
        this.data = data;
    }
    AnswerFrame.prototype.initAnswerFrame = function (bIndex, insertChild, type, number) {
        if (type === void 0) { type = "editor"; }
        // boxIndex 编辑当前框
        // boxRow 编辑当前此行属于哪个框
        this.number = number;
        this.width = GlobalData.pageType === 'A4' ? 672 :
            GlobalData.pageType === 'A3' && GlobalData.pageColum === 2 ? 704 : 448;
        var hash = "id" + (new Date().getTime() + Math.random() * 1000000000000).toFixed(0);
        var dom = null;
        if (type === 'editor') { //主观题
            dom = this.renderEditor(bIndex, insertChild, hash);
        }
        else if (type === 'write') { //作文题
            dom = this.renderWrite(bIndex, hash);
        }
        else if (type === 'select') { //客观题
            dom = this.renderSelect({ bIndex: bIndex, insertChild: insertChild, hash: hash });
        }
        this.answerFrame = dom;
        return this;
    };
    Object.defineProperty(AnswerFrame.prototype, "answerFrame", {
        get: function () {
            return this._answerFrame;
        },
        set: function (val) {
            this._answerFrame = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnswerFrame.prototype, "selDom", {
        get: function () {
            return this._selDom;
        },
        set: function (val) {
            this._selDom = val;
        },
        enumerable: true,
        configurable: true
    });
    AnswerFrame.prototype.writeAddRow = function (dom, hash) {
        var row = $("<div class=\"row\" hash=\"" + hash + "\"></div>");
        var i = 0;
        while (true) {
            if (i > Math.round(this.width / 32) - 1)
                break;
            row.append("<div class=\"write-item\"></div>");
            i++;
        }
        dom.append(row);
    };
    AnswerFrame.prototype.renderWrite = function (bIndex, hash) {
        var dom = $("<div boxIndex=" + bIndex + " hash=\"" + hash + "\" class=\"editor-box\" type=\"write\" contenteditable=\"false\"></div>");
        if (Object.keys(this.data).length) {
            dom.attr("targetid", "" + this.data.pros[0].proId);
        }
        var totlaCount = this.number ? this.number / (this.width / 32) + 1 : -1;
        var i = 0;
        while (true) {
            if (i > totlaCount)
                break;
            this.writeAddRow(dom, hash);
            i++;
        }
        return dom;
    };
    AnswerFrame.prototype.renderEditor = function (bIndex, insertChild, hash) {
        var flg = ['判断题', '单选题', '多选题'];
        var option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
        var judge = '✓✗';
        var dom = $("<div boxIndex=" + bIndex + " hash=\"" + hash + "\" contenteditable=\"true\" type=\"editor\" class=\"editor-box\"></div>");
        if (Object.keys(this.data).length) {
            dom.attr("targetid", "" + this.data.pros[0].proId);
            this.data.pros[0].qus.map(function (val) {
                var pnum = $("<div class=\"row\" hash=\"" + hash + "\">" + val.pnum + "\uFF1A(" + val.score + "\u5206)</div>");
                if (flg.indexOf(val.quType) !== -1 && val.visible) {
                    var j = 0;
                    var opt = $("<div class=\"opts\"  style=\"margin-left:15px\"></div>");
                    while (true) {
                        if (j > val.nums - 1)
                            break;
                        opt.append($("<div class=\"opt-item\">[" + (val.quType === '判断题' ? judge[j] : option[j]) + "]</div>"));
                        j++;
                    }
                    pnum.append(opt);
                }
                dom.append(pnum);
                var i = 0;
                while (true && insertChild && flg.indexOf(val.quType) === -1) {
                    if (i > 6)
                        break;
                    dom.append($("<div class=\"row\" hash=\"" + hash + "\"><br /></div>"));
                    i++;
                }
            });
        }
        dom.on('keydown', this.keyDowm);
        dom.on('paste', this.paste.bind(this));
        dom.on('click', function () { GlobalData.currentImage = null; });
        return dom;
    };
    AnswerFrame.prototype.renderSelect = function (_a) {
        var bIndex = _a.bIndex, insertChild = _a.insertChild, hash = _a.hash;
        var option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
        var judge = '✓✗';
        var dom = $("<div boxIndex=" + bIndex + " hash=\"" + hash + "\" type=\"select\" class=\"editor-box\" contenteditable=\"false\"></div>");
        var arg = new SelQues(GlobalData.dataJSON.pageQus[0]).initSelQues();
        insertChild && arg.map(function (arr, index) {
            var length = arr.length;
            var arrItemLen = arr[0].data.length;
            var i = 0;
            while (true) {
                if (i > arrItemLen)
                    break;
                var row = $("<div class=\"row\" hash=\"" + hash + "\"></div>");
                var j = 0;
                while (true) {
                    if (j > length - 1 || !arr[j].data[i])
                        break;
                    var optLen = parseInt(arr[j].data[i].nums);
                    //渲染选项
                    var k = 0;
                    var opt = $("<div class=\"opts\"></div>");
                    while (true) { //选项
                        if (k > optLen - 1 || isNaN(optLen))
                            break;
                        opt.append("<div class=\"opt-item\">[" + (arr[j].data[i].quType === '判断题' ? judge[k] : option[k]) + "]</div>");
                        k++;
                    }
                    var selItem = $("<div class=\"sel-item\" frame=\"" + arr[j].frame + "\" targetID=\"" + arr[j].data[i].quId + arr[j].data[i].pnum + "\" style=\"width:" + 100 / length + "%\"></div>");
                    selItem.append($("<div class=\"pnum\">" + (arr[j].data[i].pnum || '') + "</div>"));
                    selItem.append(opt);
                    row.append(selItem);
                    dom.append(row);
                    j++;
                }
                i++;
            }
        });
        return dom;
    };
    AnswerFrame.prototype.getLastRow = function () {
        return this.answerFrame.find('.row:last-child');
    };
    AnswerFrame.prototype.paste = function (e) {
        var _this = this;
        e.preventDefault();
        var file = e.originalEvent.clipboardData.files[0];
        if (file && file.type == 'image/png') {
            var reader_1 = new FileReader();
            reader_1.onload = function () {
                $(e.currentTarget).append($("<div contenteditable=\"false\" class=\"image-file-box\" draggable =\"false\">\n               <img src=" + reader_1.result + "  class=\"image-file\" draggable =\"false\">\n            </div>"));
                _this.dealImage();
            };
            reader_1.readAsDataURL(file);
        }
        else {
            var html = e.originalEvent.clipboardData.getData('text/plain');
            html = html.replace(/\r|\n|\s/g, '');
            document.execCommand('insertText', false, html);
            return false;
        }
    };
    AnswerFrame.prototype.dealImage = function (dom) {
        var _this = this;
        $('div.image-file-box').on('click', function (imageEvent) {
            imageEvent.stopPropagation();
            $(imageEvent.target).parent().addClass('active');
            !$(imageEvent.target).parent().children('span').get(0) && $(imageEvent.target).parent().append("\n            <span contenteditable=\"false\" draggable =\"false\" class=\"bottom-right drag\"></span>\n         ");
            $("span").on('mousedown', function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.selDom = e.target;
            });
            GlobalData.currentImage = imageEvent.target;
            var obj = {};
            $(imageEvent.target).parent().on('mousedown', function (mouseDownEvent) {
                mouseDownEvent.stopPropagation();
                _this.selDom = mouseDownEvent.target;
                obj.x0 = mouseDownEvent.offsetX;
                obj.y0 = mouseDownEvent.offsetY;
            });
            $(imageEvent.target).parent().parent().on('mousemove', function (mouseMoveEvent) {
                if (!_this.selDom)
                    return;
                if (mouseMoveEvent.target === _this.selDom) {
                    var e = mouseMoveEvent;
                    e.stopPropagation();
                    $(e.target).parent()
                        .css('top', e.pageY - $(e.target).parent().parent().offset().top - obj.y0)
                        .css('left', e.pageX - $(e.target).parent().parent().offset().left - obj.x0);
                }
                else if ($(_this.selDom).hasClass('drag')) {
                    var imageSize = {
                        height: parseInt($(_this.selDom).parent().children('.image-file').css('height')),
                        width: parseInt($(_this.selDom).parent().children('.image-file').css('width')),
                    };
                    $(_this.selDom).parent().children('.image-file')
                        .css('height', imageSize.height + mouseMoveEvent.pageY - $(_this.selDom).offset().top);
                }
            });
            $(imageEvent.target).on('mouseup', function (e) {
                e.stopPropagation();
                $(imageEvent.target).parent().off('mousedown');
                $(imageEvent.target).parent().parent().off('mousemove');
                _this.selDom = null;
                obj = {};
            });
        });
    };
    AnswerFrame.prototype.keyDowm = function (event) {
        if (event.keyCode === 8) {
            //剩下最后一行时禁用删除
            if (GlobalData.currentImage) {
                event.preventDefault();
                $(GlobalData.currentImage).parent().remove();
            }
            $(event.target).children().length === 1 && event.preventDefault();
        }
    };
    return AnswerFrame;
}());
export default AnswerFrame;
