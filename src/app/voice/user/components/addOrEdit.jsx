import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  TreeSelect,
  Radio,
  Select,
  Space,
  InputNumber,
  message,
  Upload,
  Button
} from "antd"
import Recorder from 'js-audio-recorder'
import {
  UploadOutlined,
  AudioOutlined
} from "@ant-design/icons";
import { addVoiceprint } from "@/api"

export default function ({ data, modalShow, setModalShow ,getList}) {

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [recorder, setRecorder] = useState()
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

  useEffect(() => {
    form.setFieldsValue({
      id: data.id ?? "",
      userName: data.userName ?? "",
      deptName: data.deptName ?? "",
      fileList: data.fileList ?? []
    })
  }, [data])

  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        setConfirmLoading(true)
        if (!!values.id) {//修改

        } else {
          let fileParam = new FormData();
          fileParam.append('userName', values.userName)
          fileParam.append('deptName', values.deptName)
          fileParam.append('file', values.fileList[0].originFileObj||values.fileList[0])

          const res = await addVoiceprint(fileParam)
          if(res?.code==200){
            message.success(res.msg)
            getList();
            cancel()
          }else{
            message.error(res.msg)
            setConfirmLoading(false)
          }
        }
      })
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
    recorder.stop()
    
    console.log(fileOfBlob)
  }

  function luyin() {
    if (audioData.start) {
      end()
    } else {
      start()
    }
  }

  function cancel(){
    if (recorder) {
      recorder.stop()
    }
    setConfirmLoading(false)
    setModalShow(false)
  }

  return (
    <Modal
      wrapClassName="template_model"
      title={data.deptId ? "修改" : "新增"}
      maskClosable={false}
      getContainer={false}
      open={modalShow}
      width={666}
      onOk={() => addOrUp()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      onCancel={() => {
        cancel()
      }}
    >
      <Form
        form={form}
        name="addOrEdit"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          name={`id`}
          label="id"
          hidden={true}
        >
          <Input  cautocomplete="off" />
        </Form.Item>
        <Form.Item
          name={`userName`}
          label="用户名字"
          rules={[
            {
              required: true,
            }
          ]}
        >
          <Input  cautocomplete="off" placeholder="请填写名称" />
        </Form.Item>
        <Form.Item
          name={`deptName`}
          label="部门名称"
          rules={[
            {
              required: true,
            }
          ]}
        >
          <Input  cautocomplete="off" placeholder="请填写名称" />
        </Form.Item>
        <Form.Item
          label="音频文件"
          name="fileList"
          valuePropName="fileList"
          rules={[{ required: true, message: "请上传文件或录音" }]}
          getValueFromEvent={normFile}
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
      </Form>
    </Modal>
  )
}