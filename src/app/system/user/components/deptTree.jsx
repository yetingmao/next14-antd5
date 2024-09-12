import { Input, Tree } from 'antd';
import { useEffect, useMemo, useState } from 'react';
const { Search } = Input;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
const App = ({ deptList, queryForm, resetPaginationGetList, tHeight }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [dataList, setDataList] = useState([])
  const [selectId, setSelectId] = useState([]);

  useEffect(() => {
    let n = []
    const generateList = (data) => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, title } = node;
        n.push({
          key,
          title: title,
        });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(deptList)
    const newExpandedKeys = n
      .map((item) => {
        return getParentKey(item.key, deptList);
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setDataList(n)
    setExpandedKeys(newExpandedKeys);
    if(!queryForm.getFieldValue("deptId")){
      setSelectId([])
    }
  }, [deptList, JSON.stringify(queryForm.getFieldValue())])

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const onChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, deptList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };
  const onSelect = (selectedKeys, e) => {
    if (e.selected) {
      queryForm.setFieldValue('deptId', selectedKeys[0])
    } else {
      queryForm.setFieldValue('deptId', "")
    }
    resetPaginationGetList()
  }
  const treeData = useMemo(() => {
    const loop = (data) =>
      data.map((item) => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(deptList);

  }, [searchValue, deptList]);

  return (
    <div>
      <Search
        style={{
          margin: "20px 0",
        }}
        placeholder="搜索部门"
        onChange={onChange}
      />
      <Tree
        onExpand={onExpand}
        defaultExpandAll={true}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
        selectedKeys={selectId}
        treeData={treeData}
        style={{ maxHeight: tHeight + 100, overflow: 'auto' }}
      />
    </div>
  );
};
export default App;