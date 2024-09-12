
import Qs from "querystring";
import { request } from "@/utils";


export async function getModelList(query) {
    return await request({
        url: `/desensitization/expansion/expansionModelList?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getModelType(query) {
    return await request({
        url: `/desensitization/expansion/modelTypeList?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function addModel(body) {
    return await request({
      url: "/desensitization/desensitizationManage",
      method: "POST",
      data: body
    });
  }

  export async function updateModel(body) {
    return await request({
      url: "/desensitization/desensitizationManage",
      method: "put",
      data: body
    });
  }