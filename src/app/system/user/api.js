import Qs from "querystring";
import { request } from "@/utils";
export async function getUserList(params) {
  return await request({
      url: `/system/user/list?${Qs.stringify(params)}`,
      method: "get",
  });
}

// 查询用户详情
export async function getUserDetail(params) {
  return await request({
      url: `/system/user/${params}`,
      method: "get",
  });
}

// 删除用户
export async function removeUser(ids) {
    return await request({
        url: `/system/user/${ids}`,
        method: "DELETE",
    });

}

// 新增用户
export async function addUser(params) {
  return await request({
      url: "/system/user",
      method: "post",
      data: params,
  });
}

// 修改用户
export async function updateUser(params) {
  return await request({
      url: "/system/user",
      method: "PUT",
      data: params,
  });
}
// 修改密码
export async function resetPwd(params) {
  return await request({
      url: "/system/user/resetPwd",
      method: "PUT",
      data: params,
  });
}


// 查询部门树列表
export async function getDeptTree() {
    return await request({
        url: `/system/user/deptTree`,
        method: "get",
    });
}

// 修改状态
export async function changeUserStatus(params) {
  return await request({
      url: "/system/user/changeStatus",
      method: "PUT",
      data: params,
  });
}
export async function getPostList(params) {
  return await request({
      url: `/system/post/list?${Qs.stringify(params)}`,
      method: "get",
  });
}
export async function getRoleList(params) {
  return await request({
      url: `/system/role/list?${Qs.stringify(params)}`,
      method: "get",
  });
}