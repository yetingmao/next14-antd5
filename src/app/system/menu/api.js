import Qs from "querystring";
import { request } from "@/utils";
//#region menu部分
// 查询菜单权限列表
export async function getMenuList(params) {
    return await request({
        url: `/system/menu/list?${Qs.stringify(params)}`,
        method: "get",
    });
}

// 查询菜单权限详细
export async function getMenu(menuId) {
    return await request({
        url: `/system/menu/${menuId}`,
        method: "get",
    });
}

// 查询菜单权限详细
export async function getMenuTree() {
  return await request({
      url: `/system/menu/treeselect`,
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

// 新增菜单权限
export async function addMenu(params) {
    return await request({
        url: "/system/menu",
        method: "post",
        data: params,
    });
}

// 修改菜单权限
export async function updateMenu(params) {
    return await request({
        url: "/system/menu",
        method: "PUT",
        data: params,
    });
}

// 删除菜单权限
export async function removeMenu(ids) {
    return await request({
        url: `/system/menu/${ids}`,
        method: "DELETE",
    });

}

// 导出菜单权限
export async function exportMenu(params) {
    return downLoadXlsx(`/system/menu/export`, { params }, `menu_${new Date().getTime()}.xlsx`);
}