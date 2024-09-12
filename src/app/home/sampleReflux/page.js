"use client"
import React, { useRef, useState, useEffect, useForm, useMemo } from "react";
import {
    Button,
    Radio,
    theme,
    Input,
    Row,
    Col,
    Card,
    Statistic,
    Form,
    DatePicker,
    Table,
    Space
} from "antd";
import { ArrowUpOutlined, AreaChartOutlined } from '@ant-design/icons';
import { Util } from "@/utils";
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs';
import weekday from "dayjs/plugin/weekday"
import {
    getDatas,
} from "./api";
import "dayjs/locale/zh-cn";
import _ from "lodash";
import { Pie3D1, Bar3D1 } from "@/charts"
const { RangePicker } = DatePicker;
let utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
dayjs.extend(weekday)
export default function () {
    const { token } = theme.useToken();
    const tokenStyle = {
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,

    };
    const chartStyle = {
        background: "rgba(0, 40, 119, 0.72)",
        border: "0.6px solid",
        borderColor: "rgba(143, 248, 255, 0.77)",
        borderradius: "6px",
        boxShadow: "0px 0px 30px #00eeff inset",
    }
    const [_fNode, set_fNode] = useState();
    const [_bNode1, set_bNode1] = useState();
    const [_bNode2, set_bNode2] = useState();
    const [tHeight, setTHeight] = useState(0);
    useEffect(() => {
        if (_fNode && _bNode1) {
            setTHeight(Util.initTableHeight(_fNode, [_bNode1,], 127)); //表头
        }
    }, [_fNode, _bNode1, _bNode2]);

    //首页初次加载，只根据分页去更新列表
    const [pagination, setPagination] = useState({
        hideOnSinglePage: false, //只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        defaultPageSize: 10, //默认每页多少条
        pageSize: 10, //每页多少条
    });
    const [queryForm] = Form.useForm();
    const [bar1, setBar1] = useState();
    const [pie3D1, setPie3D1] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [data, setData] = useState({});
    useMemo(() => {
        if (pagination.current) {
            getList()
        }
        const a = dayjs().month(dayjs().month()).format('YYYY-MM-01 00:00:00')
        console.log(a)
    }, [pagination.current]);

    const columns = [
        {
            title: "存储卷名称",
            key: "storageVolume",
            dataIndex: "storageVolume",
            align: "center",
        },
        {
            title: "日志抓取总数",
            key: "totalCount",
            dataIndex: "totalCount",
            align: "center",
        },
        // {
        //     title: "解析条数",
        //     key: "analysisCount",
        //     dataIndex: "analysisCount",
        //     align: "center",
        // },
        {
            title: "还原图片数量",
            key: "imageCount",
            dataIndex: "imageCount",
            align: "center",

        },
        {
            title: "调用成功数量",
            key: "successCount",
            dataIndex: "successCount",
            align: "center",
        },
        {
            title: "调用失败数量",
            key: "failCount",
            dataIndex: "failCount",
            align: "center",
        },
        {
            title: "调用时间",
            key: "storageTime",
            dataIndex: "storageTime",
            align: "center",
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
        <div className="content" style={{ height: "100%", overflow: "auto" }} ref={(node) => {
            set_fNode(node);
        }}>
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
                                name={`type`}
                                label={``}
                            >
                                <Radio.Group defaultValue="year">
                                    <Radio.Button value="week">本周</Radio.Button>
                                    <Radio.Button value="month">本月</Radio.Button>
                                    <Radio.Button value="year">本年</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="自定义日期" name={`time`} >
                                <RangePicker showTime />
                            </Form.Item>
                            <Form.Item label={` `} colon={false}>
                                <Space>
                                    <Button onClick={getList} type="primary">查询</Button>
                                    <Button onClick={resetQuery} htmlType="reset" >重置</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                    <div
                        className="middle"
                        style={{ ...tokenStyle, height: tHeight + "px", width: "100%" }}
                    >

                        <Card
                            title={"存储卷数据统计"}
                            style={{ width: "100%" }}
                        >
                            <Row gutter={[16, 16]} style={{ height: "700px", width: "100%" }} align="middle">
                                <Col span={12} style={{ ...chartStyle,height: "50%" }}>
                                    <Pie3D1 data={{
                                        data: pie3D1
                                    }

                                    } />
                                </Col>
                                <Col span={12} style={{...chartStyle, height: "50%" }}>
                                    <Row gutter={[16, 16]} justify="center" align="middle" style={{...chartStyle, height: "100%" }}>
                                        <Col span={12} >
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <AreaChartOutlined style={{ fontSize: "46px" }} />
                                                <Statistic
                                                    title="日志抓取总数"
                                                    value={data.totalCount}
                                                    valueStyle={{ color: 'rgb(0, 204, 255)' }}
                                                    prefix={<ArrowUpOutlined />}
                                                />
                                            </div>

                                        </Col>
                                        <Col span={12} >
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <AreaChartOutlined style={{ fontSize: "46px" }} />
                                                <Statistic
                                                    title="还原图片数量"
                                                    value={data.imageCount}
                                                    valueStyle={{ color: 'rgb(0, 204, 255)' }}
                                                    prefix={<ArrowUpOutlined />}
                                                />
                                            </div>

                                        </Col>
                                        <Col span={12} >
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <AreaChartOutlined style={{ fontSize: "46px" }} />
                                                <Statistic
                                                    title="调用成功数量"
                                                    value={data.successCount}
                                                    valueStyle={{ color: 'rgb(0, 204, 255)' }}
                                                    prefix={<ArrowUpOutlined />}
                                                />
                                            </div>

                                        </Col>
                                        <Col span={12} >
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <AreaChartOutlined style={{ fontSize: "46px" }} />
                                                <Statistic
                                                    title="调用失败数量"
                                                    value={data.failCount}
                                                    valueStyle={{ color: 'rgb(0, 204, 255)' }}
                                                    prefix={<ArrowUpOutlined />}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col span={24} style={{...chartStyle, height: "50%" }}>
                                    <Bar3D1 data={bar1} />
                                </Col>
                            </Row>

                        </Card>
                        <Table
                            rowKey={(record) => record.storageVolume}
                            columns={columns}
                            dataSource={dataList}
                            pagination={pagination}
                            scroll={{ y: 400, scrollToFirstRowOnChange: true }}
                            onChange={handleTableChange}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
    async function getList() {
        const values = queryForm.getFieldsValue();
        let startTime;
        let endTime = dayjs().format('YYYY-MM-DD HH:mm:ss');;
        if (values.time) {
            startTime = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
        } else {
            if (values.type == "week") {
                startTime = dayjs().weekday(1).format('YYYY-MM-DD 00:00:00');
            } if (values.type == "month") {
                startTime = dayjs().month(dayjs().month()).format('YYYY-MM-01 00:00:00');
            } else {
                startTime = dayjs().format('YYYY-01-01 00:00:00');
            }
        }
        //  const temp = _.pickBy({ ...values, startTime, endTime, taskType: "1", pageSize: pagination.pageSize, pageNum: pagination.current }, _.identity);
        const { data, code } = await getDatas({ startTime, endTime });
        //  setLoading(false);
        if (code == 200) {
            setData(data)
            setDataList(data.storageCount)
            const obj = {
                name: [],
                value: [],
            };
            const temp = data.storageCount.map(item => {
                obj.name.push(item.storageVolume)
                obj.value.push([item.totalCount, item.imageCount, item.successCount, item.failCount])
                return {
                    name: item.storageVolume,
                    value: item.totalCount,
                }
            })
            setPie3D1(temp)
            setBar1(obj)
            //  setPagination({ ...pagination, total: total });
        } else {
        }
    }


}




