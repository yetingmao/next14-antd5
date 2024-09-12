import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  TreeSelect,
  Tree,
  Radio,
  Select,
  Space,
  InputNumber,
  message,
} from "antd";
import { addRole, updateRole, getRoleDetail, getRoleMenuTreeselect } from "../api";
import { Util, IconUtil, permission } from "@/utils";
const { createIcon } = IconUtil;
const { Option } = Select;

export default function ({ data, modalShow, setModalShow, getList, menuData }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState([]); 
  const [halfCheckedKeys, setHalfCheckedKeys] = useState([]);

  useEffect(() => {
    async function getDetail(item) {
      let checkedKeys = [];
      if (item.roleId) {
        const res = await getRoleMenuTreeselect(item.roleId);
        checkedKeys = res.menus.checkedKeys;
      }
      setCheckedKeys(checkedKeys);
      form.setFieldsValue({
        roleId: item.roleId ?? "",
        roleName: item.roleName ?? "",
        roleKey: item.roleKey ?? "",
        roleSort: item.roleSort ?? "",
        dataScope: item.dataScope ?? "",
        deptIds: item.deptIds ?? [],
        menuCheckStrictly: item.menuCheckStrictly ?? true,
        deptCheckStrictly: item.deptCheckStrictly ?? true,
        status: item.status ?? "0",
        delFlag: item.delFlag ?? "",
        createBy: item.createBy ?? "",
        createTime: item.createTime ?? "",
        updateBy: item.updateBy ?? "",
        updateTime: item.updateTime ?? "",
        remark: item.remark ?? "",
        menuIds: checkedKeys,
      });
    }
    getDetail(data);
  }, [data]);

  const onCheck = (checkedKeys, { halfCheckedKeys }) => {
    setCheckedKeys(checkedKeys);
    setHalfCheckedKeys(halfCheckedKeys)
  };

  async function addOrUp() {
    form.validateFields().then(async (values, e, r) => {
      setConfirmLoading(true);
      if (!!values.roleId) {
        //修改
        const res = await updateRole({ ...values, menuIds: [...checkedKeys,...halfCheckedKeys] });
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
        const res = await addRole({ ...values, menuIds: [...checkedKeys,...halfCheckedKeys] });
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
    });
  }

  return (
    <Modal
      wrapClassName="template_model"
      title={data.roleId ? "修改" : "添加"}
      getContainer={false}
      open={modalShow}
      width={444}
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
            <Form.Item
              name={`menuCheckStrictly`}
              label="menuCheckStrictly"
              hidden={true}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={`deptCheckStrictly`}
              label="deptCheckStrictly"
              hidden={true}
            >
              <Input />
            </Form.Item>
            <Form.Item name={`deptIds`} label="deptIds" hidden={true}>
              <Input />
            </Form.Item>
            <Form.Item name={`roleId`} label="roleId" hidden={true}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`roleName`}
              label="角色名称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name={`roleKey`}
              label="角色编码"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={`roleSort`}
              label="角色顺序"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="请填写" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name={`menuIds`} label="菜单权限">
              <Tree
                checkable
                // checkStrictly={true}
                multiple={true}
                treeData={menuData}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name={`status`} label="状态">
              <Radio.Group>
                <Radio value={"0"}>正常</Radio>
                <Radio value={"1"}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name={`remark`} label="备注">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
