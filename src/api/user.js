import { post } from '@/utils/request'

/**
 * @description 用户登录
 * @param {username} 用户名
 * @param {password} 密码
 */
export function login(data) {
    return post(`${process.env.VUE_APP_BASE_API.replace(/\/api/g, '')}/login`, data)
}

/**
 * 获得账号信息
 */
export function getUserinfo() {
    return post('/system/user/getCurrentUserInfo')
}

/**
 * 修改密码
 * @param {password}
 */
export function resetPassword(data) {
    return post('/system/user/updatePassword', data)
}
/**
 * 确认邮箱
 * @param {email}
 */
export function sendEmail(data) {
    return post('/system/accountLoginController/forgetPasswordByCode', data)
}

/**
 * 确认验证码
 * @param {captcha,userName}
 */
export function sendCode(data) {
    return post('/system/accountLoginController/checkCaptcha', data)
}

/**
 * 设置新密码
 */
export function newPassword(data) {
    return post('/system/accountLoginController/modifyPasswordByCode', data)
}
