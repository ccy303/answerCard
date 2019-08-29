import './header.scss';
import GlobalData from '../global';
export default class Header {
   private data: any
   public header: JQuery<HTMLElement>;
   constructor(data?: any) {
      this.data = {
         studentNumLength: GlobalData.dataJSON.noCount,
         examCountType: Number(GlobalData.dataJSON.noMode), //2填图，1条形码
         type: data.type,
         colum: data.colum
      }
   }

   public initHeader(): JQuery<HTMLElement> {
      let { examCountType, studentNumLength, alias, type, colum } = this.data
      let box = $('<div class="header-box"></div>')
      let div = $(`
         <div
            class="header-contnet" 
         >
         </div>
      `)
      if (examCountType === 1) {
         box.append(this.renderTip())
         div.append(this.renderBarCode())
         div.append(this.renderStudentInfo());
         box.append(div);
      } else if (examCountType === 2) {
         let style = {
            width: studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '50%' : '100%',
            float: studentNumLength <= 9 ? 'left' : 'unset'
         }
         div.attr('style', `width:${style.width};float:${style.float}`)
         div.append(this.renderStudentInfo())
         div.append(this.renderTip())
         box.append(div)
         box.append(this.renderStudentNum())
      }
      this.header = box;
      return this.header
   }
   private renderStudentNum(): JQuery<HTMLElement> {
      let { studentNumLength, type, colum } = this.data
      let style = {
         width: studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '50%' : '100%'
      }
      let box: JQuery<HTMLElement> = $('<div class="student-num"></div>');
      box.attr('style', `width:${style.width}`)
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
      let { examCountType, studentNumLength, type, colum } = this.data
      let style = {
         borderTop: examCountType === 2 ? 'none' : '1px solid #000',
         borderBot: examCountType === 2 ? '1px solid #000' : 'none',
         width: examCountType === 1 ? '50%' : studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '100%' : '50%',
         height: ''
      }
      if (type === 'A3' && colum == 3) {
         style.height = '191px';
      }
      let box = $(`
         <div
            class="student-info"
            style="border-top:${style.borderTop};border-bottom:${style.borderBot};width:${style.width};height:${style.height}"
         ></div>
      `);
      let info = ['学校', '姓名', '班级'];
      let dom: Array<JQuery<HTMLElement>> = []
      info.map(val => {
         dom.push($(`<div><span class="name">${val}:</span>_______________________</div>`))
      })
      box.append(dom)
      return box
   }
   private renderTip(): JQuery<HTMLElement> {
      let { examCountType, studentNumLength, type, colum } = this.data
      let style = {
         height: '',
         width: examCountType === 1 ? '100%' : studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '100%' : '50%',
         borderBot: examCountType === 2 ? studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '' : '1px solid #000' : 'none',
         borderRight: examCountType === 2 && studentNumLength <= 9 && (type === 'A4' || type === 'A3' && colum != 3) ? '1px solid #000' : '',
      }
      if (type === 'A4' || (type === 'A3' && colum != 3)) {
         style.height = examCountType === 2 ? "136px" : 'auto';
      } else if (type === 'A3' && colum == 3) {
         style.height = 'auto'
      }
      return $(`<div 
         class="tip-box"
         style="width:${style.width};height:${style.height};border-bottom:${style.borderBot};border-right:${style.borderRight}"
      >
         <p>1、学号、姓名、班级三项信息必须用黑色签字笔填清楚。</p>
         <p>2、选择题作答必须用2B铅笔填涂，非选择题作答必须用黑色中性笔或黑色墨迹钢笔填写。</p>
         <p>3、必须在指定区域答题，且不得超出黑色答题框。</p>
         <p>4、请保持答题卡卡面清洁，不要折叠或弄破答题卡。</p>
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
}