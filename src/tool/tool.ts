import GlobalData from '../conpoment/global'
class Tool {
   selectProRIndex(dom: JQuery<HTMLElement>) { //客观题pIndex
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
         }
      }
      if (!bigFrame) return null
      let frame = dom.attr('frame');
      return `${page}-${bigFrame}-${frame}`
   }
   subjectiveQuestionsPindex(dom: JQuery<HTMLElement>) {//主观题pindex
      let pIndex = [];
      let pages = $('#answerCard>.page');
      for (let i = 0; i < dom.length; i++) {
         let f = null;
         let p = null;
         for (let j = 0; j < pages.length; j++) {
            if ($(pages[j]).find(dom[i]).get(0)) {
               p = j + 1;
               let frame = $(pages[j]).find('.colum').children(); //全部框
               for (let k = 0; k < frame.length; k++) {
                  if (frame[k] === dom[i]) {
                     f = k + 1;
                     $(pages[j]).find('.colum').children('.header-box').get(0) && (f -= 2);
                  }
               }
            }
         }
         pIndex.push(`${p}@${f}`)
      }
      return pIndex.join('-')
   }
   selPIndex() {//选择器Pindex
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
   checkBoxIsSplit(dom: JQuery<HTMLElement>) {
      let attr = dom.attr('boxindex');
      let editorBoxs = $('#answerCard').find(`[boxindex=${attr}]`);
      return !(dom.get(0) === editorBoxs[0])
   }
   insertGrid() {
      let dialog = $(`<div id="dialog" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;background:rgba(0,0,0,.3);display:flex;align-items:center;">
         <div style="height:auto;background:#fff;border-radius:10px;margin:0 auto;padding:20px;">
            <p style="">插入方格数</p>
            <input id="count" style="width:200px;height:30px;line-height:30px;border-radius:5px;border:1px solid #e1e1e1;" autocomplete="off" placeholder="数量" />
            <div style="margin:15px 0;text-align:center">
               <div id="yes" style="cursor: pointer;margin:0 auto;display:inline-block;line-height:30px;text-align:center;height:30px;width:100px;background:#32CD32;color:#fff;border:none;border-radius:5px">确定</div>
               <div id="no" style="cursor: pointer;margin:0 auto;display:inline-block;line-height:30px;text-align:center;height:30px;width:100px;background:#DAA520;color:#fff;border:none;border-radius:5px">取消</div>
            </div>
         </div>
      </div>`)
      $('body').append(dialog)
      $('#no').on('click', () => { $('#dialog').remove() })
      $('#yes').on('click', () => {
         let val = $('#count').val();
         if (!val) return
         GlobalData.contentTextTarget.targetObj.addGrid(val);
         $('#dialog').remove()
      })
   }
   changeLineHeight() {
      let dialog = $(`<div id="dialog" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;background:rgba(0,0,0,.3);display:flex;align-items:center;">
         <div style="height:auto;background:#fff;border-radius:10px;margin:0 auto;padding:20px;">
            <p style="">修改行高</p>
            <select value="25" id="lineHeight" style="width:200px;height:30px;line-height:30px;border-radius:5px;border:1px solid #e1e1e1;" autocomplete="off" placeholder="数量" >
               <option value="18">18px</option>
               <option value="20">20px</option>
               <option selected="selected" value="25">25px</option>
               <option value="30">30px</option>
               <option value="38">38px</option>
               <option value="44">44px</option>
               <option value="50">50px</option>
            <select>
            <div style="margin:15px 0;text-align:center">
               <div id="yes" style="cursor: pointer;margin:0 auto;display:inline-block;line-height:30px;text-align:center;height:30px;width:100px;background:#32CD32;color:#fff;border:none;border-radius:5px">确定</div>
               <div id="no" style="cursor: pointer;margin:0 auto;display:inline-block;line-height:30px;text-align:center;height:30px;width:100px;background:#DAA520;color:#fff;border:none;border-radius:5px">取消</div>
            </div>
         </div>
      </div>`)
      $('body').append(dialog)
      $('#no').on('click', () => { $('#dialog').remove() })
      $('#yes').on('click', () => {
         let val = $('#lineHeight').val();
         if (!val) return
         GlobalData.contentTextTarget.targetObj.changeLineHeight(val);
         $('#dialog').remove()
      })
   }
   uploadFile(file: any, type: boolean, callback?: any) {
      let config = GlobalData.config;
      let queryData = type ? Object.assign({}, config.queryData, { inFiletype: 'png' }) : config.queryData;
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
                     typeof (callback) == 'function' && callback()
                  }
               }
            }
            xhr.send(fromData);
         }
      })
   }
   findPageObj(dom: JQuery<HTMLElement>) {
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
   changeFontNum() {
      let dialog = $(`<div id="dialog" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;background:rgba(0,0,0,.3);display:flex;align-items:center;">
         <div style="height:auto;background:#fff;border-radius:10px;margin:0 auto;padding:20px;">
            <p style="">修改作文字数</p>
            <input value="800" id="fontNum" style="width:200px;height:30px;line-height:30px;border-radius:5px;border:1px solid #e1e1e1;" autocomplete="off" placeholder="数量" />
            <div style="margin:15px 0;text-align:center">
               <div id="yes" style="cursor: pointer;margin:0 auto;display:inline-block;line-height:30px;text-align:center;height:30px;width:100px;background:#32CD32;color:#fff;border:none;border-radius:5px">确定</div>
               <div id="no" style="cursor: pointer;margin:0 auto;display:inline-block;line-height:30px;text-align:center;height:30px;width:100px;background:#DAA520;color:#fff;border:none;border-radius:5px">取消</div>
            </div>
         </div>
      </div>`)
      $('body').append(dialog)
      $('#no').on('click', () => { $('#dialog').remove() })
      $('#yes').on('click', () => {
         let val = $('#fontNum').val();
         let page = GlobalData.contentTextTarget.targetObj.answerFrame.parent().parent();
         let boxindex = GlobalData.contentTextTarget.targetObj.answerFrame.attr('boxindex')
         if (!val) return
         let pageObj = this.findPageObj(page);
         let writeFrame = $('#answerCard').find('[type=write]');
         writeFrame.remove()
         pageObj.renderDeafultAnswerFrame(boxindex, true, 'write', {}, val)
         $('#dialog').remove()
      })
   }
}

export default new Tool() as Tool   