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
    Space
} from "antd";
import { Util } from "@/utils";
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';
import {
    getModelList, getCategoryList
} from "./api";
import "dayjs/locale/zh-cn";
import _ from "lodash";
import AddOrEdit from "./addOrEdit";
let utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
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
            setTHeight(Util.initTableHeight(_fNode, [_bNode1, _bNode2], 137)); //表头
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
    const [categoryList, setCategoryList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [data, setData] = useState({});


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
            title: "模型名称",
            key: "modelName",
            dataIndex: "modelName",
            align: "center",
        },
        {
            title: "模型类型",
            key: "modelTypeName",
            dataIndex: "modelTypeName",
            align: "center",
        },
        // {
        //     title: "脱敏类别",
        //     key: "modelCategoryNames",
        //     dataIndex: "modelCategoryNames",
        //     align: "center",
        //     render: (text, _) => text.join(",")
        // },

        {
            title: "状态",
            key: "statusName",
            dataIndex: "statusName",
            align: "center",
            render: (text, _) => <Tag color="processing">{text}</Tag>

        },
        {
            title: "模型地址",
            key: "modelPath",
            dataIndex: "modelPath",
            align: "center",
        },
        {
            title: "模型说明",
            key: "remark",
            dataIndex: "remark",
            align: "center",
        },
        {
            title: "操作",
            key: "id",
            dataIndex: "id",
            align: "center",
            width: "280px",
            className: "table_operate",
            render: (text, record) => {
                return (
                    <Space>
                        <Button
                            type="link"
                            onClick={() => {
                                router.push(`/sampleDesensitization/modelDetails?id=${text}`)
                            }}
                        >详情</Button>
                        <Button
                            disabled={record.status == 3}
                            type="link"
                            onClick={() => {
                                setData(record);
                                setModelShow(true)
                            }}
                        >编辑</Button>
                        {/* <Popconfirm
                            description="确定要删除这个模型吗?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => { del(text) }}
                        >
                            <Button
                                type="link"
                                danger
                            >
                                删除
                            </Button>
                        </Popconfirm> */}
                    </Space>
                );
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
        <div className="content" style={{ height: "100%" }} ref={(node) => {
            set_fNode(node);
        }}>
            <AddOrEdit
                modelShow={modelShow}
                setModelShow={setModelShow}
                data={data}
                getList={getList}
            //  categoryList={categoryList}
            ></AddOrEdit>
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
                                name={`modelName`}
                                label={`名称`}
                            >
                                <Input cautocomplete="off" placeholder="脱敏模型名称" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item label="状态" name={`status`} style={{ width: 200 }}>
                                <Select>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="1">下线</Select.Option>
                                    <Select.Option value="2">空闲</Select.Option>
                                    <Select.Option value="3">运行中</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="模型类型" name={`modelType`} style={{ width: 200 }}>
                                <Select>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="1">文本</Select.Option>
                                    <Select.Option value="2">图像</Select.Option>
                                    {/* <Select.Option value="3">语音</Select.Option> */}
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="脱敏类别" name="modelCategoryId" style={{ width: 200 }}>
                                <Select mode="multiple"
                                    allowClear>
                                    <Select.Option value="">全部</Select.Option>
                                    {categoryList.map(item => <Select.Option key={item.pkId} value={item.pkId}>{item.categoryName}</Select.Option>)}
                                </Select>
                            </Form.Item> */}
                            <Form.Item label={` `} colon={false}>
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
                            <Button type="primary" onClick={() => {
                                setData({})
                                setModelShow(true)
                            }}>
                                新增
                            </Button>
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
                            scroll={{ y: tHeight, scrollToFirstRowOnChange: true }}
                            onChange={handleTableChange}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
    async function getList() {
        const values = queryForm.getFieldsValue();
        const temp = _.pickBy({ ...values, pageSize: pagination.pageSize, pageNum: pagination.current }, _.identity);
        const { rows, total, code } = await getModelList(temp);
        //  setLoading(false);
        if (code == 200) {
            setDataList(rows)
            setPagination({ ...pagination, total: total });
        } else {
        }
    }
    async function getParameter() {
        // const { data, code } = await getCategoryList();
        // if (code == 200) {
        //     setCategoryList(data)
        // } else {
        // }
    }
    async function del(id) {
        // const { code, msg, data } = await delModel(id)
        // if (code == 200) {
        //     message.success(msg);
        //     getList()
        // } else {
        //     message.error(msg);
        // }
    }

}




