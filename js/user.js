// 用户登录和注册的表单项验证的通用代码
/**
 * 对表单的某一项进行验证
 */
class FieldValidator {
    /**
     * 
     * @param {*} txtId  文本框的Id
     * @param {*} validatorFunc  验证规则函数，当需要对该文本框验证时，会调用这个函数函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回则表示无错误
     */
    constructor(txtId, validatorFunc) {
        this.input = $('#' + txtId)
        this.p = this.input.nextElementSibling
        this.validatorFunc = validatorFunc
        // console.log(this.p, this.input);
        // 失去焦点，表单验证
        this.input.onblur = () => {
            this.validate()
        }
    }
    /**
     * 验证，成功返回ture，失败返回 false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value)
            if(err){
                // 有错误
                this.p.innerText = err
                return false
            }else{
                this.p.innerText = ''
                return true
            }
    }
    /**
     * 对传入的验证器进行统一的验证，如果所有的验证都通过了，就返回true 否则就返回false
     * @param  {FieldValidator[]} validators 
     */
    static async validate(...validators) {
    const proms =  validators.map(item=>item.validate())
    const results = await Promise.all(proms)
    return results.every(item=>item)
    }
}


function test(){
    FieldValidator.validate(loginIdValitor,nicknameValitor).then(result =>{
        console.log(result);
    })
}