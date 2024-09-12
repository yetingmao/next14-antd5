import Qs from "querystring";
import { request } from "@/utils";

export async function getTaskFile(query) {
    return await request({
        url: `/cleaning/wash/getSimilarityImage?${Qs.stringify(query)}`,
        method: "get",
    });
}
