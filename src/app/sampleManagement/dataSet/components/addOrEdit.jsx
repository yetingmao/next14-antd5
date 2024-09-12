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
  Button,
} from "antd";
import Recorder from "js-audio-recorder";
import {
  UploadOutlined,
  AudioOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { fileUpload, updateTask } from "../api";

export default function ({
  modelShow,
  setModelShow,
  getList,
  data,
  treeDataTxt,
  treeDataImg,
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      dataType: data.dataType ?? undefined,
      id: data.id ?? "",
      dataName: data.dataName ?? undefined,
      tagId: data.category ? [data.category] : undefined,
      isLabel: data.isLabel ?? undefined,
      dataSource: data.dataSource ?? undefined,
      file: data.file ?? undefined,
    });
    if (data.dataType == 1) {
      setTreeData(treeDataTxt);
    } else {
      setTreeData(treeDataImg);
    }
  }, [modelShow]);
  const reset = () => {
    //  form.resetFields()
    setModelShow(false);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Modal
      wrapClassName="template_model"
      title={data.id ? "编辑" : "导入"}
      getContainer={false}
      open={modelShow}
      width={666}
      onOk={() => addOrUp()}
      destroyOnClose={true}
      // confirmLoading={confirmLoading}
      onCancel={() => {
        setModelShow(false);
      }}
    >
      <Form
        form={form}
        name="addOrEdit"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={({ dataType }) => {
          if (dataType) {
            if (dataType == 1) {
              setTreeData(treeDataTxt);
            } else {
              setTreeData(treeDataImg);
            }
          }
          // form.setFieldsValue({
          //   tagId: undefined,
          // });
        }}
      >
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          name={`id`}
          label="id"
          hidden={true}
        >
          <Input cautocomplete="off" />
        </Form.Item>
        <Form.Item
          name={`dataType`}
          label="样本类型"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            disabled={data.id}
            style={{ width: 200 }}
            options={[
              {
                value: 1,
                label: "文本",
              },
              {
                value: 2,
                label: "图像",
              },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item
          name={`dataName`}
          label="数据集名称"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input cautocomplete="off" />
        </Form.Item>
        <Form.Item
          name={`tagId`}
          label="专业、类别"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TreeSelect
            disabled={data.id}
            multiple
            treeDataSimpleMode
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
            }}
            placeholder="标签"
            treeData={treeData}
            fieldNames={{
              key: "id",
              label: "tagName",
              value: "id",
            }}
          />
        </Form.Item>
        <Form.Item
          label="是否标注"
          name="isLabel"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group disabled={data.id}>
            <Radio value={1}> 未标注 </Radio>
            <Radio value={2}> 已标注 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="来源描述"
          name={`dataSource`}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input cautocomplete="off" placeholder="数据集来源描述" />
        </Form.Item>
        {data.id ? (
          ""
        ) : (
          <Form.Item
            label="文件"
            name="file"
            valuePropName="file"
            rules={[{ required: true, message: "请上传文件" }]}
            getValueFromEvent={normFile}
          >
            <Upload.Dragger
              maxCount={1}
              beforeUpload={() => false}
              accept=".zip"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                点击或将文件拖拽到这里上传(只支持上传压缩包，大小限制为1G)
              </p>
              <p className="ant-upload-hint">支持扩展名：.zip</p>
            </Upload.Dragger>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
  async function addOrUp() {
    form.validateFields().then(async (values, e, r) => {
      //  setConfirmLoading(true);
      if (values.id) {
        //修改
        const res = await updateTask({
          id: values.id,
          dataName: values.dataSource,
          dataSource: values.dataSource,
        });
        if (res?.code == 200) {
          message.success(res.msg);
          //  setConfirmLoading(false);
          getList();
          setModelShow(false);
        } else {
          message.error(res.msg);
          // setConfirmLoading(false);
        }
      } else {
        let fileParam = new FormData();
        fileParam.append("dataType", values.dataType);
        fileParam.append(
          "file",
          values.file[0].originFileObj || values.file[0]
        );
        fileParam.append("dataName", values.dataName);
        fileParam.append("tagId", values.tagId);
        fileParam.append("isLabel", values.isLabel);
        fileParam.append("dataSource", values.dataSource);
        const res = await fileUpload(fileParam);
        if (res?.code == 200) {
          message.success(res.msg);
          getList();
          setModelShow(false);
        } else {
          message.error(res.msg);
          //  setConfirmLoading(false);
        }
      }
    });
  }
}
