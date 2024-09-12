
import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskDetail(query) {
    return await request({
        url: `/cleaning/check/checkInfoByTaskId?${Qs.stringify(query)}`,
        method: "get",
    });
}



export async function getTaskFile(query) {
    return await request({
        url: `/cleaning/check/getFileList?${Qs.stringify(query)}`,
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
      url: "/cleaning/check/fileCheck",
      method: "put",
      data: body
    });
  }
