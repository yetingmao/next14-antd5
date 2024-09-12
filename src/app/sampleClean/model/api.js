
import Qs from "querystring";
import { request } from "@/utils";


export async function getModelList(query) {
    return await request({
        url: `/cleaning/wash/model/modelList?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getCategoryList() {
    return await request({
        url: `/desensitization/desensitizationCategory/categoryList`,
        method: "get",
    });
}

export async function addModel(body) {
    return await request({
      url: "/cleaning/wash/model/add",
      method: "POST",
      data: body
    });
  }

  export async function updateModel(body) {
    return await request({
      url: "/cleaning/wash/model/update",
      method: "put",
      data: body
    });
  }