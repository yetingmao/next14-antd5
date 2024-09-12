
import Qs from "querystring";
import { request } from "@/utils";


export async function getTaskList(query) {
  return await request({
    url: `desensitization/desensitizationExamine/examineList?${Qs.stringify(query)}`,
    method: "get",
  });
}

export async function getUsers(query) {
  return await request({
      url: `/system/user/list?${Qs.stringify(query)}`,
      method: "get",
  });
}



