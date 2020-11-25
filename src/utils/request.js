import axios from 'axios'
import {
    Message,
    Loading,
    MessageBox
} from 'element-ui'
import {
    getToken
} from '@/utils/auth'
import router from '@/router'
import store from '@/store'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.withCredentials = true
axios.defaults.timeout = 500000

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8;'
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;'

axios.interceptors.request.use(
    config => {
        if (getToken() && config.url.indexOf('logout') == -1) {
            config.headers['Authorization'] = getToken()
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    response => {
        const res = response.data
        if (response.status !== 200) {
            Message({
                message: res.message || 'Error',
                type: 'error'
            })
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            if (response.headers['content-type'] == 'application/vnd.ms-excel;charset=UTF-8') return res
            if (res.code === 200) {
                return res.data
            } else {
                if (res.code === 5004) {
                    Message.error(res.msg)
                    store.dispatch('user/logout').then(() => {
                        router.push({
                            path: '/login',
                            query: {
                                redirect: ''
                            }
                        })
                        return
                    })
                } else if (res.code !== 10401) {
                    Message.error(res.msg)
                }

                return Promise.reject(res)
            }
        }
    },
    error => {
        if (axios.isCancel(error)) {
            // console.log('Request canceled', error.message)
        } else {
            const code = error.response.status
            const msg = error.response.data.msg
            if (code === 401) {
                console.log(msg);
                // store.dispatch('user/logout').then(() => {
                //     router.push({
                //         path: '/login',
                //         query: {
                //             redirect: ''
                //         }
                //     })
                // })
            }
            // 多异步接口同时调用时消息框重复弹出
            // Message({
            //     message: error.response.data.msg,
            //     type: 'error'
            // })
            return Promise.reject(error)
        }
    }
)
// export default axios

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function DELETE(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {
            data: params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
