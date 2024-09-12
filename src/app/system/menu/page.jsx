"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Button,
  Input,
  Select,
  Tag,
  Table,
  Form,
  Row,
  Col,
  Space,
  Popconfirm,
  message,
  theme,
} from "antd";
import {
  EditTwoTone,
  PlusSquareTwoTone,
  DeleteTwoTone,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import * as icons from "@ant-design/icons";
import { getMenuList, removeMenu } from "./api";
import { Util, IconUtil, permission } from "@/utils";
import AddOrEdit from "./components/addOrEdit";

const { hasPermission } = permission;
const { createIcon } = IconUtil;
const { Option } = Select;

export default function () {
  const { token } = theme.useToken();
  const tokenStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };
  const [iconList, setIconList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_fNode, set_fNode] = useState();
  const [_bNode1, set_bNode1] = useState();
  const [_bNode2, set_bNode2] = useState();
  const [tHeight, setTHeight] = useState(0);
  const [queryForm] = Form.useForm();
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const columns = [
    {
      title: "菜单名称",
      key: "menuName",
      dataIndex: "menuName",
      align: "center",
    },
    {
      title: "图标",
      key: "icon",
      dataIndex: "icon",
      align: "center",
      width: "100px",
      render: (text) => createIcon(text),
    },
    {
      title: "显示顺序",
      key: "orderNum",
      dataIndex: "orderNum",
      align: "center",
      width: "100px",
    },
    {
      title: "权限标识",
      key: "perms",
      dataIndex: "perms",
      align: "center",
    },
    {
      title: "路由地址",
      key: "path",
      dataIndex: "path",
      align: "center",
    },
    {
      title: "组件路径",
      key: "component",
      dataIndex: "component",
      align: "center",
    },
    {
      title: "菜单类型",
      key: "menuType",
      dataIndex: "menuType",
      align: "center",
      width: "100px",
      render: (text) =>
        text == "M" ? "目录" : text == "C" ? "菜单" : text == "F" ? "按钮" : "",
    },
    {
      title: "菜单状态",
      key: "status",
      dataIndex: "status",
      align: "center",
      width: "100px",
      render: (text) =>
        text ? <Tag color="success">正常</Tag> : <Tag>停用</Tag>,
    },
    {
      title: "创建时间",
      key: "createTime",
      dataIndex: "createTime",
      align: "center",
    },
    {
      title: "操作",
      key: "option",
      dataIndex: "option",
      align: "center",
      width: "300px",
      render: (_, record) => {
        return (
          <>
            <Button
              type="link"
              icon={<EditTwoTone />}
              hidden={!hasPermission("system:menu:edit")}
              onClick={() => {
                setData(record);
                setModalShow(true);
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              icon={<PlusSquareTwoTone />}
              hidden={!hasPermission("system:menu:add")}
              onClick={() => {
                setData({ parentId: record.menuId });
                setModalShow(true);
              }}
            >
              新增
            </Button>
            <Popconfirm
              title="系统提醒"
              description={`是否确认删除名称为"${record.menuName}"的数据项？`}
              onConfirm={() => {
                delItem(record);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                hidden={!hasPermission("system:menu:remove")}
                icon={<DeleteTwoTone />}
              >
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const iconList = Object.keys(icons).filter(
      (item) => typeof icons[item] === "object"
    );
    setIconList(iconList);
    getList();
  }, []);

  useEffect(() => {
    if (_fNode && _bNode1 && _bNode2) {
      setTHeight(Util.initTableHeight(_fNode, [_bNode1, _bNode2], 104)); //操作按钮，分页，padding值40
    }
  }, [_fNode, _bNode1, _bNode2]);

  const resetQuery = () => {
    queryForm.resetFields();
    getList();
  };

  return (
    <div
      className="content"
      style={{ height: "100%" }}
      ref={(node) => {
        set_fNode(node);
      }}
    >
      <AddOrEdit
        modalShow={modalShow}
        setModalShow={setModalShow}
        data={data}
        getList={getList}
        treeData={treeData}
        iconList={iconList}
      ></AddOrEdit>
      <Row>
        <Col span={24}>
          <div
            className="top"
            ref={(node) => {
              set_bNode1(node);
            }}
          >
            <Form
              layout="inline"
              style={{ ...tokenStyle, padding: "10px" }}
              form={queryForm}
              name="querySearch"
            >
              <Form.Item name={`menuName`} label={`名称`}>
                <Input placeholder="请填写名称" style={{ width: 200 }} />
              </Form.Item>

              <Form.Item name={`status`} label={`状态`}>
                <Select placeholder="请选择状态" style={{ width: 200 }}>
                  <Option value="0" label="正常">
                    正常
                  </Option>
                  <Option value="1" label="停用">
                    停用
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item label={` `} colon={false}>
                <Space>
                  <Button onClick={getList} type="primary">
                    查询
                  </Button>
                  <Button
                    onClick={resetQuery}
                    htmlType="reset"
                    icon={<SyncOutlined />}
                  >
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
            <Button
              type="primary"
              onClick={() => {
                setData({});
                setModalShow(true);
              }}
              hidden={!hasPermission("system:menu:add")}
            >
              新增
            </Button>
          </div>
          <div className="middle" style={tokenStyle}>
            <Table
              loading={loading}
              columns={columns}
              dataSource={dataList}
              scroll={{ y: tHeight, scrollToFirstRowOnChange: true }}
              pagination={false}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
  async function delItem(item) {
    const res = await removeMenu(item.menuId);
    if (res?.code == 200) {
      message.success(res.msg);
      getList();
    } else {
      message.error(res.msg || "网络错误");
    }
  }

  async function getList(query) {
    setLoading(true);
    const res = await getMenuList(query);
    if (res?.code == 200) {
      let { data } = res;
      const menu = {
        id: 0,
        label: "主类目",
        children: [],
        value: 0,
        menuName: "主类目",
      };
      const memuData = Util.buildTreeData(
        data,
        "menuId",
        "menuName",
        "",
        "",
        ""
      );
      menu.children = memuData;
      const treeData = [];
      treeData.push(menu);
      setDataList(memuData);
      setTreeData(treeData);
      setLoading(false);
    } else {
      return;
    }
  }
}
