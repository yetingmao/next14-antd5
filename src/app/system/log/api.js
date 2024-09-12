import Qs from "querystring";
import { request } from "@/utils";
export async function getLog(params) {
    return await request({
        url: `/system/logininfor/list?${Qs.stringify(params)}`,
        method: "get",
    });
}

export async function removeLogs(ids) {
    return await request({
        url: `/system/logininfor/${ids}`,
        method: "DELETE",
    });

}
export async function exportLogs(params) {
    return await request({
        url: "/system/logininfor/export",
        method: "post",
        data: params,
    });
}
export async function cleanLogs() {
    return await request({
        url: `/system/logininfor/clean`,
        method: "DELETE",
    });
}
export async function getActionLog(params) {
    return await request({
        url: `/system/operlog/list?${Qs.stringify(params)}`,
        method: "get",
    });
}

export async function removeActionLogs(ids) {
    return await request({
        url: `/system/operlog/${ids}`,
        method: "DELETE",
    });

}
export async function exportActionLogs(params) {
    return await request({
        url: "/system/operlog/export",
        method: "post",
        data: params,
    });
}
export async function cleanActionLogs() {
    return await request({
        url: `/system/operlog/clean`,
        method: "DELETE",
    });
}