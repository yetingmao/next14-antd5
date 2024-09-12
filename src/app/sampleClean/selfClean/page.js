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
import {
    getTaskFile, passTask, deleteImg
} from "./api";
import { WordLookURL } from "@/config";
import { encode, decode } from 'js-base64';
import dayjs from 'dayjs';
const { Meta } = Card;

export default function deviceDetail() {
    const { token } = theme.useToken();
    const tokenStyle = {
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,

    };
    const router = useRouter();
    const [taskQuery, setTaskQuery] = useState({ status: "", taskType: 1 })
    const searchParams = useSearchParams()
    useEffect(() => {
        const id = searchParams.get('id');
        const taskType = searchParams.get('taskType');
        setTaskQuery({ ...taskQuery, id, taskType })
        getList(id)
    }, [searchParams]);

    const [form] = Form.useForm();
    const [modelShow, setModelShow] = useState(false);
    const [dataList, setDataList] = useState([]);

    const [total, setTotal] = useState(0);
    const [checkedList, setCheckedList] = useState([]);
    const [pagination, setPagination] = useState({
        hideOnSinglePage: false, //只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        defaultPageSize: 10, //默认每页多少条
        pageSize: 20, //每页多少条
        onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page })
        }
    });
    useEffect(() => {
        if (taskQuery.id) {
            getList(taskQuery.id);
        }
    }, [pagination.current])
    const [modelShow1, setModelShow1] = useState(false);
    const [showUrl, setShowUrl] = useState({});
    let resultEle;
    if (taskQuery.taskType == 2) {
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
                            key={item.fileUrl}
                            width={300}
                            height={200}
                            src={item.fileUrl}
                        />
                    }
                    style={{
                        width: 300, margin: 5,
                        //  height: 320 
                    }}
                >
                    <Meta title={<Space direction="vertical" style={{width:"100%"}}>
                        <Button type="link" onClick={() => {
                            window.open(`${WordLookURL}/onlinePreview?url=${encodeURIComponent(encode(item.fileUrl))}`)
                        }} >{item.fileName}</Button>
                        {item.imageCount ? <Button type="link" onClick={() => {
                            router.push(`/sampleClean/similarFile?id=${item.fileId}&taskType=2`)
                        }} > 相似文件数：{item.imageCount}个</Button> : <Button type="link"> 无相似文件</Button>}
                        <div style={{ display: "flex", justifyContent: 'space-between' ,flexWrap:"wrap"}}>
                            {item.resultTypes ? item.resultTypes.map(_ => <Tag size="small">{_}</Tag>) : ""}
                        </div>
                    </Space>} />
                </Card>
            </div>
        ))
    } else if (taskQuery.taskType == 1) {
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
                    style={{ width: 200, margin: 5, height: 120 }}
                >
                    <Meta title={<Space direction="vertical">
                        <Button type="link" onClick={() => {
                            setShowUrl({
                                file: item.fileContent,
                            })
                            setModelShow1(true)
                        }} >{item.fileName}</Button>
                        {item.imageCount ? <Button type="link" onClick={() => {
                            router.push(`/sampleClean/similarFile?id=${item.fileId}&taskType=1`)
                        }} > 相似文件数：{item.imageCount}个</Button> : <Button type="link"> 无相似文件</Button>}</Space>} />
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
                            {/*  自身清洗结果 */}
                            <Card
                                title=" 自身清洗结果"
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
                                            type="primary"
                                            onClick={() => {
                                                action()
                                            }}
                                        >
                                            全库清洗
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
                        </Space>
                    </div>
                </Col></Row>

        </div >
    )

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

    async function action() {
        form.validateFields()
            .then(async (values, e, r) => {
                console.log("--", taskQuery)
                const { code, msg, data } = await passTask({
                    //   ...values,
                    taskId: taskQuery.id,
                    type: 2
                })
                if (code == 200) {
                    message.success(msg);
                    router.back(-1)
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
            getList(taskQuery.id)
        } else {
            message.error(msg);
        }
    }


}

