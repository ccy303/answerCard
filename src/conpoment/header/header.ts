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
         if (examCountType === 1) {
            div.append(this.renderStudentInfo());
            div.append(this.renderTip())
            box.append(div);
            let con = $(`<div style="float:right;width:50%;padding-top:25px;"></div>`)
            let code = this.renderBarCode();
            con.append(code)
            box.append(con)
         } else if (examCountType === 2) {
            let style = {
               width: studentNumLength <= 12 && (type === 'A4' || type === 'A3' && colum != 3) ? '47%' : '100%',
               float: studentNumLength <= 12 ? 'left' : 'unset',
               marginTop: type === 'A4' || (type === 'A3' && colum != 3) ? '0px' : '0',
            }
            div.css('margin-top', style.marginTop).css('width', style.width)
            div.append(this.renderStudentInfo())
            div.append(this.renderTip())
            box.append(div)
            box.append(this.renderStudentNum(count))
         }
         this.header = box;
      } else {
         this.header = this.data.html
      }
      return this.header
   }
   private renderStudentNum(count?: number): JQuery<HTMLElement> {
      let studentNumLength = count ? count : this.data.studentNumLength
      let box: JQuery<HTMLElement> = $('<div class="student-num"></div>');
      let header = $(`<p class="title">考号填涂区</p>`)
      box.append(header)
      let num = $(`<div class="num"></div>`);
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
      return box;
   }
   private renderStudentInfo(): JQuery<HTMLElement> {
      let box = $(`
         <div
            class="student-info"
            contenteditable=true
         ></div>
      `);
      let info = ['姓名', '班级', '考号',];
      if (this.data.type != 'A3' || this.data.colum != '3') {
         if (this.data.studentNumLength < 13 || this.data.examCountType === 1) {
            let dom: Array<JQuery<HTMLElement>> = []
            info.map(val => {
               dom.push($(`<div>${val}:<font style="letter-spacing: -1px;">_____________________</font></div>`))
            })
            box.append(dom)
            box.css('max-height', '90px')
            return box
         }
         if (this.data.studentNumLength >= 13) {
            let dom: JQuery<HTMLElement> = $('<div></div>');
            info.map(val => {
               dom.get(0).innerHTML += `${val}:<font style="letter-spacing: -1px;">_____________________</font>`;
            })
            box.append(dom)
            box.css('max-height', '60px')
            return box
         }
      } else if (this.data.type == 'A3' && this.data.colum == '3') {
         if (this.data.examCountType === 2) { //填涂
            let dom: JQuery<HTMLElement> = $('<div></div>');
            info.map(val => {
               dom.get(0).innerHTML += `${val}:<font style="letter-spacing: -1px;">_____________________</font>`;
            })
            box.append(dom)
            box.css('max-height', '60px')
            return box
         } else { //条码
            let dom: Array<JQuery<HTMLElement>> = []
            info.map(val => {
               dom.push($(`<div>${val}:<font style="letter-spacing: -1px;">_____________________</font></div>`))
            })
            box.append(dom)
            box.css('max-height', '90px')
            return box
         }
      }
   }
   private renderTip(): JQuery<HTMLElement> {
      let { type, colum } = this.data
      return $(`<div 
         class="tip-box"
      >  
         <h5 style="margin:0;">注意事项</h5>
         <p>1、选择题作答必须用2B铅笔填涂</p>
         <p>2、必须在指定区域答题，且不得超出黑色答题框。</p>
         <div class="good-print">
            <span style="margin-right:5%">正确填涂示例</span>
            <div class="opt-item">
               <i class="iconfont icon-A" style="background:#000"></i>
            </div>
            <div class="opt-item">
               <i class="iconfont icon-B"></i>
            </div>
            <div class="opt-item">
               <i class="iconfont icon-C"></i>
            </div>
            <div class="opt-item">
               <i class="iconfont icon-D"></i>
            </div>
         </div>
      </div>`)
   }
   private renderBarCode(): JQuery<HTMLElement> {
      return $(`
         <div class="bar-code">
            <p style="line-height: normal;margin-top: 30px;">条形码粘贴处</p>
            <p style="line-height: normal;font-size: 12px">（正面朝上，切勿贴出框外）</p>
         </div>
      `)
   }
   public reRenderHeader(count: number) {
      GlobalData.dataJSON.noCount = count;
      this.initHeader(count)
   }
}