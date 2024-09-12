
import Qs from "querystring";
import { request } from "@/utils";


export async function getDatas(query) {
    return await request({
        url: `/data/modeLog/dataSetCount?${Qs.stringify(query)}`,
        method: "get",
    });
}
