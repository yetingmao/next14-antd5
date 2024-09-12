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
    Radio,
    Tag,
    Form,
    Modal,
    Table,
    Space,
    DatePicker,
    InputNumber,
    List,
    Avatar
} from "antd";
import Qs from "querystring";
import { Util } from "@/utils";
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';
import {
    getTagTreeAll, getTaskList, delTask, getExportLog
} from "../api.js";
import "dayjs/locale/zh-cn";
import { SERVERURL, MxDrawServer } from "@/config";
import _ from "lodash";
import AddOrEdit from "./components/addOrEdit.jsx";
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
    const [modelShow1, setModelShow1] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exportform] = Form.useForm();
    const [queryForm] = Form.useForm();
    const [dataList, setDataList] = useState([]);
    const [data, setData] = useState({});
    const [treeDataTxt, setTreeDataTxt] = useState([]);
    const [treeDataImg, setTreeDataImg] = useState([]);
    const [numShow, setNumShow] = useState(false);
    const [logs, setLogs] = useState([]);
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
            title: "数据集名称",
            key: "dataName",
            dataIndex: "dataName",
            align: "center",
            width: 200,
            fixed: 'left',
        },
        {
            title: "专业",
            key: "specialtyName",
            dataIndex: "specialtyName",
            align: "center",
            width: 200,
            fixed: 'left',
        },
        {
            title: "类别",
            key: "categoryName",
            dataIndex: "categoryName",
            align: "center",
            width: 200,
        },
        {
            title: "是否标注",
            key: "isLabelName",
            dataIndex: "isLabelName",
            align: "center",
            width: 200,
            render: (text, _) => <Tag color="processing">{text}</Tag>
        },


        {
            title: "样本数量",
            key: "number",
            dataIndex: "number",
            align: "center",
            width: 140,

        },
        {
            title: "转换txt成功数",
            key: "txtNumber",
            dataIndex: "txtNumber",
            align: "center",
            width: 140,

        },
        {
            title: "转换txt失败数",
            key: "errorNumber",
            dataIndex: "errorNumber",
            align: "center",
            width: 140,

        },
        {
            title: "存储位置",
            key: "ipAddress",
            dataIndex: "ipAddress",
            align: "center",
            width: 150,

        },
        {
            title: "来源信息描述",
            key: "dataSource",
            dataIndex: "dataSource",
            align: "center",
            width: 400,
        },

        {
            title: "导入时间",
            key: "importDate",
            dataIndex: "importDate",
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
                            router.push(`/sampleManagement/dataSet/details?id=${record["id"]}`)
                        }}
                    >详情</Button>
                const edit = <Button
                    type="link"
                    onClick={() => {
                        setModelShow(true)
                        setData(record);
                    }}
                >编辑</Button>;
                const out = <Button
                    type="link"
                    onClick={() => {
                        setData(record)
                        setModelShow1(true)
                        getLog(record["id"])
                    }}
                >导出</Button>;
                const dele = <Popconfirm
                    description="确定要删除这条记录吗?"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => { del(record["id"]) }}
                >
                    <Button
                        type="link"
                        danger
                    >
                        删除
                    </Button>
                </Popconfirm>;

                return <Space>
                    {details}
                    {edit}
                    {out}
                    {/* {dele} */}
                </Space>;
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
    const arrayToTree = (arr) => {
        let map = {}; // 用于存放节点对象的字典
        arr.forEach((item) => {
            item['children'] = []; // 初始化每个节点的子节点列表
            if (!map[item.id]) {
                map[item.id] = item; // 将当前节点新增到字典中
            } else {
                Object.assign(map[item.id], item); // 如果已经有相同ID的节点，则合并属性值
            }
        });
        const roots = []; // 根节点集合
        for (let key in map) {
            const node = map[key];
            if (node.pid === null || !map[node.pid]) {
                roots.push(node); // 没有指定父节点或者父节点不在字典中时，认为该节点为根节点
            } else {
                map[node.pid].children.push(node); // 否则将其作为父节点的子节点
            }
        }
        return roots;
    }
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    return (
        <div className="content" style={{ height: "calc(100% - 46px)" }} ref={(node) => {
            set_fNode(node);
        }}>
            <AddOrEdit
                modelShow={modelShow}
                setModelShow={setModelShow}
                data={data}
                getList={getList}
                treeDataTxt={treeDataTxt}
                treeDataImg={treeDataImg}
            ></AddOrEdit>
            <Modal
                wrapClassName="template_model"
                title={"导出"}
                getContainer={false}
                open={modelShow1}
                width={666}
                onOk={() => exportData()}
                destroyOnClose={true}
                // confirmLoading={confirmLoading}
                onCancel={() => {
                    setModelShow1(false);
                }}
            >
                <Form
                    form={exportform}
                    name="exportData"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    onValuesChange={({ exportPNum }) => {
                        if (exportPNum) {
                            if (exportPNum == 1) {
                                setNumShow(false);
                            } else {
                                setNumShow(true);
                            }
                        }
                    }}
                >
                    <Form.Item
                        label="导出目的"
                        name={`exportPurpose`}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input cautocomplete="off" placeholder="导出目的" />
                    </Form.Item>
                    <Form.Item
                        label="导出数量"
                        name={`exportPNum`}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={1}>全部</Radio>
                            <Radio value={2}>部分</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {numShow ? <Form.Item
                        label="范围"
                        style={{
                            marginBottom: 0,
                        }}
                    >
                        <Form.Item
                            name="startIndex"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                            }}
                        >
                            <Input addonBefore="从" addonAfter="页" />
                        </Form.Item>
                        <Form.Item
                            name="endIndex"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            style={{
                                display: 'inline-block',
                                width: 'calc(50% - 8px)',
                                margin: '0 8px',
                            }}
                        >
                            <Input addonBefore="至" addonAfter="页" />
                        </Form.Item>
                    </Form.Item> : ""}
                    <Form.Item
                        label="导出类型"
                        name={`exportType`}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={1}>源数据</Radio>
                            <Radio value={2}>转txt 数据 </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                <List
                    style={{ height: "400px", overflow: "auto" }}
                    header="导出记录"
                    itemLayout="vertical"
                    size="small"
                    dataSource={logs}
                    renderItem={(item, i) => (
                        <List.Item
                            key={i}
                            extra={item.exportTime}
                            actions={[
                                <>导出数量：{item.exportNumber}</>
                            ]}
                        >
                            <List.Item.Meta
                                title={`导出类型：${item.exportTypeName}`}
                                description={`操作人：${item.userName}`}
                            />
                            导出目的：{item.exportPurpose}
                        </List.Item>
                    )}
                />
            </Modal>
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
                                name={`dataName`}
                                label={`数据集名称`}
                            >
                                <Input cautocomplete="off" placeholder="数据集名称" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item
                                name={`ipAddress`}
                                label={`存储位置`}
                            >
                                <Input cautocomplete="off" placeholder="存储位置" style={{ width: 200 }} />
                            </Form.Item>
                            <Form.Item label="导入时间" name={`time`} >
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
                            <Button type="primary" onClick={() => {
                                setData({})
                                setModelShow(true)
                            }}>
                                导入
                            </Button>
                            <Button type="primary" onClick={() => {
                                exportExcel()
                            }}>
                                生成台账信息
                            </Button>
                        </Space>

                    </div>
                    <div
                        className="middle"
                        style={tokenStyle}
                    >
                        <Table
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (newSelectedRowKeys, selectedRows) => {
                                    setSelectedRowKeys(newSelectedRowKeys);
                                },
                            }}
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
        let importStartTime;
        let importEndTime;
        if (values.time) {
            importStartTime = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
            importEndTime = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        const temp = _.pickBy({ ...values, dataType: 1, importStartTime, importEndTime, pageSize: pagination.pageSize, pageNum: pagination.current }, _.identity);
        const { rows, total, code } = await getTaskList(temp);
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
        //     let temp = data.map(item => {
        //         return {
        //             value: item.pkId,
        //             label: item.categoryName,
        //         }
        //     });
        //     setCategoryList(temp)
        // } else {
        // }
        let res = await getTagTreeAll({ type: 1 });
        if (res?.code == 200) {
            setTreeDataTxt(arrayToTree(res.data))
        }
        res = await getTagTreeAll({ type: 0 });
        if (res?.code == 200) {
            setTreeDataImg(arrayToTree(res.data))
        }
    }
    async function getLog(dataId) {
        const { rows, code } = await getExportLog({ dataId, pageSize: 10, pageNum: 1 });
        if (code == 200) {
            setLogs(rows)
        } else {
        }

    }
    async function del(id) {
        const { code, msg, data } = await delTask({ dataId: id })
        if (code == 200) {
            message.success(msg);
            getList()
        } else {
            message.error(msg);
        }
    }
    async function exportData() {
        exportform.validateFields().then(async (values, e, r) => {
           delete values.exportPNum;
            let url = SERVERURL;
            url += "/collections/dataManage/exportDataManage";
            url += `?${Qs.stringify({ ...values, dataId: data.id, })}`;
             Util.download(url);
            setModelShow1(false)
        });
    };
    async function exportExcel() {
        let url = SERVERURL;
        url += "/collections/dataManage/exportExcel";
        url += `?${Qs.stringify({ dataIds: selectedRowKeys })}`;
        Util.download(url);
    };
}




