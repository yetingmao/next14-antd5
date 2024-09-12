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
} from "antd";
import { addUser, updateUser, getUserDetail } from "../api";
import { IconUtil } from "@/utils";
const { createIcon } = IconUtil;
const { Option } = Select;

export default function ({
  data,
  modalShow,
  setModalShow,
  getList,
  roleList,
  postList,
  deptList,
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
   if(data){
     getDetail(data);
   }
  }, [data]);

  return (
    <Modal
      wrapClassName="template_model"
      title={data.userId ? "修改" : "添加"}
      getContainer={false}
      open={modalShow}
      width={600}
      onOk={() => addOrUp()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setModalShow(false);
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
            <Form.Item name={`userId`} label="userId" hidden={true}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`nickName`}
              label="用户昵称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={`deptId`} label="归属部门">
              <TreeSelect
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
                fieldNames={{
                  label: "label",
                  value: "id",
                  children: "children",
                }}
                treeData={deptList}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`phonenumber`}
              label="手机号码"
              rules={[
                { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={`email`} label="邮箱" rules={[{ type: "email" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`userName`}
              label="用户名称"
              hidden={data.userId}
              rules={[{ required: true }]}
            >
              <Input cautocomplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`password`}
              label="密码"
              hidden={data.userId}
              rules={[{ required: true }]}
            >
              <Input.Password  cautocomplete="off"/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={`sex`} label="性别">
              <Select>
                <Option value="0">男</Option>
                <Option value="1">女</Option>
                <Option value="2">保密</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={`status`} label="状态">
              <Radio.Group>
                <Radio value={"0"}>正常</Radio>
                <Radio value={"1"}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={`postIds`} label="岗位">
              <Select
                fieldNames={{ label: "postName", value: "postId" }}
                options={postList}
                mode="multiple"
              ></Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={`roleIds`} label="角色">
              <Select
                fieldNames={{ label: "roleName", value: "roleId" }}
                options={roleList}
                mode="multiple"
              ></Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name={`remark`}
              label="备注"
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
  async function addOrUp() {
    form.validateFields()
    .then(async (values, e, r) => {
      console.log("22222",values)
      setConfirmLoading(true);
      if (values.userId) {
        //修改
        const res = await updateUser(values);
        if (res?.code == 200) {
          message.success(res.msg);
          setConfirmLoading(false);
          setModalShow(false);
          getList();
        } else {
          setConfirmLoading(false);
          message.error(res.msg);
        }
      } else {
        const res = await addUser(values);
        if (res?.code == 200) {
          message.success(res.msg);
          setConfirmLoading(false);
          setModalShow(false);
          getList();
        } else {
          setConfirmLoading(false);
          message.error(res.msg);
        }
      }
    })
  }
  async function getDetail(item) {
    if (item.userId) {
      const res = await getUserDetail(item.userId);
      const userDetail = res.data;
      form.setFieldsValue({
        userId: userDetail.userId ?? "",
        nickName: userDetail.nickName ?? "",
        deptId: userDetail.deptId ?? "",
        phonenumber: userDetail.phonenumber ?? "",
        email: userDetail.email ?? "",
        userName: userDetail.userName ?? "",
        sex: userDetail.sex ?? "",
        status: userDetail.status ?? "0",
        postIds: userDetail.postIds ?? [],
        roleIds: userDetail.roleIds ?? [],
        remark: userDetail.remark ?? "",
      });
    } else {
      form.setFieldsValue({
        userId: "",
        nickName: "",
        deptId: "",
        phonenumber: "",
        email: "",
        userName: "",
        sex: "",
        status: "0",
        postIds: [],
        roleIds: [],
        remark: "",
      });
    }
  }
}
