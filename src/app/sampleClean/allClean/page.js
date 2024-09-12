"use client"
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Button,
    message,
    Modal,
    Input,
    Form,
    Statistic,
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
    getTaskFile, passTask, deleteImg, getUsers
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
        getUserList()
    }, [searchParams]);

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
        resultEle = dataList?.map((item, index) => {
            const file1 = item.resultSelfData[0] || {}
            const file2 = item.resultSelfData[1] || {}
            return (
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
                                width={200}
                                height={200}
                                src={item.fileUrl}
                            />
                        }
                        style={{ width: 200, margin: 5, height: 320 }}
                    >
                        <Meta title={<Space direction="vertical">
                            <Button type="link" onClick={() => {
                                window.open(`${WordLookURL}/onlinePreview?url=${encodeURIComponent(encode(item.fileUrl))}`)
                            }} >{item.fileName}</Button>
                            {item.resultTypes ? item.resultTypes.map(_ => <Tag>{_}</Tag>) : ""}

                        </Space>} />
                    </Card>
                    <Card
                        size="small"
                        hoverable={true}
                        title="库中图"
                        style={{ width: 200, margin: 5, height: 120 }}
                        cover={
                            <Image
                                key={file1.fileUrl}
                                width={200}
                                height={200}
                                src={file1.fileUrl}
                            />
                        }
                    >
                        <Meta title={<Space direction="vertical">
                            <Button type="link" onClick={() => {
                                window.open(`${WordLookURL}/onlinePreview?url=${encodeURIComponent(encode(file1.fileUrl))}`)
                            }} >{file1.fileName}</Button>
                            {file1.value ? <Button type="link">相似度{file1.value * 100}%</Button> : ""}
                        </Space>} />
                    </Card>
                    <Card
                        size="small"
                        hoverable={true}
                        title="库中图"
                        style={{ width: 200, margin: 5, height: 120 }}
                        cover={
                            <Image
                                key={file2.fileUrl}
                                width={200}
                                height={200}
                                src={file2.fileUrl}
                            />
                        }
                    >
                        <Meta title={<Space direction="vertical">
                            <Button type="link" onClick={() => {
                                window.open(`${WordLookURL}/onlinePreview?url=${encodeURIComponent(encode(file2.fileUrl))}`)
                            }} >{file2.fileName}</Button>
                            {file2.value ? <Button type="link">相似度{file2.value * 100}%</Button> : ""}
                        </Space>} />
                    </Card>
                </div>
            )
        })
    } else if (taskQuery.taskType == 1) {
        resultEle = dataList?.map((item, index) => {
            const file1 = item.resultSelfData[0] || {}
            const file2 = item.resultSelfData[1] || {}
            return (
                <div key={index} style={{ display: "flex", background: "rgb(240, 242, 245)", marginTop: "5px" }}>
                    <Card
                        size="small"
                        hoverable={true}
                        title={<Checkbox value={item.fileId}>全库对比结果</Checkbox>}
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
                        </Space>} />
                    </Card>
                    <Card
                        size="small"
                        hoverable={true}
                        title="库中文件"
                        style={{ width: 200, margin: 5, height: 120 }}
                    >
                        <Meta title={<Space direction="vertical">
                            <Button type="link" onClick={() => {
                                setShowUrl({
                                    file: item.fileContent,
                                })
                                setModelShow1(true)
                            }} >{file1.fileName}</Button>
                            {file1.value ? <Button type="link">相似度{file1.value * 100}%</Button> : ""}
                        </Space>} />
                    </Card>
                    <Card
                        size="small"
                        hoverable={true}
                        title="库中文件"
                        style={{ width: 200, margin: 5, height: 120 }}
                    >
                        <Meta title={<Space direction="vertical">
                            <Button type="link" onClick={() => {
                                setShowUrl({
                                    file: item.fileContent,
                                })
                                setModelShow1(true)
                            }} >{file2.fileName}</Button>
                            {file2.value ? <Button type="link">相似度{file2.value * 100}%</Button> : ""}
                        </Space>} />
                    </Card>
                </div>
            )
        })
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
                onOk={() => action()}
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
                            {/*  全库对比结果 */}
                            <Card
                                title=" 全库对比结果"
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
                                            onClick={() => { setModelShow(true) }}
                                        >
                                            提交审核
                                        </Button>
                                        <Popconfirm
                                            title={`确定要删除这些文件吗?`}
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
                const { code, msg, data } = await passTask({
                    ...values,
                    taskId: taskQuery.id,
                    type: 6
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
    async function getUserList() {
        const res = await getUsers();
        if (res?.code == 200) {
            let { rows } = res;
            const temp = rows.map(item => {
                return {
                    value: item.userId,
                    label: item.nickName,
                }
            })
            setUserList(temp)
        } else {
            return
        }
    }


}

