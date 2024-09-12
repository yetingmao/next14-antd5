import Qs from "querystring";
import { request } from "@/utils";
// 新增部门
export async function addDept(params) {
    return await request({
        url: "/system/dept",
        method: "post",
        data: params,
    });
  }
  
  // 修改部门
  export async function updateDept(params) {
    return await request({
        url: "/system/dept",
        method: "PUT",
        data: params,
    });
  }
  export async function getDeptDetail(params) {
    return await request({
        url: `/system/dept/${params}`,
        method: "get",
    });
  }
  
  // 删除部门
  export async function removeDept(ids) {
      return await request({
          url: `/system/dept/${ids}`,
          method: "DELETE",
      });
  
  }
  export async function getDeptList(params) {
    return await request({
        url: `/system/dept/list?${Qs.stringify(params)}`,
        method: "get",
    });
  }