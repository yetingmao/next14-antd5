
import Qs from "querystring";
import { request } from "@/utils";


export async function getModelDetail(query) {
    return await request({
        url: `/desensitization/desensitizationManage/modelInfoById?${Qs.stringify(query)}`,
        method: "get",
    });
}

export async function getModelTasks(query) {
    return await request({
        url: `/desensitization/desensitizationTask/taskList?${Qs.stringify(query)}`,
        method: "get",
    });
}