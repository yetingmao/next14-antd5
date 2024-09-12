"use client";
import { Button, ConfigProvider, Space } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import ViewContext from "@/component/viewContext";
import React, { useState, useEffect, useContext } from "react";
import { Dropdown, Avatar } from "antd";
import index1 from "/public/img/index1.svg";
export default function HeaderView(props) {
  const { title } = useContext(ViewContext);
  const [userInfo, setUserInfo] = useState();
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  useEffect(() => {
    const username = window.localStorage.getItem("username");
    if (username) {
      setUserInfo(username);
    } else {
      logout();
    }
  }, []);
  const items = [
    {
      key: "1",
      label: `你好 - ${userInfo}`,
      type: "group",
      label: userInfo,
    },
    {
      key: "2",
      onClick: logout,
      label: <span>退出登录</span>,
    },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "64px",
        position: "relative",
        textAlign: "center",
        fontSize: "34px",
        color: "rgb(51,242,245)",
        fontWeight:"bold",
        letterSpacing: "5px" 
      }}
    >
      <img
        src={index1.src}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></img>
      <div>样本中心</div>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar
            style={{
              backgroundColor: "#00a2ae",
              verticalAlign: "middle",
            }}
            size="large"
          >
            {userInfo}
          </Avatar>
        </Dropdown>
      </div>
    </div>
  );
  function logout() {
    window.localStorage.clear();
    props.logout();
  }
}
