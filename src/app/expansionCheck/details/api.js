
import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskDetail(query) {
    return await request({
        url: `/desensitization/desensitizationExamine/examineInfo?${Qs.stringify(query)}`,
        method: "get",
    });
}


export async function getTaskLog(query) {
    return await request({
        url: `/desensitization/examineLog/examineLogList?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getTaskFile(query) {
    return await request({
        url: `/desensitization/desensitizationTask/selectTaskFile?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getUsers(query) {
    return await request({
        url: `/system/user/list?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function passTask(body) {
    return await request({
      url: "/desensitization/desensitizationTask/passById",
      method: "put",
      data: body
    });
  }

  export async function getCheckTaskResult(query) {
    return await request({
        url: `/desensitization/desensitizationExamine/examineInfoByTaskId?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function deleteImg(query) {
    return await request({
      url: `/collections/fileManager/intoEecycle?${Qs.stringify(query)}`,
      method: "put",
    });
  }