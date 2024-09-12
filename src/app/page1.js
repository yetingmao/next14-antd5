
"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import ViewContext from "@/component/viewContext";
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
//import * as THREE from 'three';
import index1 from "/public/img/index1.svg"
import index2 from "/public/img/index2.svg"
import index3 from "/public/img/index3.svg"
import index4 from "/public/img/index4.svg"
import index5 from "/public/img/index5.svg"
import index6 from "/public/img/index6.svg"
import index7 from "/public/img/index7.svg"
import index8 from "/public/img/index8.svg"
import index9 from "/public/img/index9.svg"
import index10 from "/public/img/index10.svg"
import index11 from "/public/img/index11.svg"
import index12 from "/public/img/index12.svg"
import index13 from "/public/img/index13.svg"
import { DJbAR1, Pie2, LiquidFill1, Bar2 } from "@/charts"
import { getData1 } from "./api"
import { zoomies } from 'ldrs'
const { RangePicker } = DatePicker;
export default function Home() {
  useEffect(() => {
    async function getLoader() {
      const { zoomies } = await import('ldrs')
      zoomies.register()
    }
    getLoader()
  }, []);
  const { token } = theme.useToken();
  const tokenStyle = {
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,

  };

  const boxStyle = {
    background: "rgba(0, 40, 119, 0.6)",
    border: "0.6px solid",
    borderColor: "rgba(143, 248, 255, 0.77)",
    borderradius: "6px",
    boxShadow: "0px 0px 30px #00eeff inset",
  }
  const style1 = {
    width: "11%", color: "rgb(51,242,245)",
    fontSize: "16px",
    zIndex: 1,
  }
  const style2 = {
    width: "100%",
  }
  const style3 = {
    color: "rgb(51,242,245)",
    fontSize: "14px",
    zIndex: 1,
    lineHeight: 1,
    textAlign: "center",
  }
  const style4 = {
    height: "100%", width: "9%",
    alignContent: "center",
    textAlign: "center"
  }

  const [queryForm] = Form.useForm();
  const resetQuery = () => {
    queryForm.resetFields()
    resetPaginationGetList()
  }
  const [data1, setData1] = useState();
  useEffect(() => {
    getList1()
  }, []);
  return (
    <main style={{ width: "100%", height: "100%" }} >
      <div style={{ width: "100%", height: "100%", position: "relative", marginTop: "0px" }}>
        <Row style={{ width: "100%", height: "60%" }}>
          <Col span={16} style={{ ...boxStyle, height: "100%" }}>
            <div style={{ height: "35px", marginLeft: "10px", fontSize: "18px", fontWeight: "bold" }}>样本处理流程概括</div>
            <div style={{ height: "calc(100% - 35px)" }}>
              <div style={{ height: "33.3%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={style1}>
                  <img src={index3.src} style={style2}></img>
                  <div style={style3}>临时库本地上传</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="3"
                    bg-opacity="0.8"
                    color="rgb(3,124,248)"
                    stroke="6"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index4.src} style={style2}></img>
                  <div style={style3}>添加清洗任务(数量)</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="4"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index8.src} style={style2}></img>
                  <div style={style3}>自身清洗(数量)</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="5"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index6.src} style={style2}></img>
                  <div style={style3}>全库对比(数量)</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="5"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index7.src} style={style2}></img>
                  <div style={style3}>提交审核(数量)</div>
                </div>
              </div>
              <div style={{ height: "33.3%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={style1}>
                  <img src={index5.src} style={style2}></img>
                  <div style={style3}>添加脱敏任务(数量)</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="3"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index11.src} style={style2}></img>
                  <div style={style3}>选择样本库脱敏路径</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="4"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index10.src} style={style2}></img>
                  <div style={style3}>查看脱敏结果（数量）</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="5"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index7.src} style={style2}></img>
                  <div style={style3}>提交审核(数量)</div>
                </div>
              </div>
              <div style={{ height: "33.3%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={style1}>
                  <img src={index12.src} style={style2}></img>
                  <div style={style3}>添加扩充任务(数量)</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="3"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index13.src} style={style2}></img>
                  <div style={style3}>选择样本库扩充路径 、扩充方式</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="4"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index9.src} style={style2}></img>
                  <div style={style3}>查看扩充结果(数量)</div>
                </div>
                <div style={style4}>
                  <l-zoomies
                    size="100"
                    speed="5"
                    bg-opacity="0.8"
                    stroke="6"
                    color="rgb(3,124,248)"
                  ></l-zoomies>
                </div>
                <div style={style1}>
                  <img src={index7.src} style={style2}></img>
                  <div style={style3}>提交审核(数量)</div>
                </div>
              </div>
              <div>
              </div>
            </div>
          </Col>
          <Col span={8} style={{ ...boxStyle, height: "100%" }}>
            <Row style={{ width: "100%", height: "100%" }}>
              <Col span={24} style={{ ...boxStyle, height: "50%" }}>
                <DJbAR1 data={{
                  title: "样本数据统计",
                  name: ["样本库", "临时库", "回收站"],
                  data: { name: ["文本", "图像"], value: [["100", "200", "300"], ["120", "250", "200"]] },
                }} /></Col>
              <Col span={24} style={{ ...boxStyle, height: "50%" }}>
                <DJbAR1 data={{
                  title: "模型数据统计",
                  name: ["清洗模型", "脱敏模型", "扩充模型"],
                  data: { name: ["文本", "图像"], value: [["10", "20", 0], ["12", "25", "50"]] },
                }} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ width: "100%", height: "40%" }}>
          <Col span={14} style={{ ...boxStyle, height: "100%" }}>
            <Row style={{ width: "100%", height: "100%" }}>
              <Col span={12} style={{ height: "100%" }}>
                <Pie2 data={{
                  title: "样本回流数据统计",
                  name: ["存储卷1", "存储卷2"],
                  data: [{ name: "存储卷1", value: 100 }, { name: "存储卷2", value: 200 }],
                }} />
              </Col>
              <Col span={12} style={{ height: "100%" }}>
                <LiquidFill1 data={{
                  name: ["日志抓取", "解析", "还原图片", "调用成功", "调用失败"],
                  data: [11003, 23453, 435112, 1243234, 231424],
                }} />
              </Col>
            </Row>
          </Col>
          <Col span={10} style={{ ...boxStyle, height: "100%" }}>
            <Bar2 /> </Col>
        </Row>
      </div>
    </main>
  );
  async function getList1() {
    const { data, code } = await getData1();
    if (code == 200) {
      setData(data)
      setDataList(data.storageCount)
      const obj = {
        name: [],
        value: [],
      };
    } else {
    }
  }
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
    // const { data, code } = await getDatas({ startTime, endTime });
    // //  setLoading(false);
    // if (code == 200) {
    //     setData(data)
    //     setDataList(data.storageCount)
    //     const obj = {
    //         name: [],
    //         value: [],
    //     };
    // } else {
    // }
  }
}
