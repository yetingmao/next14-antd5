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
import { updateTag, getTagTreeAll, addTag } from "@/api";

export default function ({ modalShow, setModalShow, getList, data }) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    getDefaultTree();
    form.setFieldsValue({
      id: data.id || "",
      pid: data.pid || "",
      tagName: data.tagName || "",
      postscript: data.postscript || "",
    });
    console.log(data);
  }, [data]);

  const arrayToTree = (arr) => {
    let map = {}; // 用于存放节点对象的字典
    arr.forEach((item) => {
      item["children"] = []; // 初始化每个节点的子节点列表
      if (!map[item.id]) {
        map[item.id] = item; // 将当前节点新增到字典中
      } else {
        Object.assign(map[item.id], item); // 如果已经有相同ID的节点，则合并属性值
      }
    });
    const roots = []; // 根节点集合
    for (let key in map) {
      const node = map[key];
      if (node.pid === null || !map[node.pid]) {
        roots.push(node); // 没有指定父节点或者父节点不在字典中时，认为该节点为根节点
      } else {
        map[node.pid].children.push(node); // 否则将其作为父节点的子节点
      }
    }
    return roots;
  };

  async function getDefaultTree() {
    const res = await getTagTreeAll({ type: 0 });
    if (res?.code == 200) {
      setTreeData([
        { tagName: "图像", id: 1764, children: arrayToTree(res.data) },
      ]);
    }
  }

  async function addOrUp() {
    form.validateFields().then(async (values, e, r) => {
      setConfirmLoading(true);
      let res;
      if (values.id) {
        res = await updateTag(values);
      } else {
        delete values.id;
        res = await addTag(values);
      }
      setConfirmLoading(false);
      if (res?.code == 200) {
        message.success(res.msg);
        getList();
        setModalShow(false);
      } else {
        message.error(res.msg);
      }
    });
  }
  return (
    <Modal
      wrapClassName="template_model"
      title={data.id ? "修改" : "新增"}
      maskClosable={false}
      getContainer={false}
      open={modalShow}
      width={666}
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          name={`id`}
          label="id"
          hidden={true}
        >
          <Input  cautocomplete="off" />
        </Form.Item>
        <Form.Item label="目录名称" name="tagName" rules={[{ required: true }]}>
          <Input  cautocomplete="off"
            count={{
              show: true,
              max: 100,
            }}
          ></Input>
        </Form.Item>
        <Form.Item name={`pid`} label="上级目录">
          <TreeSelect
            treeDataSimpleMode
            style={{
              width: "100%",
            }}
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
          label="备注"
          name="postscript"
          valuePropName="postscript"
          getValueFromEvent={(e) => {
            return e.target.value;
          }}
        >
          <Input.TextArea cautocomplete="off"
            count={{
              show: true,
              max: 100,
            }}
          ></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}
