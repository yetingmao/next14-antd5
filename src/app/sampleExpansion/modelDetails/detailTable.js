"use client"
import React, { useState, useEffect } from "react";
import { Button, message, Table, Pagination, Descriptions } from "antd";
import _ from "lodash";
export default function (props) {
    const [dataList, setDataList] = useState([]);
    const [pagination, setPagination] = useState({
        hideOnSinglePage: false, //只有一页默认隐藏
        defaultCurrent: 1, //默认当前页
        current: 1, //当前页
        defaultPageSize: 10, //默认每页多少条
        pageSize: 10, //每页多少条
    });

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (props.getListFC) {
            getList();
        }
    }, [pagination.current])

    useEffect(() => {
        resetPaginationGetList()
    }, [props.queryParams])

    //分页、排序、筛选变化时触发
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination)
    }
    const resetPaginationGetList = () => {
        if (pagination.pageSize == 10 && pagination.current == 1) {
            getList()
        } else {
            setPagination({ ...pagination, pageSize: 10, current: 1 });
        }
    }
    async function getList() {
        let temp = { pageSize: pagination.pageSize, pageNum: pagination.current };
        if (props.queryParams) {
            temp = { ...temp, ...props.queryParams };
        }
        if (temp.desensitizationManageId) {
            temp = _.pickBy(temp, _.identity);
            const { code, msg, rows, total } = await props.getListFC(temp);
            if (code == 200) {
                setDataList(rows);
                setPagination({ ...pagination, total })
            } else {

            }
        }

    }



    return (
        <Table
            bordered={true}
            rowKey={(record) => record.id}
            columns={props.columns}
            dataSource={dataList}
            pagination={pagination}
            onChange={handleTableChange}
        />
    );

}
