// 针对账号的验证规则，针对昵称的验证规则
const loginIdValitor = new FieldValidator("txtLoginId", async function (val) {
    if (!val) {
        return "请填写账号"
    }
    // 验证账号是否被注册过
    const resp = await API.exists(val)
    if(resp.data){
        return "该账号已被注册，请重新选择账号"
    }
})
const nicknameValitor = new FieldValidator("txtNickname", async function (val){
    if(!val){
        return "请填写昵称"
    }
})
const loginPwdValidator = new FieldValidator("txtLoginPwd", async function (val){
    if(!val){
        return "请填写密码"
    }
})
const loginPwdConfirmValidator = new FieldValidator("txtLoginPwdConfirm", async function (val){
    if(!val){
        return "请确认密码"
    }
    if(val !== loginPwdValidator.input.value) {
        return "两次密码不一致，请确认密码"
    }
})

// 给表单注册提交事件
const form = $('.user-form')
form.onsubmit= async function (e){
    // 阻止表单的默认事件
    e.preventDefault()
    // console.log('已完成表单验证');
    const result = await FieldValidator.validate(loginIdValitor,nicknameValitor,loginPwdValidator,loginPwdConfirmValidator)
    // console.log(result);
    if(!result){
        return "表单验证未通过"
    }
    // 使用一个新的知识点来获取表单上带有name属性的值 返回格式为{name：输入的值}
    // FormData 传入form表单 ，得到一个表单数据对象
    const formdata = new FormData(form)
    const data =  Object.fromEntries(formdata.entries())
    // console.log(data);
    const resp =await API.reg(data)
    if(resp.code === 0){
        alert('注册完成，点击确定，即将跳转到登录页')
        location.href = './login.html'
    }
}