import React, { useState, useEffect, useImperativeHandle, forwardRef, memo, useRef } from "react";
import { Button, message, Table, Pagination, Descriptions } from "antd";

export default memo(forwardRef(function (props, ref) {

  const nodeRef = useRef();
  const [total, setTotal] = useState(0);
  const [height, setHeight] = useState(0);
  const [fHeight, setFHeight] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nodeRef) {
      let el = nodeRef.current.nativeElement
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
      setHeight(elHeight - 55 - 64 - 12)
      setFHeight(elHeight - 24)
      // 恢复原始样式
      el.style.height = elDFHeight;
    }
  }, [nodeRef])

  useEffect(() => {
    if (props.getListFC) {
      getList();
    }
  }, [props.queryParams])

  useImperativeHandle(ref, () => {
    return {
      search() {
        getList();
      },
      resetSearch() {

      }
    };
  }, []);

  const arrayToTree = (arr) => {
    let map = {}; // 用于存放节点对象的字典
    arr.forEach((item) => {
      item['children'] = []; // 初始化每个节点的子节点列表
      if (!map[item.id]) {
        map[item.id] = item; // 将当前节点新增到字典中
      } else {
        Object.assign(map[item.id], item); // 如果已经有相同ID的节点，则合并属性值
      }
    });
    const roots = []; // 根节点集合
    for (let key in map) {
      const node = map[key];
      if (node.pid === null || !map[node.pid]) {
        roots.push(node); // 没有指定父节点或者父节点不在字典中时，认为该节点为根节点
      } else {
        map[node.pid].children.push(node); // 否则将其作为父节点的子节点
      }
    }
    return roots;
  }

  async function getList() {
    let temp = {};

    if (props.queryParams) {
      temp = { ...temp, ...props.queryParams };
    }
    setLoading(true)
    const res = await props.getListFC(temp);
    if (res?.code == 200) {
      let { code, msg, data, rows } = res;
      setDataList(arrayToTree(data) || rows);
    }
    setLoading(false)

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

  return (
    <>
      <Table
        {...props}
        ref={nodeRef}
        loading={loading}
        bordered={true}
        rowKey={(record) => record[props.rowKey]}
        columns={props.columns}
        dataSource={dataList}
        style={{ height: height ?? 100 }}
        scroll={{ y: height, scrollToFirstRowOnChange: true }}
        pagination={false}
      />
    </>
  );

}))
