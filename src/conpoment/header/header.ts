import './header.scss';
import GlobalData from '../global';
export default class Header {
   private data: any
   public _header: JQuery<HTMLElement> = null;
   constructor(data?: any, html?: string) {
      this.data = {
         studentNumLength: GlobalData.dataJSON.noCount,
         examCountType: Number(GlobalData.dataJSON.noMode), //2填图，1条形码
         type: data.type,
         colum: data.colum,
         html: html
      }
   }
   set header(val: JQuery<HTMLElement>) {
      if (!this._header) {
         this._header = val;
      } else {
         $(this._header).html(val.html()) //修改学号位数时,重新渲染头部
      }
   }
   get header() {
      return this._header;
   }
   public initHeader(count?: number): JQuery<HTMLElement> {
      count && (this.data.studentNumLength = count)
      if (!this.data.html || count) {
         let { examCountType, type, colum } = this.data
         let studentNumLength = count ? count : this.data.studentNumLength;
         let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
         let box = $(`<div class="header-box" hash="${hash}"></div>`)
         let div = $(`<div class="header-contnet"></div>`)
         div.css('position', 'relative');
         if (examCountType === 1) {
            let stuInfo = this.renderStudentInfo();
            let row_1 = $('<div></div>');
            stuInfo.css('width', '35%').css('float', 'left')
            row_1.append(stuInfo)
            let code = this.renderBarCode()
            code.css('display', 'inline-block')
            row_1.append(code)
            let qrCode = this.renderQrCode({});
            qrCode.css('float', 'right')
            row_1.append(qrCode)
            box.append(row_1)
            let tip = this.renderTip();
            box.append(tip)
         } else if (examCountType === 2) {
            if (this.data.studentNumLength >= 13 && !(this.data.type == 'A3' && this.data.colum == '3')) {
               let stuInfo = this.renderStudentInfo();
               let row_1 = $('<div style="text-align:left"></div>');
               row_1.append(stuInfo)
               stuInfo.css('display', 'inline-block').css('width', '30%')
               box.append(row_1)
               let qrCode = this.renderQrCode({}, 'row');
               qrCode.css('display', 'inline-block').css('text-align', 'center')
               row_1.append(qrCode)
               let tip = this.renderTip();
               row_1.append(tip)
               let row_2 = $('<div></div>')
               let num = this.renderStudentNum();
               row_2.append(num)
               box.append(row_2)
            } else if (!(this.data.type == 'A3' && this.data.colum == '3')) {
               let stuInfo = this.renderStudentInfo();
               let row_1 = $('<div style="text-align:left"></div>');
               row_1.append(stuInfo)
               box.append(row_1)
               let row_2 = $('<div style="text-align:left"></div>')
               let left_box = $('<div style="text-align:left;display:inline-block"></div>');
               let tip = this.renderTip();
               tip.css('display', 'block').css('width', '285px').css('float', 'inherit');
               left_box.append(tip)
               let qrCode = this.renderQrCode({}, 'row');
               qrCode.css('display', 'inline-block').css('text-align', 'center').css('position', 'inherit').css('margin-top', '20px')
               left_box.append(qrCode)
               row_2.append(left_box)
               let right_box = $('<div style="float:right"></div>');
               let num = this.renderStudentNum();
               right_box.css('width', '380px').css('text-align', 'center')
               right_box.append(num)
               row_2.append(right_box)
               box.append(row_2)
            } else {//A3-3
               let stuInfo = this.renderStudentInfo();
               let row_1 = $('<div style="text-align:left"></div>');
               row_1.append(stuInfo)
               box.append(row_1)
               let row_2 = $('<div style="text-align:left"></div>')
               let tip = this.renderTip();
               tip.css('display', 'inline-block').css('width', '285px').css('float', 'inherit');
               row_2.append(tip)
               let qrCode = this.renderQrCode({}, 'row');
               qrCode.css('display', 'inline-block').css('text-align', 'center').css('position', 'inherit').css('margin-top', '45px').css('float', 'right')
               row_2.append(qrCode)
               box.append(row_2)
               let num = this.renderStudentNum();
               box.append(num)
            }
         }
         this.header = box;
      } else {
         this.header = this.data.html
      }
      return this.header
   }
   private renderStudentNum(count?: number): JQuery<HTMLElement> {
      let studentNumLength = count ? count : this.data.studentNumLength
      let box: JQuery<HTMLElement> = $('<div class="student-num" style="padding:0;height:200px"></div>');
      let header = $(`<p class="title" style="font-size:12px;margin-right:5px">考号填涂区</p>`)
      box.append(header)
      let num = $(`<div class="num" style="margin:0"></div>`);
      let i = 0;
      while (true) {
         if (i > studentNumLength - 1) break
         let dom = $(`
            <div class="num-colum"></div>
         `)
         let j = 0
         while (true) {
            if (j > 9) break;
            dom.append($(`<div class="frame">[${j}]</div>`))
            j++;
         }
         num.append(dom)
         i++;
      }
      box.append(num)
      box.css('margin-top', '10px')
      return box;
   }
   private renderQrCode(position: any, type = 'colum') {
      // position: absolute;
      // top: ${ position.top };
      // right: ${ position.right };
      // bottom: ${ position.bottom };
      let qrcode = null;
      if (type === 'colum') {
         qrcode = $(`<div style="
            margin:0;
            font-size: 12px;
            line-height: inherit;
         ">
            <img width="65px" height="65px" crossorigin="true" src="https://master-ennjoy.oss-cn-shenzhen.aliyuncs.com/static/download/scan/wx_smart_prog.jpg" />
            <p style="margin:0">成绩查询</p>
            <p style="margin:5px 0 0">微信小程序二维码</p>
         </div>`)
      } else {
         qrcode = $(`<div style="
            margin:0;
            font-size: 12px;
            line-height: inherit;
            position:relative;
            top:-20px;
         ">
            <img style="margin-right:10px;" width="65px" height="65px" crossorigin="true" src="https://master-ennjoy.oss-cn-shenzhen.aliyuncs.com/static/download/scan/wx_smart_prog.jpg" />
            <div style="display:inline-block;position:relative;top:-20px">
               <p style="margin:0;text-align:left">成绩查询</p>
               <p style="margin:2px 0 0;text-align:left">微信小程序二维码</p>
            </div>
         </div>`)
      }
      return qrcode
   }
   private renderStudentInfo(): any {
      let box = $(`
         <div
            class="student-info"
            contenteditable=true
         ></div>
      `);
      let info = ['姓名', '班级', '考号'];
      if (this.data.examCountType === 1) {
         let dom: Array<JQuery<HTMLElement>> = []
         info.forEach(val => {
            let item = $(`<div>${val}:<font style="letter-spacing: -1px;">_____________________</font></div>`)
            item.css('text-align', 'left').css('height', '28px').css('line-height', '28px')
            dom.push(item)
         })
         box.append(dom)
         return box
      } else {
         //学号大于13位且不是A3-3栏
         if (this.data.studentNumLength >= 13 && !(this.data.type == 'A3' && this.data.colum == '3')) {
            let dom: Array<JQuery<HTMLElement>> = []
            info.forEach(val => {
               let item = $(`<div>${val}:<font style="letter-spacing: -1px;">__________________</font></div>`)
               item.css('text-align', 'left').css('height', '28px').css('line-height', '28px')
               dom.push(item)
            })
            box.append(dom)
            return box
         } else {
            let dom: Array<JQuery<HTMLElement>> = []
            info.forEach(val => {
               let item = $(`<div style="display:inline-block;margin-right:5px;">
                  ${val}:<font style="letter-spacing: -1px;">__________________</font>
               </div>`)
               item.css('text-align', 'left').css('height', '28px').css('line-height', '28px')
               dom.push(item)
            })
            box.append(dom)
            return box
         }
      }
   }
   private renderTip(): JQuery<HTMLElement> {
      let { type, colum, examCountType } = this.data
      let style = ''
      let print = $(`<div class="good-print">
            <span style="display:inline-block;width:84px;text-align:center;vertical-align:initial;">正确填涂示例</span><div class="opt-item" style="color:#000">
               <div style="display:inline-block;width:16px;height:11px;background:#000;vertical-align:text-top"></div>
            </div><div class="opt-item" style="color:#000;">
               [<font style="color:#000;vertical-align:unset">B</font>]
            </div><div class="opt-item" style="color:#000;">
               [<font style="color:#000;vertical-align:unset">C</font>]
            </div><div class="opt-item" style="color:#000;">
               [<font style="color:#000;vertical-align:unset">D</font>]
            </div>
         </div>`)
      let tip = $(`<div 
         class="tip-box"
         style="position:relative"
      >  
         <div id="text" style="position:relative;padding:10px">
            <h5 style="margin:0;">注意事项</h5>
            <p>1、选择题作答必须用2B铅笔填涂</p>
            <p>2、必须在指定区域答题，且不得超出黑色答题框。</p>
         </div>
      </div>`)
      if (examCountType === 1) {
         tip.children('#text').before(print)
         let width = colum == 3 && type == 'A3' ? '45%' : '60%'
         tip.children('#text').css('float', 'right').css('border-left', '2px dashed #999').css('width', width)
         let top = colum == 3 && type == 'A3' ? '35%' : '30%'
         print.css('position', 'absolute').css('top', top).css('left', '4%')
      } else {
         tip.children('#text').after(print)
         print.css('margin', '0 0 10px 10px')
         tip.css('display', 'inline-block').css('width', 'auto').css('float', 'right')
      }
      return tip
   }
   private renderBarCode(): JQuery<HTMLElement> {
      return $(`
         <div class="bar-code">
            <p style="line-height: normal;margin-top: 35px;margin-bottom:0">条形码粘贴处</p>
            <p style="line-height: normal;font-size: 12px; margin-top:5px">（正面朝上，切勿贴出框外）</p>
         </div>
      `)
   }
   public reRenderHeader(count: number) {
      GlobalData.dataJSON.noCount = count;
      this.initHeader(count)
   }
}