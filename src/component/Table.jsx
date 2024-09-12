import React, { useState, useEffect, useImperativeHandle, forwardRef, memo, useRef } from "react";
import { Button, message, Table, Pagination, Descriptions } from "antd";

export default memo(forwardRef(function (props, ref) {

  const nodeRef = useRef();
  const [total, setTotal] = useState(0);
  const [height, setHeight] = useState(0);
  const [fHeight, setFHeight] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [pagination, setPagination] = useState({
    hideOnSinglePage: false, //只有一页默认隐藏
    defaultCurrent: 1, //默认当前页
    current: 1, //当前页
    defaultPageSize: 10, //默认每页多少条
    pageSize: 10, //每页多少条
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nodeRef) {
      let el = nodeRef.current.nativeElement
      console.log("------el",el)
      // 保存原始样式 
      const elDFHeight = el.style.height;
      let elHeight = el.style.height.slice(0, -2) * 1;
      let fel = getParentWithStyle(el, "overflow", "auto")

      // 计算内容的总高度
      let totalContentHeight = fel.scrollHeight;

      // 计算元素的可视区域高度
      let viewportHeight = fel.clientHeight;
      console.log("------totalContentHeight",totalContentHeight)
      console.log("------viewportHeight",viewportHeight)
      while (totalContentHeight <= viewportHeight) {
        el.style.height = elHeight + "px";
        elHeight += 10;
        totalContentHeight = fel.scrollHeight;
        viewportHeight = fel.clientHeight;
      }
      console.log("------",elHeight)
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
  }, [JSON.stringify(pagination), props.queryParams])

  //暴漏给父组件的方法
  useImperativeHandle(ref, () => {
    return {
      search() {
        getList();
      },
      resetSearch() {
        setPagination({
          hideOnSinglePage: false, //只有一页默认隐藏
          defaultCurrent: 1, //默认当前页
          current: 1, //当前页
          defaultPageSize: 10, //默认每页多少条
          pageSize: 10, //每页多少条
        })
      }
    };
  }, []);

  //分页、排序、筛选变化时触发
  const handleTableChange = (pagination, filters, sorter) => {
    props.setTableSelect([]);
    setPagination(pagination)
  }

  async function getList() {
    let temp = { pageSize: pagination.pageSize, pageNum: pagination.current };

    if (props.queryParams) {
      temp = { ...temp, ...props.queryParams };
    }
    setLoading(true)
    const res = await props.getListFC(temp);
    if (res?.code == 200) {
      let { code, msg, data, total, rows } = res;
      setTotal(total);
      setDataList(data || rows);
    }
    props.setTableSelect([]);
    setLoading(false)

  }

  //获取父组件是否有指定样式
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
        // loading={loading}
        bordered={true}
        rowKey={(record) => record[props.rowKey]}
        columns={props.columns}
        dataSource={dataList}
        pagination={{ ...pagination, ...props.pagination, total }}
        onChange={handleTableChange}
        style={{ height: height ?? 1000 }}
        scroll={{ y: height, scrollToFirstRowOnChange: true }}
        rowSelection={
          props.rowSelection ?
            {
              ...props.rowSelection
            }
            :
            false
        }
      />
    </>
  );

}))
