
import Qs from "querystring";
import { request } from "../utils";

export async function addImage(body) {
  return await request({
    url: "/imageSearch/addImage",
    method: "post",
    data: body,
  });
}

export async function flashImage(query) {
  return await request({
    url: "/imageSearch/flash",
    method: "get",
    params: query,
  });
}

export async function imageSearch(body, query) {
  return await request({
    url: `/imageSearch/imageSearch?${Qs.stringify(query)}`,
    method: "post",
    data: body,
  });
}

export async function textSearch(query) {
  return await request({
    url: "/imageSearch/textSearch",
    method: "get",
    params: query,
  });
}

export async function getImgLib(query) {
  return await request({
    url: "/imageSearch/list",
    method: "get",
    params: query,
  });
}
