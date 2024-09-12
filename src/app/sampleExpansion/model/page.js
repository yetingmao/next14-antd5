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
    getModelList, getModelType
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
    const [dataList, setDataList] = useState([]);
    const [modelType, setModelType] = useState([]);
    const [data, setData] = useState({});


    useEffect(() => {
        getList()
    }, []);
    let expandedRowRender;
    if (dataList.length) {
        const columns = [
            {
                title: "模型名称",
                key: "modelName",
                dataIndex: "modelName",
                align: "center",
            },

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
                                    router.push(`/sampleExpansion/modelDetails?id=${text}`)
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
        expandedRowRender = (record) => (
            <Table
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={record.modelmanageS}
            />
        )
    }


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
              modelType={modelType}
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
                                <Input  cautocomplete="off" placeholder="扩充模型名称" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item label="状态" name={`status`} style={{ width: 200 }}>
                                <Select>
                                    <Select.Option value="">全部</Select.Option>
                                    <Select.Option value="1">下线</Select.Option>
                                    <Select.Option value="2">空闲</Select.Option>
                                    <Select.Option value="3">运行中</Select.Option>
                                </Select>
                            </Form.Item>
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
                            rowKey={(record) => record.pkId}
                            columns={[{
                                title: "类型名",
                                key: "typeName",
                                dataIndex: "typeName",
                                align: "center",
                            },

                            {
                                title: "备注",
                                key: "remark",
                                dataIndex: "remark",
                                align: "center",

                            }]
                            }
                            dataSource={dataList}
                            pagination={pagination}
                            scroll={{ y: tHeight, scrollToFirstRowOnChange: true }}
                            onChange={handleTableChange}
                            expandable={
                                {
                                    expandedRowRender,
                                }
                            }
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
    async function getList() {
        const values = queryForm.getFieldsValue();
        const temp = _.pickBy(values, _.identity);
        const { data, code } = await getModelType(temp);
        //  setLoading(false);
        if (code == 200) {
            setDataList(data)
            const type = data.map(item => {
                return {
                    value: item.pkId,
                    label: item.typeName,
                }
            })
            setModelType(type)
        } else {
        }
    }
    async function del(id) {
        // const { code, msg, data } = await delModel(id)
        // if (code == 200) {
        //     message.success(msg);
        //     getList()
        // } else {dd
        //     message.error(msg);
        // }
    }

}




