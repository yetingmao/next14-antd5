
import Qs from "querystring";
import { request } from "@/utils";


export async function getModelList(query) {
  return await request({
    url: `/desensitization/desensitizationManage/modelList?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function getTaskList(query) {
  return await request({
    url: `/desensitization/desensitizationTask/taskList?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function addTask(body) {
  return await request({
    url: "/desensitization/desensitizationTask",
    method: "POST",
    data: body
  });
}
export async function updateTask(body) {
  return await request({
    url: "/desensitization/desensitizationTask",
    method: "put",
    data: body
  });
}
export async function taskAction(body) {
  return await request({
    url: "/desensitization/desensitizationTask/editStatus",
    method: "put",
    data: body
  });
}
export async function delTask(id) {
  return await request({
    url: "/desensitization/desensitizationTask/" + id,
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
