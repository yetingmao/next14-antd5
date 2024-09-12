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
    Image,
    Descriptions,
    TreeSelect,
    Cascader,
    DatePicker,
    theme,
    Progress,
    Pagination,
    Checkbox,
    Row,
    Col
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
    getTaskDetail, getTaskLog, getTaskFile, getUsers, passTask, getCheckTaskResult, deleteImg, taskAction
} from "./api";
import { SERVERURL, MxDrawServer } from "@/config";
import Qs from "querystring";
import { encode, decode } from 'js-base64';
import { Util } from "@/utils";
import dayjs from 'dayjs';

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
        setTaskQuery({ ...taskQuery, desensitizationManageId: id })
        getList(id)
        getUserList()
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
            key: "operTypeResult",
            dataIndex: "operTypeResult",
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
        if (taskQuery.desensitizationManageId) {
            getList(taskQuery.desensitizationManageId);
        }
    }, [pagination.current])
    const [result, setResult] = useState({});
    const [modelShow1, setModelShow1] = useState(false);
    const [showUrl, setShowUrl] = useState({});
    let resultEle;
    if (detail.taskType == 2) {
        resultEle = dataList?.map((item, index) => (
            <div key={index} style={{ display: "flex", background: "rgb(240, 242, 245)", marginTop: "5px" }}>
                <Card
                    size="small"
                    hoverable={true}
                    title="原图"
                    extra={<Button type="link" icon={<DownloadOutlined onClick={() => {
                        const a = document.createElement("a");
                        a.href = item.originImageUrl;
                        a.download = item.originImageName;
                        a.click();
                    }} />}></Button>}
                    cover={
                        <Image
                            key={item.originImageId}
                            width={200}
                            height={200}
                            src={item.originImageUrl}
                        />
                    }
                    style={{ width: 200, margin: 5, height: 280 }}
                >
                    <Meta title={item.originImageName} />
                </Card>
                {item.fileUrl ? <Card
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
                    style={{ width: 200, margin: 5, marginRight: 10, height: 280 }}
                >
                    <Meta title={item.fileName} />
                </Card> : <Card
                    size="small"
                    title="失败"
                    cover={
                        <Image
                            width={200}
                            height={200}
                            src="error"
                            fallback="data:image/png;base64,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"
                        />
                    }
                    style={{ width: 200, margin: 5, marginRight: 10, height: 280 }}
                >
                </Card>}
            </div>
        ))
    } else if (detail.taskType == 1) {
        resultEle = dataList?.map((item, index) => (
            <div key={index} style={{ display: "flex", background: "rgb(240, 242, 245)", marginTop: "5px" }}>
                <Card
                    size="small"
                    hoverable={true}
                    title="原文件"
                    extra={<Button type="link" icon={<DownloadOutlined onClick={() => {
                        const a = document.createElement("a");
                        a.href = item.originImageUrl;
                        a.download = item.originImageName;
                        a.click();
                    }} />}></Button>}
                    style={{ width: 200, margin: 5, height: 80 }}
                >
                    <Meta title={<Button type="link" onClick={() => {
                        setShowUrl({
                            origin: item.originContent,
                            file: item.fileContent,
                        })
                        setModelShow1(true)
                    }} >{item.originImageName}</Button>} />
                </Card>
                {item.fileUrl ? <Card
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
                            origin: item.originContent,
                            file: item.fileContent,
                        })
                        setModelShow1(true)
                    }} >{item.fileName}</Button>} />
                </Card> : <Card
                    size="small"
                    title="失败"
                    style={{ width: 200, margin: 5, marginRight: 10, height: 80 }}
                >
                </Card>}
            </div>
        ))
    }
    return (
        <div className="content" style={{ height: "100%", overflow: "auto" }}>
            <Modal
                maskClosable={false}
                wrapClassName="template_model"
                title="审核人列表"
                getContainer={false}
                open={modelShow}
                width={500}
                onOk={() => addOrUp()}
                destroyOnClose={true}
                onCancel={() => {
                    setModelShow(!modelShow)
                    form.resetFields()
                }}
            >
                <Form
                    form={form}
                    ref={formRef}
                    name="setUser"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item label="审核人" name={`examineUser`} >
                        <Select style={{ width: 200 }} options={userList}>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal >

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
                    <Col span={12} style={{ height: "100%" }}>
                        <Card
                            style={{
                                height: "100%", overflow: "auto"
                            }}
                        >
                            <pre>{showUrl.origin}</pre>
                        </Card>

                    </Col>
                    <Col span={12} style={{ height: "100%", overflow: "auto" }}>
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
                                    <Descriptions.Item label="脱敏任务编号">{detail.id || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="脱敏任务名称">{detail.taskName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="任务状态">
                                        <Tag icon={<CheckCircleOutlined />} color="success">{detail.statusResult}</Tag>
                                    </Descriptions.Item>

                                    {/* <Descriptions.Item label="脱敏类别">
                                        {detail.modelCategoryResults ? detail.modelCategoryResults.join(",") : "暂无"}
                                    </Descriptions.Item> */}
                                    <Descriptions.Item label="脱敏路径">{detail.tagResults ? detail.tagResults.join(",") : "暂无"}</Descriptions.Item>
                                    {/* <Descriptions.Item label="脱敏方式">{detail.desensitizationWayResult}</Descriptions.Item> */}
                                    <Descriptions.Item label="创建时间">{detail.creatTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="开始时间">{detail.startTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="结束时间">{detail.endTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="任务进度">
                                        <Progress percent={detail.taskProgress || 0} size="small"></Progress>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                            {/* 设备日志 */}
                            <Card
                                title={"脱敏任务日志"}
                            >
                                {detail.id ? <DetailTable
                                    columns={columnsLog}
                                    getListFC={getTaskLog}
                                    queryParams={{ desensitizationTaskId: detail.id }}
                                >
                                </DetailTable> : ""}
                            </Card >
                            {/* 设备结果 */}
                            <Card
                                title="脱敏结果"
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
                                            disabled={![4, 7].includes(detail.status)}
                                            type="primary"
                                            onClick={() => { exportData() }}
                                        >
                                            导出脱敏结果
                                        </Button>
                                        <Button
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
                                                disabled={checkedList.length == 0 || [7, 8].includes(detail.status)}
                                                type="primary"
                                                danger
                                            >删除</Button>
                                        </Popconfirm>
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
                                        {result.examineReason || "暂无"}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Space>
                    </div>
                </Col></Row>

        </div >
    )
    async function getDetail(id) {
        const { code, msg, data } = await getTaskDetail({ id: id });
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
    async function getUserList() {
        const res = await getUsers();
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
                    id: taskQuery.desensitizationManageId
                })
                if (code == 200) {
                    message.success(msg);
                    setModelShow(!modelShow)
                    getCheckResult(taskQuery.desensitizationManageId)
                } else {
                    message.error(msg);
                }
            })
            .catch((errorInfo) => { })
    }
    async function del() {
        const { code, msg } = await deleteImg({ fileIds: checkedList, taskId: taskQuery.desensitizationManageId })
        if (code == 200) {
            message.success(msg);
            getList(taskQuery.desensitizationManageId)
        } else {
            message.error(msg);
        }
    }
    async function exportData() {
        let url = SERVERURL;
        url += "/desensitization/desensitizationTask/exportFile";
        url += `?${Qs.stringify({ taskId: taskQuery.desensitizationManageId })}`;
        Util.download(url);
    };


}

