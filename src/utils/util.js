
import axios from 'axios';
import { Modal } from 'antd';
import { SERVERURL, MxDrawServer } from "../config";

const Util = {
  initTableHeight: (father, brothers, more) => {
    const _f = father.clientHeight;
    const _bs = brothers.reduce(function (sum, number) { //sum2 前两个数的和
      return sum + number.clientHeight;
    }, 0)
    console.log("_brothers", brothers)
    console.log("_f - _bs - more", _f, _bs, more, _f - _bs - more)
    return _f - _bs - more;
  },
  arrayToJson: (list, pid, parentId = "parentId", id = "menuId") => {
    function _f(pid, parentId, id) {
      const a = [];
      for (const item of list) {
        const temp = { ...item };
        if (temp[parentId] == pid) {
          temp.children = _f(temp[id], parentId, id)
          a.push(temp);
        }
      }
      return a;
    }
    return _f(pid, parentId, id)
  },
  /*
  * @params {string} url 请求地址
  */
  download: (url, name) => {
    const token = localStorage.getItem("token");
    axios.get(`${url}`, {
      responseType: 'blob',
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(res => {
      let url = window.URL.createObjectURL(new Blob([res.data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      const fileName = name || res.headers['content-disposition'].match(/filename=(.*)/)[1];
      link.setAttribute("download", decodeURI(fileName));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
  },
  convertRes2Blob: (response) => {
    // 提取文件名
    const fileName = response.headers['content-disposition'].match(
      /filename=(.*)/
    )[1]
    // 将二进制流转为blob
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
      window.navigator.msSaveBlob(blob, decodeURI(fileName))
    } else {
      // 创建新的URL并指向File对象或者Blob对象的地址
      const blobURL = window.URL.createObjectURL(blob)
      // 创建a标签，用于跳转至下载链接
      const tempLink = document.createElement('a')
      tempLink.style.display = 'none'
      tempLink.href = blobURL
      tempLink.setAttribute('download', decodeURI(fileName))
      // 兼容：某些浏览器不支持HTML5的download属性
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }
      // 挂载a标签
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      // 释放blob URL地址
      window.URL.revokeObjectURL(blobURL)
    }
  },
  showFileModal(fileUrl, fileName) {
    let type = fileName.split(".").reverse()[0];
    switch (type) {
      case "txt":
        Modal.success({
          content: (
            <iframe src={fileUrl} style={{ width: '100%', height: "100%" }}></iframe>
          ),
          width: 600
        });
        break;
      case "pdf":
        Modal.success({
          content: (
            <iframe src={fileUrl} style={{ width: '100%', height: "100%" }}></iframe>
          ),
          width: 600
        });
        break;
    }

  },
    /**
   * 构造树型结构数据
   * @param {*} data 数据源
   * @param {*} id id字段 默认 'id'
   * @param {*} parentId 父节点字段 默认 'parentId'
   * @param {*} children 孩子节点字段 默认 'children'
   */
    buildTreeData(
      data,
      id,
      name,
      parentId,
      parentName,
      children,
    ) {
      const config = {
        id: id || 'id',
        name: name || 'name',
        parentId: parentId || 'parentId',
        parentName: parentName || 'parentName',
        childrenList: children || 'children',
      };
  
      const childrenListMap = {};
      const nodeIds = {};
      const tree = [];
      data.forEach((item) => {
        const d = item;
        const pId = d[config.parentId];
        if (childrenListMap[pId] == null) {
          childrenListMap[pId] = [];
        }
        d.key = d[config.id];
        d.title = d[config.name];
        d.value = d[config.id];
        nodeIds[d[config.id]] = d;
        childrenListMap[pId].push(d);
      });
  
      data.forEach((item) => {
        const d = item;
        const pId = d[config.parentId];
        if (nodeIds[pId] == null) {
          d[config.parentName] = '';
          tree.push(d);
        }
      });
  
      tree.forEach((t) => {
        adaptToChildrenList(t);
      });
  
      function adaptToChildrenList(item) {
        const o = item;
        if (childrenListMap[o[config.id]] !== null) {
          o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
          o[config.childrenList].forEach((child) => {
            const c = child;
            c[config.parentName] = o[config.name];
            adaptToChildrenList(c);
          });
        }
      }
      return tree;
    },
}

export default Util