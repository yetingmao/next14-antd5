import { useEffect, useState } from "react";
import { headerStyle, contentStyle, siderStyle, footerStyle, layoutStyle } from "@/app/layout"

const defultHeight =
  headerStyle.height
  +
  footerStyle.height
  +
  contentStyle.padding*2;

export default function useTableHeight(props) {
  const [tableHeight, setHeight] = useState(props);
  const [moreHeight, setMoreHeight] = useState(0);
  const [bHeight, setBheight] = useState(0);

  useEffect(() => {
    const _f = window.innerHeight;
    setHeight(_f - moreHeight - bHeight - defultHeight)
  }, [moreHeight, bHeight])

  function setTableHeight(e) {
    const { brothers, more } = e
    const _bs = brothers.reduce(function (sum, number) { //sum2 前两个数的和
      console.log(number.current.clientHeight)
      return sum + number.current.clientHeight;
    }, 0)
    setBheight(_bs);
    setMoreHeight(more);
  }

  return [tableHeight, setTableHeight];
}