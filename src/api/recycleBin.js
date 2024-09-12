import { request } from "../utils";
import Qs from "querystring"
import dayjs from "dayjs";

export async function getRecycleBinListText(params) {
  if (params.time?.length) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  delete params.time;
  return await request({
    url: "/collections/fileManager/list",
    method: "get",
    params: { ...params, type: 1 }
  });
}

export async function getRecycleBinListImg(params) {
  if (params.time?.length) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  delete params.time;
  return await request({
    url: "/collections/fileManager/list",
    method: "get",
    params: { ...params, type: 0 }
  });
}


export async function delRecycleBinList(params) {
  return await request({
    url: `/collections/fileManager/delete?${Qs.stringify(params)}`,
    method: "DELETE",
  });
}

export async function restoreRecycleBinList(params) {
  return await request({
    url: `/collections/fileManager/restore?${Qs.stringify(params)}`,
    method: "PUT",
  });
}

export async function setCleaning(params) {
  return await request({
    url: "/collections/fileManager/setCleaning",
    method: "get",
    params: { ...params }
  });
}