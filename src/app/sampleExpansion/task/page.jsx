"use client";
import React, { useRef, useState, useEffect, useForm, useMemo } from "react";
import {
  Button,
  message,
  theme,
  Input,
  Row,
  Col,
  Popconfirm,
  Select,
  Tag,
  Form,
  TreeSelect,
  Table,
  Space,
  DatePicker,
  Progress,
} from "antd";
import { Util } from "@/utils";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import {
  getModelList,
  getCategoryList,
  getTagTreeAll,
  getTaskList,
  delTask,
  taskAction,
} from "./api.js";
import "dayjs/locale/zh-cn";
import _ from "lodash";
import AddOrEdit from "./addOrEdit";
let utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
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

  const router = useRouter();
  //首页初次加载，只根据分页去更新列表
  const [pagination, setPagination] = useState({
    hideOnSinglePage: false, //只有一页默认隐藏
    defaultCurrent: 1, //默认当前页
    current: 1, //当前页
    defaultPageSize: 10, //默认每页多少条
    pageSize: 10, //每页多少条
  });
  const [modelShow, setModelShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryForm] = Form.useForm();
  const [categoryList, setCategoryList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [data, setData] = useState({});
  const [treeData, setTreeData] = useState([]);
  const [modelList, setModelList] = useState([]);
  useEffect(() => {
    getParameter();
  }, []);
  useMemo(() => {
    if (pagination.current) {
      getList();
    }
  }, [pagination.current]);

  const columns = [
    {
      title: "任务编号",
      width: 150,
      key: "id",
      dataIndex: "id",
      align: "center",
      fixed: "left",
    },
    {
      title: "任务名称",
      key: "taskName",
      dataIndex: "taskName",
      align: "center",
      width: 200,
      fixed: "left",
    },
    {
      title: "扩充模型",
      key: "modelName",
      dataIndex: "modelName",
      align: "center",
      width: 200,
      render: (text, _) => text.map((item, i) => <Tag key={i}>{item}</Tag>),
    },
    {
      title: "扩充方式",
      key: "executionMethodResult",
      dataIndex: "executionMethodResult",
      align: "center",
      width: 200,
    },
    {
      title: "状态",
      key: "statusResult",
      dataIndex: "statusResult",
      align: "center",
      width: 100,
      render: (text, _) => <Tag color="processing">{text}</Tag>,
    },
    {
      title: "任务进度",
      key: "taskProgress",
      dataIndex: "taskProgress",
      align: "center",
      width: 150,
      render: (text, _) => <Progress percent={text} size="small" />,
    },
    {
      title: "扩充路径",
      key: "tagResults",
      dataIndex: "tagResults",
      align: "center",
      width: 400,
      render: (text, _) =>
        text.map((item, i) => (
          <Tag key={i} color="success">
            {item}
          </Tag>
        )),
    },
    {
      title: "是否提交审核",
      key: "isPassedResult",
      dataIndex: "isPassedResult",
      align: "center",
      width: 150,
    },
    {
      title: "创建时间",
      key: "creatTime",
      dataIndex: "creatTime",
      align: "center",
      width: 150,
    },
    {
      title: "创建人",
      key: "creatUser",
      dataIndex: "creatUser",
      align: "center",
      width: 100,
    },
    {
      title: "开始扩充时间",
      key: "startTime",
      dataIndex: "startTime",
      align: "center",
      width: 150,
    },
    {
      title: "结束扩充时间",
      key: "endTime",
      dataIndex: "endTime",
      align: "center",
      width: 150,
    },
    {
      title: "操作",
      key: "status",
      dataIndex: "status",
      align: "center",
      width: "280px",
      fixed: "right",
      className: "table_operate",
      render: (text, record) => {
        const start = (
          <Button
            type="link"
            onClick={() => {
              action({ id: record["id"], status: 3 });
            }}
          >
            开始
          </Button>
        );
        const details = (
          <Button
            type="link"
            onClick={() => {
              router.push(`/sampleExpansion/taskDetails?id=${record["id"]}`);
            }}
          >
            详情
          </Button>
        );
        const edit = (
          <Button
            type="link"
            onClick={() => {
              setModelShow(true);
              setData(record);
            }}
          >
            编辑
          </Button>
        );
        const pause = (
          <Button
            type="link"
            onClick={() => {
              action({ id: record["id"], status: 2 });
            }}
          >
            暂停
          </Button>
        );
        const keep = (
          <Button
            type="link"
            onClick={() => {
              action({ id: record["id"], status: 3 });
            }}
          >
            继续
          </Button>
        );
        const end = (
          <Button
            type="link"
            onClick={() => {
              action({ id: record["id"], status: 5 });
            }}
          >
            结束
          </Button>
        );
        const dele = (
          <Popconfirm
            description="确定要删除这条记录吗?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              del(record["id"]);
            }}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        );
        const push = (
          <Button
            type="link"
            onClick={() => {
              //
            }}
          >
            提交审核
          </Button>
        );
        let ele;
        if (text == 1) {
          ele = (
            <Space>
              {start}
              {edit}
              {dele}
            </Space>
          );
        } else if (text == 3) {
          ele = (
            <Space>
              {pause}
              {end}
            </Space>
          );
        } else if (text == 4) {
          ele = (
            <Space>
              {details}
              {dele}
            </Space>
          );
        } else if (text == 8 || text == 7) {
          ele = (
            <Space>
              {details}
              {dele}
            </Space>
          );
        } else if (text == 2) {
          ele = (
            <Space>
              {keep}
              {end}
              {edit}
              {dele}
            </Space>
          );
        } else if (text == 5) {
          ele = <Space>{dele}</Space>;
        }
        return ele;
      },
    },
  ];

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
  const arrayToTree = (arr) => {
    let map = {}; // 用于存放节点对象的字典
    arr.forEach((item) => {
      item["children"] = []; // 初始化每个节点的子节点列表
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
  };

  return (
    <div
      className="content"
      style={{ height: "calc(100% - 46px)" }}
      ref={(node) => {
        set_fNode(node);
      }}
    >
      <AddOrEdit
        modelShow={modelShow}
        setModelShow={setModelShow}
        data={data}
        getList={getList}
        //  categoryList={categoryList}
        treeData={treeData}
        modelList={modelList}
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
              form={queryForm}
              style={{ ...tokenStyle, padding: "10px" }}
              name="querySearch"
            >
              <Form.Item name={`taskName`} label={`任务名称`}>
                <Input
                  cautocomplete="off"
                  placeholder="任务名称"
                  style={{ width: 200 }}
                />
              </Form.Item>
              <Form.Item label="状态" name={`status`}>
                <Select
                  style={{ width: 200 }}
                  options={[
                    {
                      value: "",
                      label: "全部",
                    },
                    {
                      value: "1",
                      label: "未开始",
                    },
                    {
                      value: "2",
                      label: "暂停",
                    },
                    {
                      value: "3",
                      label: "运行中",
                    },
                    {
                      value: "4",
                      label: "已完成",
                    },
                    {
                      value: "5",
                      label: "结束",
                    },

                    // {
                    //     value: '6',
                    //     label: '未审核',
                    // },
                    {
                      value: "7",
                      label: "审核完成",
                    },
                    {
                      value: "8",
                      label: "审核中",
                    },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item label="扩充方式" name={`executionMethod`}>
                <Select
                  style={{ width: 200 }}
                  options={[
                    {
                      value: "",
                      label: "全部",
                    },
                    {
                      value: "1",
                      label: "依次扩充",
                    },
                    {
                      value: "2",
                      label: "叠加扩充",
                    },
                  ]}
                ></Select>
              </Form.Item>
              {/* <Form.Item label="扩充类别" name="modelCategoryId">
                <Select
                  mode="multiple"
                  allowClear
                  options={[
                    {
                      value: "",
                      label: "全部",
                    },
                    ...categoryList,
                  ]}
                  style={{ width: 200 }}
                >
                  {" "}
                </Select>
              </Form.Item> */}
              <Form.Item label="扩充路径" name={`tagId`}>
                <TreeSelect
                  // multiple
                  treeDataSimpleMode
                  style={{
                    width: "300px",
                  }}
                  dropdownStyle={{
                    maxHeight: 400,
                    overflow: "auto",
                  }}
                  placeholder="标签"
                  treeData={treeData}
                  fieldNames={{
                    key: "id",
                    label: "tagName",
                    value: "id",
                  }}
                />
              </Form.Item>
              <Form.Item label="是否提交审核" name={`isPassed`}>
                <Select
                  style={{ width: 200 }}
                  options={[
                    {
                      value: "",
                      label: "全部",
                    },
                    {
                      value: "2",
                      label: "是",
                    },
                    {
                      value: "1",
                      label: "否",
                    },
                  ]}
                ></Select>
              </Form.Item>
              <Form.Item label="创建时间" name={`time`}>
                <RangePicker showTime />
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
                  <Button onClick={getList} type="primary">
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
                  setData({});
                  setModelShow(true);
                }}
              >
                新增
              </Button>
            </Space>
          </div>
          <div className="middle" style={tokenStyle}>
            <Table
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={dataList}
              pagination={pagination}
              scroll={{ y: tHeight, scrollToFirstRowOnChange: true, x: 1500 }}
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
    const temp = _.pickBy(
      {
        ...values,
        startTime,
        endTime,
        taskType: "3",
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
  async function getParameter() {
    // const { data, code } = await getCategoryList();
    // if (code == 200) {
    //   let temp = data.map((item) => {
    //     return {
    //       value: item.pkId,
    //       label: item.categoryName,
    //     };
    //   });
    //   setCategoryList(temp);
    // } else {
    // }
    let res = await getTagTreeAll({ type: 0 });
    if (res?.code == 200) {
      setTreeData(arrayToTree(res.data));
    }
    res = await getModelList({ modelType: 3, pageNum: 1, pageSize: 100 });
    if (res?.code == 200) {
      setModelList(res.rows);
    }
  }
  async function del(id) {
    const { code, msg, data } = await delTask(id);
    if (code == 200) {
      message.success(msg);
      getList();
    } else {
      message.error(msg);
    }
  }
  async function action(info) {
    const { code, msg } = await taskAction(info);
    if (code == 200) {
      message.success(msg);
      getList();
    } else {
      message.error(msg);
    }
  }
  function collectNames(data) {
    let paths = [];

    function traverse(obj, parentPath = []) {
      if (typeof obj === "object" && obj !== null) {
        if ("name" in obj) {
          // 当前对象有name属性，新增到路径中
          let currentPath = [...parentPath, obj.name];

          if (
            "children" in obj &&
            Array.isArray(obj.children) &&
            obj.children.length
          ) {
            // 如果当前对象有children属性且是一个数组，递归遍历children
            obj.children.forEach((child) => {
              traverse(child, currentPath);
            });
          } else {
            // 如果当前对象没有children属性或children不是一个数组，说明到达叶节点
            // 将当前路径转换成字符串并新增到结果数组中
            paths.push(currentPath.join("/"));
          }
        }
      } else if (Array.isArray(obj)) {
        // 如果当前层级是数组，遍历数组中的每个元素
        obj.forEach((item) => {
          traverse(item, parentPath);
        });
      }
    }

    // 开始遍历数据
    data.forEach((item) => {
      traverse(item);
    });

    return paths;
  }
}
