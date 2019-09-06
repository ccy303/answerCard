import GlobalData from '../global';
import tool from '../../tool/tool';
export default class ContentText {
   constructor() {
   }
   public init() {
      let contentText = $(`<div id="contentText">
         <ul id="firstList">
            <li onselectstart="return false" id="right-addContent">插入文本框</li>
            <li onselectstart="return false" id="right-lineHeight">修改行高</li>
            <li onselectstart="return false" id="right-addGrid">插入方格</li>
            <li onselectstart="return false" id="right-style-change">样式修改</li>
            <li onselectstart="return false" id="insert-img">插入图片</li>
            <li onselectstart="return false" id="clear-style">清除样式</li>
         </ul>
      </div>`)
      let secondList = $(`<div class="secondList">
         <ul id="secondList">
            <li onselectstart="return false" id="blod">加粗</li>
            <li onselectstart="return false" id="under-line">下划线</li>
            <li onselectstart="return false" id="align">对齐方式</li>
         </ul>
      </div>`)
      let threeList = $(`<div class="threeList">
         <ul>
            <li onselectstart="return false" id="left">左对齐</li>
            <li onselectstart="return false" id="center">居中</li>
            <li onselectstart="return false" id="right">右对齐</li>
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
         GlobalData.contentTextTarget.targetObj.addContent();
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
      $('#contentText').remove()
   }

   private fileChange(e: any) {
      let file = e.target.files[0];
      tool.uploadFile(file, true)
   }

}