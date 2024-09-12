"use client";

import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Button,
  Form,
  Input,
  theme,
  Upload,
  message,
  Space,
  Skeleton,
  Descriptions,
  Empty
} from 'antd';
import {
  UploadOutlined,
  AudioOutlined
} from "@ant-design/icons";
import { getVoiceprintUSer } from "@/api"
import Recorder from 'js-audio-recorder'

export default function () {


  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [recorder, setRecorder] = useState()
  const [data, setData] = useState({})
  const [confirmLoading, setConfirmLoading] = useState(false)

  const [audioData, setAudioData] = useState({
    start: false
  });
  const fileList = Form.useWatch("fileList", form);

  useEffect(() => {
    setRecorder(new Recorder())
    return () => {
      if (recorder) {
        recorder.stop()
      }
    }
  }, [])

  const contentStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12
  }

  const operationStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  }

  function luyin() {
    if (audioData.start) {
      end()
    } else {
      start()
    }
  }

  function start() {
    setAudioData({
      ...audioData,
      start: true,
      str: ""
    })
    Recorder.getPermission().then(() => {
      console.log('开始录音')
      recorder.start() // 开始录音
    }, (error) => {
      console.log(`${error.name} : ${error.message}`)
    })
  }

  function end() {
    recorder.pause() // 暂停录音
    setAudioData({
      ...audioData,
      start: false,
      loading: true,
      str: ""
    })
    const blob = recorder.getWAVBlob()// 获取wav格式音频数据
    // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
    const newbolb = new Blob([blob], { type: 'audio/wav' })
    const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')

    form.setFieldValue("fileList", [fileOfBlob])

    // let url = window.URL.createObjectURL(newbolb);
    // let link = document.createElement("a");
    // link.style.display = "none";
    // link.href = url;
    // const fileName = new Date().getTime() + '.wav'
    // link.setAttribute("download", decodeURI(fileName));
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link)
    // window.URL.revokeObjectURL(url)

    recorder.stop()
  }

  async function onFinish(values) {
    setConfirmLoading(true)
    setData({})
    let fileParam = new FormData();
    fileParam.append('file', values.fileList[0].originFileObj || values.fileList[0])
    const res = await getVoiceprintUSer(fileParam)
    if (res?.code == 200) {
      message.success(res.msg)
      setData(res.data)
    } else {
      message.error(res.msg)
      setData({})
    }
    setConfirmLoading(false)
  }

  return (
    <>
      <div style={operationStyle}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item
            label="音频文件"
            name="fileList"
            valuePropName="fileList"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            rules={[{ required: true, message: "请上传文件或录音" }]}
            getValueFromEvent={normFile}
            style={{ width: 400 }}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept=".wav"
              disabled={audioData.start}
            >
              {
                (!fileList || !fileList.length)
                &&
                <Space>
                  <Button icon={<UploadOutlined />} disabled={audioData.start}>上传（.wav）</Button>
                  <Button
                    icon={<AudioOutlined spin={audioData.start} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      luyin();
                    }}>
                    {
                      audioData.start ? "停止录音" : "录音（.wav）"
                    }
                  </Button>
                </Space>
              }

            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Space>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                {
                  confirmLoading
                    ?
                    "正在识别"
                    :
                    "开始识别"
                }
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div >
      <div style={contentStyle} >
        {
          data.id
            ?
            <Descriptions title="声纹识别结果">
              <Descriptions.Item label="用户名">{data.featureUserName}</Descriptions.Item>
              <Descriptions.Item label="部门名">{data.deptName}</Descriptions.Item>
              <Descriptions.Item label="相似度">{data.similarity}</Descriptions.Item>
              <Descriptions.Item label="声纹创建时间">{data.creatTime}</Descriptions.Item>
            </Descriptions>
            :
            confirmLoading ?
              <Skeleton active /> :
              <Empty />
        }
      </div>
    </>
  );
};