"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Input, theme, Popconfirm, message } from 'antd';
import {
  geiVoiceprintUserList,
  delVoiceprint
} from "@/api"
import useTableHeight from '@/component/hooks/useTableHeight';
import Table from '@/component/Table';
import AddOrEdit from "./components/addOrEdit"



export default function () {

  const tRef = useRef();
  const [queryForm] = Form.useForm();
  const { token } = theme.useToken();
  const [data, setData] = useState({});
  const [queryParams, setQueryParams] = useState(0);
  const [tableHeight, setTableHeight] = useTableHeight(0);
  const [modalShow, setModalShow] = useState(false);
  const columns = [
    {
      title: '姓名',
      dataIndex: 'featureUserName',
      key: 'featureUserName',
    },
    {
      title: '组织名',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '创建时间',
      dataIndex: 'creatTime',
      key: 'creatTime',
    },
    {
      title: "操作",
      key: "action",
      render: (_, { id }) => {
        return (
          <Popconfirm
            title="删除"
            description="确认删除该数据？"
            onConfirm={() => { del(id) }}

          >
            <Button danger>删除</Button>
          </Popconfirm>

        )
      }
    }
  ]

  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
  };

  const contentStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12
  }

  const operationStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 12,
    marginTop: 12
  }


  useEffect(() => {
  }, [tableHeight])

  function getList() {
    tRef.current.search();
  }



  function del(id) {
    return new Promise((resolve, reject) => {
      delVoiceprint(id).then((res) => {
        if (res?.code == 200) {
          tRef.current.search();
          message.success("删除成功")
          resolve()
        } else {
          message.success(res.msg)
          reject()
        }
      })
    })
  }

  async function delBatch(ids) {

  }


  return (
    <>
      {
        modalShow
        &&
        <AddOrEdit
          modalShow={modalShow}
          setModalShow={setModalShow}
          data={data}
          getList={getList}
        ></AddOrEdit>
      }
      <div>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="inline"
          form={queryForm}
          style={formStyle}
        >
          <Form.Item label="Field A" name="userName">
            <Input  cautocomplete="off" placeholder="input placeholder" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 14,
              offset: 4,
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setQueryParams(JSON.parse(JSON.stringify(queryForm.getFieldValue())));
              }}
            >
              查询
            </Button>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 14,
              offset: 4,
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                queryForm.resetFields();
                setQueryParams({});
                tRef.current.resetSearch();
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={operationStyle}>
        <Button type="primary" onClick={() => { setModalShow(true) }}>新增</Button>
              
      </div>
      <div style={contentStyle} >
        <Table
          ref={tRef}
          rowKey={"id"}
          getListFC={geiVoiceprintUserList}
          columns={columns}
          queryParams={queryParams}
          tableHeight={tableHeight}
        ></Table>
      </div>
    </>
  );
};