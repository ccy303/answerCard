import './selQues.scss'
import GlobalData from '../global';
export default class SelQues {
   data: any = null
   selQuesBox: JQuery<HTMLElement> = null;
   option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
   judge = '✓✗';
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
      return newData;
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
                  opt.append($(`<div class="opt-item">[${value.quType !== '判断题' ? this.option[i] : this.judge[i]}]</div>`))
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

   checkoutdata(): boolean {//检查data是否仅为客观题
      return !Boolean(this.data.pros.find((val: any) => {
         return val.pureObjective !== '1'
      }))
   }

   //返回客观题选项最大长度，整合后的全部客观题
   splitQues(): { totalQues: any, max: number } {
      let obj: { totalQues: any, max: number } = {
         totalQues: [],
         max: 0
      }
      let ques: Array<any> = []
      this.data.pros.map((val: any) => {
         val.qus.map((qus: any) => {
            obj.max = Number(qus.nums) > obj.max ? Number(qus.nums) : obj.max;
            qus.visible && ques.push(qus)
         })
      })
      for (let i = 0; i < ques.length; null) {//客观题分为每五个一组
         let _obj: any = {
            data: [],
            frame: 0,
         };
         _obj.data = ques.splice(i * 5, 5);
         _obj.frame = obj.totalQues.length + 1
         obj.totalQues.push(_obj)
         // obj.totalQues.push(ques.splice(i * 5, 5))
      }
      obj.totalQues.map((val: any) => {
         let length = val.data.length
         while (length < 5) {
            val.data.push({})
            length++
         }
      })
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
         if (data.max <= 4) { //3栏选择题
            for (let i = 0; i < data.totalQues.length; null) {
               newArr.push(data.totalQues.splice(i * 3, 3))
            }
         } else if (data.max <= 9) {//2栏选择题
            for (let i = 0; i < data.totalQues.length; null) {
               newArr.push(data.totalQues.splice(i * 2, 2))
            }
         } else if (data.max > 9) {//一栏2栏混排选择题
            for (let i = 0; i < data.totalQues.length; i = i + 2) {
               let arr: Array<any> = [];
               if (this.findMaxOptLength(data.totalQues[i].data) <= 9 && this.findMaxOptLength(data.totalQues[i + 1].data) <= 9) {
                  arr.push(data.totalQues[i], data.totalQues[i + 1]);
                  newArr.push(arr)
               } else {
                  newArr.push([data.totalQues[i]], [data.totalQues[i + 1]]);
               }
            }
         }
      } else { //A3 3栏
         if (data.max <= 5) {
            for (let i = 0; i < data.totalQues.length; null) {
               newArr.push(data.totalQues.splice(i * 2, 2))
            }
         } else if (data.max > 5) {
            for (let i = 0; i < data.totalQues.length; i = i + 2) {
               let arr: Array<any> = [];
               if (this.findMaxOptLength(data.totalQues[i].data) <= 5 && this.findMaxOptLength(data.totalQues[i + 1].data) <= 5) {
                  arr.push(data.totalQues[i], data.totalQues[i + 1]);
                  newArr.push(arr)
               } else {
                  newArr.push([data.totalQues[i]], [data.totalQues[i + 1]]);
               }
            }
         }
      }
      return [...newArr]
   }
}