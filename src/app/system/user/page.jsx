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
  Pagination,
} from "antd";
import {
  EditTwoTone,
  PlusSquareTwoTone,
  DeleteTwoTone,
  SearchOutlined,
  SyncOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import {
  getUserList,
  removeUser,
  getDeptTree,
  getRoleList,
  changeUserStatus,
  getPostList,
} from "./api";
import { Util, IconUtil, permission } from "@/utils";
import AddOrEdit from "./components/addOrEdit";
import DeptTree from "./components/deptTree";
import ResetPwd from "./components/resetPwd";

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
  const [deptList, setDeptList] = useState([]); //部门列表
  const [roleList, setRoleList] = useState([]); //角色列表
  const [postList, setPostList] = useState([]); //岗位列表
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState([]);
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
      title: "用户账号",
      key: "userName",
      dataIndex: "userName",
      align: "center",
    },
    {
      title: "用户昵称",
      key: "nickName",
      dataIndex: "nickName",
      align: "center",
    },
    {
      title: "用户部门",
      key: "dept",
      dataIndex: "dept",
      align: "center",
      render: (text) => {
        return text?.deptName;
      },
    },
    {
      title: "手机号码",
      key: "phonenumber",
      dataIndex: "phonenumber",
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
              hidden={!hasPermission("system:user:edit")}
              onClick={() => {
                setData(record);
                setModalShow(true);
              }}
            >
              修改
            </Button>

            <Popconfirm
              title="系统提醒"
              description={`是否确认删除"${record.menuName}"用户`}
              onConfirm={() => {
                delItem(record);
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                hidden={!hasPermission("system:user:remove")}
                icon={<DeleteTwoTone />}
              >
                删除
              </Button>
            </Popconfirm>
            <Button
              type="link"
              icon={<KeyOutlined />}
              hidden={!hasPermission("system:user:resetPwd")}
              onClick={() => {
                setData(record);
                setResetPwdShow(true);
              }}
            >
              重置密码
            </Button>
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
      setTHeight(Util.initTableHeight(_fNode, [_bNode1, _bNode2], 140)); //操作按钮，分页，padding值40
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
      <ResetPwd
        modalShow={resetPwdShow}
        setModalShow={setResetPwdShow}
        data={data}
        resetPaginationGetList={resetPaginationGetList}
      />
      <AddOrEdit
        modalShow={modalShow}
        setModalShow={setModalShow}
        data={data}
        getList={getList}
        deptList={deptList}
        roleList={roleList}
        postList={postList}
      ></AddOrEdit>
      <Row gutter={24}>
        <Col span={4}>
          <DeptTree
            tHeight={tHeight}
            deptList={deptList}
            queryForm={queryForm}
            resetPaginationGetList={resetPaginationGetList}
          ></DeptTree>
        </Col>
        <Col span={20}>
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
              <Form.Item name={`deptId`} label={`deptId`} hidden={true}>
                <Input />
              </Form.Item>
              <Form.Item name={`userName`} label={`用户名称`}>
                <Input placeholder="请填写用户名称" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item name={`phonenumber`} label={`手机号码`}>
                <Input placeholder="请填写手机号码" style={{ width: 200 }} />
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
                hidden={!hasPermission("system:user:add")}
              >
                新增
              </Button>
            </div>
            <div
              className="middle"
              style={tokenStyle}
            >
              <Table
                rowKey={(record) => record.userId}
                loading={loading}
                columns={columns}
                dataSource={dataList}
                scroll={{ y: tHeight, scrollToFirstRowOnChange: true }}
                onChange={handleTableChange}
                pagination={{ ...pagination, total }}
              />
            </div>
        </Col>
      </Row>
    </div>
  );
  async function delItem(item) {
    const res = await removeUser(item.userId);
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
    const res = await getUserList(temp);
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
    const dept = await getDeptTree();
    if (dept?.code == 200) {
      let { data } = dept;
      let index = 0;
      const mapTree = (org) => {
        const haveChildren =
          Array.isArray(org.children) && org.children.length > 0;
        index++;
        return {
          ...org,
          key: org.id,
          title: org.label,
          children: haveChildren
            ? org.children.map((child) => mapTree(child))
            : null,
        };
      };
      const list = data.map((org) => mapTree(org));
      setDeptList(list);
    }
    const role = await getRoleList();
    if (dept?.code == 200) {
      let { data } = role;
      setRoleList(data);
    }

    const post = await getPostList();
    if (post?.code == 200) {
      let { data } = post;
      setPostList(data);
    }
  }

  async function changeStatus(item, checked) {
    setLoading(true);
    const res = await changeUserStatus({
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
