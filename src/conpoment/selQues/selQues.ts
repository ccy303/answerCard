import './selQues.scss'
import GlobalData from '../global';
export default class SelQues {
   data: any = null
   selQuesBox: JQuery<HTMLElement> = null;
   option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
   constructor(data: any) {
      this.data = { ...data };
      this.selQuesBox = $(`
         <div class="select-box" selIndex="1"></div>  
      `)
   }

   initSelQues() {
      if (!this.checkoutdata()) return;
      let obj = this.splitQues()
      let newData = this.splitQuesTocolum(obj)
      // this.observeSelBox();
      this.renderColum(newData)
      // return this.selQuesBox
   }

   observeSelBox() {
      let config = { attributes: true, childList: true, subtree: true };
      let observer = new MutationObserver((e: any) => {
         e.map((mutation: MutationRecord) => {
            console.log($(mutation.target).parent().height());
            // console.log(this.selQuesBox.css('height'))
         })
      })
      observer.observe(this.selQuesBox.get(0), config)
   }

   renderColum(arg: any) {
      arg.map((val: any, index: number) => {
         let dom: JQuery<HTMLElement> = $(`<div class="sel-group-box" bIndex="${index + 1}"></div>`)
         val.map((item: any, box: number) => {
            let selGroup: JQuery<HTMLElement> = $(`<div style="width:${100 / val.length}%" class="sel-group" bIndex="${index + 1}-${box + 1}"></div>`)
            item && item.map((value: any, row: number) => {
               let opt: JQuery<HTMLElement> = $(`<div class="opts"></div>`);
               let i = 0;
               while (true) {
                  if (i >= parseInt(value.nums)) break;
                  opt.append($(`<div class="opt-item">[${this.option[i]}]</div>`))
                  i++
               }
               let selGroupRow: JQuery<HTMLElement> = $(`<div class="sel-group-row" rowIndex="${index + 1}-${box + 1}-${row + 1}">
                  <div class="pnum">${value.pnum}</div>
               </div>`)
               selGroupRow.append(opt)
               selGroup.append(selGroupRow)
            })
            selGroup.children().get(0) && dom.append(selGroup)
         })
         this.selQuesBox.append(dom)
      })
   }

   checkoutdata(): boolean {//检查data是否为客观题
      return !Boolean(this.data.pros.find((val: any) => {
         return val.pureObjective !== '1'
      }))
   }

   //返回客观题选项最大长度，整合后的全部客观题
   splitQues(): { totalQues: Array<any>, max: number } {
      let obj: { totalQues: Array<any>, max: number } = {
         totalQues: [],
         max: 0
      }
      let ques: Array<any> = []
      this.data.pros.map((val: any) => {
         val.qus.map((qus: any) => {
            obj.max = qus.nums > obj.max ? qus.nums : obj.max;
            ques.push(qus)
         })
      })
      for (let i = 0; i < ques.length; null) {//客观题分为每五个一组
         obj.totalQues.push(ques.splice(i * 5, 5))
      }
      return obj
   }

   findMaxOptLength(data: any) {
      let length = 0
      data && data.map((val: any) => {
         length = parseInt(val.nums) > length ? parseInt(val.nums) : length;
      })
      return length
   }

   splitQuesTocolum(data: any) {
      let newArr: Array<any> = [];
      if (GlobalData.pageType === 'A4' || GlobalData.pageType === 'A3' && GlobalData.pageColum === 2) {
         if (data.max <= 4) {
            for (let i = 0; i < data.totalQues.length; null) {
               newArr.push(data.totalQues.splice(i * 2, 2))
            }
         } else {
            for (let i = 0; i < data.totalQues.length; i = i + 2) {
               let arr: Array<any> = [];
               if (this.findMaxOptLength(data.totalQues[i]) <= 9 && this.findMaxOptLength(data.totalQues[i + 1]) <= 9) {
                  arr.push(data.totalQues[i], data.totalQues[i + 1]);
                  newArr.push(arr)
               } else {
                  newArr.push([data.totalQues[i]], [data.totalQues[i + 1]]);
               }
            }
         }
      } else {

      }
      return [...newArr]
   }
}