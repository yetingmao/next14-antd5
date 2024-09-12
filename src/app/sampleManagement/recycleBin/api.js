import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskList(query) {
  return await request({
    url: `/collections/fileManager/list?${Qs.stringify(query)}`,
    method: "get",
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