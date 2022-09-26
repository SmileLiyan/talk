var API = (function(){
    const BASE_URL = "https://study.duyiedu.com"
const TOKEN = 'token'

async function get(path) {
    const headers = {}
    const token = localStorage.getItem(TOKEN)
    if (token) {
        headers.authorization = `Bearer ${token}`
    }
    return fetch(BASE_URL + path, { headers })
}

async function post(path, bodyobj) {
    const headers = {
        "Content-Type": "application/json",
    }
    const token = localStorage.getItem(TOKEN)
    if (token) {
        headers.authorization = `bearer ${token}`
    }
    return fetch(`${BASE_URL}${path}`, { headers, method: "POST", body: JSON.stringify(bodyobj) })
}
async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo)
    return await resp.json()
}
// reg({
//     "loginId":"monica",
//     "nickname":"caca",
//     "loginPwd":"123"
// }).then(resp=>console.log(resp))

async function login(loginInfo) {
    const resp = await post('/api/user/login', loginInfo)
    const result = await resp.json()
    if (result.code === 0) {
        // 登陆成功
        // 将响应头中token保存起来（localStorage）
        const token = resp.headers.get('authorization')
        localStorage.setItem(TOKEN, token)
    }
    return result
}


async function exists(loginId) {
    const resp = await get('/api/user/exists?loginId=' + loginId);
    return await resp.json();
}
// exists({"loginId":"SC."}).then(resp=>console.log(resp))

async function profile() {
    const resp = await get('/api/user/profile')
    return await resp.json()
}

async function sendChat(content) {
    const resp = await post('/api/chat', { content,})
    return await resp.json()
}

async function getHistory() { 
    const resp = await get('/api/chat/history')
    return resp.json()
}
function loginOut(){
    localStorage.removeItem(TOKEN)
}
return {reg,login,exists,profile,sendChat,getHistory,loginOut}
})()
