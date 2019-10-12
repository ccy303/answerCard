import GlobalData from '../global';
import tool from '../../tool/tool';
import icon1 from './../../../assets/icons/charudati_icono.png';
import icon2 from './../../../assets/icons/hanggao-icon.png';
import icon3 from './../../../assets/icons/kongge-icon.png';
import icon4 from './../../../assets/icons/yanghsixiugai-icon.png';
import icon5 from './../../../assets/icons/more-icon.png';
import icon6 from './../../../assets/icons/tupian-icon.png';
import icon7 from './../../../assets/icons/qingchu-icon.png';
import icon8 from './../../../assets/icons/jiachu-icon.png';
import icon9 from './../../../assets/icons/xiahuaxian-icon.png';
import icon10 from './../../../assets/icons/zuoduiqi-icon.png';
import icon11 from './../../../assets/icons/zuoduiqi-icon.png';
import icon12 from './../../../assets/icons/juzhong-icon.png';
import icon13 from './../../../assets/icons/youduiqi-icon.png';
import icon14 from './../../../assets/icons/zishu-icon.png';

export default class ContentText {
   dom: JQuery<HTMLElement> = null;
   constructor(dom?: any) {
      this.dom = dom;
   }
   public init() {
      let contentText = $(`<div id="contentText">
         <ul id="firstList">
            <li onselectstart="return false" id="right-addContent">
               <img src="${icon1}" />
               <div>插入文本框</div>
            </li>
            <li onselectstart="return false" id="right-lineHeight">
               <img src="${icon2}" />
               <div>修改行高</div>
            </li>
            <li onselectstart="return false" id="right-addGrid">
               <img src="${icon3}" />
               <div>插入方格</div>
            </li>
            <li onselectstart="return false" id="right-style-change">
               <img src="${icon4}" />
               <div>
                  样式修改
                  <img style="margin: 0 0 0 30px" src="${icon5}" />
               </div>
            </li>
            <li onselectstart="return false" id="insert-img">
               <img src="${icon6}" />
               <div>插入图片</div>
            </li>
            <li onselectstart="return false" id="clear-style">
               <img src="${icon7}" />
               <div>清除样式</div>
            </li>
            <li onselectstart="return false" id="change-font-num">
               <img src="${icon14}" />
               <div>修改字数</div>
            </li>
         </ul>
      </div>`)
      let secondList = $(`<div class="secondList">
         <ul id="secondList">
            <li onselectstart="return false" id="blod">
               <img src="${icon8}" />
               <div>加粗</div>
            </li>
            <li onselectstart="return false" id="under-line">
               <img src="${icon9}" />
               <div>下划线</div>
            </li>
            <li onselectstart="return false" id="align">
               <img src="${icon10}" />
               <div>
                  对齐方式
                  <img style="margin: 0 0 0 20px" src="${icon5}" />
               </div>
            </li>
         </ul>
      </div>`)
      let threeList = $(`<div class="threeList">
         <ul>
            <li onselectstart="return false" id="left">
               <img src="${icon11}" />
               <div>左对齐</div>
            </li>
            <li onselectstart="return false" id="center">
               <img src="${icon12}" />
               <div>居中</div>
            </li>
            <li onselectstart="return false" id="right">
               <img src="${icon13}" />
               <div>右对齐</div>
            </li>
         </ul>
      </div>`)
      contentText.append(secondList)
      contentText.append(threeList)
      contentText.find('ul#firstList>li').hover((e: any) => {
         if ($(e.currentTarget).attr('id') === 'right-style-change') {
            secondList.css('display', 'inline-block')
         } else {
            secondList.css('display', 'none')
            threeList.css('display', 'none')
         }
      }, (e: any) => { return })
      secondList.find(`ul#secondList>li`).hover((e: any) => {
         $(e.currentTarget).attr('id') === 'align' ? threeList.css('display', 'inline-block') : threeList.css('display', 'none')
      }, (e: any) => { return })
      contentText.find(`li`).css(`user-select`, 'none')
      contentText.find('li').on('click', this.contentTextClick.bind(this))
      return contentText
   }
   private contentTextClick(e: any) {
      e.preventDefault()
      e.stopPropagation()
      let id = $(e.currentTarget).attr('id')
      if (id === 'right-addContent') {
         let dom = GlobalData.contentTextTarget.targetObj.addContent();
         dom.focus();
         let range = new Range();
         range.selectNodeContents(dom.children('.row').get(0));
         range.collapse(false);
         let sel = window.getSelection();
         sel.removeAllRanges();
         sel.addRange(range);
      }
      if (id === 'right-lineHeight') { tool.changeLineHeight() }
      if (id === 'right-addGrid') { tool.insertGrid() }
      if (id === 'blod') { document.execCommand('bold') }
      if (id === 'under-line') { document.execCommand('underline') }
      if (id === 'left') { document.execCommand('justifyLeft') }
      if (id === 'center') { document.execCommand('justifyCenter') }
      if (id === 'right') { document.execCommand('justifyRight') }
      if (id === 'clear-style') { document.execCommand('removeFormat') }
      if (id === 'insert-img') {
         let inputObj = document.createElement('input');
         inputObj.setAttribute('id', 'file');
         inputObj.setAttribute('type', 'file');
         inputObj.setAttribute('style', 'visibility:hidden');
         document.body.appendChild(inputObj);
         inputObj.click();
         inputObj.onchange = this.fileChange
      }
      if (id === 'change-font-num') {
         tool.changeFontNum()
      }
      $('#contentText').remove()
   }
   private fileChange(e: any) {
      let file = e.target.files[0];
      tool.uploadFile(file, true)
   }

}