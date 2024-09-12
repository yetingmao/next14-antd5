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
import { addMenu, updateMenu } from "../api";
import { IconUtil } from "@/utils";
const { createIcon } = IconUtil;
const { Option } = Select;


export default function ({ data, modalShow, setModalShow, treeData, getList, iconList }) {

  const [form] = Form.useForm()
  const [menuType, setMenuType] = useState("")
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setMenuType(data.menuType ?? "M")
    form.setFieldsValue({
      component: data.component ?? "",
      icon: data.icon ?? "",
      isFrame: data.isFrame ?? "1",
      menuId: data.menuId ?? "",
      menuName: data.menuName ?? "",
      menuType: data.menuType ?? "M",
      orderNum: data.orderNum ?? "",
      parentId: data.parentId ?? "0",
      path: data.path ?? "",
      perms: data.perms ?? "",
      status: data.status ?? "0",
      visible: data.visible ?? "0",
    })
  }, [data])

  const onFieldsChange = (e) => {
    if (e[0].name[0] == "menuType") {
      setMenuType(e[0].value)
    }
  }

  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        setConfirmLoading(true)
        if (!!values.menuId) {//修改
          const res = await updateMenu(values)
          if (res?.code == 200) {
            message.success(res.msg)
            setConfirmLoading(false)
            setModalShow(false)
            getList()
          } else {
            message.error(res.msg)
            setConfirmLoading(false)
          }
        } else {
          const res = await addMenu(values)
          if (res?.code == 200) {
            message.success(res.msg)
            setConfirmLoading(false)
            setModalShow(false)
            getList()
          } else {
            message.error(res.msg)
            setConfirmLoading(false)
          }
        }
      })
  }

  return (
    <Modal
      wrapClassName="template_model"
      title={data.menuId ? "修改" : "添加"}
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
        onFieldsChange={onFieldsChange}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name={`menuId`}
              label="menuId"
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
              label="上级菜单"
            >
              <TreeSelect
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                treeData={treeData}
                placeholder="请选择上级菜单"
                treeDefaultExpandAll
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name={`menuType`}
              label="菜单类型"
            >
              <Radio.Group>
                <Radio value={"M"}>目录</Radio>
                <Radio value={"C"}>菜单</Radio>
                <Radio value={"F"}>按钮</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24} hidden={menuType == "F"}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name={`icon`}
              label="菜单图标"
            >
              <Select
                placeholder="请选择图标"
                optionLabelProp="label"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {
                  iconList.map((item, index) => {
                    return (
                      <Option label={item} key={item} value={item}>
                        <Space>
                          {createIcon(item)}{item}
                        </Space>

                      </Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={`menuName`}
              label="菜单名称"
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
          <Col span={12} hidden={menuType == "F"}>
            <Form.Item
              name={`isFrame`}
              label="是否外链"
              tooltip="选择是外链则路由地址需要以`http(s)://`开头"
            >
              <Radio.Group>
                <Radio value={"0"}>是</Radio>
                <Radio value={"1"}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12} hidden={menuType == "F"}>
            <Form.Item
              name={`path`}
              label="路由地址"
              tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
              rules={[
                {
                  required: menuType !== 'F',
                },
              ]}
            >
              <Input placeholder="请填写" />
            </Form.Item>
          </Col>

          <Col span={12} hidden={menuType == "M"}>
            <Form.Item
              name={`perms`}
              label="权限字符"
            >
              <Input placeholder="请填写" />
            </Form.Item>
          </Col>


          <Col span={12} hidden={menuType == "F"}>
            <Form.Item
              name={`visible`}
              label="显示状态"
              tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
            >
              <Radio.Group>
                <Radio value={"0"}>显示</Radio>
                <Radio value={"1"}>隐藏</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12} hidden={menuType == "F"}>
            <Form.Item
              name={`status`}
              label="菜单状态"
              tooltip="选择停用则路由将不会出现在侧边栏，也不能被访问"
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