"use client";
import React, { useState, useCallback, useEffect, useContext, Suspense } from 'react';
import {
  Layout,
  Flex,
  Button,
  ConfigProvider
} from 'antd';
import "./globals.css";
import zhCN from 'antd/locale/zh_CN';
// for date-picker i18n
import 'dayjs/locale/zh-cn';
import ViewContextProvider from "@/component/viewProvider";
import HeaderView from '@/component/header';
import LeftMenu from "@/component/leftMenu";
import TopMenu from '@/component/topMenu';
import Login from './login/page';


export { headerStyle, contentStyle, siderStyle, footerStyle, layoutStyle };


const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  // textAlign: 'center',
  color: '#fff',
  height: 64,
  // paddingInline: 48,
  lineHeight: '64px',
  background: "rgba(0, 29, 123, 0.4)",
  borderbottom: "0.8px solid",
  borderColor: "rgba(0, 148, 225, 0.95)",

};
const contentStyle = {
  textAlign: 'left',
  minHeight: 120,
  lineHeight: '40px',
  height: 'calc(100vh - 84px)',
  overflow: "auto",
  background: "rgba(0, 29, 123, 0.8)",
  border: "0.4px solid",
  borderColor: "rgba(0, 148, 225, 0.95)",
  boxShadow: "0px 0px 45px #0090ff inset",
  marginLeft: "10px",
  padding: "10px",
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '40px',
  color: '#fff',
  //letterSpacing:"100px",
  height: 'calc(100vh - 84px)',
  background: "rgba(0, 26, 113, 0.8)",
  border: "0.8px solid",
  borderColor: "#00b9ff",
  boxShadow: "0px 0px 65px #00eeff inset",
  overflow:"auto"
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
  height: 0,
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  backgroundColor: "rgba(20, 58, 110, 0.8)",
};


export default function RootLayout({ children }) {

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    // console.log(window.localStorage.getItem("token"))
    setIsLogin(!!window.localStorage.getItem("token"))
  }, [])


  const login = useCallback(() => {
    setIsLogin(true)
  }, [])

  const logout = useCallback(() => {
    setIsLogin(false)
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: '#00ffff',
          colorTextBase: '#fff',
          colorBgBase: "rgba(0,0,0,0)",
          "borderRadius": 6

        },
        "components": {
          "Input": {
            "colorBgContainer": "rgba(0, 29, 123, 0)",
            "colorText": "rgba(0, 255, 255, 1)"
          },
          "Select": {
            "optionSelectedBg": "rgba(0, 255, 255, 0.3)",
            "colorBgContainer": "rgba(0, 29, 123, 0.8)",
            "colorBgElevated": "rgba(0, 29, 123, 0.8)"
          },
          "Menu": {
            "colorBgContainer": "rgba(0, 26, 113, 0)",
            "itemSelectedBg": "rgba(0, 255, 255, 0.2)",
            "itemSelectedColor": "rgba(0, 255, 255, 0.8)",
          },
          "TreeSelect": {
            "colorBgContainer": "rgba(0, 29, 123, 0.8)",
            "colorBgElevated": "rgba(0, 29, 123, 0)",
            "colorPrimary": "rgba(0, 255, 255, 0.8)",
          },
          "DatePicker": {
            "colorBgContainer": "rgba(0, 29, 123, 0.8)",
            "colorBgElevated": "rgba(0, 29, 123, 0.9)",
            "cellHoverBg": "rgba(0, 255, 255, 0.5)",
            "cellHoverWithRangeBg": "rgba(0, 255, 255, 0.5)",
            "cellActiveWithRangeBg": "rgba(0, 255, 255, 0.5)",
          },
          "Button": {
            "primaryShadow": "0",
            "dangerShadow": "0",
            "defaultBg": "rgba(255, 255, 255, 0.15)"
          },
          "Radio": {
            "colorBgContainer": "rgba(0, 29, 123, 0.8)",
            "buttonSolidCheckedColor": "rgba(0, 255, 255, 1)"

          },
          "Table": {
            "colorBgContainer": "rgba(0, 29, 123, 1)",
            "colorBgElevated": "rgba(0, 29, 123, 1)",
            "headerBg": "rgba(0, 89, 165, 0.95)",
            "borderColor": "rgba(0, 148, 225, 0.5)",
            "rowHoverBg": "rgba(0, 185, 255, 0.6)",
          },
          "Tree": {
            "colorBgContainer": "rgba(0, 29, 123, 0)",
            "controlItemBgHover": "rgba(0, 255, 255, 0.5)"
          },
          "Card": {
            "colorBgContainer": "rgba(0, 29, 123, 0)",
            "colorBorderSecondary": "rgba(0, 148, 225, 0.95)"
          },
          "Checkbox": {
            "colorBgContainer": "rgba(0, 238, 255, 0.6)"
          },
          "Modal": {
            "colorBgElevated": "rgba(0, 29, 123, 1)",
            "colorBgMask": "rgba(0, 4, 15, 0.3)",
            "boxShadow": "0px 0px 100px #0090ff inset",
            "headerBg": "rgba(0, 238, 255, 0)"

          },
          "Descriptions": {
            "colorText": "rgba(0, 255, 255, 1)",
            "colorSplit": "rgba(0, 185, 255, 0.3)"
          },
          "Pagination": {
            "itemActiveBg": "rgba(0, 255, 255, 1)",
            "colorBgContainer": "rgba(0, 238, 255, 0)"
          },
          "Tag": {
            "defaultBg": "rgba(0, 238, 255, 0.3)"
          },
          "Popconfirm": {
            "colorBgElevated": "rgba(0, 29, 123, 0.8)",
          },
          "Tooltip": {
            "colorBgSpotlight": "rgba(0, 29, 123, 0.8)"
          }
        }
      }}
      locale={zhCN}>
      <html lang="en">
        <body>
          <ViewContextProvider>
            {
              isLogin
                ?
                <Layout style={layoutStyle}>
                  <Header style={headerStyle}>
                    <HeaderView logout={logout}></HeaderView>
                    {/* <Button onClick={logout}>退出</Button> */}
                  </Header>
                  <Layout style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                    <Sider width="12%" style={siderStyle}>
                      <LeftMenu></LeftMenu>
                    </Sider>
                    <Content style={contentStyle}>
                      <TopMenu></TopMenu>
                      {children}
                    </Content>
                  </Layout>
                  {/* <Footer style={footerStyle}>Footer</Footer> */}
                </Layout>
                :
                <Login logined={login}></Login>
            }

          </ViewContextProvider>
        </body>
      </html>
    </ConfigProvider>
  )
};