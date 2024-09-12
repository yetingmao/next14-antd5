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
import { addDept, updateDept } from "../api";
import { Util,IconUtil } from "@/utils";
const { createIcon } = IconUtil;
const { Option } = Select;


export default function ({ data, modalShow, setModalShow, treeData, getList, iconList }) {

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      deptId: data.deptId ?? "",
      deptName: data.deptName ?? "",
      email: data.email ?? "",
      leader: data.leader ?? "",
      orderNum: data.orderNum ?? "",
      parentId: data.parentId ?? "",
      phone: data.phone ?? "",
      status: data.status ?? "0",
    })
  }, [data])

  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        setConfirmLoading(true)
        if (!!values.deptId) {//修改
          const res = await updateDept(values)
          if (res?.code == 200) {
            message.success(res.msg)
            setConfirmLoading(false)
            setModalShow(false)
            getList()
          } else {
            setConfirmLoading(false)
            message.error(res.msg)
          }
        } else {
          const res = await addDept(values)
          if (res?.code == 200) {
            message.success(res.msg)
            setConfirmLoading(false)
            setModalShow(false)
            getList()
          } else {
            setConfirmLoading(false)
            message.error(res.msg)
          }
        }
      })
  }

  return (
    <Modal
      wrapClassName="template_model"
      title={data.deptId ? "修改" : "添加"}
      getContainer={false}
      open={modalShow}
      width={666}
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
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name={`deptId`}
              label="deptId"
              hidden={true}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name={`parentId`}
              label="上级部门"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TreeSelect
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                treeData={treeData}
                placeholder="请选择上级部门"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name={`deptName`}
              label="部门名称"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="请填写名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`orderNum`}
              label="显示顺序"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="请填写" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`leader`}
              label="负责人"
            >
              <Input placeholder="请填写负责人" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`phonenumber`}
              label="手机号码"
              rules={[{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`email`}
              label="邮箱"
              rules={[{ type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`status`}
              label="部门状态"
            >
              <Radio.Group>
                <Radio value={"0"}>正常</Radio>
                <Radio value={"1"}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}