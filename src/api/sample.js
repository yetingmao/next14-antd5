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

export async function getSampleListText(params) {
  if (params.time?.length) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  delete params.time;
  return await request({
    url: "/collections/assetImg/list",
    method: "get",
    params: { ...params, type: 1 }
  });
}

export async function getSampleListImg(params) {
  if (params.time?.length) {
    params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss');
    params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss');
  }
  delete params.time;
  return await request({
    url: "/collections/assetImg/list",
    method: "get",
    params: { ...params, type: 0 }
  });
}


export async function delSampleList(params) {
  return await request({
    url: `/collections/assetImg/delete?${Qs.stringify(params)}`,
    method: "DELETE",
  });
}
