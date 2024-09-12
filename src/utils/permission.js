
const permission = {
    hasPermission: (perm) => {
        let UserData = JSON.parse(window.localStorage.getItem("userInfo"));
        let has;
        if (UserData) {
            let selfselfPermission = UserData.permissions;
            has = selfselfPermission.some((item) => { return item == perm || item == '*:*:*' })
        }
        return has
    }
}


export default permission