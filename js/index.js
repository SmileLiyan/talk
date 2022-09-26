/**
 * 验证是否又登录，如果没有登录 ，跳转到登录页面，如果有登录，获取的登录信息
 */
(async function () {
    const resp = await API.profile()
    const user = resp.data
    // console.log(resp);
    if (!user) {
        alert('未登录或登录已过期，请重新登录')
        location.href = './login.html'
        return
    }
    // 获取各种doms元素
    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        msgContainer:$('.msg-container')
    }

    // console.log(doms.close);
    // 下面的代码一定是登录状态
    setUserInfo()
    // 关闭按钮，注销用户登录信息
    doms.close.onclick = function () {
        // console.log(1234); 
        API.loginOut()
        location.href = './login.html'
    }

    // 加载历史记录
    await loadHistory()
    async function loadHistory() {
        const resp = await API.getHistory()
        // console.log(resp);
        for (const item of resp.data) {
            addChat(item)
        }
        scrollButton()
    }

    // 设置用户信息
    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname
        doms.aside.loginId.innerText = user.loginId
    }

    // 设置表单的提交时间发送用户消息
    doms.msgContainer.onsubmit = function (e){
        e.preventDefault()
        sendChat()
    }

    /**
     *  from: 'SC.', 
        to: null, 
        content: 'nihao', 
        createdAt: 1663939232150,
     */
    function addChat(chatInfo) {
        // 消息框
        const div = $$$('div')
        div.classList.add('chat-item')
        if (chatInfo.from) {
            div.classList.add('me')
        }
        // 头像
        const img = $$$('img')
        img.className = 'chat-avatar'
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg'
        // 消息内容
        const content = $$$('div')
        content.className = 'chat-content'
        content.innerText = chatInfo.content
        // 发消息的时间，因为时间给的值是个时间戳，所以我们这里需要转化一下
        const time = $$$('div')
        time.className = 'chat-date'
        time.innerText = formateDate(chatInfo.createdAt)
        div.appendChild(img)
        div.appendChild(content)
        div.appendChild(time)
        doms.chatContainer.appendChild(div)
    }

    //让聊天区域的滚动条滚动到底
    function scrollButton() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
    }

    // 将时间戳转化为我们想要的时间格式xxxx-xx-xx xx:xx:xx
    function formateDate(timestamp) {
        // 得到日期date，通过日期得到年月日，得到时分秒
        const date = new Date(timestamp)
        // 得到年
        const year = date.getFullYear()
        // 得到月 因为月数是从0开始的，所以要加1
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        // 得到天
        const day = date.getDay().toString().padStart(2, '0')
        // 得到时
        const hour = date.getHours().toString().padStart(2, '0')
        // 得到分
        const minute = date.getMinutes().toString().padStart(2, '0')
        // 得到秒
        const second = date.getSeconds().toString().padStart(2, '0')
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    // 发送消息

    async function sendChat() {
        const content = doms.txtMsg.value.trim()
        if (!content) {
            return
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
            content
        })
        //清空文本框
        doms.txtMsg.value = ''
        scrollButton()
        const resp = await API.sendChat(content)
        // addChat(resp.data)
        addChat({
            from:null,
            to:user.loginId,
            ...resp.data
        })
        scrollButton()
        console.log(resp.data);
    }
    window.sendChat = sendChat
})()