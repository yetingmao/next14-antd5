import Qs from "querystring";
import { request } from "@/utils";
// 查询角色列表
export async function getRoleList(params) {
  return await request({
      url: `/system/role/list?${Qs.stringify(params)}`,
      method: "get",
  });
}
// 查询角色详情
export async function getRoleDetail(params) {
  return await request({
      url: `/system/role/${params}`,
      method: "get",
  });
}

// 删除角色
export async function removeRole(ids) {
    return await request({
        url: `/system/role/${ids}`,
        method: "DELETE",
    });

}

// 新增角色
export async function addRole(params) {
  return await request({
      url: "/system/role",
      method: "post",
      data: params,
  });
}

// 修改角色
export async function updateRole(params) {
  return await request({
      url: "/system/role",
      method: "PUT",
      data: params,
  });
}
// 修改状态
export async function changeRoleStatus(params) {
  return await request({
      url: "/system/role/changeStatus",
      method: "PUT",
      data: params,
  });
}

export async function getMenuList(params) {
  return await request({
      url: `/system/menu/list?${Qs.stringify(params)}`,
      method: "get",
  });
}
// 查询角色菜单权限详细
export async function getRoleMenuTreeselect(roleId) {
  return await request({
      url: `/system/menu/roleMenuTreeselect/${roleId}`,
      method: "get",
  });
}