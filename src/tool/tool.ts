import GlobalData from '../conpoment/global'
import AnswerFrame from '../conpoment/answerFrame/answerFrame';
import loading from './../../assets/img/loading.gif';
class Tool {
   _selDom: any = null;
   get selDom() {
      return this._selDom;
   }
   set selDom(val) {
      this._selDom = val
   }
   public selectProRIndex(dom: JQuery<HTMLElement>) { //客观题pIndex
      let page = null
      let pageDom = null;
      for (let i = 0; i < $('#answerCard>.page').length; i++) { //查找页数
         if ($($('#answerCard>.page').get(i)).find(dom).get(0)) {
            page = i + 1;
            pageDom = $($('#answerCard>.page').get(i));
         }
      }
      if (!page) return null
      let bigFrame = null
      for (let i = 0; i < pageDom.find('.colum').children().length; i++) { //查找大框
         if ($(pageDom.find('.colum').children().get(i)).find(dom).get(0)) {
            bigFrame = i + 1;
            if (pageDom.find('.colum').children('.header-box').get(0)) {
               bigFrame -= 2;
            }
            if (pageDom.find('.colum').children(`[type=select]`).prev().attr('protitle') == "true") {
               bigFrame -= 1;
            }
         }
      }
      if (!bigFrame) return null
      let frame = dom.attr('frame');
      return `${page}-${bigFrame}-${frame}`
   }
   public subjectiveQuestionsPindex(dom: JQuery<HTMLElement>) {//主观题pindex
      let pIndex = [];
      let pages = $('#answerCard>.page');
      for (let i = 0; i < dom.length; i++) {
         let f = null;
         let p = null;
         for (let j = 0; j < pages.length; j++) {
            if ($(pages[j]).find(dom[i]).get(0)) {
               p = j + 1;
               let frame = $(pages[j]).find('.colum').children(); //全部框
               let titleLen: number = 0;
               for (let k = 0; k < frame.length; k++) {
                  $(frame[k]).attr('protitle') && titleLen++
                  if (frame[k] === dom[i]) {
                     f = k + 1;
                     $(pages[j]).find('.colum').children('.header-box').get(0) && (f -= 2);
                     f -= titleLen
                  }
               }
            }
         }
         pIndex.push(`${p}@${f}`)
      }
      return pIndex.join('-')
   }
   public selPIndex() {//选择器Pindex
      let page = $('#answerCard>.page');
      let pIndex = [];
      for (let i = 0; i < page.length; i++) {
         let len = $(page[i]).find('[type="select"]').length
         let j = 1;
         while (true) {
            if (j > len) break;
            pIndex.push(`${i + 1}@${j}`)
            j++
         }
      }
      return pIndex.join('-')
   }
   public checkBoxIsSplit(dom: JQuery<HTMLElement>) {
      if (!dom) return
      let attr = dom.attr('boxindex');
      let editorBoxs = $('#answerCard').find(`[boxindex=${attr}]`);
      return !(dom.get(0) === editorBoxs[0])
   }
   public insertGrid() {
      let dialog = $(`<div id="dialog">
            <div class="content">
               <p class="title">插入方格</p>
               <div class='form'>
                  <label for="count">设置方格数量:</label>
                  <input value="" id="count" autocomplete="off" placeholder="请输入方格数量" />
               </div>
               <div class="bottom-box">
                  <div class="botton" id="yes">确定</div>
                  <div class="botton" id="no">取消</div>
               </div>
            </div>
         </div>`);
      $('body').append(dialog)
      $('#no').on('click', () => { $('#dialog').remove() })
      $('#yes').on('click', () => {
         let val = $('#count').val();
         if (!val) return
         GlobalData.contentTextTarget.targetObj.addGrid(val);
         $('#dialog').remove()
      })
   }
   public changeLineHeight() {
      let dialog = $(`<div id="dialog">
            <div class="content">
               <p class="title">插入方格</p>
               <div class='form'>
                  <label for="lineHeight">设置行高:</label>
                   <select value="25" id="lineHeight" autocomplete="off" placeholder="行高" >
                     <option value="18">18px</option>
                     <option value="20">20px</option>
                     <option selected="selected" value="25">25px</option>
                     <option value="30">30px</option>
                     <option value="38">38px</option>
                     <option value="44">44px</option>
                     <option value="50">50px</option>
                  <select>
               </div>
               <div class="bottom-box">
                  <div class="botton" id="yes">确定</div>
                  <div class="botton" id="no">取消</div>
               </div>
            </div>
         </div>`);
      $('body').append(dialog)
      $('#no').on('click', () => { $('#dialog').remove() })
      $('#yes').on('click', () => {
         let val = $('#lineHeight').val();
         if (!val) return
         GlobalData.contentTextTarget.targetObj.changeLineHeight(val);
         $('#dialog').remove()
      })
   }
   public uploadFile(file: any, type: boolean, callback?: any) {
      let config = GlobalData.config;
      let queryData = type ? Object.assign({}, config.queryData, { inFiletype: '', inexamSubjectId: GlobalData.subjectId || 0, inexamId: "0" }) : config.queryData;
      $.post(`${config.uploadUrl}`, queryData, (res) => {
         if (res.result === '00') {
            let { data } = res;
            let fromData = new FormData();
            !type && fromData.append('key', data.dir + data.filename + (file.name.substring((file.name.lastIndexOf(".")))));
            type && fromData.append('key', data.dir + data.filename);
            fromData.append('policy', data.policy);
            fromData.append('OSSAccessKeyId', data.accessid);
            fromData.append('success_action_status', '200');
            fromData.append('signature', data.signature);
            fromData.append('file', file);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", data.host, true);
            xhr.onreadystatechange = function () {
               if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                     !callback && GlobalData.contentTextTarget.targetObj.addImage(data.url)
                     typeof (callback) == 'function' && callback(data.url)
                  }
               }
            }
            xhr.send(fromData);
         }
      })
   }
   public findPageObj(dom: JQuery<HTMLElement>) {
      let i = 0;
      let obj = null;
      while (true) {
         if (i > GlobalData.pageObject.length - 1) break;
         if (GlobalData.pageObject[i].page[0] == dom[0]) {
            obj = GlobalData.pageObject[i];
         }
         i++
      }
      return obj
   }
   public changeFontNum() {
      if (GlobalData.contentTextTarget.targetDom.attr('type') !== 'write') return
      let boxIndex = GlobalData.contentTextTarget.targetDom.attr('boxindex')
      let dialog = $(`<div id="dialog">
            <div class="content">
               <p class="title">修改作文字数</p>
               <div class='form'>
                  <label for="fontNum">设置字数:</label>
                  <input value="800" id="fontNum" autocomplete="off" placeholder="请输入字数" />
               </div>
               <div class="bottom-box">
                  <div class="botton" id="yes">确定</div>
                  <div class="botton" id="no">取消</div>
               </div>
            </div>
         </div>`);
      $('body').append(dialog)
      $('#no').on('click', () => { $('#dialog').remove() })
      $('#fontNum').keyup(() => {
         let val = Number($('#fontNum').val());
         if (isNaN(val)) {
            return
         } else {
            val > 10000 && $('#fontNum').val(10000)
         }
      })
      $('#yes').on('click', () => {
         // this.showLoading()
         let val = $('#fontNum').val();
         let page = $(`[type=write][boxindex=${boxIndex}]`).first().parent().parent();
         let boxindex = $(`[type=write][boxindex=${boxIndex}]`).first().attr('boxindex')
         if (!val) return
         let writeFrame = $('#answerCard').find(`[type=write][boxindex=${boxIndex}]`);
         this.removeBox(writeFrame, () => {
            $('#dialog').remove()
            let answerFrame = new AnswerFrame({}).initAnswerFrame(Number(boxindex), true, 'write', Number(val));
            GlobalData.AnswerFrameObj.push(answerFrame);
            page = $(page);
            let targetBox = $(`[type=write][boxindex=${boxIndex}]`).first();
            targetBox.children('.row').last().after(answerFrame.answerFrame.children())
            this.hideLoading()
         })
      })
   }
   public resetRange(startContainer: any, startOffset: any, endContainer: any, endOffset: any) {//重新设置焦点
      let selection = window.getSelection();
      selection.removeAllRanges();
      let range = document.createRange();
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      selection.addRange(range);
   }
   public removeBox(box: JQuery<HTMLElement>, callback?: any) {//when remove a box,we should remove row by row
      let i = box.length - 1;
      let fun = function () {
         let _box = box[i]
         GlobalData.haveRemoveDomParent = $(_box).parent().first();
         let children = $(_box).attr('protitle') == 'true' ? $(_box).children('.row') : $(_box).children('.row[writeRow=true]')
         let j = children.length - 1
         while (true) {
            if (j < 0) break
            $(children[j]).remove();
            j--
         }
         if (!$(_box).children('.row').get(0)) {
            setTimeout(() => {
               $(_box).remove();
            }, 0)
            i--
            if (i >= 0) {
               setTimeout(() => {
                  fun()
               }, 0);
            }
         } else {
            typeof callback == 'function' && callback();
         }
      }
      fun()

      //修改过一个版本
      // console.log(box)
      // let i = box.length - 1;
      // setTimeout(() => {//async problem
      //    while (true) {
      //       if (i < 0) break;
      //       let children = $(box.get(i)).attr('protitle') == 'true' ? $(box[i]).children('.row') : $(box[i]).children('.row[writeRow=true]')
      //       let j = children.length - 1
      //       while (true) {
      //          if (j < 0) break
      //          $(children[j]).remove();
      //          j--
      //       }
      //       if (!$(box[i]).children('.row').get(0)) {
      //          GlobalData.haveRemoveDomParent = $(box[i]).parent().first();
      //          setTimeout(() => {
      //             $(box[i]).remove();
      //          }, 0);
      //       }
      //       i--
      //    }
      //    typeof callback == 'function' && callback();
      // }, 0);
   }
   public showLoading() {
      let dialog = $(`<div id="loading" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;background:rgba(0,0,0,.3);display:flex;align-items:center;">
         <div style="height:auto;background:#fff;border-radius:10px;margin:0 auto;padding:20px;">
            <img src='${loading}' width="50px">
         </div>
      </div>`)
      $('body').append(dialog)
   }
   public hideLoading() {
      $('#loading').remove();
   }
   public dealImage(dom?: any) {
      $('.image-file').on('click', (imageEvent) => {
         imageEvent.stopPropagation()
         $(imageEvent.target).parent().addClass('active') //image-file-box
         !$(imageEvent.target).parent().children('span').get(0) && $(imageEvent.target).parent().append(`
            <span contenteditable="false" draggable ="false" class="bottom-right drag"></span>
         `)
         GlobalData.currentImage = imageEvent.target
         $(`span`).on('mousedown', (e) => { //拖拽区域
            e.stopPropagation();
            e.preventDefault()
            this.selDom = e.target;
         })
         let obj: any = {};
         $(imageEvent.target).parent().on('mousedown', (mouseDownEvent) => {//包裹图片的div image-file-box
            mouseDownEvent.stopPropagation()
            this.selDom = mouseDownEvent.target;
            obj.x0 = mouseDownEvent.offsetX;
            obj.y0 = mouseDownEvent.offsetY;
         })
         $(imageEvent.target).parent().parent().on('mousemove', (mouseMoveEvent) => {//editorBox
            mouseMoveEvent.stopPropagation()
            if (!this.selDom) return
            if (mouseMoveEvent.target === this.selDom) {
               let e = mouseMoveEvent
               $(e.target).parent()
                  .css('top', e.pageY - $(e.target).parent().parent().offset().top - obj.y0)
                  .css('left', e.pageX - $(e.target).parent().parent().offset().left - obj.x0)
            } else if ($(this.selDom).hasClass('drag')) {
               let imageSize = {
                  height: parseInt($(this.selDom).parent().children('.image-file').css('height')),
                  width: parseInt($(this.selDom).parent().children('.image-file').css('width')),
               }
               $(this.selDom).parent().children('.image-file')
                  .css('height', imageSize.height + mouseMoveEvent.pageY - $(this.selDom).offset().top)
            }
         })
         $(imageEvent.target).on('mouseup', (e) => {
            e.stopPropagation()
            $(imageEvent.target).parent().off('mousedown');
            $(imageEvent.target).parent().parent().off('mousemove')
            this.selDom = null;
            obj = {};
         })
      })
   }
   public strCheckStr(pStr: string, cStr: string): { start: number, end: number, prevStr: string, nextStr: string } {//find cStr in pStr
      // debugger
      let startIndex = pStr.indexOf(cStr);
      let endIndex = startIndex + cStr.length - 1;
      return {
         start: startIndex,
         end: endIndex,
         prevStr: pStr.substr(0, startIndex),
         nextStr: pStr.substr(endIndex + 1)
      }
   }
}
export default new Tool() as Tool   