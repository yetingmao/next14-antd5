
import Qs from "querystring";
import { request } from "@/utils";


export async function getData1() {
    return await request({
        url: `/data/modeLog/dataSetCount`,
        method: "get",
    });
}

export async function getData2(query) {
    return await request({
        url: `/data/homeData/dataComparison?${Qs.stringify(query)}`,
        method: "get",
    });
}
export async function getData3() {
    return await request({
        url: `/data/homeData/getHomeData`,
        method: "get",
    });
}
