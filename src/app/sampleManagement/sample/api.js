import Qs from "querystring";
import { request } from "@/utils";
export async function getTaskList(query) {
    return await request({
      url: `/collections/assetImg/list?${Qs.stringify(query)}`,
      method: "get",
    });
  }