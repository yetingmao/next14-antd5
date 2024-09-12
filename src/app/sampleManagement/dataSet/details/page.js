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
    getTaskDetail, getTaskLog, getTaskFile, getUsers, getCheckTaskResult,
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
    const [taskQuery, setTaskQuery] = useState({ success: 1 })
    const searchParams = useSearchParams()
    useEffect(() => {
        const id = searchParams.get('id');
        getDetail(id)
        setTaskQuery({ ...taskQuery, dataId: id })
        getList(id)
        getUserList()
    }, [searchParams]);
    useEffect(() => {
        getCheckResult()
    }, [JSON.stringify(taskQuery)]);
    const columnsLog = [
        {
            title: "导出目的",
            key: "exportPurpose",
            dataIndex: "exportPurpose",
            align: "center",
        },
        {
            title: "操作人",
            key: "userName",
            dataIndex: "userName",
            align: "center",
        },
        {
            title: "导出时间",
            key: "exportTime",
            dataIndex: "exportTime",
            align: "center",
        },
        {
            title: "导出数量",
            key: "exportNumber",
            dataIndex: "exportNumber",
            align: "center",
        },
    ]
    if (detail.dataType == 1) {
        columnsLog.push({
            title: "导出类型",
            key: "exportTypeName",
            dataIndex: "exportTypeName",
            align: "center",
        })
    }
    const formRef = useRef(null);
    const [form] = Form.useForm();
    const [modelShow, setModelShow] = useState(false);
    const [userList, setUserList] = useState([]);
    const [dataList, setDataList] = useState([]);

    const [total, setTotal] = useState(0);
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
        if (taskQuery.dataId) {
            getList(taskQuery.dataId);
        }
    }, [pagination.current])
    const [total1, setTotal1] = useState(0);
    const [pagination1, setPagination1] = useState({
        hideOnSinglePage: false, //只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        pageSize: 10, //每页多少条
        onChange: (page, pageSize) => {
            setPagination1({ ...pagination1, current: page })
        }
    });
    useEffect(() => {
        getCheckResult();
    }, [pagination1.current])
    const [result, setResult] = useState([]);
    const [modelShow1, setModelShow1] = useState(false);
    const [showUrl, setShowUrl] = useState({});
    let resultEle;
    let textEle;
    if (detail.dataType == 2) {
        resultEle = dataList?.map((item, index) => (
            <div key={index} style={{ display: "flex" }}>
                <Card
                    size="small"
                    hoverable={true}
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
                    </Space>} />
                </Card>
            </div>
        ))
    } else if (detail.dataType == 1) {
        resultEle = dataList?.map((item, index) => (
            <div key={index} style={{ display: "flex" }}>
                <Card
                    size="small"
                    hoverable={true}
                    //  title={<Checkbox value={item.fileId}></Checkbox>}
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
                            file: item.fileUrl,
                        })
                        //   showFileModal()
                        setModelShow1(true)
                    }} >{item.fileName}</Button>} />
                </Card>
            </div>
        ))
        if (result.length) {
            textEle = result.map((item, index) => (
                <div key={index} style={{ display: "flex" }}>
                    <Card
                        size="small"
                        hoverable={true}
                        //   title={<Checkbox value={item.fileId}></Checkbox>}
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
                                file: item.fileUrl,
                            })
                            //   showFileModal()
                            setModelShow1(true)
                        }} >{item.fileName}</Button>} />
                    </Card>
                </div>
            ))
        }
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
                        {showUrl.file ? <iframe style={{ width: '100%', height: "100%" }} src={`${WordLookURL}/onlinePreview?url=${encodeURIComponent(encode(showUrl.file))}`}></iframe> : ""}
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
                                    <Descriptions.Item label="样本类型">{detail.dataTypeName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="数据集名称">{detail.dataName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="是否标注">
                                        <Tag icon={<CheckCircleOutlined />} color="success">{detail.isLabelName}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="专业">{detail.specialtyName || "暂无"}</Descriptions.Item>
                                    {/* <Descriptions.Item label="扩充方式">{detail.desensitizationWayResult}</Descriptions.Item> */}
                                    <Descriptions.Item label="类别">{detail.categoryName || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="导入时间">{detail.importDate || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="存储位置">{detail.ipAddress || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="样本数量">{detail.number || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="来源信息描述">
                                        {detail.dataSource}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                            {/* 设备日志 */}
                            <Card
                                title={"导出记录"}
                            >
                                {detail.id ? <DetailTable
                                    columns={columnsLog}
                                    getListFC={getTaskLog}
                                    queryParams={{ dataId: detail.id }}
                                >
                                </DetailTable> : ""}
                            </Card >
                            {/* 设备结果 */}
                            <Card
                                title="数据集预览"
                                actions={[
                                    <Pagination {...pagination} total={total} style={{ zIndex: 100 }} />
                                ]}
                                style={{ width: "100%", }}

                            >
                                <div
                                    style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", justifyContent: "center" }}
                                >
                                    {
                                        resultEle
                                    }
                                </div>
                            </Card>
                            {/* 审核结果 */}
                            {detail.dataType == 1 ? <Card
                                title="转txt结果"
                                actions={[
                                    <Pagination {...pagination1} total={total1} style={{ zIndex: 100 }} />
                                ]}
                                style={{ width: "100%", }}
                                tabList={[
                                    {
                                        key: 1,
                                        tab: '成功',
                                    },
                                    {
                                        key: 2,
                                        tab: '失败',
                                    },
                                ]}
                                onTabChange={(key) => {
                                    setPagination1({ ...pagination1, current: 1 })
                                    setTaskQuery({ ...taskQuery, success: key })
                                }}

                            >
                                <div
                                    style={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", justifyContent: "center" }}
                                >
                                    {
                                        textEle
                                    }
                                </div>
                            </Card> : ""}
                        </Space>
                    </div>
                </Col></Row>

        </div >
    )
    async function getDetail(id) {
        const { code, msg, data } = await getTaskDetail({ dataId: id });
        if (code == 200) {
            setDetail(data)
        } else {
            message.error(msg)
        }
    }
    async function getList(id) {
        //  setLoading(true);
        let temp = { pageSize: pagination.pageSize, pageNum: pagination.current, dataId: id };
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
    async function getCheckResult() {
        if (taskQuery.dataId && taskQuery.success) {
            const { code, total, rows } = await getCheckTaskResult({ ...taskQuery, pageSize: pagination1.pageSize, pageNum: pagination1.current });
            if (code == 200) {
                setResult(rows)
                setTotal1(total)
            } else {
                return
            }
        }
    }
}

