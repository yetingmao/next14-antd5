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
import {
  getTemporaryListImg,
  getTagTree,
  delTemporaryList,
  importAsset,
} from "@/api";
import AddOrEdit from "./components/addOrEdit";
import useContentHeight from "@/component/hooks/useContentHeight";
import Qs from "querystring";
import { SERVERURL } from "@/config";
import { Util } from "@/utils";

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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [dataList, setDataList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [flatTreeData, setFlatTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [seletcKeys, setSelectKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [queryParams, setQueryParams] = useState(0);
  const [checkedList, setCheckedList] = useState([]);
  const [contentHeight, setContentHeight] = useContentHeight(0);
  const [modalShow, setModalShow] = useState(false);
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
  const columns = [
    {
      title: "姓名",
      dataIndex: "fileName",
      key: "fileName",
    },
    {
      title: "接入方式",
      dataIndex: "deptName",
      key: "deptName",
    },
    {
      title: "入库时间",
      dataIndex: "createTime",
      key: "createTime",
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
  const treeStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12,
    overflow: "auto",
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
    padding: "0 12px",
    display: "flex",
    flexWrap: "wrap",
    userSelect: "none",
    // marginTop: 12
  };

  useEffect(() => {
    setContentHeight(treeRef);
    getDefaultTree();
  }, []);

  useEffect(() => {
    if (queryParams.tagId) {
      getList();
    }
  }, [queryParams, JSON.stringify(pagination)]);
  useEffect(() => {
    resetPagination();
  }, [queryParams.tagId]);

  const resetPagination = () => {
    setPagination({
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
  };

  const changeTreeSelect = (selectedKeys, e) => {
    setSelectKeys(selectedKeys);
    // setQueryParams({ ...queryParams, tagId: selectedKeys.length ? selectedKeys[0] : "" })
    if (!e.node.childrenIds.length) {
      //最后一级
      getLastData(e.node);
    } else if (e.node.children) {
      setQueryParams({ ...queryParams, tagId: "" });
      setDataList(e.node.children);
    } else {
      onExpand([...expandedKeys, e.node.id]);
      setQueryParams({ ...queryParams, tagId: "" });
    }
  };

  const onChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = flatTreeData
      .map((item) => {
        if (item.tagName.indexOf(value) > -1) {
          return item.pid;
        }
        return null;
      })
      .filter((item, i, self) => !!(item && self.indexOf(item) === i));
    flatTreeData.map((item, index) => {
      if (newExpandedKeys.includes(item.id)) {
        newExpandedKeys.push(item.pid);
      }
    });
    setExpandedKeys(value ? newExpandedKeys : []);
    setSearchValue(value);
  };

  const showTreeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.tagName + `(${item.temporaryCount})`;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            ...item,
            title,
            id: item.id,
            children: loop(item.children),
            isLeaf: !item.childrenIds.length,
          };
        }
        return {
          ...item,
          title,
          id: item.id,
          isLeaf: !item.childrenIds.length,
        };
      });
    return loop(treeData);
  }, [searchValue, treeData]);

  const onLoadData = ({ key, children }) => {
    return new Promise((resolve) => {
      if (children?.length) {
        resolve();
        return;
      }
      setLoading(true);
      getTagTree({ tagId: key }).then((res) => {
        setLoading(false);
        if (res?.code == 200) {
          setDataList(res.data);
          setFlatTreeData((origin) => {
            return [...origin, ...res.data];
          });
          setTreeData((origin) => {
            return updateTreeData(origin, key, res.data);
          });
          resolve();
        }
      });
    });
  };

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
  };

  const doubleClickFolder = (e) => {
    setSelectKeys([e.id]);
    if (e.children) {
      setDataList(e.children);
      setQueryParams({ ...queryParams, tagId: "" });
    } else if (e?.childrenIds?.length) {
      onExpand([...expandedKeys, e.id]);
      setQueryParams({ ...queryParams, tagId: "" });
    } else {
      getLastData(e);
    }
  };

  const onChangeCheckbox = (e) => {
    setCheckedList(e);
  };

  const exportData = () => {
    if (!checkedList.length) {
      message.error("未选择");
      return;
    }
    let url = SERVERURL;
    url += "/collections/taskGather/export";
    url += `?${Qs.stringify({ ids: checkedList })}`;
    Util.download(url);
  };

  async function getDefaultTree() {
    const res = await getTagTree({ tagId: 1764 });
    if (res?.code == 200) {
      setDataList(res.data);
      setFlatTreeData(res.data);
      setTreeData(res.data);
    }
  }

  async function getLastData(e) {
    setQueryParams({ ...queryParams, tagId: e.id });
  }

  async function getList() {
    setLoading(true);
    const res = await getTemporaryListImg({
      ...queryParams,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });
    setCheckedList([]);
    setLoading(false);
    if (res?.code == 200) {
      setDataList(res.rows);
      setTotal(res.total);
    }
  }

  async function del() {
    const ids = checkedList;
    const res = await delTemporaryList({ taskGatherIds: ids });
    if (res?.code == 200) {
      message.success("删除成功");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
        tagId: queryParams.tagId,
      });
    } else {
      message.error("删除失败");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
        tagId: queryParams.tagId,
      });
    }
  }

  async function importAssetFC() {
    const ids = checkedList;
    const res = await importAsset({ ids });
    if (res?.code == 200) {
      message.success("成功");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
        tagId: queryParams.tagId,
      });
    } else {
      message.error("失败");
      setQueryParams({
        ...JSON.parse(JSON.stringify(queryForm.getFieldValue())),
        tagId: queryParams.tagId,
      });
    }
  }

  return (
    <>
      <AddOrEdit
        modalShow={modalShow}
        setModalShow={setModalShow}
        getList={getList}
      ></AddOrEdit>
      <Row>
        <Col span={4} style={treeStyle} ref={treeRef}>
          <Search
            style={{
              marginBottom: 8,
            }}
            placeholder="目录名称"
            onChange={onChange}
          />
          <Tree
            style={{ height: contentHeight - 100, overflow: "auto" }}
            loadData={onLoadData}
            treeData={showTreeData}
            selectedKeys={seletcKeys}
            expandedKeys={expandedKeys}
            onExpand={onExpand}
            onSelect={changeTreeSelect}
            fieldNames={{
              key: "id",
              title: "title",
            }}
          />
        </Col>
        <Col span={20}>
          <div>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              layout="inline"
              form={queryForm}
              style={formStyle}
            >
              {/* {
                <Form.Item label="文件夹名称" name="tagName">
                  <Input  cautocomplete="off" placeholder="文件夹名称" />
                </Form.Item>
              } */}
              <Form.Item label="名称" name="userName">
                <Input  cautocomplete="off" placeholder="名称" />
              </Form.Item>
              <Form.Item label="入库时间" name="time">
                <RangePicker showTime  />
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
                    resetPagination();
                    setQueryParams({
                      ...queryForm.getFieldValue(),
                      tagId: queryParams.tagId,
                    });
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
                    resetPagination();
                    setQueryParams({ tagId: queryParams.tagId });
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
                onClick={() => {
                  setModalShow(true);
                }}
              >
                本地导入
              </Button>
              <Button
                type="primary"
                disabled={!(checkedList.length && queryParams.tagId)}
                onClick={importAssetFC}
              >
                导入样本库
              </Button>
              <Button
                type="primary"
                disabled={!(checkedList.length && queryParams.tagId)}
                onClick={exportData}
              >
                导出
              </Button>
              <Button
                danger
                disabled={!(checkedList.length && queryParams.tagId)}
                onClick={del}
              >
                删除
              </Button>
            </Space>
          </div>
          <Spin spinning={loading}>
            <div
              style={{
                ...contentStyle,
                height: contentHeight - 130,
                overflow: "auto",
              }}
            >
              {!queryParams.tagId ? (
                dataList.map((item, index) => {
                  const { tagGrade, tagName, id, pid } = item;
                  return (
                    <Card
                      key={id}
                      size="small"
                      hoverable={true}
                      // title={
                      //   <Checkbox value={id} checked={selectFile[id]} onChange={(e) => {
                      //     setSelectFile({ ...selectFile, [e.target.value]: e.target.checked })
                      //   }}>
                      //   </Checkbox>
                      // }
                      cover={
                        <FolderFilled
                          style={{
                            fontSize: "120px",
                            color: "rgb(255, 231, 144)",
                          }}
                        />
                      }
                      style={{ width: 200, margin: 5, height: 200 }}
                      onDoubleClick={() => {
                        doubleClickFolder(item);
                      }}
                    >
                      <Meta style={{ textAlign: "center" }} title={tagName} />
                    </Card>
                  );
                })
              ) : (
                <>
                  <Checkbox.Group
                    onChange={onChangeCheckbox}
                    value={checkedList}
                  >
                    {dataList.map((item, index) => (
                      <Card
                        key={item.id}
                        size="small"
                        hoverable={true}
                        title={
                          <>
                            <Checkbox value={item.id}></Checkbox>
                            {item.fileName}
                          </>
                        }
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
                                    a.download =
                                      item.fileName || "filename.jpg";
                                    a.click();
                                  };
                                  x.send();
                                }}
                              />
                            }
                          ></Button>
                        }
                        cover={
                          <>
                            <Image
                              key={item.id}
                              width={200}
                              height={200}
                              src={item.fileUrl}
                            />
                          </>
                        }
                        style={{ width: 200, margin: 5, height: 280 }}
                      >
                        <Card.Meta
                          description={<>入库时间:{item.createTime}</>}
                        ></Card.Meta>
                      </Card>
                    ))}
                  </Checkbox.Group>
                  <Pagination
                    {...pagination}
                    total={total}
                    style={{ width: "100%", textAlign: "right" }}
                  />
                </>
              )}
            </div>
          </Spin>
        </Col>
      </Row>
    </>
  );
}
