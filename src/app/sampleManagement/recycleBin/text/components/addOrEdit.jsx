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
  AudioOutlined,
  InboxOutlined
} from "@ant-design/icons";
import { setCleaning } from "@/api"

export default function ({ modalShow, setModalShow, getList }) {

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);


  useEffect(() => {
    form.setFieldsValue({
      cleaning: 1,
    })
  }, [])




  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        setConfirmLoading(true)
        const res = await setCleaning(values)
        if (res?.code == 200) {
          message.success(res.msg)
          setModalShow(false);
        } else {
          message.error(res.msg)
          setConfirmLoading(false)
        }
      })
  }

  return (
    <Modal
      wrapClassName="template_model"
      title={<>设置定时清理<span style={{ color: "red" }}>（针对设置后进入回收站的样本）</span></>}
      maskClosable={false}
      getContainer={false}
      open={modalShow}
      width={444}
      onOk={() => addOrUp()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setModalShow(false)
      }}
    >
      <Form
        form={form}
        name="addOrEdit"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name={`cleaning`}
          label="回收站保存时间"
          rules={[
            {
              required: true,
            }
          ]}
        >
          <Select
            style={{ width: "200px" }}
            options={
              Array.from(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                (e) => { return { value: e, label: e + "个月" } }
              )
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}