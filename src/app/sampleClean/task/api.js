
import Qs from "querystring";
import { request } from "@/utils";


export async function getModelList(query) {
  return await request({
    url: `/cleaning/wash/model/modelList?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function getTaskList(query) {
  return await request({
    url: `/cleaning/wash/list?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function addTask(body) {
  return await request({
    url: "/cleaning/wash/add",
    method: "POST",
    data: body
  });
}
export async function updateTask(body) {
  return await request({
    url: "/cleaning/wash/update",
    method: "put",
    data: body
  });
}
export async function taskAction(query) {
  return await request({
    url: `/cleaning/wash/updateStatus?${Qs.stringify(query)}`,
    method: "put",
  });
}
export async function delTask(id) {
  return await request({
    url: "cleaning/wash/" + id,
    method: "DELETE",
  });
}
export async function getCategoryList() {
  return await request({
    url: `/desensitization/desensitizationCategory/categoryList`,
    method: "get",
  });
}

export async function getTagTreeAll(params) {
  return await request({
    url: "/collections/assetTag/list",
    method: "get",
    params
  });
}
