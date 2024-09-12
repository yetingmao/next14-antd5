"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  HomeOutlined,
  BarsOutlined,
  FileUnknownOutlined,
  FileSyncOutlined,
  FolderAddOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import ViewContext from "./viewContext";
import { Menu, Switch } from "antd";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function getItem(label, key, icon, children, type, defaultKey) {
  return {
    key: key,
    icon,
    children: type === "noChildren" ? "" : children,
    label,
    type,
    title: label,
    other: type === "noChildren" ? children : "",
    defaultkey: defaultKey ?? "",
  };
}
const items = [
  getItem("首页", "/", <HomeOutlined />),
  getItem("数据统计", "/home", <HomeOutlined />, [
    getItem("数据回流统计", "/home/sampleReflux", ""),
  ]),
  getItem("样本管理", "/sampleManagement", <BarsOutlined />, [
    getItem(
      "临时库",
      "/sampleManagement/temporary",
      "",
      [
        getItem("文本", "/sampleManagement/temporary/text", "", "", ""),
        getItem("图像", "/sampleManagement/temporary/img", "", "", ""),
      ],
      "noChildren",
      "/sampleManagement/temporary/text"
    ),
    getItem(
      "样本库",
      "/sampleManagement/sample",
      "",
      [
        getItem("文本", "/sampleManagement/sample/text", "", "", ""),
        getItem("图像", "/sampleManagement/sample/img", "", "", ""),
      ],
      "noChildren",
      "/sampleManagement/sample/text"
    ),
    getItem(
      "回收站",
      "/sampleManagement/recycleBin",
      "",
      [
        getItem("文本", "/sampleManagement/recycleBin/text", "", "", ""),
        getItem("图像", "/sampleManagement/recycleBin/img", "", "", ""),
      ],
      "noChildren",
      "/sampleManagement/recycleBin/text"
    ),
    getItem(
      "目录管理",
      "/sampleManagement/classification",
      "",
      [
        getItem("文本", "/sampleManagement/classification/text", "", "", ""),
        getItem("图像", "/sampleManagement/classification/img", "", "", ""),
      ],
      "noChildren",
      "/sampleManagement/classification/text"
    ),
    getItem(
      "数据集管理",
      "/sampleManagement/dataSet",
      "",
      [
        getItem("文本", "/sampleManagement/dataSet/text", "", "", ""),
        getItem("图像", "/sampleManagement/dataSet/img", "", "", ""),
      ],
      "noChildren",
      "/sampleManagement/dataSet/text"
    ),
  ]),
  getItem("样本脱敏工具", "/sampleDesensitization", <FileUnknownOutlined />, [
    getItem("脱敏模型管理", "/sampleDesensitization/model", ""),
    getItem(
      "脱敏任务管理",
      "/sampleDesensitization/task",
      "",
      [
        getItem("文本", "/sampleDesensitization/task/text", "", "", ""),
        getItem("图像", "/sampleDesensitization/task/img", "", "", ""),
      ],
      "noChildren",
      "/sampleDesensitization/task/text"
    ),
  ]),
  getItem("样本清洗工具", "/sampleClean", <FileSyncOutlined />, [
    getItem("样本清洗模型", "/sampleClean/model", ""),
    getItem(
      "清洗任务管理",
      "/sampleClean/task",
      "",
      [
        getItem("文本", "/sampleClean/task/text", "", "", ""),
        getItem("图像", "/sampleClean/task/img", "", "", ""),
      ],
      "noChildren",
      "/sampleClean/task/text"
    ),
  ]),
  getItem("样本扩充工具", "/sampleExpansion", <FolderAddOutlined />, [
    getItem("扩充模型管理", "/sampleExpansion/model", ""),
    getItem("扩充任务管理", "/sampleExpansion/task", ""),
  ]),
  getItem("脱敏审核", "/desensitizeCheck", <FileSearchOutlined />, [
    getItem(
      "审核任务管理",
      "/desensitizeCheck/task",
      "",
      [
        getItem("文本", "/desensitizeCheck/task/text", "", "", ""),
        getItem("图像", "/desensitizeCheck/task/img", "", "", ""),
      ],
      "noChildren",
      "/desensitizeCheck/task/text"
    ),
  ]),
  getItem("清洗审核", "/cleanCheck", <FileSearchOutlined />, [
    getItem(
      "审核任务管理",
      "/cleanCheck/task",
      "",
      [
        getItem("文本", "/cleanCheck/task/text", "", "", ""),
        getItem("图像", "/cleanCheck/task/img", "", "", ""),
      ],
      "noChildren",
      "/cleanCheck/task/text"
    ),
  ]),
  getItem("扩充审核", "/expansionCheck", <FileSearchOutlined />, [
    getItem("审核任务管理", "/expansionCheck/task", ""),
  ]),
  getItem("系统管理", "/system", <FileSearchOutlined />, [
    getItem("部门管理", "/system/dept", ""),
    getItem("角色管理", "/system/role", ""),
    getItem("用户管理", "/system/user", ""),
     getItem("菜单管理", "/system/menu", ""),
    getItem(
      "日志管理",
      "/system/log",
      "",
      [
        getItem("登录日志", "/system/log/login", "", "", ""),
        getItem("操作日志", "/system/log/action", "", "", ""),
      ],
      "noChildren",
      "/system/log/login"
    ),
  ]),
];

export default function LeftMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    changeTitle,
    title,
    changeRouterList,
    changeTopRouterList,
    changeTopActiveItem,
  } = useContext(ViewContext);
  const [theme, setTheme] = useState("dark");
  const [current, setCurrent] = useState("/");
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    // console.log(title)
  }, [title]);

  useEffect(() => {
    changeRouterList(items);
  }, []);

  useEffect(() => {
    //刷新的时候不是首页
    if (pathname != "/") {
      //获取pathName
      let pathNameArr = pathname.split("/");
      pathNameArr.reduce((accumulator, currentValue, index, array) => {
        pathNameArr[index] = [...accumulator, currentValue];
        return array[index];
      }, "");
      pathNameArr = pathNameArr.map((e) => e.join("/"));

      pathNameArr.shift();
      //获取当前应该激活的menu
      let { arr, other, otherActive } = getActiveMenu(pathNameArr, items, []);
      pathNameArr = arr;
      //如果有顶部菜单栏,获取顶部菜单栏展示
      changeTopRouterList(other);
      changeTopActiveItem(otherActive);
      setCurrent(pathNameArr.pop());
      setOpenKeys(pathNameArr);
    } else {
      //刷新的时候是首页,获取默认跳转地址
      changeTopRouterList([]);
      changeTopActiveItem();
      setCurrent("/");
      setOpenKeys([]);
    }
  }, [pathname]);

  //获取当前激活的menu相关数据
  const getActiveMenu = (array, items, v) => {
    let item = items.find((e) => e.key == array[0]);
    let arr = [...v, ...array.splice(0, 1)];
    if (item && item.children && !item.other) {
      return getActiveMenu(array, item.children, arr);
    } else {
      let other = [];
      let otherActive = "";
      if (item?.other) {
        other = item.other;
        otherActive = item.other.find((e) => e.key == array[0]);
      }
      return { arr, other, otherActive };
    }
  };

  //进来获取默认应该激活的menu
  const getDefaultActiveMenu = (items, keys) => {
    const n = items[0];
    //看有没有children,有的话递归获取最后一级第一个
    if (n.children?.length || n.other?.length) {
      return getDefaultActiveMenu(n.children || n.other, [...keys, n.key]);
    } else {
      return { n, keys };
    }
  };

  const onClick = ({ item, key }) => {
    setCurrent(key);
    changeTitle(item.props.title);
    router.push(item.props.defaultkey || key);
  };
  //  console.log("-----", openKeys);
  // style={{
  //   backgroundColor: "rgba(255, 255, 255, 0)",
  // }}
  return (
    <>
      <Menu

      //  theme={theme}
        onClick={onClick}
        openKeys={openKeys}
        selectedKeys={[current]}
        mode="inline"
        items={items}
        onOpenChange={(openKeys) => {
          setOpenKeys(openKeys);
        }}
      />
    </>
  );
}
