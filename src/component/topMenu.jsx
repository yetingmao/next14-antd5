"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import ViewContext from "@/component/viewContext";
import { Menu } from "antd";

export default function TopMenu({ children }) {
  const router = useRouter();
  const [current, setCurrent] = useState("mail");
  const { topRouterList, topRouterActiveItem } = useContext(ViewContext);

  useEffect(() => {
    setCurrent(topRouterActiveItem?.key);
  }, [topRouterList, topRouterActiveItem]);

  const onClick = (e) => {
    setCurrent(e.key);
    router.push(e.key);
  };
  return (
    <>
      {topRouterList.length ? (
        <Menu
        //  theme="dark"
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={topRouterList}
          onOpenChange={(openKeys) => {
            //  setOpenKeys(openKeys)
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}
