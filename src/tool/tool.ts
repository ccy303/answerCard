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

}

export default new Tool() as Tool   