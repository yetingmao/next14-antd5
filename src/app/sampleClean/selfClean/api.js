import Qs from "querystring";
import { request } from "@/utils";

export async function getTaskFile(query) {
    return await request({
        url: `/cleaning/wash/getSelfWashResult?${Qs.stringify(query)}`,
        method: "get",
    });
}


export async function passTask(query) {
    return await request({
        url: `/cleaning/wash/updateStatus?${Qs.stringify(query)}`,
        method: "put",
      });
  }


export async function deleteImg(query) {
    return await request({
      url: `/cleaning/wash/deleteFile?${Qs.stringify(query)}`,
      method: "put",
    });
  }