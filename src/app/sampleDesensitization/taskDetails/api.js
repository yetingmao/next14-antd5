
import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskDetail(query) {
    return await request({
        url: `/desensitization/desensitizationTask/taskInfoById?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getTaskLog(query) {
    return await request({
        url: `/desensitization/desensitizationTaskLog/taskLogList?${Qs.stringify(query)}`,
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
      url: `/desensitization/desensitizationTask/deleteTaskFile?${Qs.stringify(query)}`,
      method: "DELETE",
    });
  }

  export async function taskAction(query) {
    return await request({
      url: `/desensitization/desensitizationTask/exportFile?${Qs.stringify(query)}`,
      method: "get",
    });
  }