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
    Rate,
    message,
    Switch,
    theme,
    DatePicker,
    Popconfirm,
} from "antd";
import {
    EditTwoTone,
    DeleteTwoTone,
    SearchOutlined,
    SyncOutlined,
    FileTextOutlined,
    CloudUploadOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { getLog, removeLogs, exportLogs, cleanLogs } from "../api";
import { Util, IconUtil, permission } from "@/utils";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

let utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const { hasPermission } = permission;
const { RangePicker } = DatePicker;
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        }
    };
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState({
        hideOnSinglePage: false, //只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        defaultPageSize: 10, //默认每页多少条
        pageSize: 10, //每页多少条
    });
    const columns = ([
        {
            title: "访问编号",
            key: "infoId",
            dataIndex: "infoId",
            align: "center",
        },
        {
            title: "用户名称",
            key: "userName",
            dataIndex: "userName",
            align: "center",
        },

        {
            title: "登录地址",
            key: "ipaddr",
            dataIndex: "ipaddr",
            align: "center",
        },
        {
            title: "登录地点",
            key: "loginLocation",
            dataIndex: "loginLocation",
            align: "center",
        },

        {
            title: "浏览器",
            key: "browser",
            dataIndex: "browser",
            align: "center",
        },

        {
            title: "登录状态",
            key: "status",
            dataIndex: "status",
            align: "center",
            render: (text) => {
                return text == 0 ? <Tag >成功</Tag> : <Tag color="#f50">失败</Tag>;
            },
        },
        {
            title: "操作系统",
            key: "os",
            dataIndex: "os",
            align: "center",
        },
        {
            title: "操作信息",
            key: "msg",
            dataIndex: "msg",
            align: "center",
        },

        {
            title: "登录日期",
            key: "loginTime",
            dataIndex: "loginTime",
            align: "center",
        },
        {
            title: "操作",
            key: "option",
            dataIndex: "option",
            align: "center",
            width: "300px",
            render: (_, record) => {
                return <>
                    <Popconfirm
                        title="系统提醒"
                        description={`是否确认删除这条数据项？`}
                        onConfirm={() => { delItem(record) }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button
                            type="link"
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </>
            }
        },
    ]);

    useEffect(() => { }, []);

    useEffect(() => {
        if (_fNode && _bNode1 && _bNode2) {
            setTHeight(Util.initTableHeight(_fNode, [_bNode1, _bNode2], 160)); //操作按钮，分页，padding值40
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
        <div className="content" style={{ height: "100%" }}ref={(node) => {
            set_fNode(node);
        }}>
            
                <Row gutter={24}>
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
                                <Form.Item name="rangeTimeValue" label={`开始时间`}>
                                    <RangePicker
                                        showTime={{
                                            format: "HH:mm:ss",
                                        }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </Form.Item>
                                <Form.Item name={`userName`} label={`用户名称`}>
                                    <Input placeholder="请填写用户名称" style={{ width: 200 }} />
                                </Form.Item>
                                <Form.Item name={`status`} label={`登录状态`}>
                                    <Select placeholder="请选择状态" style={{ width: 200 }}>
                                        <Option value="" >
                                            全部
                                        </Option>
                                        <Option value="1" >
                                            失败
                                        </Option>
                                        <Option value="0" >
                                            成功
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
                                <Space>

                                    <Popconfirm
                                        title="系统提醒"
                                        description={`是否清空所有数据？`}
                                        onConfirm={cleanLog}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Button
                                            type="primary"
                                        >
                                            清空
                                        </Button>
                                    </Popconfirm>
                                    {/* <Popconfirm
                                        title="系统提醒"
                                        description={`是否导出当前数据？`}
                                        onConfirm={cleanLog}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Button
                                            disabled
                                            type="primary"
                                        >
                                            导出
                                        </Button>
                                    </Popconfirm> */}

                                </Space>
                            </div>
                            <div
                                className="middle"
                                style={tokenStyle}
                            >
                                <Table
                                    rowSelection={rowSelection}
                                    rowKey={(record) => record.sessionId}
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
        const res = await removeLogs(item.infoId)
        if (res?.code == 200) {
            message.success(res.msg)
            getList()
        } else {
            message.error(res.msg || "网络错误")
        }
    } //
    async function cleanLog() {
        const res = await cleanLogs()
        if (res?.code == 200) {
            message.success(res.msg)
            getList()
        } else {
            message.error(res.msg || "网络错误")
        }
    }
    async function exportLog() {
        let form = queryForm.getFieldsValue();
        let sessionStartTime;
        let sessionEndTime;
        if (form.rangeTimeValue) {
            sessionStartTime = dayjs(form.rangeTimeValue[0]).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            sessionEndTime = dayjs(form.rangeTimeValue[1]).format(
                "YYYY-MM-DD HH:mm:ss"
            );
        }
        let temp = {
            ...form,
            "params[beginTime]": sessionStartTime,
            "params[endTime]": sessionEndTime,
            pageSize: pagination.pageSize,
            pageNum: pagination.current,
        };
        const res = await exportLogs(temp)
        Util.convertRes2Blob(res)
        // if (res?.code == 200) {
        //     message.success(res.msg)
        // } else {
        //     message.error(res.msg || "网络错误")
        // }
    }

    async function getList() {
        setLoading(true);
        let form = queryForm.getFieldsValue();
        let sessionStartTime;
        let sessionEndTime;
        if (form.rangeTimeValue) {
            sessionStartTime = dayjs(form.rangeTimeValue[0]).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            sessionEndTime = dayjs(form.rangeTimeValue[1]).format(
                "YYYY-MM-DD HH:mm:ss"
            );
        }
        let temp = {
            ...form,
            "params[beginTime]": sessionStartTime,
            "params[endTime]": sessionEndTime,
            pageSize: pagination.pageSize,
            pageNum: pagination.current,
        };
        const res = await getLog(temp);
        setLoading(false);
        if (res?.code == 200) {
            let { rows, total } = res;
            setDataList(rows);
            setTotal(total);
        } else {
            return;
        }
    }

}
