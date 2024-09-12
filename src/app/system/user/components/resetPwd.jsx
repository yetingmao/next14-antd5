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
} from "antd"
import { resetPwd } from "../api";
import { IconUtil } from "@/utils";
const { createIcon } = IconUtil;
const { Option } = Select;


export default function ({ data, modalShow, setModalShow, getList, roleList, postList, deptList }) {

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      userId: data.userId ?? "",
    })
  }, [data])

  const checkPassword = (rule, value) => {
    const login_password = form.getFieldValue('password');
    if (value === login_password) {
      // 校验条件自定义
      return Promise.resolve();
    }
    return Promise.reject(new Error('两次密码输入不一致'));
  }

  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        setConfirmLoading(true)
        const res = await resetPwd(values)
        if (res?.code == 200) {
          message.success(res.msg)
          setConfirmLoading(false)
          setModalShow(false)
          getList()
        } else {
          message.error(res.msg)
          setConfirmLoading(false)
        }
      })
  }

  return (
    <Modal
      wrapClassName="template_model"
      title={"修改密码"}
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
        labelCol={{ span: 6, offset: 2 }}
        wrapperCol={{ span: 12 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name={`userId`}
              label="userId"
              hidden={true}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`password`}
              label="密码"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`confirm_password`}
              label="确认密码"
              rules={[{ required: true }, { validator: checkPassword },]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal >
  )
}