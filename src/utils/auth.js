import Cookies from 'js-cookie'

const TokenKey = 'zhijun_login_token'
export function getToken() {
    return Cookies.get(TokenKey)
}
export function setToken(token) {
    return Cookies.set(TokenKey, token)
}
export function removeToken() {
    return Cookies.remove(TokenKey)
}

const ExpiredTimeKey = 'zhijun_token_expired_time'
export function getExpiredTime() {
    return Cookies.get(ExpiredTimeKey)
}
export function setExpiredTime(time) {
    let now_time = new Date().getTime()
    return Cookies.set(ExpiredTimeKey, now_time + time*1000)
}

const UserKey = 'zhijun_user_info'
export function getUser() {
    return Cookies.get(UserKey) ? JSON.parse(Cookies.get(UserKey)) : null
}
export function setUser(userinfo) {
    return Cookies.set(UserKey, JSON.stringify(userinfo))
}
export function removeUser() {
    return Cookies.remove(UserKey)
}
