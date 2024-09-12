
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
    url: `/collections/dataManage/getDataManageList?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function addTask(body) {
  return await request({
    url: "/collections/dataManage/importDataManage",
    method: "POST",
    data: body
  });
}
export async function fileUpload(params) {
  return await request({
    url: `/collections/dataManage/importDataManage`,
    method: "POST",
    data:params
  });
}
export async function updateTask(body) {
  return await request({
    url: "/collections/dataManage/updateDataManage",
    method: "put",
    data: body
  });
}
export async function taskAction(query) {
  return await request({
    url: `/collections/dataManage/exportExcel?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function delTask(query) {
  return await request({
    url: `/collections/dataManage/deleteDataManage?${Qs.stringify(query)}`,
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

export async function getExportLog(query) {
  return await request({
    url: `/collections/dataManage/exportDataManageLog?${Qs.stringify(query)}`,
    method: "get",
  });
}
export async function getCheckTaskResult(query) {
  return await request({
    url: `/collections/dataManage/getDataManageTxtFileList?${Qs.stringify(query)}`,
    method: "get",
  });
}



