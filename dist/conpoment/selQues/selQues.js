var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import './selQues.scss';
import GlobalData from '../global';
var SelQues = /** @class */ (function () {
    function SelQues(data) {
        this.data = null;
        this.selQuesBox = null;
        this.option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
        this.judge = '✓✗';
        this.data = __assign({}, data);
        this.selQuesBox = $("\n         <div class=\"select-box\" selIndex=\"1\"></div>  \n      ");
    }
    SelQues.prototype.initSelQues = function () {
        if (!this.checkoutdata())
            return;
        var obj = this.splitQues();
        var newData = this.splitQuesTocolum(obj);
        return newData;
    };
    SelQues.prototype.renderColum = function (arg) {
        var _this = this;
        arg.map(function (val, index) {
            var dom = $("<div class=\"sel-group-box\" bIndex=\"" + (index + 1) + "\"></div>");
            val.map(function (item, box) {
                var selGroup = $("<div style=\"width:" + 100 / val.length + "%\" class=\"sel-group\" bIndex=\"" + (index + 1) + "-" + (box + 1) + "\"></div>");
                item && item.map(function (value, row) {
                    var opt = $("<div class=\"opts\"></div>");
                    var i = 0;
                    while (true) {
                        if (i >= parseInt(value.nums))
                            break;
                        opt.append($("<div class=\"opt-item\">[" + (value.quType !== '判断题' ? _this.option[i] : _this.judge[i]) + "]</div>"));
                        i++;
                    }
                    var selGroupRow = $("<div class=\"sel-group-row\" rowIndex=\"" + (index + 1) + "-" + (box + 1) + "-" + (row + 1) + "\">\n                  <div class=\"pnum\">" + value.pnum + "</div>\n               </div>");
                    selGroupRow.append(opt);
                    selGroup.append(selGroupRow);
                });
                selGroup.children().get(0) && dom.append(selGroup);
            });
            _this.selQuesBox.append(dom);
        });
    };
    SelQues.prototype.checkoutdata = function () {
        return !Boolean(this.data.pros.find(function (val) {
            return val.pureObjective !== '1';
        }));
    };
    //返回客观题选项最大长度，整合后的全部客观题
    SelQues.prototype.splitQues = function () {
        var obj = {
            totalQues: [],
            max: 0
        };
        var ques = [];
        this.data.pros.map(function (val) {
            val.qus.map(function (qus) {
                obj.max = Number(qus.nums) > obj.max ? Number(qus.nums) : obj.max;
                qus.visible && ques.push(qus);
            });
        });
        for (var i = 0; i < ques.length; null) { //客观题分为每五个一组
            var _obj = {
                data: [],
                frame: 0,
            };
            _obj.data = ques.splice(i * 5, 5);
            _obj.frame = obj.totalQues.length + 1;
            obj.totalQues.push(_obj);
            // obj.totalQues.push(ques.splice(i * 5, 5))
        }
        obj.totalQues.map(function (val) {
            var length = val.data.length;
            while (length < 5) {
                val.data.push({});
                length++;
            }
        });
        return obj;
    };
    SelQues.prototype.findMaxOptLength = function (data) {
        var length = 0;
        data && data.map(function (val) {
            length = parseInt(val.nums) > length ? parseInt(val.nums) : length;
        });
        return length;
    };
    SelQues.prototype.splitQuesTocolum = function (data) {
        var newArr = [];
        if (GlobalData.pageType === 'A4' || GlobalData.pageType === 'A3' && GlobalData.pageColum === 2) {
            if (data.max <= 4) { //3栏选择题
                for (var i = 0; i < data.totalQues.length; null) {
                    newArr.push(data.totalQues.splice(i * 3, 3));
                }
            }
            else if (data.max <= 9) { //2栏选择题
                for (var i = 0; i < data.totalQues.length; null) {
                    newArr.push(data.totalQues.splice(i * 2, 2));
                }
            }
            else if (data.max > 9) { //一栏2栏混排选择题
                for (var i = 0; i < data.totalQues.length; i = i + 2) {
                    var arr = [];
                    if (this.findMaxOptLength(data.totalQues[i].data) <= 9 && this.findMaxOptLength(data.totalQues[i + 1].data) <= 9) {
                        arr.push(data.totalQues[i], data.totalQues[i + 1]);
                        newArr.push(arr);
                    }
                    else {
                        newArr.push([data.totalQues[i]], [data.totalQues[i + 1]]);
                    }
                }
            }
        }
        else { //A3 3栏
            if (data.max <= 5) {
                for (var i = 0; i < data.totalQues.length; null) {
                    newArr.push(data.totalQues.splice(i * 2, 2));
                }
            }
            else if (data.max > 5) {
                for (var i = 0; i < data.totalQues.length; i = i + 2) {
                    var arr = [];
                    if (this.findMaxOptLength(data.totalQues[i].data) <= 5 && this.findMaxOptLength(data.totalQues[i + 1].data) <= 5) {
                        arr.push(data.totalQues[i], data.totalQues[i + 1]);
                        newArr.push(arr);
                    }
                    else {
                        newArr.push([data.totalQues[i]], [data.totalQues[i + 1]]);
                    }
                }
            }
        }
        return newArr.slice();
    };
    return SelQues;
}());
export default SelQues;
