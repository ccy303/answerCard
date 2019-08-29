import './header.scss';
import GlobalData from '../global';
var Header = /** @class */ (function () {
    function Header(data) {
        this.data = {
            studentNumLength: GlobalData.dataJSON.noCount,
            examCountType: Number(GlobalData.dataJSON.noMode),
            type: data.type,
            colum: data.colum
        };
    }
    Header.prototype.initHeader = function () {
        var _a = this.data, examCountType = _a.examCountType, studentNumLength = _a.studentNumLength, alias = _a.alias, type = _a.type, colum = _a.colum;
        var box = $('<div class="header-box"></div>');
        var div = $("\n         <div\n            class=\"header-contnet\" \n         >\n         </div>\n      ");
        if (examCountType === 1) {
            box.append(this.renderTip());
            div.append(this.renderBarCode());
            div.append(this.renderStudentInfo());
            box.append(div);
        }
        else if (examCountType === 2) {
            var style = {
                width: studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '50%' : '100%',
                float: studentNumLength <= 9 ? 'left' : 'unset'
            };
            div.attr('style', "width:" + style.width + ";float:" + style.float);
            div.append(this.renderStudentInfo());
            div.append(this.renderTip());
            box.append(div);
            box.append(this.renderStudentNum());
        }
        this.header = box;
        return this.header;
    };
    Header.prototype.renderStudentNum = function () {
        var _a = this.data, studentNumLength = _a.studentNumLength, type = _a.type, colum = _a.colum;
        var style = {
            width: studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '50%' : '100%'
        };
        var box = $('<div class="student-num"></div>');
        box.attr('style', "width:" + style.width);
        var header = $("<p class=\"title\">\u5B66\u53F7</p>");
        box.append(header);
        var num = $("<div class=\"num\"></div>");
        var i = 0;
        while (true) {
            if (i > studentNumLength - 1)
                break;
            var dom = $("\n            <div class=\"num-colum\"></div>\n         ");
            var j = 0;
            while (true) {
                if (j > 9)
                    break;
                dom.append($("<div class=\"frame\">[" + j + "]</div>"));
                j++;
            }
            num.append(dom);
            i++;
        }
        box.append(num);
        return box;
    };
    Header.prototype.renderStudentInfo = function () {
        var _a = this.data, examCountType = _a.examCountType, studentNumLength = _a.studentNumLength, type = _a.type, colum = _a.colum;
        var style = {
            borderTop: examCountType === 2 ? 'none' : '1px solid #000',
            borderBot: examCountType === 2 ? '1px solid #000' : 'none',
            width: examCountType === 1 ? '50%' : studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '100%' : '50%',
            height: ''
        };
        if (type === 'A3' && colum == 3) {
            style.height = '191px';
        }
        var box = $("\n         <div\n            class=\"student-info\"\n            style=\"border-top:" + style.borderTop + ";border-bottom:" + style.borderBot + ";width:" + style.width + ";height:" + style.height + "\"\n         ></div>\n      ");
        var info = ['学校', '姓名', '班级'];
        var dom = [];
        info.map(function (val) {
            dom.push($("<div><span class=\"name\">" + val + ":</span>_______________________</div>"));
        });
        box.append(dom);
        return box;
    };
    Header.prototype.renderTip = function () {
        var _a = this.data, examCountType = _a.examCountType, studentNumLength = _a.studentNumLength, type = _a.type, colum = _a.colum;
        var style = {
            height: '',
            width: examCountType === 1 ? '100%' : studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '100%' : '50%',
            borderBot: examCountType === 2 ? studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '' : '1px solid #000' : 'none',
            borderRight: examCountType === 2 && studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '1px solid #000' : '',
        };
        if (type === 'A4' || (type === 'A3' && colum != 3)) {
            style.height = examCountType === 2 ? "136px" : 'auto';
        }
        else if (type === 'A3' && colum == 3) {
            style.height = 'auto';
        }
        return $("<div \n         class=\"tip-box\"\n         style=\"width:" + style.width + ";height:" + style.height + ";border-bottom:" + style.borderBot + ";border-right:" + style.borderRight + "\"\n      >\n         <p>1\u3001\u5B66\u53F7\u3001\u59D3\u540D\u3001\u73ED\u7EA7\u4E09\u9879\u4FE1\u606F\u5FC5\u987B\u7528\u9ED1\u8272\u7B7E\u5B57\u7B14\u586B\u6E05\u695A\u3002</p>\n         <p>2\u3001\u9009\u62E9\u9898\u4F5C\u7B54\u5FC5\u987B\u75282B\u94C5\u7B14\u586B\u6D82\uFF0C\u975E\u9009\u62E9\u9898\u4F5C\u7B54\u5FC5\u987B\u7528\u9ED1\u8272\u4E2D\u6027\u7B14\u6216\u9ED1\u8272\u58A8\u8FF9\u94A2\u7B14\u586B\u5199\u3002</p>\n         <p>3\u3001\u5FC5\u987B\u5728\u6307\u5B9A\u533A\u57DF\u7B54\u9898\uFF0C\u4E14\u4E0D\u5F97\u8D85\u51FA\u9ED1\u8272\u7B54\u9898\u6846\u3002</p>\n         <p>4\u3001\u8BF7\u4FDD\u6301\u7B54\u9898\u5361\u5361\u9762\u6E05\u6D01\uFF0C\u4E0D\u8981\u6298\u53E0\u6216\u5F04\u7834\u7B54\u9898\u5361\u3002</p>\n      </div>");
    };
    Header.prototype.renderBarCode = function () {
        return $("\n         <div class=\"bar-code\">\n            <p style=\"margin-top:40px\">\u6761\u5F62\u7801\u7C98\u8D34\u5904</p>\n            <p style=\"font-size: 12px\">\uFF08\u6B63\u9762\u671D\u4E0A\uFF0C\u5207\u52FF\u8D34\u51FA\u6846\u5916\uFF09</p>\n         </div>\n      ");
    };
    return Header;
}());
export default Header;
