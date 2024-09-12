import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  message,
  TreeSelect,
  DatePicker
} from "antd"
import {
  addTask, updateTask
} from "../api";
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
export default function ({ data, modelShow, setModelShow,
  getList, categoryList, treeData, modelList
}) {
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    form.setFieldsValue({
      desensitizationWay: data.desensitizationWay ?? 1,
      id: data.id ?? "",
      taskName: data.taskName ?? undefined,
      modelIds: data.modelIds ?? undefined,
      modelCategoryIds: data.modelCategoryIds ?? undefined,
      tagIds: data.tagIds ?? undefined,
      time: data.assetStartTime ? [dayjs(data.assetStartTime, 'YYYY-MM-DD HH:mm:ss'), dayjs(data.assetEndTime, 'YYYY-MM-DD HH:mm:ss')] : undefined,
    })
    if (data.desensitizationWay) {
      setShow(data.desensitizationWay == 2)
    }
  }, [modelShow])

  const reset = () => {
    form.resetFields()
    setModelShow(false);
    setShow(false)
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
       {data.id ? "" : <Button type="link" danger>
        （入库时间不填写脱清洗个选中路径）
      </Button> }
      <Form
        form={form}
        name="addOrEdit"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        // onValuesChange={({ desensitizationWay }) => {
        //   if (desensitizationWay) {
        //     setShow(desensitizationWay == 2)
        //   }
        // }}
      >
        <Form.Item
          label="id"
          name="id"
          hidden={true}
        >
        </Form.Item>
        {/* <Form.Item label="脱敏方式" name="desensitizationWay" >
          <Radio.Group disabled={data.id}>
            <Radio value={1}> 自动脱敏 </Radio>
            <Radio value={2}> 手动脱敏 </Radio>
          </Radio.Group>
        </Form.Item> */}
        <Form.Item
          name={`taskName`}
          label={`任务名称`}
          rules={[
            {
              required: true,
              message: '任务名称必填!',
            },
          ]}
        >
          <Input  cautocomplete="off" placeholder="任务名称" />
        </Form.Item>
        <Form.Item label="清洗路径" name={`tagIds`} rules={[
          {
            required: true,
            message: '清洗路径必填!',
          },
        ]}>
          <TreeSelect
            disabled={data.id}
            multiple
            treeDataSimpleMode
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto',
            }}
            placeholder="标签"
            treeData={treeData}
            fieldNames={{
              key: "id",
              label: "tagName",
              value: "id"
            }}

          />
        </Form.Item>
        <Form.Item label="清洗模型" name={`modelIds`} rules={[
          {
            required: true,
            message: '清洗模型必填!',
          },
        ]}>
          <Select disabled={data.id} allowClear mode="multiple">
            {modelList.map(item => <Select.Option key={item.id} value={item.id}>{item.modelName}</Select.Option>)}
          </Select>
        </Form.Item>
        {/* {show ? <Form.Item label="脱敏类别" name="modelCategoryIds" rules={[
          {
            required: true,
            message: '脱敏类别必填!',
          },
        ]}>
          <Select disabled={data.id} mode="multiple"
            allowClear>
            {categoryList.map(item => <Select.Option key={item.value} value={item.pkId}>{item.label}</Select.Option>)}
          </Select>
        </Form.Item> : ""} */}
        <Form.Item label="入库时间" name={`time`} >
          <RangePicker disabled={data.id} showTime />
        </Form.Item>
      </Form>
    </Modal>
  )
  async function addOrUp() {
    form.validateFields()
      .then(async (values, e, r) => {
        let assetStartTime;
        let assetEndTime;
        if (values.time) {
          assetStartTime = dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss');
          assetEndTime = dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss');
        }
        delete values.time;
        setConfirmLoading(true)
        if (values.id) {//修改
          const res = await updateTask({ ...values, assetStartTime, assetEndTime, taskType: 2 })
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
          const res = await addTask({ ...values,  assetStartTime, assetEndTime, taskType: 2 })
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