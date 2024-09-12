

const chen = "http://192.168.0.111:8080/";
const liang = "http://192.168.0.120:8080";
const line = "http://114.116.247.159:7050/aioa";
const test = "http://192.168.0.183:8080";  //外网
const zhang = "http://20.58.69.75:28088/Others/speech0724/";  //内网
const ce = "http://20.58.69.75:28088/";  //
const WordLookURL = process.env.NODE_ENV === "development" ? "http://192.168.0.183:18012" : "http://192.168.0.183:18012";
// const ce = "/";  //外网
const wechatLine = "http://114.116.247.159:7001/api"

const SERVERURL = process.env.NODE_ENV === "development" ? test : "/api";


export {
    SERVERURL,WordLookURL
}