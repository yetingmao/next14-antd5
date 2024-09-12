import { request } from "../utils";

//登陆
export async function login(body) {
  return await request({
      url: "/auth/login",
      method: "post",
      data: body,
  });
}
