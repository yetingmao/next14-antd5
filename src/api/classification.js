import { request } from "../utils";
import Qs from "querystring"
import dayjs from "dayjs";


export async function getTagTreeAllText(params) {
  return await request({
    url: "/collections/assetTag/list",
    method: "get",
    params: { ...params, type: 1 }
  });
}

export async function getTagTreeAllImg(params) {
  return await request({
    url: "/collections/assetTag/list",
    method: "get",
    params: { ...params, type: 0 }
  });
}


export async function updateTag(params) {
  return await request({
    url: "/collections/assetTag/update",
    method: "PUT",
    data: params
  });
}

export async function addTag(params) {
  return await request({
    url: "/collections/assetTag/add",
    method: "POST",
    data: params
  });
}


export async function delTag(params) {
  return await request({
    url: "/collections/assetTag/delete",
    method: "DELETE",
    params: params
  });
}
