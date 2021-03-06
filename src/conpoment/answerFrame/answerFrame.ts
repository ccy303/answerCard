import './answerFrame.scss'
import GlobalData from '../global';
import SelQues from '../selQues/selQues';
import tool from '../../tool/tool';
import ContentText from '../contentText/content';

export default class AnswerFrame {
   _answerFrame: JQuery<HTMLElement> = null;
   // _selDom: any = null;
   number: number = 0;
   width: number = 0;
   data: any;
   html: any;
   constructor(data: any, html?: any) {
      this.data = data;
      this.html = html;
   }
   get answerFrame(): JQuery<HTMLElement> {
      return this._answerFrame;
   }
   set answerFrame(val: JQuery<HTMLElement>) {
      this._answerFrame = val;
   }
   public initAnswerFrame(bIndex: number, insertChild: boolean, type = "editor", number?: number) {
      // boxIndex 编辑当前框
      // boxRow 编辑当前此行属于哪个框
      this.number = number;
      this.width = GlobalData.pageType === 'A4' ? 672 :
         GlobalData.pageType === 'A3' && GlobalData.pageColum === 2 ?
            704 : 448;
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      let dom: JQuery<HTMLElement> = null;
      if (type === 'editor') { //主观题
         dom = this.renderEditor(bIndex, insertChild, hash)
      } else if (type === 'write') {//作文题
         dom = this.renderWrite(bIndex, hash)
      } else if (type === 'select') {//客观题
         dom = this.renderSelect(bIndex, insertChild, hash)
      }
      this.answerFrame = dom
      this.answerFrame.on('contextmenu', this.contextmenu.bind(this))
      this.answerFrame.on('click', this.checkSelection.bind(this))
      this.observeRow();
      return this
   }
   private initBindProFun(dom: JQuery<HTMLElement>[]) {//生成绑定题目题号点击事件
      dom.forEach((val: JQuery<HTMLElement>) => {
         val.on('click', (e: any) => {
            if (GlobalData.bindProTarget.dom && e.currentTarget === GlobalData.bindProTarget.dom[0]) {
               $(e.currentTarget).css('border', 'none')
               GlobalData.bindProTarget = {
                  dom: null,
                  pro: null,
                  qus: null,
               }
            } else {
               GlobalData.bindProTarget.dom && GlobalData.bindProTarget.dom.css('border', 'none')
               let pro = GlobalData.dataJSON.pageQus.find((val: any) => {
                  let index = val.pros.findIndex((pro: any) => {
                     return pro.proId === $(e.currentTarget).attr('proId');
                  })
                  return index !== -1
               })
               GlobalData.bindProTarget.pro = pro;
               GlobalData.bindProTarget.dom = $(e.currentTarget);
               $(e.currentTarget).css('border', '1px solid #000')
               if ($(e.currentTarget).attr('qusId')) {
                  let pro = GlobalData.bindProTarget.pro.pros.find((pro: any) => {
                     return pro.proId === $(e.currentTarget).attr('proId');
                  })
                  GlobalData.bindProTarget.qus = pro.qus.find((val: any) => {
                     return val.quId === $(e.currentTarget).attr('qusId');
                  })
               }
            }
         })
      })
   }
   private contextmenu(e: any) {//右键菜单
      e.preventDefault();
      if (GlobalData.dataJSON.bindExam) { return }
      $('#contentText').get(0) && $('#contentText').remove()
      GlobalData.contentTextTarget = { targetObj: this, targetDom: $(e.currentTarget), targetRow: $(e.target) };
      let contentText = new ContentText().init()
      $(e.currentTarget).parent().append(contentText)
      let top = e.offsetY + e.target.offsetTop + e.currentTarget.offsetTop + 5;
      let left = e.offsetX + e.target.offsetLeft + e.currentTarget.offsetLeft + 5;
      $('#contentText').css('display', 'block').css('top', top).css('left', left)
   }
   private writeAddRow(dom: JQuery<HTMLElement>, hash: string) {
      let row = $(`<div writeRow="true" contenteditable=false class="row" hash="${hash}"></div>`);
      let i = 0;
      while (true) {
         if (i > Math.round(this.width / 32) - 1) break
         row.append(`<div contenteditable=false class="write-item"></div>`)
         i++
      }
      dom.append(row)
   }
   private renderWrite(bIndex: number, hash: string) {
      tool.showLoading()
      let dom: JQuery<HTMLElement> = null;
      if (!this.html) {
         let totlaCount = this.number ? this.number / (this.width / 32) + 1 : -1;
         dom = $(`<div boxIndex=${bIndex} hash="${hash}" class="editor-box" type="write" contenteditable="true"></div>`);
         if (Object.keys(this.data).length) {
            GlobalData.dataJSON.newCard && dom.attr('operationId', this.data.pros[0].operationId)
            GlobalData.dataJSON.newCard && dom.attr('proId', this.data.pros[0].proId)
            let row = $(`<div class="row" hash="${hash}"></div>`);
            row.css('text-align', 'left').css('margin', '0 15px').css('padding', '0')
            dom.attr("targetid", `${this.data.pros[0].proId}`)
            row.append(`${this.data.pros[0].qus[0].pnum}.(${this.data.pros[0].qus[0].score}分)`)
            dom.append(row)
         } else if (GlobalData.dataJSON.newCard) {
            dom.attr('operationId', $(`[boxIndex=${bIndex}]`).attr('operationid'))
            dom.attr('proId', $(`[boxIndex=${bIndex}]`).attr('proId'))
         }
         let i = 0
         while (true) {
            if (i > totlaCount) break;
            this.writeAddRow(dom, hash)
            i++;
         }
      } else {
         dom = $(this.html)
         if (GlobalData.dataJSON.bindExam) {
            GlobalData.dataJSON.pageQus.forEach((val: any) => {
               if (val.pros[0].proId === dom.attr('proId')) {
                  let bindPnum: JQuery<HTMLElement>[] = [];
                  if (val.pros[0].joinProNum) {
                     let pnumDom = $(`<div proId="${val.pros[0].proId}" qusId="" class="bindPro">第${val.pros[0].pnum}题</div>`)
                     pnumDom
                        .css('position', 'absolute')
                        .css('top', '15px')
                        .css('left', '40px')
                        .css('padding', '10px 20px')
                        // .css('background', '#32CD32')
                        .css('background', '#F08080')
                        .css('color', '#000')
                        .css('font-size', '12px')
                        .css('cursor', 'pointer')
                     bindPnum.push(pnumDom)
                     dom.append(bindPnum)
                  } else {
                     let container = $(`<div></div>`)
                     dom.append(container)
                     container
                        .css('position', 'absolute')
                        .css('top', '15px')
                        .css('left', `40px`)
                     for (let i = 0; i < val.pros[0].qus.length; i++) {
                        let pnumDom = $(`<div proId="${val.pros[0].proId}" qusId="${val.pros[0].qus[i].quId}" class="bindPro">第${val.pros[0].qus[i].pnum}题</div>`)
                        pnumDom
                           .css('padding', '10px 20px')
                           // .css('background', '#32CD32')
                           .css('background', '#F08080')
                           .css('color', '#000')
                           .css('font-size', '12px')
                           .css('cursor', 'pointer')
                           .css('display', 'inline-block')
                        i !== 0 && pnumDom.css('margin-left', '10px')
                        bindPnum.push(pnumDom)
                        container.append(bindPnum)
                     }
                  }
                  this.initBindProFun(bindPnum)
               }
            })
         }
      }
      tool.hideLoading()
      dom.on('keydown', this.keyDowm.bind(this, false))
      dom.on('paste', this.paste.bind(this, true))
      dom.on('click', () => { GlobalData.currentImage = null; })
      return dom
   }
   private renderEditor(bIndex: number, insertChild: boolean, hash: string) {
      let dom: JQuery<HTMLElement> = null;
      if (this.data.flag === 2) { //新建答题卡生成填空题
         dom = $(`<div boxIndex=${bIndex} hash="${hash}" contenteditable="true" type="editor" class="editor-box"></div>`)
         if (Object.keys(this.data).length) {
            if (GlobalData.dataJSON.newCard) {
               dom.attr('operationId', this.data.pros[0].operationId)
               dom.attr('proId', this.data.pros[0].proId)
            }
            for (let i = 0; i < this.data.pros.length; i++) {
               for (let j = 0; j < this.data.pros[i].qus.length; j++) {
                  let flag = this.data.pros[i].qus[j].blankNums;
                  while (flag > 0) {
                     let row = $(`<div class="row" hash="${hash}">__________</div>`)
                     if (flag !== 1) {
                        row[0].innerHTML += '&nbsp;&nbsp;';
                     }
                     if (flag === this.data.pros[i].qus[j].blankNums) {
                        row[0].innerHTML =
                           `${this.data.pros[i].pnum}${this.data.pros[i].qus[j].pnum}.(${this.data.pros[i].qus[j].score}分)` +
                           '&nbsp;&nbsp;' +
                           row[0].innerHTML
                     }
                     dom.append(row)
                     row = null;
                     flag--;
                  }
               }
            }
         }
      } else if (!this.html) {
         const flg = ['判断题', '单选题', '多选题'];
         const option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
         const judge = '✓✗';
         dom = $(`<div boxIndex=${bIndex} hash="${hash}" contenteditable="true" type="editor" class="editor-box"></div>`)
         if (Object.keys(this.data).length) {
            if (GlobalData.dataJSON.newCard) {
               dom.attr('operationId', this.data.pros[0].operationId)
               dom.attr('proId', this.data.pros[0].proId)
               if (this.data.group != 0) {
                  dom.attr('group', this.data.group)
               }
            }
            dom.attr("targetid", `${this.data.pros[0].proId}`)
            if (this.data.group != 0) {
               let chooseQues = $(`<div class="row" hash="${hash}">
                  选做题组${this.data.group}.(${this.data.pros[0].score}分)
               </div>`)
               let i = 0;
               while (true) {
                  if (i > this.data.pros.length - 1) break
                  if (this.data.pros[i].pnum) {
                     chooseQues.append($(`<span style="margin-left:10px">[${this.data.pros[i].pnum}]</span>`))
                  } else {
                     let j = 0
                     let text = ''
                     while (true) {
                        if (j > this.data.pros[i].qus.length - 1) { break }
                        !text ? text += this.data.pros[i].qus[j].pnum : text += `、${this.data.pros[i].qus[j].pnum}`
                        j++
                     }
                     text = text.replace(/\、.*\、/, '-')
                     chooseQues.append($(`<span style="margin-left:10px">[${text}]</span>`))
                  }
                  i++
               }
               dom.append(chooseQues)
            }
            this.data.pros[0].qus.map((val: any) => {
               let pnum = $(`<div class="row" hash="${hash}">
                  ${this.data.group != 0 ? `` : `${this.data.pros[0].pnum}${val.pnum}.(${val.score}分)`}
               </div>`)
               if (flg.indexOf(val.quType) !== -1 && val.visible) {
                  let j = 0;
                  let opt = $(`<div class="opts" style="margin-left:15px"></div>`)
                  while (true) {
                     if (j > val.nums - 1) break
                     opt.append($(`<div class="opt-item">[${val.quType === '判断题' ? judge[j] : option[j]}]</div>`))
                     j++;
                  }
                  pnum.append(opt)
               }
               dom.append(pnum)
               let i = 0;
               while (true && insertChild && flg.indexOf(val.quType) === -1) {
                  if (i > 5) break;
                  dom.append($(`<div class="row" hash="${hash}"><br /></div>`))
                  i++
               }
            })
         } else if (GlobalData.dataJSON.newCard) {
            dom.attr('operationId', $(`[boxIndex=${bIndex}]`).attr('operationId'))
            dom.attr('proId', $(`[boxIndex=${bIndex}]`).attr('proId'))
         }
      } else {
         dom = $(this.html)
         if (GlobalData.dataJSON.bindExam) {
            if (dom.attr('group')) {
               let bindPnum: JQuery<HTMLElement>[] = [];
               let pro = GlobalData.dataJSON.pageQus.find((val: any) => {
                  return val.group == dom.attr('group')
               })
               let container = $(`<div></div>`)
               dom.append(container)
               container
                  .css('position', 'absolute')
                  .css('top', '15px')
                  .css('left', `40px`)
               for (let i = 0; i < pro.pros.length; i++) {
                  let pnumDom = $(`<div proId="${pro.pros[i].proId}" qusId="${pro.pros[i].qus[0].quId}" class="bindPro">第${pro.pros[i].qus[0].pnum}题</div>`)
                  pnumDom
                     .css('padding', '10px 20px')
                     // .css('background', '#32CD32')
                     .css('background', '#F08080')
                     .css('color', '#000')
                     .css('font-size', '12px')
                     .css('cursor', 'pointer')
                     .css('display', 'inline-block')
                  i !== 0 && pnumDom.css('margin-left', '10px')
                  bindPnum.push(pnumDom)
               }
               container.append(bindPnum)
               this.initBindProFun(bindPnum)
            } else {
               GlobalData.dataJSON.pageQus.forEach((val: any) => {
                  if (val.pros[0].proId === dom.attr('proId')) {
                     let bindPnum: JQuery<HTMLElement>[] = [];
                     if (val.pros[0].joinProNum) {
                        let pnumDom = $(`<div proId="${val.pros[0].proId}" qusId="" class="bindPro">第${val.pros[0].pnum}题</div>`)
                        pnumDom
                           .css('position', 'absolute')
                           .css('top', '15px')
                           .css('left', '40px')
                           .css('padding', '10px 20px')
                           // .css('background', '#32CD32')
                           .css('background', '#F08080')
                           .css('color', '#000')
                           .css('font-size', '12px')
                           .css('cursor', 'pointer')
                        bindPnum.push(pnumDom)
                        dom.append(bindPnum)
                     } else {
                        let container = $(`<div></div>`)
                        dom.append(container)
                        container
                           .css('position', 'absolute')
                           .css('top', '15px')
                           .css('left', `40px`)
                        for (let i = 0; i < val.pros[0].qus.length; i++) {
                           let pnumDom = $(`<div proId="${val.pros[0].proId}" qusId="${val.pros[0].qus[i].quId}" class="bindPro">第${val.pros[0].qus[i].pnum}题</div>`)
                           pnumDom
                              .css('padding', '10px 20px')
                              // .css('background', '#32CD32')
                              .css('background', '#F08080')
                              .css('color', '#000')
                              .css('font-size', '12px')
                              .css('cursor', 'pointer')
                              .css('display', 'inline-block')
                           i !== 0 && pnumDom.css('margin-left', '10px')
                           bindPnum.push(pnumDom)
                           container.append(bindPnum)
                        }
                     }
                     this.initBindProFun(bindPnum)
                  }
               })
            }
         }
      }
      dom.on('keydown', this.keyDowm.bind(this, false))
      dom.on('paste', this.paste.bind(this, true))
      dom.on('click', () => { GlobalData.currentImage = null; })
      return dom
   }
   private renderSelect(bIndex: number, insertChild: boolean, hash: string) {
      let dom: JQuery<HTMLElement> = null;
      if (!this.html) {
         const option = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ';
         const judge = '√×';
         dom = $(`<div boxIndex=${bIndex} hash="${hash}" type="select" class="editor-box" contenteditable="false"></div>`)
         const arg = new SelQues(GlobalData.dataJSON.pageQus[0]).initSelQues();
         insertChild && arg.arr.map((arr: any, index: number) => {
            if (!arr[0]) { return }
            let length = arr.length;
            let arrItemLen = arr[0].data.length;
            let i = 0
            while (true) {
               if (i > arrItemLen) break;
               let row = $(`<div class="row" type="sel" hash="${hash}"></div>`);
               let j = 0;
               while (true) {
                  if (j > length - 1 || !arr[j].data[i]) break;
                  const optLen = parseInt(arr[j].data[i].nums);
                  //渲染选项
                  let k = 0
                  let opt = $(`<div class="opts"></div>`)
                  if (GlobalData.dataJSON.newCard) {
                     opt.attr('operationId', arr[j].data[i].operationId)
                     opt.attr('proId', arr[j].data[i].proId)
                     opt.attr('qusId', arr[j].data[i].quId)
                  }
                  while (true) {//选项
                     if (k > optLen - 1 || isNaN(optLen)) break
                     // opt.append(`<div class="opt-item">
                     //    <i class="iconfont icon-${arr[j].data[i].quType === '判断题' ? judge[k] : option[k]}"></i>
                     // </div>`)
                     opt.append(`<div class="opt-item" style="color:#000">
                        [<font style="padding:0 1px">${arr[j].data[i].quType === '判断题' ? judge[k] : option[k]}</font>]
                     </div>`)
                     k++
                  }
                  let width = arg.colum ? 100 / arg.colum : 100 / arr.length;
                  let selItem = $(`
                  <div class="sel-item" frame="${arr[j].frame}" targetID="${arr[j].data[i].quId}${arr[j].data[i].pnum}" style="width:${width}%"></div>
                     k++
                  }`);
                  selItem.append($(`<div class="pnum">${arr[j].data[i].pnum || ``}</div>`));
                  selItem.append(opt)
                  row.append(selItem)
                  dom.append(row)
                  j++;
               }
               i++
            }
         })
         setTimeout(() => {
            let row = dom.find('.row')
            let i = 0;
            while (true) {
               if (i > row.length - 1) break;
               let html = $(row[i]).children('.sel-item:first-child').children('.pnum').html();
               let prev = $(row[i - 1]).children('.sel-item:first-child').children('.pnum').html()
               if (!html) {
                  $(row[i]).css('height', '0');
                  prev && !parseInt($(row[i - 1]).css('padding-bottom')) && $(row[i - 1]).children('.sel-item').css('padding-bottom', '7px')
               }
               i++
            }
         }, 0)
      } else {
         dom = $(this.html)
         if (GlobalData.dataJSON.bindExam) {
            let opts = dom.find('.opts');
            let _opts = [];
            $(opts)
               .css('background', '#F08080')
               .css('cursor', 'pointer')
            // .css('box-shadow', '-40px 0 0 #F08080')
            for (let i = 0; i < opts.length; i++) {
               _opts.push($(opts[i]))
            }
            this.initBindProFun(_opts)
         }
      }
      return dom
   }
   public getLastRow() {
      return this.answerFrame.find('.row').last();
   }
   public addImage(url: any) {
      $(this.answerFrame).append($(`<div contenteditable="false" class="image-file-box" draggable ="false">
         <img src=${url} crossorigin="true" class="image-file" draggable ="false">
      </div>`))
      tool.dealImage()
   }
   private paste(canPasteImg: boolean = true, e: any) {
      e.preventDefault();
      let file = e.originalEvent.clipboardData.files[0]
      if (file && file.type == 'image/png' && canPasteImg) {
         tool.uploadFile(file, true, (arg: any) => {
            this.addImage(arg)
         })
      } else {
         let html = e.originalEvent.clipboardData.getData('text/plain');
         html = html.replace(/\r|\n/g, '')
         document.execCommand('insertText', false, html)
         return false
      }
   }
   private keyDowm(contentText: boolean, event: any) { //contentText：来自右键菜单
      if (event.keyCode === 8 || event.keyCode === 46) {
         //剩下最后一行时禁用删除
         if (GlobalData.currentImage) {
            event.preventDefault();
            $(GlobalData.currentImage).parent().remove()
         }
         $(event.target).children('.row').length === 1 && $(event.target).children('.row').get(0).innerHTML.indexOf('<b') != -1 && event.preventDefault();
      } else {
         $(window.getSelection().anchorNode).hasClass('editor-box') && event.preventDefault();
      }
   }
   /**
    * @param  addrow  是否给新创建的标题栏添加一行
    * @param  bIndex  由上一个标题栏跨栏产生的标题栏创建时需要传递的发生跨列的标题栏的boxIndex，空则表示不是跨列调用
    */
   public addContent(addrow: boolean = true, bIndex?: any) {
      let prev = GlobalData.contentTextTarget.targetDom ? GlobalData.contentTextTarget.targetDom.prev() : null
      let proTitle = prev ? prev.attr('proTitle') : undefined;
      let isSplit = tool.checkBoxIsSplit(GlobalData.contentTextTarget.targetDom);
      if (!bIndex && (proTitle || isSplit)) { return }
      let dom = this.content(addrow, bIndex)
      addrow && GlobalData.contentTextTarget.targetDom.before(dom)
      return dom
   }
   private content(addrow: boolean, bIndex?: any) {
      let hash = `id${(new Date().getTime() + Math.random() * 1000000000000).toFixed(0)}`;
      !bIndex && (bIndex = (new Date().getTime() + Math.random() * 1000000000000).toFixed(0))
      let dom = $(`<div boxIndex=${bIndex} hash="${hash}" proTitle="true" contenteditable="true" type="editor" class="editor-box"></div>`)
      let row = $(`<div class="row" style="height:25px;font-weight:bold;" hash="${hash}"></div>`)
      let del = $(`<span class="del" contenteditable="false">×</span>`)
      dom.append(del)
      addrow && dom.append(row);
      dom.on('keydown', this.keyDowm.bind(this, true))
      dom.on('paste', this.paste.bind(this, false))
      del.on('click', () => {
         GlobalData.haveRemoveDomParent = $(`div[proTitle="true"][boxIndex=${bIndex}]`).parent().first();
         tool.removeBox($(`div[proTitle="true"][boxIndex=${bIndex}]`))
      })
      return dom
   }
   public addGrid(count: number) {
      if (GlobalData.contentTextTarget.targetDom.attr('type') !== 'editor') {
         return
      }
      if (GlobalData.contentTextTarget.targetRow.get(0).innerHTML === '<br>') {
         GlobalData.contentTextTarget.targetRow.get(0).innerHTML = ''
      }
      let _count = count;
      let i = 0;
      let rowWidth = parseFloat(GlobalData.contentTextTarget.targetRow.css('width'));
      let maxGridNum = parseInt(String(rowWidth / 34))
      if (count < maxGridNum) {
         while (true) {
            if (i > _count - 1) break;
            let grid = $(`<div 
               grid="grid"
               contenteditable="false"
               style="height:32px;width:32px;box-sizing:border-box;border:1px solid #000;display:inline-block;margin-right:2px"
            ></div>`)
            i == 0 && grid.css('border-left', '1px solid #000')
            GlobalData.contentTextTarget.targetRow.append(grid)
            i++
         }
      } else {
         let rowCount = Math.ceil(count / maxGridNum)
         let _count = count % maxGridNum //剩余count
         let i = 0;
         while (i < rowCount) {
            if (i == 0) { //第一行
               // console.log(GlobalData.contentTextTarget.targetRow.clone())
               let j = 0;
               while (j < maxGridNum) {
                  let grid = $(`<div 
                     grid="grid"
                     contenteditable="false"
                     style="height:32px;width:32px;box-sizing:border-box;border:1px solid #000;display:inline-block;margin-right:2px"
                  ></div>`)
                  j == 0 && grid.css('border-left', '1px solid #000')
                  GlobalData.contentTextTarget.targetRow.append(grid)
                  j++
               }
               i++;
               continue;
            }
            if (i != rowCount - 1 && i != 0) {
               let newRow = GlobalData.contentTextTarget.targetRow.clone()
               GlobalData.contentTextTarget.targetRow.before(newRow)
               i++;
               continue
            }
            if (i == rowCount - 1) { // 最后一行
               let j = 0;
               let row = GlobalData.contentTextTarget.targetRow.clone()
               row.empty();
               while (j < _count) {
                  let grid = $(`<div 
                     grid="grid"
                     contenteditable="false"
                     style="height:32px;width:32px;box-sizing:border-box;border:1px solid #000;display:inline-block;margin-right:2px"
                  ></div>`)
                  j == 0 && grid.css('border-left', '1px solid #000')
                  row.append(grid)
                  j++
               }
               GlobalData.contentTextTarget.targetRow.after(row)
               i++
               continue
            }
            i++
         }
      }
   }
   public changeLineHeight(height: number) {
      if (GlobalData.contentTextTarget.targetDom.attr('type') !== 'editor') {
         return
      }
      let attr = GlobalData.contentTextTarget.targetDom.attr('boxindex');
      $(`div[boxindex=${attr}]`).find('.row').css('line-height', height + 'px')
   }
   private observeRow() {
      const config: any = { attributes: true, childList: true, subtree: true, characterData: true };
      let observer = new MutationObserver(this.observeColumFun.bind(this, config))
      observer.observe(this.answerFrame.get(0), config)
   }
   private dealGridChangeRow(mutation: any) {
      let nextSiblings = $(mutation.addedNodes[0]).nextAll();
      $(mutation.addedNodes[0]).remove()
      let newRow = $(mutation.target).clone();
      newRow.empty();
      newRow.append(nextSiblings);
      $(mutation.target).after(newRow)
   }
   private nextStr = '' //移到下一行的内容
   private prevSelection: any = 0 // 上次焦点所在位置距离结束位置
   private observeColumFun(config: any, e: any) {
      e.map(async (mutation: MutationRecord) => {
         //target.nodeType 文本改变
         if (!mutation.addedNodes[0] && mutation.target.nodeType !== 3) {
            return
         }
         if (mutation.addedNodes[0]) {
            if (mutation.addedNodes[0].nodeName == 'BR' && ($(mutation.nextSibling).attr('grid') == 'grid' || $(mutation.previousSibling).attr('grid') == 'grid')) { // 处理在插入方格处换行
               this.dealGridChangeRow(mutation)
               return
            }
         }
         if (mutation.type !== 'characterData') {
            if (!mutation.addedNodes[0]) {
               return
            } else if (mutation.addedNodes[0].nodeType !== 3) {
               return
            }
         }
         if ($(mutation.target).hasClass('image-file-box')) {
            return
         }
         $('.fit-content').remove();
         const { anchorOffset, anchorNode } = window.getSelection()
         const selectionPonit = $(anchorNode).parent() //当前光标所在行
         let rowWidth = this.answerFrame.find('.row').width();
         let textDom = $(`<div class="fit-content"></div>`)
         textDom.css('font-size', this.answerFrame.find('.row').css('font-size'))
         const text = mutation.target.textContent;
         $('body').append(textDom)
         let targetDom = null;
         textDom.html(mutation.target.textContent)
         if (mutation.type == 'characterData') {
            if (!$(mutation.target).parent().get(0)) { return }
            targetDom = mutation.target;
         } else {
            targetDom = mutation.addedNodes[0];
         }
         if ($(mutation.target).hasClass('row')) {
            let child: any = $(mutation.target.childNodes);
            for (let i = 0; i < child.length; i++) {
               if (child[i].tagName === 'BR') {
                  $(child[i]).remove();
               }
            }
         }
         //@ts-ignore
         if (targetDom.length - anchorOffset > 0) {
            //@ts-ignore
            this.prevSelection = targetDom.length - anchorOffset
         }
         if (textDom.width() > rowWidth) {
            let targetRow = $(targetDom).parent()
            this.observeTextWidth(textDom, text)
            let _strObj = tool.strCheckStr(text, textDom[0].innerText)
            this.nextStr = _strObj.nextStr || ''
            targetRow.html('<br/>')
            targetRow.html(textDom[0].innerText)
            this.addTextToNextRow(targetRow, _strObj)
            if (selectionPonit.get(0) == targetRow.get(0)) {
               let textNode: any = targetRow.get(0).childNodes[0]
               let target = anchorOffset > textNode.length ? textNode.length : anchorOffset
               tool.resetRange(textNode, target, textNode, target)
            }
         } else {
            let targetRow: any = $(targetDom).parent()
            let textNode: any = targetRow.get(0).childNodes[0]
            //@ts-ignore
            if (anchorNode.length == anchorOffset && textNode != anchorNode && this.nextStr) {
               let target = this.nextStr.length - this.prevSelection
               tool.resetRange(textNode, target, textNode, target)
               this.nextStr = null;
               this.prevSelection = 0
            }
         }
      })
   }
   private addTextToNextRow(targetDom: JQuery<Node>, textObj: { start: number, end: number, prevStr: string, nextStr: string }, movePoint?: boolean) {
      let nextRow = this.getNextRow(targetDom)
      if (nextRow && nextRow.get(0)) {
         let html = nextRow.html() == '<br>' ? '' : nextRow.get(0).innerText;
         nextRow.html(textObj.nextStr + html)
      } else {
         let row = $(`<div class="row" hash="${targetDom.attr('hash')}"></div>`)
         targetDom.after(row)
         row.html(textObj.nextStr)
      }
   }
   private subStr(str: string) {
      if (!str.length) return
      let href = Math.round(str.length / 2)
      let arr = [];
      arr.push(str.substr(0, href), str.substr(href))
      return arr
   }
   private observeTextWidth(dom: any, text: any): any {
      const strObj = tool.strCheckStr(text, dom[0].innerText)
      if (!strObj.nextStr && dom.width() <= this.answerFrame.find('.row').width()) { return }
      if (dom.width() >= this.answerFrame.find('.row').width()) {
         if (dom.width() - this.answerFrame.find('.row').width() <= this.answerFrame.find('.row').width() / 2) {
            while (true) {
               if (dom.width() < this.answerFrame.find('.row').width()) break;
               let html = dom[0].innerText;
               html = html.substr(0, html.length - 1);
               dom.html(html)
            }
         } else {
            const strArr = this.subStr(dom[0].innerText);
            dom.html(strArr[0])
            this.observeTextWidth(dom, text);
         }
      } else {
         const strArr = this.subStr(strObj.nextStr)
         const html = dom[0].innerText + strArr[0];
         dom.html(html)
         this.observeTextWidth(dom, text);
      }
   }
   private getNextRow(target: JQuery<Node>): any {
      if (target.next('.row:not([writerow=true])').get(0)) {
         return target.next('.row:not([writerow=true])')
      } else {
         if (target.next('.row[writerow=true]').get(0)) {
            return null
         } else {
            let editorBox = $(`[boxindex=${this.answerFrame.attr('boxindex')}]`);
            let nextEditorBox = null;
            let i = 0;
            while (i <= editorBox.length - 1) {
               if (editorBox[i] == this.answerFrame.get(0)) {
                  nextEditorBox = editorBox[i + 1] ? $(editorBox[i + 1]) : null
                  break
               }
               i++;
            }
            return nextEditorBox ?
               nextEditorBox.children('.row:not([writerow=true])').get(0) ?
                  nextEditorBox.children('.row:not([writerow = true])').first() :
                  null :
               null
         }
      }

   }
   private checkSelection() { //检查光标
      const { anchorNode } = window.getSelection();
      if ($(anchorNode).hasClass('editor-box')) {
         let target: any = $(anchorNode).children('.row:not([writerow=true])').last();
         if (target.children().get(0) && target.children().get(0).nodeName == 'BR') {
            tool.resetRange(target.get(0), '', target.get(0), '')
         } else {
            target[0].innerText.length
            tool.resetRange(target.get(0).childNodes[0], target[0].innerText.length, target.get(0).childNodes[0], target[0].innerText.length)
         }
      }
   }
}