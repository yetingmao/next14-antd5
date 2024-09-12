import { useEffect, useState } from "react";

//获取ref在当前页面的可用高度
export default function useContentHeight(props) {
  const [contentHeight, setHeight] = useState(props);

  function setContentHeight(nodeRef) {
    if (nodeRef&&nodeRef.current) {
      let el = nodeRef.current.nativeElement||nodeRef.current
      // 保存原始样式 
      const elDFHeight = el.style.height;
      let elHeight = el.style.height.slice(0, -2) * 1;
      let fel = getParentWithStyle(el, "overflow", "auto")

      // 计算内容的总高度
      let totalContentHeight = fel.scrollHeight;

      // 计算元素的可视区域高度
      let viewportHeight = fel.clientHeight;

      while (totalContentHeight <= viewportHeight) {
        el.style.height = elHeight + "px";
        elHeight += 10;
        totalContentHeight = fel.scrollHeight;
        viewportHeight = fel.clientHeight;
      }
      setHeight(elHeight - 42)
      // setFHieght(elHeight - 24)
      // 恢复原始样式
      el.style.height = elDFHeight;
    }
  }

  function getParentWithStyle(el, styleProp, styleData) {
    while (el !== null) {
      const style = window.getComputedStyle(el);
      if (style[styleProp] && style[styleProp] == styleData) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }


  return [contentHeight, setContentHeight];
}