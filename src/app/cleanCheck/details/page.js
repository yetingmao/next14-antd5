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
    getTaskDetail, getTaskLog, getTaskFile, getUsers, passTask, getCheckTaskResult, deleteImg
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
            title: "审核人",
            key: "operUser",
            dataIndex: "operUser",
            align: "center",
        },
        {
            title: "审核时间",
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

    let resultEle;
    if (detail.taskType == 2) {
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
                    style={{ width: 200, margin: 5, marginRight: 10, height: 350 }}
                >
                    <Meta title={<Space direction="vertical">
                        {item.fileName}
                        <Tag color="cyan">{item.washStatusName}</Tag>
                        {item.reason}
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
                     title="清洗后文件"
                    extra={<Button type="link" icon={<DownloadOutlined onClick={() => {
                        const a = document.createElement("a");
                        a.href = item.fileUrl;
                        a.download = item.fileName;
                        a.click();
                    }} />}></Button>}

                    style={{ width: 200, margin: 5, marginRight: 10, height: 150 }}
                >
                    <Meta title={<Space direction="vertical">
                        <Button type="link" onClick={() => {
                            window.open(`${WordLookURL}/onlinePreview?url=${encodeURIComponent(encode(item.fileUrl))}`)
                        }} >{item.fileName}</Button>
                        <Tag color="cyan">{item.washStatusName}</Tag>
                        {item.reason}
                    </Space>} />
                </Card>
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
                                    <Descriptions.Item label="清洗模型">{detail.modelNames ? detail.modelNames.join(",") : "暂无"}</Descriptions.Item>
                                    {/* <Descriptions.Item label="清洗方式">{detail.desensitizationWayResult}</Descriptions.Item> */}
                                    <Descriptions.Item label="创建时间">{detail.creatTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="开始时间">{detail.startTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="结束时间">{detail.endTime || "暂无"}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                            {/* 设备日志 */}
                            <Card
                                title={"审核任务日志"}
                            >
                                {detail.id ? <DetailTable
                                    columns={columnsLog}
                                    getListFC={getTaskLog}
                                    queryParams={{ taskId: detail.id }}
                                >
                                </DetailTable> : ""}
                            </Card >
                      
                            {/* 审核结果 */}
                            <Card
                                title={"审核结果"}
                            >
                                <Descriptions bordered>
                                    <Descriptions.Item label="审核人">{result.examineUser || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="审核时间">{result.examineTime || "暂无"}</Descriptions.Item>
                                    <Descriptions.Item label="结果">
                                        {result.examineReason ||  `通过 ${result.passCount} 个不通过 ${result.notPassCount}`}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                                  {/* 设备结果 */}
                                  <Card
                                actions={[
                                    <Pagination {...pagination} total={total} style={{ zIndex: 100 }} />
                                ]}
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


}

