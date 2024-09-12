
import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskDetail(query) {
    return await request({
        url: `/cleaning/wash/getTask?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getTaskLog(query) {
    return await request({
        url: `/cleaning/wash/getLog?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getTaskFile(query) {
    return await request({
        url: `/cleaning/check/getFileList?${Qs.stringify(query)}`,
        method: "get",
    });
}



  export async function getCheckTaskResult(query) {
    return await request({
        url: `/cleaning/check/checkResult?${Qs.stringify(query)}`,
        method: "get",
    });
}
