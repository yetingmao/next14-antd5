"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  theme,
  Popconfirm,
  message,
  Row,
  Col,
  Tree,
  DatePicker,
  Card,
  Table,
  Space,
} from "antd";
import { FolderFilled, DownloadOutlined } from "@ant-design/icons";
import { getTaskList, delRecycleBinList, restoreRecycleBinList } from "../api";
import useContentHeight from "@/component/hooks/useContentHeight";
import AddOrEdit from "./components/addOrEdit";
import { Util } from "@/utils";
import _ from "lodash";
const { RangePicker } = DatePicker;

export default function () {
  const { token } = theme.useToken();
  const tokenStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };
  const [_fNode, set_fNode] = useState();
  const [_bNode1, set_bNode1] = useState();
  const [_bNode2, set_bNode2] = useState();
  const [tHeight, setTHeight] = useState(0);
  useEffect(() => {
    if (_fNode && _bNode1 && _bNode2) {
      setTHeight(Util.initTableHeight(_fNode, [_bNode1, _bNode2], 137)); //操作按钮，分页，padding值40
    }
  }, [_fNode, _bNode1, _bNode2]);
  const [pagination, setPagination] = useState({
    hideOnSinglePage: false, //只有一页默认隐藏
    defaultCurrent: 1, //默认当前页
    current: 1, //当前页
    defaultPageSize: 10, //默认每页多少条
    pageSize: 10, //每页多少条
  });
  const tRef = useRef();
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState(0);
  const [tableSelect, setTableSelect] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const columns = [
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "来源",
      dataIndex: "fileType",
      key: "fileType",
      render: (_) => {
        return _ ? "临时库" : "样本库";
      },
    },
    {
      title: "删除时间",
      dataIndex: "deleteTime",
      key: "deleteTime",
    },
    {
      title: "清理时间",
      dataIndex: "cleaningTime",
      key: "cleaningTime",
    },
    {
      title: "操作",
      key: "action",
      render: (_, { fileUrl }) => {
        return (
          <Button
            onClick={() => {
              Util.download(fileUrl, _.fileName);
            }}
          >
            下载
          </Button>
        );
      },
    },
  ];
  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12,
  };
  const operationStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    marginTop: 12,
  };
  const contentStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    display: "flex",
    flexWrap: "wrap",
    userSelect: "none",
    // marginTop: 12
  };

  useMemo(() => {
    if (pagination.current) {
      getList();
    }
  }, [pagination.current]);

  //分页、排序、筛选变化时触发
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

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
  return (
    <div
      className="content"
      style={{ height: "calc(100% - 46px)" }}
      ref={(node) => {
        set_fNode(node);
      }}
    >
      <AddOrEdit modalShow={modalShow} setModalShow={setModalShow}></AddOrEdit>
      <Row>
        <Col span={24}>
          <div
            className="top"
            ref={(node) => {
              set_bNode1(node);
            }}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              layout="inline"
              form={queryForm}
              style={{ ...tokenStyle, padding: "10px" }}
            >
              <Form.Item label="名称" name="fileName">
                <Input  cautocomplete="off" style={{ width: "200px" }} placeholder="名称" />
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
          <div
            className="action"
            ref={(node) => {
              set_bNode2(node);
            }}
            style={tokenStyle}
          >
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
                disabled={!tableSelect.length}
                onClick={restore}
              >
                还原
              </Button>
              <Button danger disabled={!tableSelect.length} onClick={del}>
                删除
              </Button>
            </Space>
          </div>
          <div style={{ ...contentStyle }}>
            <Table
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={dataList}
              pagination={pagination}
              scroll={{ y: tHeight, scrollToFirstRowOnChange: true }}
              onChange={handleTableChange}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
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
        type: "1",
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      },
      _.identity
    );
    const { rows, total, code } = await getTaskList(temp);
    //  setLoading(false);
    if (code == 200) {
      setDataList(rows);
      setPagination({ ...pagination, total: total });
    } else {
    }
  }
  async function del() {
    const ids = tableSelect.map((e) => e.id);
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
    const ids = tableSelect.map((e) => e.id);
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
}
