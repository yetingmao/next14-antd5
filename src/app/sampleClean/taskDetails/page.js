"use client"
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Button,
    message,
    Modal,
    Input,
    Form,
    Tree,
    Tag,
    Select,
    Space,
    Popover,
    Empty,
    Popconfirm,
    Card,
    Row,
    Image,
    Col,
    Descriptions,
    TreeSelect,
    Cascader,
    DatePicker,
    theme,
    Progress,
    Pagination,
    Checkbox,
    Radio
} from "antd";
import {
    RollbackOutlined,
    BarsOutlined,
    ExclamationOutlined,
    MinusCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    ExportOutlined,
    DeleteOutlined,
    PauseCircleOutlined,
    PoweroffOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import DetailTable from "./detailTable";
import {
    getTaskDetail, getTaskLog, getTaskFile, getCheckTaskResult,
} from "./api";
import { WordLookURL } from "@/config";
import { encode, decode } from 'js-base64';
import dayjs from 'dayjs';
import { forEach } from "lodash";

const { SHOW_CHILD } = TreeSelect;
const { RangePicker } = DatePicker;
const { Meta } = Card;

export default function deviceDetail() {
    const { token } = theme.useToken();
    const tokenStyle = {
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,

    };
    const router = useRouter();
    const [detail, setDetail] = useState({});
    const [taskQuery, setTaskQuery] = useState({ status: "", taskType: 1 })
    const searchParams = useSearchParams()
    useEffect(() => {
        const id = searchParams.get('id');
        getDetail(id)
        setTaskQuery({ ...taskQuery, taskId: id })
        getList(id)
        getCheckResult(id)
    }, [searchParams]);
    const columnsLog = [
        {
            title: "日志编号",
            key: "id",
            dataIndex: "id",
            align: "center",
        },
        {
            title: "任务变更类型",
            key: "operTypeName",
            dataIndex: "operTypeName",
            align: "center",
        },
        {
            title: "操作人",
            key: "operUser",
            dataIndex: "operUser",
            align: "center",
        },
        {
            title: "时间",
            key: "creatTime",
            dataIndex: "creatTime",
            align: "center",
        },
    ]

    const [categoryList, setCategoryList] = useState([
        {
            key: "",
            tab: "全部"
        }
    ]);
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [modelShow, setModelShow] = useState(false);
    const [userList, setUserList] = useState([]);
    const [dataList, setDataList] = useState([]);

    const [total, setTotal] = useState(0);
    const [checkedList, setCheckedList] = useState([]);
    const [pagination, setPagination] = useState({
        hideOnSinglePage: false, //只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        defaultPageSize: 10, //默认每页多少条
        pageSize: 10, //每页多少条
        onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page })
        }
    });
    useEffect(() => {
        if (taskQuery.taskId) {
            getList(taskQuery.taskId);
        }
    }, [pagination.current])
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({});
    const [modelShow1, setModelShow1] = useState(false);
    const [showUrl, setShowUrl] = useState({});
    let resultEle;
    if (detail.taskType == 2) {
        resultEle = dataList?.map((item, index) => (
            <div key={index} style={{ display: "flex" }}>
                <Card
                    size="small"
                    hoverable={true}
                    title={<Checkbox value={item.fileId}></Checkbox>}
                    extra={<Button type="link" icon={<DownloadOutlined onClick={() => {
                        const a = document.createElement("a");
                        a.href = item.fileUrl;
                        a.download = item.fileName;
                        a.click();
                    }} />}></Button>}
                    cover={
                        <Image
                            key={item.fileId}
                            width={200}
                            height={200}
                            src={item.fileUrl}
                        />
                    }
                    style={{ width: 200, margin: 5, marginRight: 10, minHeight: 340 }}
                >
                    <Meta title={<Space direction="vertical">
                        {item.fileName}
                        {item.resultTypes ? item.resultTypes.map(_ => <Tag>{_}</Tag>) : ""}
                    </Space>} />
                </Card>
            </div>
        ))
    } else if (detail.taskType == 1) {
        resultEle = dataList?.map((item, index) => (
            <div key={index} style={{ display: "flex" }}>
                <Card
                    size="small"
                    hoverable={true}
                    title={<Checkbox value={item.fileId}></Checkbox>}
                    extra={<Button type="link" icon={<DownloadOutlined onClick={() => {
                        const a = document.createElement("a");
                        a.href = item.fileUrl;
                        a.download = item.fileName;
                        a.click();
                    }} />}></Button>}

                    style={{ width: 200, margin: 5, marginRight: 10, height: 80 }}
                >
                    <Meta title={<Button type="link" onClick={() => {
                        setShowUrl({
                            file: item.fileContent,
                        })
                        setModelShow1(true)
                    }} >{item.fileName}</Button>} />
                </Card>
            </div>
        ))
    }
    return (
        <div className="content" style={{ height: "100%", overflow: "auto" }}>
            <Modal
                maskClosable={false}
                wrapClassName="template_model"
                getContainer={false}
                open={modelShow1}
                width="80%"
                height="90%"
                onOk={() => setModelShow1(!modelShow1)}
                destroyOnClose={true}
                onCancel={() => {
                    setModelShow1(!modelShow1)
                }}
            >
                <style>

                    {
                        `
                     .ant-modal-content{
                       height:90%;
                     }
                       .ant-modal-body{
                       height:90%;
                       }
                    `
                    }

                </style>
                <Row gutter={[8, 8]} style={{ height: "100%" }}>
                    <Col span={24} style={{ height: "100%", overflow: "auto" }}>
                        <Card
                            style={{
                                height: "100%", overflow: "auto"
                            }}
                        >
                            <pre dangerouslySetInnerHTML={{ __html: showUrl.file }}></pre>
                        </Card>
                    </Col>
                </Row>
            </Modal >
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
                            {/* 基础信息 */}
                            <Card
                                title={"基础信息"}
                            >
                                <Descriptions bordered>
                                    <Descriptions.Item label="清洗任务编号">{detail.id || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="清洗任务名称">{detail.taskName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="任务状态">
                                        <Tag icon={<CheckCircleOutlined />} color="success">{detail.statusName}</Tag>
                                    </Descriptions.Item>

                                    {/* <Descriptions.Item label="清洗类别">
                                        {detail.modelCategoryResults ? detail.modelCategoryResults.join(",") : "暂无"}
                                    </Descriptions.Item> */}
                                    <Descriptions.Item label="清洗路径">{detail.tagNames ? detail.tagNames.join(",") : "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="清洗模型">{detail.modelNames ? detail.modelNames.join(",") : "暂无"}</Descriptions.Item>
                                    {/* <Descriptions.Item label="清洗方式">{detail.desensitizationWayResult}</Descriptions.Item> */}
                                    <Descriptions.Item label="创建时间">{detail.createTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="开始时间">{detail.startTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="结束时间">{detail.endTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="任务进度">
                                        <Progress percent={detail.taskProgress || 0} size="small"></Progress>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                            {/* 设备日志 */}
                            <Card
                                title={"清洗任务日志"}
                            >
                                {detail.id ? <DetailTable
                                    columns={columnsLog}
                                    getListFC={getTaskLog}
                                    queryParams={{ taskId: detail.id }}
                                >
                                </DetailTable> : ""}
                            </Card >
                            {/* 设备结果 */}
                            <Card
                                title="清洗结果"
                                actions={[
                                    <Pagination {...pagination} total={total} style={{ zIndex: 100 }} />
                                ]}
                                extra={
                                    <Space>
                                        {/* <Select mode="multiple" allowClear options={[{
                                            value: "",
                                            label: "全部",
                                        }, ...categoryList]} style={{ width: 200 }}
                                            onChange={(key) => {
                                                setTaskQuery({ ...taskQuery, taskType: key })
                                            }}
                                        > </Select> */}
                                        <Button
                                            disabled
                                            type="primary"
                                        //onClick={() => { console.log(checkedList) }}
                                        >
                                            导出清洗结果
                                        </Button>
                                        {/* <Button
                                            type="primary"
                                            onClick={() => { setModelShow(true) }}
                                        >
                                            提交审核
                                        </Button>
                                        <Popconfirm
                                            title={`确定要删除这些图片吗?`}
                                            okText="确定"
                                            cancelText="取消"
                                            onConfirm={() => {
                                                del()
                                            }}
                                        >
                                            <Button
                                                disabled={checkedList.length == 0}
                                                type="primary"
                                                danger
                                            >删除</Button>
                                        </Popconfirm> */}
                                    </Space>
                                }

                                style={{ width: "100%", }}

                            >
                                <Checkbox.Group
                                    value={checkedList}
                                    onChange={(list) => {
                                        setCheckedList(list)
                                    }}
                                    style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", justifyContent: "center" }}
                                >
                                    {
                                        resultEle
                                    }
                                </Checkbox.Group>
                            </Card>
                            {/* 审核结果 */}
                            <Card
                                title={"审核结果"}
                            >
                                <Descriptions bordered>
                                    <Descriptions.Item label="审核人">{result.examineUser || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="审核时间">{result.examineTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="结果">
                                        通过 {result.passCount || 0}个，
                                        不通过 {result.notPassCount || 0}个
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Space>
                    </div>
                </Col></Row>

        </div >
    )
    async function getDetail(id) {
        const { code, msg, data } = await getTaskDetail({ taskId: id });
        if (code == 200) {
            setDetail(data)
            const { modelCategoryIds, modelCategoryResults, desensitizationWay } = data;
            if (desensitizationWay == 2) {
                const temp = [];
                modelCategoryIds.forEach((item, i) => {
                    temp.push({
                        key: item,
                        tab: modelCategoryResults[i]
                    })
                })
                setCategoryList(temp)
            }
        } else {
            message.error(msg)
        }
    }
    async function getList(id) {
        //  setLoading(true);
        let temp = { pageSize: pagination.pageSize, pageNum: pagination.current, taskId: id };
        const res = await getTaskFile(temp);
        //  setLoading(false);
        if (res?.code == 200) {
            let { rows, total } = res;
            setDataList(rows)
            setTotal(total)
        } else {
            return
        }
    }
    async function getCheckResult(taskId) {
        const { code, msg, data } = await getCheckTaskResult({ taskId });
        if (code == 200) {
            if (data) {
                setResult(data)
            }
        } else {
            return
        }
    }
    async function addOrUp() {
        form.validateFields()
            .then(async (values, e, r) => {
                const { code, msg, data } = await passTask({
                    ...values,
                    id: taskQuery.taskId
                })
                if (code == 200) {
                    message.success(msg);
                    setModelShow(!modelShow)
                    getCheckResult(taskQuery.taskId)
                } else {
                    message.error(msg);
                }
            })
            .catch((errorInfo) => { })
    }
    async function del() {
        const { code, msg } = await deleteImg({ fileIds: checkedList })
        if (code == 200) {
            message.success(msg);
            getList(taskQuery.taskId)
        } else {
            message.error(msg);
        }
    }


}

