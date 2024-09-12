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
import { getActionLog, removeActionLogs, exportActionLogs, cleanActionLogs } from "../api";
import { Util, IconUtil, permission } from "@/utils";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import AddOrEdit from "./components/addOrEdit"
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
    const [modalShow, setModalShow] = useState(false);
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
            title: "日志编号",
            key: "operId",
            dataIndex: "operId",
            align: "center",
        },
        {
            title: "系统模块",
            key: "title",
            dataIndex: "title",
            align: "center",
        },

        {
            title: "操作地址",
            key: "operIp",
            dataIndex: "operIp",
            align: "center",
        },
        {
            title: "操作地点",
            key: "operLocation",
            dataIndex: "operLocation",
            align: "center",
        },

        {
            title: "操作类型",
            key: "businessType",
            dataIndex: "businessType",
            align: "center",
            render: (text) => {
                let result = "其他"
                switch (text) {
                    case 1:
                        result = "新增"
                        break;
                    case 2:
                        result = "修改"
                        break;
                    case 3:
                        result = "删除"
                        break;
                    case 4:
                        result = "授权"
                        break;
                    case 5:
                        result = "导出"
                        break;
                    case 6:
                        result = "导入"
                        break;
                    case 7:
                        result = "强退"
                        break;
                    case 8:
                        result = "清空数据"
                        break;
                    default:
                        break;
                }
                return result;
            },
        },

        {
            title: "操作状态",
            key: "status",
            dataIndex: "status",
            align: "center",
            render: (text) => {
                return text == 0 ? <Tag >成功</Tag> : <Tag color="#f50">失败</Tag>;
            },
        },
        {
            title: "消耗时间（毫秒）",
            key: "costTime",
            dataIndex: "costTime",
            align: "center",
        },

        {
            title: "操作日期",
            key: "operTime",
            dataIndex: "operTime",
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
                    <Space>
                        <Button
                            type="link"
                            onClick={() => {
                                setData(record)
                                setModalShow((true))
                            }}
                        >
                            详情
                        </Button>
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
                    </Space>

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
        <div className="content" style={{ height: "100%" }} ref={(node) => {
            set_fNode(node);
        }}>
            <AddOrEdit
                modalShow={modalShow}
                setModalShow={setModalShow}
                data={data}
                getList={getList}
            ></AddOrEdit>
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
                            <Form.Item name={`businessType`} label={`类型`}>
                                <Select placeholder="请选择状态" style={{ width: 200 }}>
                                    <Option value="" >
                                        全部
                                    </Option>
                                    <Option value="1" >
                                        新增
                                    </Option>
                                    <Option value="2" >
                                        修改
                                    </Option>
                                    <Option value="3" >
                                        删除
                                    </Option>
                                    <Option value="4" >
                                        授权
                                    </Option>
                                    <Option value="5" >
                                        导出
                                    </Option>
                                    <Option value="6" >
                                        导入
                                    </Option>
                                    {/* <Option value="7" >
                                        强退
                                        </Option> */}
                                    <Option value="8" >
                                        生成代码
                                    </Option>
                                    <Option value="9" >
                                        清空数据
                                    </Option>
                                    <Option value="0" >
                                        其他
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
                        style={{ ...tokenStyle, padding: "10px" }}
                        className="action"
                        ref={(node) => {
                            set_bNode2(node);
                        }}
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
        const res = await removeActionLogs(item.operId)
        if (res?.code == 200) {
            message.success(res.msg)
            getList()
        } else {
            message.error(res.msg || "网络错误")
        }
    } //
    async function cleanLog() {
        const res = await cleanActionLogs()
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
        const res = await exportActioLogs(temp)
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
        const res = await getActionLog(temp);
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
