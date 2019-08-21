import GlobalData from '../global';
import './writing.scss';
export default class Write {
   write: JQuery<HTMLElement> = null;
   number: number = 0;
   width: number = 0;
   constructor(number: number) {
      this.number = number;
      this.width = GlobalData.pageType === 'A4' ? 672 :
         GlobalData.pageType === 'A3' && GlobalData.pageColum === 2 ? 704 :
            448;
      this.write = $(`<div class="write-box"></div>`)
   }

   public init() {
      let totlaCount = this.number / (this.width / 32) + 1;
      let i = 0
      while (true) {
         if (i > totlaCount) break;
         this.addRow()
         i++;
      }
      return this.write
   }

   private async addRow() {
      let row = $(`<div class="write-row" style="width:${this.width}px"></div>`)
      let i = 0;
      while (true) {
         if (i > this.width / 32 - 1) break
         row.append(`<div class="write-item"></div>`)
         i++
      }
      await this.write.append(row)
      // console.log($(`div.write-item`))
   }
}