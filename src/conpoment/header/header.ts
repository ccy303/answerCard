import './header.scss';
import GlobalData from '../global';
export default class Header {
   private data: any
   public _header: JQuery<HTMLElement> = null;
   constructor(data?: any) {
      this.data = {
         studentNumLength: GlobalData.dataJSON.noCount,
         examCountType: Number(GlobalData.dataJSON.noMode), //2填图，1条形码
         type: data.type,
         colum: data.colum
      }
   }
   set header(val: JQuery<HTMLElement>) {
      if (!this._header) {
         this._header = val;
      } else {
         $(this._header).html(val.html())
      }
   }
   get header() {
      return this._header;
   }
   public initHeader(count?: number): JQuery<HTMLElement> {
      let { examCountType, type, colum } = this.data
      let studentNumLength = count ? count : this.data.studentNumLength;
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      let box = $(`<div class="header-box" hash="${hash}"></div>`)
      let div = $(`<div class="header-contnet"></div>`)
      if (examCountType === 1) {
         div.append(this.renderStudentInfo());
         div.append(this.renderTip())
         box.append(div);
         box.append(this.renderBarCode())
      } else if (examCountType === 2) {
         let style = {
            width: studentNumLength <= 12 && (type === 'A4' || type === 'A3' && colum != 3) ? '45%' : '100%',
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
      return this.header
   }
   private renderStudentNum(count?: number): JQuery<HTMLElement> {
      let studentNumLength = count ? count : this.data.studentNumLength
      let box: JQuery<HTMLElement> = $('<div class="student-num"></div>');
      let header = $(`<p class="title">学号</p>`)
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
         ></div>
      `);
      let info = ['姓名', '班级', '考场号/座位号',];
      let dom: Array<JQuery<HTMLElement>> = []
      info.map(val => {
         dom.push($(`<div><span class="name"><b>${val}:</span>_______________</b></div>`))
      })
      box.append(dom)
      return box
   }
   private renderTip(): JQuery<HTMLElement> {
      let { type, colum } = this.data
      let disNone = type == 'A3' && colum == 3 ? "display:none" : "display:block"
      return $(`<div 
         class="tip-box"
      >  
         <h5 style="margin:0;">注意事项</h5>
         <p>1、选择题作答必须用2B铅笔填涂</p>
         <p>2、必须在指定区域答题，且不得超出黑色答题框。</p>
         <p style=${disNone}>3、学号、姓名、班级三项信息必须用黑色签字笔填清楚。</p>
         <p style=${disNone}>4、请保持答题卡卡面清洁，不要折叠或弄破答题卡。</p>
      </div>`)
   }
   private renderBarCode(): JQuery<HTMLElement> {
      return $(`
         <div class="bar-code">
            <p style="margin-top:40px">条形码粘贴处</p>
            <p style="font-size: 12px">（正面朝上，切勿贴出框外）</p>
         </div>
      `)
   }
   public reRenderHeader(count: number) {
      GlobalData.dataJSON.noCount = count;
      this.initHeader(count)
   }
}