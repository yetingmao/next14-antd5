
import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskDetail(query) {
    return await request({
        url: `/collections/dataManage/getDataManage?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getTaskLog(query) {
    return await request({
        url: `/collections/dataManage/exportDataManageLog?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getTaskFile(query) {
    return await request({
        url: `/collections/dataManage/getDataManageFileList?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getUsers(query) {
    return await request({
        url: `/system/user/list?${Qs.stringify(query)}`,
        method: "get",
    });
}


  export async function getCheckTaskResult(query) {
    return await request({
      url: `/collections/dataManage/getDataManageTxtFileList?${Qs.stringify(query)}`,
      method: "get",
    });
  }
