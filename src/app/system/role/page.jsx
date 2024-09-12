"use client";
import React, { useRef, useState, useEffect } from "react";
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
  Switch,
} from "antd";
import {
  EditTwoTone,
  PlusSquareTwoTone,
  DeleteTwoTone,
  SearchOutlined,
  SyncOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { getRoleList, removeRole, changeRoleStatus, getMenuList } from "./api";
import { Util, IconUtil, permission } from "@/utils";
import AddOrEdit from "./components/addOrEdit";

const { hasPermission } = permission;
const { Option } = Select;

export default function () {
  const { token } = theme.useToken();
  const tokenStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };
  const [loading, setLoading] = useState(false);
  const [_fNode, set_fNode] = useState();
  const [_bNode1, set_bNode1] = useState();
  const [_bNode2, set_bNode2] = useState();
  const [tHeight, setTHeight] = useState(0);
  const [queryForm] = Form.useForm();
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [resetPwdShow, setResetPwdShow] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    hideOnSinglePage: false, //只有一页默认隐藏
    defaultCurrent: 1, //默认当前页
    current: 1, //当前页
    defaultPageSize: 10, //默认每页多少条
    pageSize: 10, //每页多少条
  });
  const columns = [
    {
      title: "角色名称",
      key: "roleName",
      dataIndex: "roleName",
      align: "center",
    },
    {
      title: "权限字符",
      key: "roleKey",
      dataIndex: "roleKey",
      align: "center",
    },
    {
      title: "岗位排序",
      key: "roleSort",
      dataIndex: "roleSort",
      align: "center",
    },
    {
      title: "状态",
      key: "status",
      dataIndex: "status",
      align: "center",
      render: (text, record) => {
        return (
          <Switch
            checked={text == 1 ? false : true}
            onChange={(e) => {
              changeStatus(record, e);
            }}
          ></Switch>
        );
      },
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
              hidden={!hasPermission("system:role:edit")}
              onClick={() => {
                setData(record);
                setModalShow(true);
              }}
            >
              修改
            </Button>

            <Popconfirm
              title="系统提醒"
              description={`是否确认删除"${record.roleName}"岗位`}
              onConfirm={() => {
                delItem(record);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                hidden={!hasPermission("system:role:remove")}
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
    getParameter();
  }, []);

  useEffect(() => {
    if (_fNode && _bNode1 && _bNode2) {
      setTHeight(Util.initTableHeight(_fNode, [_bNode1, _bNode2], 104)); //操作按钮，分页，padding值40
    }
  }, [_fNode, _bNode1, _bNode2]);

  useEffect(() => {
    getList();
  }, [JSON.stringify(pagination)]);

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
        menuData={menuData}
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
              <Form.Item name={`roleName`} label={`角色名称`}>
                <Input placeholder="请填写角色名称" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name={`roleKey`} label={`权限字符`}>
                <Input placeholder="请填写权限字符" style={{ width: 200 }} />
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
                  <Button
                    onClick={getList}
                    type="primary"
                    icon={<SearchOutlined />}
                  >
                    搜索
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
              hidden={!hasPermission("system:role:add")}
            >
              新增
            </Button>
          </div>
          <div
              className="middle"
              style={tokenStyle}
          >
            <Table
              rowKey={(record) => record.roleId}
              loading={loading}
              columns={columns}
              dataSource={dataList}
              scroll={{ y: tHeight, scrollToFirstRowOnChange: true }}
              onChange={handleTableChange}
              pagination={{ ...pagination, total: total }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
  async function delItem(item) {
    const res = await removeRole(item.roleId);
    if (res?.code == 200) {
      message.success(res.msg);
      getList();
    } else {
      message.error(res.msg || "网络错误");
    }
  }

  async function getList() {
    setLoading(true);
    let form = queryForm.getFieldsValue();
    let temp = {
      ...form,
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    const res = await getRoleList(temp);
    setLoading(false);
    if (res?.code == 200) {
      let { rows, total } = res;
      setDataList(rows);
      setTotal(total);
    } else {
      return;
    }
  }

  async function getParameter() {
    const res = await getMenuList();
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
      setMenuData(memuData);
    } else {
      return;
    }
  }

  async function changeStatus(item, checked) {
    setLoading(true);
    const res = await changeRoleStatus({
      ...item,
      status: checked ? "0" : "1",
    });
    setLoading(false);
    if (res?.code == 200) {
      message.success(res.msg);
      getList();
    } else {
      message.error(res.msg);
    }
  }
}
