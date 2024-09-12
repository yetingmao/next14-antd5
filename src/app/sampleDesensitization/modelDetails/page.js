"use client"
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Button,
    message,
    theme,
    Input,
    Form,
    Tree,
    Tag,
    Select,
    Space,
    Popover,
    Table,
    Popconfirm,
    Card,
    Row,
    Col,
    Descriptions,
    TreeSelect
} from "antd";
import {
    RollbackOutlined,
    BarsOutlined,
    ExclamationOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { Util } from "@/utils";
import DetailTable from "./detailTable.js";
import {
    getModelDetail, getModelTasks
} from "./api";

export default function deviceDetail() {
    const { token } = theme.useToken();
    const tokenStyle = {
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,

    };
    const router = useRouter();
    const [detail, setDetail] = useState({});
    const [taskQuery, setTaskQuery] = useState({ status: "" })
    const searchParams = useSearchParams()
    useEffect(() => {
        const id = searchParams.get('id');
        getDetail(id)
        setTaskQuery({ ...taskQuery, desensitizationManageId: id })
    }, [searchParams]);



    //关联采样任务
    const columnsTask = [
        {
            title: "任务编号",
            key: "id",
            dataIndex: "id",
            align: "center",
        },
        {
            title: "任务名称",
            key: "taskName",
            dataIndex: "taskName",
            align: "center",
        },
        {
            title: "状态",
            key: "statusResult",
            dataIndex: "statusResult",
            align: "center",
            render: (text, _) => <Tag color="processing">{text}</Tag>,
        },
        {
            title: "脱敏路径",
            key: "tagResults",
            dataIndex: "tagResults",
            align: "center",
            render: (text, _) => text.join("/")
        },
        {
            title: "开始时间",
            key: "startTime",
            dataIndex: "startTime",
            align: "center",
        },
        {
            title: "结束时间",
            key: "endTime",
            dataIndex: "endTime",
            align: "center",
        },

        {
            title: "操作",
            key: "Action",
            dataIndex: "id",
            align: "center",
            className: "table_operate",
            render: (text, record) => {
                let { status } = record
                return (
                    <Space>
                        <Button
                            type="link"
                            title="详情"

                            onClick={() => {
                                // setModelShow(true)
                                router.push(`/sampleDesensitization/taskDetails?id=${text}`)
                            }}
                        >
                            详情
                        </Button>
                    </Space>
                );
            },
        },
    ];




    async function getDetail(id) {
        const { code, data, msg } = await getModelDetail({ id });
        if (code == 200) {
            setDetail(data)
        } else {
            message.error(msg)
        }
    }

    return (
        <div className="content" style={{ height: "100%", overflow: "auto" }}>
            <Row>
                <Col span={24}>
                    <div className="action" style={tokenStyle}>
                        <Button icon={<RollbackOutlined />} onClick={() => { router.back(-1) }} type="primary" danger>返回</Button>
                    </div>
                    <div className="middle" style={tokenStyle}>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{
                                display: 'flex',
                                width: "100%"
                            }}
                        >
                            <Card
                                title={"基础信息"}
                            >
                                <Descriptions bordered>
                                    <Descriptions.Item label="模型名称">{detail.modelName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="模型类型">{detail.modelTypeName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="模型状态">
                                        <Tag color="processing">{detail.statusName}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="当前被调用任务数">{detail.usedNum || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="模型地址">{detail.modelPath || "暂无"}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                            {/* 设备日志 */}
                            <Card
                                title={"关联脱敏任务"}
                                extra={

                                    <Select
                                        style={{
                                            width: 200,
                                        }}
                                        placeholder="任务状态"
                                        onChange={(value) => {
                                            setTaskQuery({ ...taskQuery, status: value });
                                        }}
                                        options={[
                                            {
                                                value: '',
                                                label: '全部',
                                            },
                                            {
                                                value: '1',
                                                label: '未开始',
                                            },
                                            {
                                                value: '2',
                                                label: '暂停',
                                            },
                                            {
                                                value: '3',
                                                label: '运行中',
                                            },
                                            {
                                                value: '4',
                                                label: '已完成',
                                            },
                                            {
                                                value: '5',
                                                label: '结束',
                                            },

                                            // {
                                            //     value: '6',
                                            //     label: '未审核',
                                            // },
                                            {
                                                value: '7',
                                                label: '审核完成',
                                            },
                                            {
                                                value: '8',
                                                label: '审核中',
                                            },

                                        ]}
                                    />
                                }
                                // tabList={[
                                //     {
                                //         key: 1,
                                //         tab: '文本',
                                //     },
                                //     {
                                //         key: 2,
                                //         tab: '图像',
                                //     },
                                // ]}
                                // onTabChange={(key) => {
                                //     setTaskQuery({ ...taskQuery, taskType: key })
                                // }}
                            >
                                <DetailTable
                                    columns={columnsTask}
                                    getListFC={getModelTasks}
                                    queryParams={taskQuery}
                                >
                                </DetailTable>
                            </Card>
                        </Space>
                    </div>
                </Col></Row>


        </div>
    )
}

