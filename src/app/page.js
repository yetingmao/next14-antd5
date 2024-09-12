"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import ViewContext from "@/component/viewContext";
import {
  Tooltip,
  Radio,
  theme,
  Descriptions,
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
import { DJbAR1, Pie2, LiquidFill1, Bar2 } from "@/charts"
import { getData1, getData2, getData3 } from "./api"
import { forEach } from "lodash";
const { RangePicker } = DatePicker;
export default function Home() {
  useEffect(() => {
    async function getLoader() {
      const { quantum, dotStream, grid, helix } = await import('ldrs')
      quantum.register();
      dotStream.register()
      grid.register()
      helix.register()
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
    height: "100%", width: "11%", position: "relative", color: "rgb(51,242,245)",
    fontSize: "16px"
  }
  const style2 = {
    width: "100%", height: "100%", position: "absolute", top: 0, left: 0,
  }
  const style3 = {
    width: "91px",
    color: "rgb(51,242,245)",
    fontSize: "16px",
    zIndex: 1,
    position: "absolute",
    lineHeight: 1,
    marginTop: "30px",
    textAlign: "center",
  }
  const style4 = {
    height: "100px", width: "11%",
    alignContent: "center"
  }

  const [queryForm] = Form.useForm();
  const resetQuery = () => {
    queryForm.resetFields()
    resetPaginationGetList()
  }
  useEffect(() => {
    getList1()
    getList()
  }, []);

  const [data1, setData1] = useState({
    name: [],
    data: []
  });
  const [data2, setData2] = useState([]);
  const [type, setType] = useState("1");
  const [data3, setData3] = useState([]);
  useEffect(() => {
    getList2(type)
  }, [type]);
  const [data4, setData4] = useState({});
  const [data5, setData5] = useState({
    name: [],
    data: { name: ["文本", "图像"], value: [[], []] },
  });
  const [data6, setData6] = useState({
    name: [],
    data: { name: ["文本", "图像"], value: [[], []] },
  });
  return (
    <main style={{ width: "100%", height: "100%" }} >
      <div style={{ width: "100%", height: "100%", position: "relative", marginTop: "0px" }}>
        <Row style={{ width: "100%", height: "60%" }}>
          <Col span={16} style={{ ...boxStyle, height: "100%" }}>
            <div style={{ height: "35px", marginLeft: "10px", fontSize: "18px", fontWeight: "bold" }}>样本处理流程概括</div>
            <div style={{ height: "calc(100% - 35px)" }}>
              <div style={{ height: "33.3%", display: "flex", alignItems: "center" }}>
                <Tooltip title="样本清洗（样本清理）：去除重复与错误数据，保证数据质量">
                  <div style={{
                    width: "18%", textAlign: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <l-quantum
                        size="100"
                        speed="3"
                        color="rgb(3,124,248)"
                      ></l-quantum>
                    </div>

                    <div style={{
                      color: "rgb(51,242,245)",
                      fontSize: "18px"
                    }}>样本清洗</div>
                  </div>
                </Tooltip>
                <div style={{ width: "82%", width: "100%", display: "flex", alignContent: "center" }}>
                  <Tooltip title={data4.d1}>
                    <div style={style1}>
                      <img src={index3.src} style={style2}></img>
                      <div style={style3}>临时库本地上传(数量)</div>
                    </div>
                  </Tooltip>
                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d2}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>添加清洗任务(数量)</div>
                    </div>
                  </Tooltip>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d3}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>自身清洗(数量)</div>
                    </div>
                  </Tooltip>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d4}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>全库对比(数量)</div>
                    </div>
                  </Tooltip>
                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d5}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>提交审核(数量)</div>
                    </div>
                  </Tooltip>

                </div>
              </div>
              <div style={{ height: "33.3%", display: "flex", alignItems: "center" }}>
                <Tooltip title="样本脱敏（数据去标识化）：保护个人信息，确保数据隐私安全">
                  <div style={{
                    width: "18%", textAlign: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <l-grid
                        size="100"
                        speed="3"
                        color="rgb(3,124,248)"
                      ></l-grid>
                    </div>

                    <div style={{
                      color: "rgb(51,242,245)",
                      fontSize: "18px"
                    }}>样本脱敏</div>
                  </div>
                </Tooltip>

                <div style={{ width: "82%", display: "flex", alignContent: "center" }}>
                  <Tooltip title={data4.d6}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>添加脱敏任务(数量)</div>
                    </div>
                  </Tooltip>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <div style={style1}>
                    <img src={index2.src} style={style2}></img>
                    <div style={style3}>选择样本库脱敏路径</div>
                  </div>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d7}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>查看脱敏结果（数量）</div>
                    </div>
                  </Tooltip>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d7}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>提交审核(数量)</div>
                    </div>
                  </Tooltip>

                </div>
              </div>
              <div style={{ height: "33.3%", display: "flex", alignItems: "center" }}>
                <Tooltip title="样本扩充（数据增强）：提升数据集多样性，增强模型训练效果">
                  <div style={{
                    width: "18%", textAlign: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                      <l-helix
                        size="100"
                        speed="3"
                        color="rgb(3,124,248)"
                      ></l-helix>
                    </div>

                    <div style={{
                      color: "rgb(51,242,245)",
                      fontSize: "18px"
                    }}>样本扩充</div>
                  </div>
                </Tooltip>

                <div style={{ width: "82%", display: "flex", alignContent: "center" }}>
                  <Tooltip title={data4.d9}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>添加扩充任务(数量)</div>
                    </div>
                  </Tooltip>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>

                  <div style={style1}>
                    <img src={index2.src} style={style2}></img>
                    <div style={style3}>选择样本库扩充路径 、扩充方式</div>
                  </div>
                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d10}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>查看扩充结果(数量)</div>
                    </div>
                  </Tooltip>

                  <div style={style4}>
                    <l-dot-stream
                      size="80"
                      speed="2.5"
                      color="rgb(3,124,248)"
                    ></l-dot-stream>
                  </div>
                  <Tooltip title={data4.d11}>
                    <div style={style1}>
                      <img src={index2.src} style={style2}></img>
                      <div style={style3}>提交审核(数量)</div>
                    </div>
                  </Tooltip>

                </div>
              </div>
              <div>
              </div>
            </div>
          </Col>
          <Col span={8} style={{ ...boxStyle, height: "100%" }}>
            <Row style={{ width: "100%", height: "100%" }}>
              <Col span={24} style={{ ...boxStyle, height: "50%" }}>
                <DJbAR1 data={data5} /></Col>
              <Col span={24} style={{ ...boxStyle, height: "50%" }}>
                <DJbAR1 data={data6} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ width: "100%", height: "40%" }}>
          <Col span={12} style={{ ...boxStyle, height: "100%" }}>
            <Row style={{ width: "100%", height: "100%" }}>
              <Col span={14} style={{ height: "100%" }}>
                <Pie2 data={{
                  title: "样本回流数据统计",
                  name: data1.name,
                  data: data1.data,
                }} />
              </Col>
              <Col span={10} style={{ height: "100%" }}>
                <LiquidFill1 data={{
                  name: ["日志抓取", "还原图片", "调用成功", "调用失败"],
                  data: data2,
                }} />
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ ...boxStyle, height: "100%", position: "relative" }}>

            <Bar2 data={data3} />
            <div style={{ position: "absolute", top: "5px", left: "30%" }}>
              <Radio.Group value={type} onChange={(e) => {
                setType(e.target.value)
              }}>
                <Radio.Button value="1">清洗</Radio.Button>
                <Radio.Button value="2">脱敏</Radio.Button>
                <Radio.Button value="3">扩充</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
        </Row>
      </div>
    </main>
  );
  async function getList1() {
    const { data, code } = await getData1();
    if (code == 200) {
      const { failCount, imageCount, storageCount, successCount, totalCount } = data;
      const name = [];
      const temp1 = storageCount.map(item => {
        name.push(item.storageVolume)
        return {
          name: item.storageVolume,
          value: item.totalCount,
        }
      })
      setData1({ name, data: temp1 })
      setData2([totalCount, imageCount, successCount, failCount])

    } else {
    }
  }
  async function getList2() {
    const { data, code } = await getData2({ type });
    if (code == 200) {
      const name = [];
      const before = [];
      const after = [];
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key];
          name.push(key)
          before.push(element.before)
          after.push(element.after)
        }
      }
      setData3({
        name,
        before,
        after
      })

    } else {
    }
  }
  async function getList() {
    const { data, code } = await getData3();
    //  setLoading(false);
    let d1 = "";
    let d2 = "";
    let d3 = "";
    let d4 = "";
    let d5 = "";
    let d6 = "";
    let d7 = "";
    let d8 = "";
    let d9 = "";
    let d10 = "";
    let d11 = "";
    let d12 = {
      name: [],
      data: { name: ["文本", "图像"], value: [[], []] },
    };
    let d13 = {
      name: [],
      data: { name: ["文本", "图像"], value: [[], []] },
    };
    if (code == 200) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const element = data[key];
          if (key == "临时库本地上传") {
            d1 = <Descriptions size="small" items={element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            })} />
          }
          if (key == "添加扩充任务数量") {
            d2 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有清洗任务数量，不包含删除的任务 ",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "自身清洗数量") {
            d3 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有自身清洗数量，不包含删除的样本 ",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "全库对比数量") {
            d4 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有全库对比数量，不包含删除的样本 ",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "清洗任务提交审核数量") {
            d5 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有提交审核数量，不包含删除的样本 ",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "添加脱敏任务数量") {
            d6 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有脱敏任务数量，不包含删除的任务",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "查看脱敏结果") {
            d7 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有脱敏结果数量，不包含删除的样本",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "脱敏提交审核数量") {
            d8 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有提交审核数量，不包含删除的样本",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "添加扩充任务数量") {
            d9 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有扩充任务数量，不包含删除的任务",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "查看扩充结果") {
            d10 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有扩充结果数量，不包含删除的样本 ",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "扩充提交审核数量") {
            d11 = <Descriptions size="small" items={[{
              key: 100,
              label: "",
              children: "统计所有提交审核数量，不包含删除的样本 ",
              span: 3,
            }, ...(element.map((item, i) => {
              return {
                key: i,
                label: item["type"],
                children: item.count,
                span: 3,
              }
            }))]} />
          }
          if (key == "样本库样本总数") {
            d12.name.push("样本库")
            element.forEach(item => {
              if (item.type == "文本") {
                d12.data.value[0].push(item.count)
              } else if (item.type == "图像") {
                d12.data.value[1].push(item.count)
              }
            });
          }
          if (key == "临时库样本总数") {
            d12.name.push("临时库")
            element.forEach(item => {
              if (item.type == "文本") {
                d12.data.value[0].push(item.count)
              } else if (item.type == "图像") {
                d12.data.value[1].push(item.count)
              }
            });
          }
          if (key == "回收站样本总数") {
            d12.name.push("回收站")
            element.forEach(item => {
              if (item.type == "文本") {
                d12.data.value[0].push(item.count)
              } else if (item.type == "图像") {
                d12.data.value[1].push(item.count)
              }
            });
          }
          if (key == "扩充模型数量") {
            d13.name.push("扩充模型")
            element.forEach(item => {
              if (item.type == "文本") {
                d13.data.value[0].push(item.count)
              } else if (item.type == "图像") {
                d13.data.value[1].push(item.count)
              }
            });
          }
          if (key == "清洗模型数量") {
            d13.name.push("清洗模型")
            element.forEach(item => {
              if (item.type == "文本") {
                d13.data.value[0].push(item.count)
              } else if (item.type == "图像") {
                d13.data.value[1].push(item.count)
              }
            });
          }
          if (key == "脱敏模型数量") {
            d13.name.push("脱敏模型")
            element.forEach(item => {
              if (item.type == "文本") {
                d13.data.value[0].push(item.count)
              } else if (item.type == "图像") {
                d13.data.value[1].push(item.count)
              }
            });
          }
        }
      }
      setData4({
        d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11
      });
      setData5({
        ...d12,
        title: "样本数据统计",
      })
      setData6({
        ...d13,
        title: "模型数据统计",
      })
    }
  }
}