import {
  createContext,
  useCallback,
  useState
} from "react";
import ViewContext from "./viewContext"


const ViewContextProvider = ({ children }) => {

  const [title, setTitle] = useState("");
  const [routerList, setRouterList] = useState("");
  const [activeMenu, setActiveMenu] = useState("");
  const [topRouterList, settopRouterList] = useState([]);
  const [topRouterActiveItem, settopRouterActiveItem] = useState("");

  const changeTitle = (title) => {
    setTitle(title)
  }

  const changeRouterList = (title) => {
    setRouterList(title)
  }

  const changeActiveMenu = (title) => {
    setActiveMenu(title)
  }

  const changeTopRouterList = (e) => settopRouterList(e);
  const changeTopActiveItem = (e) => settopRouterActiveItem(e);

  return (
    <ViewContext.Provider value={
      {
        changeTitle,
        title,
        changeRouterList,
        routerList,
        activeMenu,
        changeActiveMenu,
        topRouterList,
        changeTopRouterList,
        topRouterActiveItem,
        changeTopActiveItem
      }
    }>
      {children}
    </ViewContext.Provider>
  )
}

export default ViewContextProvider;