import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  Select,
  message
} from "antd"
import {
  addModel, updateModel
} from "./api";
const { Option } = Select;


export default function ({ data, modelShow, setModelShow,
  getList, categoryList
}) {

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      modelName: data.modelName ?? "",
      id: data.id ?? "",
      type: data.type ? `${data.type}` : undefined,
      modelPath: data.modelPath ?? "",
      function: data.function ?? undefined,
      status: `${data.status}` ?? undefined,
    })
  }, [data])


  const reset = () => {
  //  form.resetFields()
    setModelShow(false);
  }
  return (
    <Modal
      wrapClassName="template_model"
      title={data.id ? "修改" : "新增"}
      getContainer={false}   
      open={modelShow}
      width={600}
      onOk={() => addOrUp()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
      onCancel={() => {
        reset()
      }}
    >
      <Form
        form={form}
        name="addOrEdit"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="id"
          name="id"
          hidden={true}
        >
        </Form.Item>
        <Form.Item
          name={`modelName`}
          label={`名称`}
          rules={[
            {
              required: true,
              message: '模型名称必填!',
            },
          ]}
        >
          <Input  cautocomplete="off" placeholder="模型名称" />
        </Form.Item>
        {data.id ? <Form.Item label="是否下线" name="status" >
          <Radio.Group>
            <Radio value="1"> 下线 </Radio>
            <Radio value="2"> 上线 </Radio>
          </Radio.Group>
        </Form.Item> : ""}
        <Form.Item label="模型类型" name={`type`} rules={[
          {
            required: true,
            message: '模型类型必填!',
          },
        ]}>
          <Select disabled={data.id}>
            <Select.Option value="1">文本</Select.Option>
            <Select.Option value="2">图像</Select.Option>
            <Select.Option value="3">语音</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="模型地址" name={`modelPath`} rules={[
          {
            required: true,
            message: '模型类型必填!',
          },
        ]}>
          <Input  cautocomplete="off" placeholder="模型地址" />
        </Form.Item>
        <Form.Item label="模型功能说明" name={`function`} >
          <Input  cautocomplete="off" placeholder="模型功能说明" />
        </Form.Item>
        {/* <Form.Item label="脱敏类别" name="modelCategoryIds">
          <Select disabled={data.id} mode="multiple"
            allowClear>
            {categoryList.map(item => <Select.Option key={item.pkId} value={item.pkId}>{item.categoryName}</Select.Option>)}
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  )
  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        setConfirmLoading(true)
        if (values.id) {//修改
          const res = await updateModel(values)
          if (res?.code == 200) {
            message.success(res.msg)
            setConfirmLoading(false)
            reset()
            getList()
          } else {
            message.error(res.msg)
            setConfirmLoading(false)
          }
        } else {
          const res = await addModel(values)
          if (res?.code == 200) {
            message.success(res.msg)
            setConfirmLoading(false)
            reset()
            getList()
          } else {
            message.error(res.msg)
            setConfirmLoading(false)
          }
        }
      })
  }
}