"use client"
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
    Progress
} from "antd";
import { Util } from "@/utils";
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';
import {
    getUsers, getTaskList, taskAction
} from "../api.js";
import "dayjs/locale/zh-cn";
import _ from "lodash";
let utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
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

    const router = useRouter()
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
    const [userList, setUserList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [data, setData] = useState({});
    const [treeData, setTreeData] = useState([]);
    const [modelList, setModelList] = useState([]);
    useEffect(() => {
        getParameter()
    }, []);
    useMemo(() => {
        if (pagination.current) {
            getList()
        }
    }, [pagination.current]);

    const columns = [
        {
            title: "任务编号",
            width: 150,
            key: "id",
            dataIndex: "id",
            align: "center",
            fixed: 'left',
        },
        {
            title: "任务名称",
            key: "taskName",
            dataIndex: "taskName",
            align: "center",
            width: 200,
            fixed: 'left',
        },
        {
            title: "脱敏模型",
            key: "modelName",
            dataIndex: "modelName",
            align: "center",
            width: 200,
            render: (text, _) => text.map((item, i) => <Tag key={i}>{item}</Tag>)
        },


        {
            title: "状态",
            key: "statusResult",
            dataIndex: "statusResult",
            align: "center",
            width: 100,
            render: (text, _) => <Tag color="processing">{text}</Tag>

        },
        {
            title: "脱敏路径",
            key: "tagResults",
            dataIndex: "tagResults",
            align: "center",
            width: 400,
            render: (text, _) => text.map((item, i) => <Tag key={i} color="success">{item}</Tag>)
        },
        {
            title: "创建人",
            key: "creatUser",
            dataIndex: "creatUser",
            align: "center",
            width: 120,
        },
        {
            title: "创建时间",
            key: "creatTime",
            dataIndex: "creatTime",
            align: "center",
            width: 150,
        },

        {
            title: "开始脱敏时间",
            key: "startTime",
            dataIndex: "startTime",
            align: "center",
            width: 150,
        },
        {
            title: "结束脱敏时间",
            key: "endTime",
            dataIndex: "endTime",
            align: "center",
            width: 150,
        },
        {
            title: "审核人",
            key: "examineUser",
            dataIndex: "examineUser",
            align: "center",
            width: 150,
        },
        {
            title: "审核时间",
            key: "examineTime",
            dataIndex: "examineTime",
            align: "center",
            width: 150,
        },
        {
            title: "操作",
            key: "status",
            dataIndex: "status",
            align: "center",
            width: "280px",
            fixed: 'right',
            className: "table_operate",
            render: (text, record) => {

                const details =
                    <Button
                        type="link"
                        onClick={() => {
                            router.push(`/desensitizeCheck/details?id=${record["id"]}`)
                        }}
                    >详情</Button>
                const push = <Button
                    type="link"
                    onClick={() => {
                        router.push(`/desensitizeCheck/check?id=${record["id"]}`)
                    }}
                >审核</Button>;
                let ele;
                if (text == 8) {
                    ele = <Space>
                        {push}
                    </Space>
                } else if (text == 7) {
                    ele = <Space>
                        {details}
                    </Space>
                }
                return ele;
            },
        },
    ];

    //分页、排序、筛选变化时触发
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination)
    }

    const resetPaginationGetList = () => {
        if (pagination.pageSize == 10 && pagination.current == 1) {
            getList()
        } else {
            setPagination({ ...pagination, pageSize: 10, current: 1 });
        }
    }

    const resetQuery = () => {
        queryForm.resetFields()
        resetPaginationGetList()
    }

    return (
        <div className="content" style={{ height: "calc(100% - 46px)" }} ref={(node) => {
            set_fNode(node);
        }}>
            <Row>
                <Col span={24}>
                    <div className="top" ref={(node) => {
                        set_bNode1(node);
                    }} >

                        <Form
                            layout="inline"
                            form={queryForm}
                            style={{ ...tokenStyle, padding: "10px" }}
                            name="querySearch"
                        >
                            <Form.Item
                                name={`taskId`}
                                label={`任务编号`}
                            >
                                <Input  cautocomplete="off" placeholder="任务编号" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item
                                name={`taskName`}
                                label={`任务名称`}
                            >
                                <Input  cautocomplete="off" placeholder="任务名称" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item label="状态" name={`status`}>
                                <Select style={{ width: 200 }} options={[
                                    {
                                        value: '',
                                        label: '全部',
                                    },
                                    {
                                        value: '8',
                                        label: '待审核',
                                    },
                                    {
                                        value: '7',
                                        label: '审核完成',
                                    },
                                ]}>
                                </Select>
                            </Form.Item>
                            <Form.Item label="审核人" name="examineUser">
                                <Select allowClear options={[{
                                    value: "",
                                    label: "全部",
                                }, ...userList]} style={{ width: 200 }}> </Select>
                            </Form.Item>
                            <Form.Item label="审核时间" name={`time`} >
                                <RangePicker showTime />
                            </Form.Item>
                            <Form.Item label={` `} colon={false} wrapperCol={{
                                span: 14,
                                offset: 4,
                            }}>
                                <Space>
                                    <Button onClick={getList} type="primary">查询</Button>
                                    <Button onClick={resetQuery} htmlType="reset" >重置</Button>
                                </Space>
                            </Form.Item>

                        </Form>
                    </div>
                    <div className="action" ref={(node) => {
                        set_bNode2(node);

                    }} style={tokenStyle}>
                        <Space>
                        </Space>
                    </div>
                    <div
                        className="middle"
                        style={tokenStyle}
                    >
                        <Table
                            rowKey={(record) => record.id}
                            columns={columns}
                            dataSource={dataList}
                            pagination={pagination}
                            scroll={{ y: tHeight, scrollToFirstRowOnChange: true, x: 1800, }}
                            onChange={handleTableChange}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
    async function getList() {
        const values = queryForm.getFieldsValue();
        let examineStartTime;
        let examineEndTime;
        if (values.time) {
            examineStartTime = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
            examineEndTime = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        const temp = _.pickBy({ ...values, examineStartTime, examineEndTime, taskType: "1", pageSize: pagination.pageSize, pageNum: pagination.current }, _.identity);
        const { rows, total, code } = await getTaskList(temp);
        //  setLoading(false);
        if (code == 200) {
            setDataList(rows)
            setPagination({ ...pagination, total: total });
        } else {
        }
    }
    async function getParameter() {
        let res = await getUsers();
        if (res?.code == 200) {
            let { rows } = res;
            const temp = rows.map(item => {
                return {
                    value: item.userName,
                    label: item.nickName,
                }
            })
            setUserList(temp)
        } else {
            return
        }
    }

}




