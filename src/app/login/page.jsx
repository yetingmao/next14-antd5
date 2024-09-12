"use client";
import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { login } from "@/api";
import { useRouter } from "next/navigation";

// const style = css
import bgImg from "/public//img/login.gif";
export default function Login({ logined }) {
  const router = useRouter();
  useEffect(() => {
    // window.localStorage.clear();
  }, []);

  return (
    <div className="login">
      <img src={bgImg.src} alt="" style={{}} />
      <style jsx>{`
        .login {
          height: 100vh;
          display: flex;
          justify-content: right;
          align-items: center;
          width: 100%;
          z-index: 99;
          position: relative;
        }
        img {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .container {
          width: 60%;
          display: flex;
          padding: 10% 0;
          flex-direction: column;
          align-items: center;
        }
        .title {
          font-size: 50px;
          /* color: #fff; */
          color: #fff;
        }

        .data {
          margin-top: 100px;
          width: 420px;
          height: 350px;
          padding: 20px;
          background: linear-gradient(
            180deg,
            #01206c 0%,
            #01206c 56.48%,
            #0373c6 100%
          );
          border: 0.6px solid;
          border-color: #00eeff;
          border-radius: 4px;
          box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.35),
            0px 10px 30px #00a8ff inset;
        }
        .data .title {
          font-size: 16px;
          margin-bottom: 20px;
          color: #0aa679;
        }

        .footer {
          color: #0aa679;
          font-size: 10px;
        }
      `}</style>
      <div className="container">
        <div className="title">样本中心</div>
        <div className="data">
          <h3 className="title">登录</h3>
          <Form
            name="login"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input size="large" placeholder="用户名" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password size="large" type="password" placeholder="密码" />
            </Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 4, span: 20 }}
            >
              {/* <Checkbox>记住密码</Checkbox> */}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="footer">
            <div>欢迎登录样本中心</div>
          </div>
        </div>
      </div>
    </div>
  );
  async function handleSubmit(values) {
    const body = {
      username: values.username,
      password: values.password,
    };
    const res = await login(body);
    if (!res || res.code !== 200) {
      message.error("登陆失败");
      return;
    }

    const { data } = res;
    window.localStorage.setItem("token", data.access_token);
    // const userInfo = await getUserInfo();
    window.localStorage.setItem("username", values.username);
    // //获取路由信息
    // const resRouter = await getRouters();
    // window.localStorage.setItem("routers", JSON.stringify(resRouter.data));
    logined(true);
    router.push("/");
  }
}
