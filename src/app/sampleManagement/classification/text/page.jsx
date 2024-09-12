"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Space
} from 'antd';
import {
  FolderFilled,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  updateTag,
  getTagTreeAllText,
  delTag
} from "@/api"
import useContentHeight from '@/component/hooks/useContentHeight';
import AddOrEdit from "./components/addOrEdit"
import Table from './components/table';
import Qs from "querystring";
import { SERVERURL } from "@/config";
import { Util } from '@/utils';

const { RangePicker } = DatePicker;
const { Meta } = Card;
const { Search } = Input;

const updateTreeData = (list, key, children) =>
  list.map((node) => {
    if (node.id === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

export default function () {

  const tRef = useRef();
  const treeRef = useRef();
  const [queryForm] = Form.useForm();
  const { token } = theme.useToken();
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [flatTreeData, setFlatTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [seletcKeys, setSelectKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [queryParams, setQueryParams] = useState(0);
  const [tableSelect, setTableSelect] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [contentHeight, setContentHeight] = useContentHeight(0);
  const columns = [
    {
      title: '目录名称',
      dataIndex: 'tagName',
      key: 'tagName',
    },
    {
      title: '备注',
      dataIndex: 'postscript',
      key: 'soupostscriptrce',
      render: (_) => {
        return _ || "暂无";
      }
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, { fileUrl }) => {
        return (
          <Space>
            <Button type='primary' onClick={() => { setData(_); setModalShow(true) }}>编辑</Button>
            <Popconfirm
              description="确认删除该分类?"
              onConfirm={() => { del(_) }}
              okText="确认"
              cancelText="取消"
            >
              <Button danger >删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12,
  };
  const treeStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12,
  };
  const operationStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    marginTop: 12
  }
  const contentStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    display: "flex",
    flexWrap: "wrap",
    userSelect: "none"
    // marginTop: 12
  }

  useEffect(() => {
    setContentHeight(treeRef)
  }, [])



  const getList = () => {
    setQueryParams({ ...JSON.parse(JSON.stringify(queryForm.getFieldValue())), tagId: queryParams.tagId });
  }

  async function del(_) {
    const res = await delTag({ id: _.id });
    if (res?.code == 200) {
      message.success("删除成功");
      setQueryParams({ ...JSON.parse(JSON.stringify(queryForm.getFieldValue())), tagId: queryParams.tagId });
    } else {
      message.error("删除失败");
      setQueryParams({ ...JSON.parse(JSON.stringify(queryForm.getFieldValue())), tagId: queryParams.tagId });
    }
  }


  return (
    <>
      <AddOrEdit
        modalShow={modalShow}
        setModalShow={setModalShow}
        getList={getList}
        data={data}
      ></AddOrEdit>
      <Row>
        <Col span={24}>
          <div>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              layout="inline"
              form={queryForm}
              style={formStyle}
            >
              <Form.Item label="目录名称" name="fileName">
                <Input  cautocomplete="off" placeholder="目录名称"  allowClear/>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 14,
                  offset: 4,
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setQueryParams({ ...JSON.parse(JSON.stringify(queryForm.getFieldValue())), tagId: queryParams.tagId });
                  }}
                >
                  查询
                </Button>
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  span: 14,
                  offset: 4,
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    queryForm.resetFields();
                    setQueryParams({ tagId: queryParams.tagId });
                    tRef.current.resetSearch();
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div style={operationStyle}>
            <Space>
              <Button
                type="primary"
                onClick={() => { setData({}); setModalShow(true) }}
              >
                新增
              </Button>
            </Space>
          </div>
          <div style={{ contentStyle }}>
            <Table
              ref={tRef}
              rowKey={"id"}
              getListFC={getTagTreeAllText}
              columns={columns}
              queryParams={queryParams}
            ></Table>
          </div>
        </Col>
      </Row>

    </>
  );
};