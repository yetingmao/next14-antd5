
import Qs from "querystring";
import { request } from "@/utils";


export async function getModelDetail(query) {
    return await request({
        url: `/cleaning/wash/model/modelInfoById?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getModelTasks(query) {
    return await request({
        url: `/cleaning/wash/model/getTaskList?${Qs.stringify(query)}`,
        method: "get",
    });
}