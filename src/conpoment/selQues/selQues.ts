import GlobalData from '../global';
export default class SelQues {
   data: any = null
   constructor(data: any) {
      this.data = { ...data };
   }
   initSelQues() {
      if (!this.checkoutdata()) return;
      let obj = this.splitQues()
      let newData = this.splitQuesTocolum(obj)
      return newData;
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
            max: 0,
         };
         _obj.data = ques.splice(i * 5, 5);
         _obj.frame = obj.totalQues.length + 1;
         obj.totalQues.push(_obj)
      }
      obj.totalQues.map((val: any) => {
         let length = val.data.length
         while (length < 5) {
            val.data.push({})
            length++
         }
      })
      obj.totalQues.map((val: any) => {
         val.data.map((_val: any) => {
            if (parseInt(_val.nums) > val.max) {
               val.max = parseInt(_val.nums);
            }
         })
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
      let obj: any = {}
      let newArr: Array<any> = [];
      if (GlobalData.pageType === 'A4' || GlobalData.pageType === 'A3' && GlobalData.pageColum === 2) {
         if (data.max <= 4) { //3栏选择题
            for (let i = 0; i < data.totalQues.length; null) {
               let a = data.totalQues.splice(i * 4, 4);
               newArr.push(a)
            }
            obj.arr = newArr;
            obj.colum = 4
         } else if (data.max > 4 && data.max <= 6) {
            for (let i = 0; i < data.totalQues.length; null) {
               let a = data.totalQues.splice(i * 3, 3);
               newArr.push(a)
            }
            obj.arr = newArr;
            obj.colum = 3
         } else if (data.max <= 9) {//2栏选择题
            for (let i = 0; i < data.totalQues.length; null) {
               newArr.push(data.totalQues.splice(i * 2, 2))
            }
            obj.arr = newArr;
            obj.colum = 2
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
            obj.arr = newArr;
            obj.colum = null //随机分列
         }
      } else { //A3 3栏
         if (data.max <= 5) {
            for (let i = 0; i < data.totalQues.length; null) {
               newArr.push(data.totalQues.splice(i * 2, 2))
            }
            obj.arr = newArr;
            obj.colum = 2
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
            obj.arr = newArr;
            obj.colum = null //随机分列
         }
      }
      return obj
   }
}