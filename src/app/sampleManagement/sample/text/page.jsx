"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  theme,
  Popconfirm,
  Skeleton,
  message,
  Row,
  List,
  Col,
  Tree,
  DatePicker,
  Space,
  Card,
  Tag,
  Checkbox,
  Select,
} from "antd";
import {
  FolderFilled,
  DownloadOutlined,
  EyeOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getSampleListText, getTagTree, delSampleList } from "@/api";
import useContentHeight from "@/component/hooks/useContentHeight";
import { getTaskList } from "../api";
import Qs from "querystring";
import { SERVERURL, WordLookURL } from "@/config";
import { Util } from "@/utils";
import _ from "lodash";
import { encode, decode } from "js-base64";
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
  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [flatTreeData, setFlatTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [seletcKeys, setSelectKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [queryParams, setQueryParams] = useState(0);
  const [tableSelect, setTableSelect] = useState([]);
  const [contentHeight, setContentHeight] = useContentHeight(0);
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
    padding: 12,
    display: "flex",
    flexWrap: "wrap",
    userSelect: "none",
    // marginTop: 12
  };

  useEffect(() => {
    setContentHeight(treeRef);
    getDefaultTree();
  }, []);

  //左侧树选中后的操作
  const changeTreeSelect = (selectedKeys, e) => {
    setSelectKeys(selectedKeys);
    // setQueryParams({ ...queryParams, tagId: selectedKeys.length ? selectedKeys[0] : "" })
    //最后一级获取数据
    if (!e.node.childrenIds.length) {
      //最后一级
      getLastData(e.node);
    } else if (e.node.children) {
      setQueryParams({ ...queryParams, tagId: e.node.id });
      setDataList(e.node.children);
    } else {
      onExpand([...expandedKeys, e.node.id]);
      setQueryParams({ ...queryParams, tagId: e.node.id });
    }
  };

  //查询框改变时进行的操作
  const onChange = (e) => {
    const { value } = e.target;
    //获取要展开的节点
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

  //使用useMemo缓存要展示的树结构数据
  //Antd提供的数据处理函数
  const showTreeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.tagName + `(${item.sampleCount})`;
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

  //异步加载tree数据
  const onLoadData = ({ key, children }) => {
    return new Promise((resolve) => {
      if (children?.length) {
        resolve();
        return;
      }
      getTagTree({ tagId: key }).then((res) => {
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
    setShow(false);
    setQueryParams({
      ...queryParams,
      tagId: newExpandedKeys[newExpandedKeys.length - 1],
    });
    setExpandedKeys(newExpandedKeys);
  };

  const doubleClickFolder = (e) => {
    setSelectKeys([e.id]);
    setShow(false);
    if (e.children) {
      setDataList(e.children);
      setQueryParams({ ...queryParams, tagId: e.id });
    } else if (e.childrenIds.length) {
      onExpand([...expandedKeys, e.id]);
      setQueryParams({ ...queryParams, tagId: e.id });
    } else {
      getLastData(e);
    }
  };

  const exportData = () => {
    if (!tableSelect.length) {
      message.error("未选择");
      return;
    }
    let url = SERVERURL;
    url += "/collections/assetImg/export";
    url += `?${Qs.stringify({ ids: tableSelect })}`;
    Util.download(url);
  };

  async function getDefaultTree() {
    const res = await getTagTree({ tagId: 1765 });
    if (res?.code == 200) {
      setDataList(res.data);
      setFlatTreeData(res.data);
      setTreeData(res.data);
    }
  }

  async function getLastData(e) {
    setQueryParams({ ...queryParams, tagId: e.id });
    getList(e.id);
  }
  const [pagination, setPagination] = useState({
    hideOnSinglePage: false, //只有一页默认隐藏
    defaultCurrent: 1, //默认当前页
    current: 1, //当前页
    defaultPageSize: 10, //默认每页多少条
    pageSize: 10, //每页多少条
    onChange: (page, pageSize) => {
      setPagination({ ...pagination, current: page });
    },
  });
  useMemo(() => {
    if (pagination.current && show) {
      getList();
    }
  }, [pagination.current]);
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
    <>
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
              <Form.Item label="状态" name={`source`}>
                <Select
                  style={{ width: 120 }}
                  options={[
                    {
                      value: "",
                      label: "全部",
                    },
                    {
                      value: "3",
                      label: "脱敏生成",
                    },
                  ]}
                ></Select>
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
          <div style={operationStyle}>
            <Space>
              <Button
                type="primary"
                disabled={!(tableSelect.length && queryParams.tagId)}
                onClick={exportData}
              >
                导出
              </Button>
              <Button
                danger
                disabled={!(tableSelect.length && queryParams.tagId)}
                onClick={del}
              >
                删除
              </Button>
            </Space>
          </div>
          <div
            style={{
              ...contentStyle,
              height: contentHeight - 180,
              overflow: "auto",
            }}
          >
            {!show ? (
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
              <Checkbox.Group
                style={{ width: "100%" }}
                onChange={(list) => {
                  setTableSelect(list);
                }}
              >
                <List
                  pagination={pagination}
                  style={{ width: "100%" }}
                  itemLayout="horizontal"
                  dataSource={dataList}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          icon={
                            <DownloadOutlined
                              onClick={() => {
                                const a = document.createElement("a");
                                a.href = item.fileUrl;
                                a.download = item.fileName;
                                a.click();
                              }}
                            />
                          }
                        ></Button>,
                        <Button
                          type="link"
                          icon={
                            <EyeOutlined
                              onClick={() => {
                                window.open(
                                  `${WordLookURL}/onlinePreview?url=${encodeURIComponent(
                                    encode(item.fileUrl)
                                  )}`
                                );
                              }}
                            />
                          }
                        ></Button>,
                      ]}
                    >
                      <Skeleton
                        avatar
                        title={false}
                        loading={item.loading}
                        active
                      >
                        <List.Item.Meta
                          avatar={<Checkbox value={item.id}></Checkbox>}
                          title={item.fileName}
                          // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                        <div>{item.createTime}</div>
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </Checkbox.Group>
            )}
          </div>
        </Col>
      </Row>
    </>
  );

  async function getList(tagId) {
    setShow(true);
    const values = queryForm.getFieldsValue();
    let startTime;
    let endTime;
    if (values.time) {
      startTime = dayjs(values.time[0]).format("YYYY-MM-DD HH:mm:ss");
      endTime = dayjs(values.time[1]).format("YYYY-MM-DD HH:mm:ss");
    }
    const id = tagId || queryParams.tagId;
    const temp = _.pickBy(
      {
        ...values,
        tagId: id,
        startTime,
        endTime,
        type: "1",
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      },
      _.identity
    );
    console.log("---temp", temp);
    const { rows, total, code } = await getTaskList(temp);
    //  setLoading(false);
    if (code == 200) {
      setDataList(rows);
      setPagination({ ...pagination, total: total });
    } else {
    }
  }
  async function del() {
    const res = await delSampleList({ assetImgIds: tableSelect });
    if (res?.code == 200) {
      message.success("删除成功");
      getList(queryParams.tagId);
    } else {
      message.error("删除失败");
    }
  }
}
