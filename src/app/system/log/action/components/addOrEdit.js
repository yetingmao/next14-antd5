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
  message
} from "antd"
const { TextArea } = Input;

export default function ({ data, modalShow, setModalShow, getList }) {

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(data)
  }, [JSON.stringify(data)])

  return (
    <Modal
      wrapClassName="template_model"
      title="详情"
      getContainer={false}
      open={modalShow}
      width="50%"
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setModalShow(false)
      }}
    >
      <Form
        form={form}
        name="addOrEdit"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name={`title`}
              label="操作模块"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`operUrl`}
              label="请求地址"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`operLocation`}
              label="登录信息"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`requestMethod`}
              label="请求方式"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`method`}
              label="操作方法"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`operParam`}
              label="请求参数"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`jsonResult`}
              label="返回参数"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`costTime`}
              label="消耗时间"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`operTime`}
              label="操作时间"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input  disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}