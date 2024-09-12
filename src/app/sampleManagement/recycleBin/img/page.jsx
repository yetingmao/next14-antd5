"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  theme,
  Popconfirm,
  Select,
  Spin,
  message,
  Row,
  Col,
  Tree,
  DatePicker,
  Card,
  Image,
  Checkbox,
  Pagination,
  Space,
} from "antd";
import { FolderFilled, DownloadOutlined } from "@ant-design/icons";
import { getTaskList, delRecycleBinList, restoreRecycleBinList } from "../api";
import useContentHeight from "@/component/hooks/useContentHeight";
import AddOrEdit from "./components/addOrEdit";
import _ from "lodash";
const { RangePicker } = DatePicker;
const { Meta } = Card;
const { Search } = Input;

export default function () {
  const contentRef = useRef();
  const [queryForm] = Form.useForm();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [queryParams, setQueryParams] = useState(0);
  const [checkedList, setCheckedList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [contentHeight, setContentHeight] = useContentHeight(0);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    showSizeChanger: true,
    showQuickJumper: true,
    hideOnSinglePage: false, //只有一页默认隐藏
    defaultCurrent: 1, //默认当前页
    current: 1, //当前页
    defaultPageSize: 50, //默认每页多少条
    pageSize: 10, //每页多少条
    onChange: (page, pageSize) => {
      //回调函数
      const temp = { ...pagination, pageSize, current: page };
      setPagination(temp);
    },
  });

  const tokenStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };
  const contentStyle = {
    ...tokenStyle,
    maxWidth: "none",
    padding: "0 12px",
    display: "flex",
    flexWrap: "wrap",
    userSelect: "none",
    // marginTop: 12
  };

  useEffect(() => {
    setContentHeight(contentRef);
  }, []);

  useEffect(() => {
    getList();
  }, [queryParams, JSON.stringify(pagination)]);

  //分页、排序、筛选变化时触发

  const resetPaginationGetList = () => {
    if (pagination.pageSize == 10 && pagination.current == 1) {
      getList();
    } else {
      setPagination({ ...pagination, pageSize: 10, current: 1 });
    }
  };

  const resetQuery = () => {
    queryForm.resetFields();
    resetPaginationGetList();
  };
  const onChangeCheckbox = (e) => {
    setCheckedList(e);
  };

  async function getList() {
    const values = queryForm.getFieldsValue();
    let startTime;
    let endTime;
    if (values.time) {
      startTime = dayjs(values.time[0]).format("YYYY-MM-DD HH:mm:ss");
      endTime = dayjs(values.time[1]).format("YYYY-MM-DD HH:mm:ss");
    }
    let cleaningStartTime;
    let cleaningEndTime;
    if (values.cleantime) {
      cleaningStartTime = dayjs(values.cleantime[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      cleaningEndTime = dayjs(values.cleantime[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    }
    const temp = _.pickBy(
      {
        ...values,
        cleaningStartTime,
        cleaningEndTime,
        startTime,
        endTime,
        type: "0",
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      },
      _.identity
    );
    setCheckedList([]);
    const { rows, total, code } = await getTaskList(temp);
    //  setLoading(false);
    if (code == 200) {
      setDataList(rows);
      setPagination({ ...pagination, total: total });
    } else {
    }
  }

  async function del() {
    const ids = checkedList;
    const res = await delRecycleBinList({ fileIds: ids });
    if (res?.code == 200) {
      message.success("删除成功");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
      });
    } else {
      message.error("删除失败");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
      });
    }
  }

  async function restore() {
    const ids = checkedList;
    const res = await restoreRecycleBinList({ fileIds: ids });
    if (res?.code == 200) {
      message.success("还原成功");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
      });
    } else {
      message.error("还原失败");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
      });
    }
  }

  return (
    <div   className="content"
    style={{ height: "calc(100% - 46px)" }}>
      <AddOrEdit modalShow={modalShow} setModalShow={setModalShow}></AddOrEdit>
      <Row>
        <Col span={24}>
          <div   className="top">
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              layout="inline"
              form={queryForm}
              style={{ ...tokenStyle, padding: "10px" }}
            >
              <Form.Item label="名称" name="fileName">
                <Input  cautocomplete="off" placeholder="名称" />
              </Form.Item>
              <Form.Item label="入库时间" name="time">
                <RangePicker />
              </Form.Item>
              <Form.Item label="定时清理时间" name="cleantime">
                <RangePicker />
              </Form.Item>
              <Form.Item
                label={` `}
                colon={false}
                wrapperCol={{
                  span: 14,
                  offset: 4,
                }}
              >
                <Space>
                  <Button
                    onClick={() => {
                      getList();
                    }}
                    type="primary"
                  >
                    查询
                  </Button>
                  <Button onClick={resetQuery} htmlType="reset">
                    重置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
          <div style={tokenStyle}>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setModalShow(true);
                }}
              >
                设置清理时间
              </Button>
              <Button
                type="primary"
                disabled={!checkedList.length}
                onClick={restore}
              >
                还原
              </Button>
              <Button danger disabled={!checkedList.length} onClick={del}>
                删除
              </Button>
            </Space>
          </div>
          <Spin spinning={loading} ref={contentRef}>
            <div
              style={{
                ...contentStyle,
                height: contentHeight - 130,
                overflow: "auto",
              }}
            >
              <Checkbox.Group onChange={onChangeCheckbox} value={checkedList}>
                {dataList.map((item, index) => (
                  <Card
                    key={item.id}
                    size="small"
                    hoverable={true}
                    title={<Checkbox value={item.id}></Checkbox>}
                    extra={
                      <Button
                        type="link"
                        icon={
                          <DownloadOutlined
                            onClick={() => {
                              let imgsrc = item.fileUrl;
                              let x = new XMLHttpRequest();
                              x.open("GET", imgsrc, true);
                              x.responseType = "blob";
                              x.onload = function () {
                                let url = window.URL.createObjectURL(
                                  x.response
                                );
                                let a = document.createElement("a");
                                a.href = url;
                                a.download = item.fileName || "filename.jpg";
                                a.click();
                              };
                              x.send();
                            }}
                          />
                        }
                      ></Button>
                    }
                    cover={
                      <Image
                        key={item.id}
                        width={200}
                        height={200}
                        src={item.fileUrl}
                      />
                    }
                    style={{ width: 200, margin: 5, height: 250 }}
                  ></Card>
                ))}
              </Checkbox.Group>
              <Pagination
                {...pagination}
                total={total}
                style={{ width: "100%", textAlign: "right" }}
              />
            </div>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}
