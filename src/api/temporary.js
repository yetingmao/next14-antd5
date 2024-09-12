
import { request } from "../utils";
import Qs from "querystring"
import dayjs from "dayjs";

export async function getTagTree(params) {
  return await request({
    url: "/collections/assetTag/getTag",
    method: "get",
    params
  });
}

export async function getTagTreeAll(params) {
  return await request({
    url: "/collections/assetTag/list",
    method: "get",
    params
  });
}

export async function getTemporaryListText(params) {
  if (params.time?.length) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  delete params.time;
  return await request({
    url: "/collections/taskGather/list",
    method: "get",
    params: { ...params, type: 1 }
  });
}

export async function getTemporaryListImg(params) {
  if (params.time?.length) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  delete params.time;
  return await request({
    url: "/collections/taskGather/list",
    method: "get",
    params: { ...params, type: 0 }
  });
}


export async function delTemporaryList(params) {
  return await request({
    url: `/collections/taskGather/delete?${Qs.stringify(params)}`,
    method: "DELETE",
  });
}

export async function importAsset(params) {
  return await request({
    url: `/collections/taskGather/importAsset`,
    method: "POST",
    data:params
  });
}

export async function fileUpload(params) {
  return await request({
    url: `/collections/taskGather/fileUpload`,
    method: "POST",
    data:params
  });
}