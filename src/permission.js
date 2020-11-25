import router from './router'
import store from './store'

import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

import getPageTitle from '@/utils/getPageTitle'
import { getToken, getExpiredTime } from '@/utils/auth'

const whiteList = ['/login'] // 无需token

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)

    if (whiteList.indexOf(to.path) !== -1) {
        next()
        return
    }
    if (getToken()) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            // 点击的菜单功能正在开发中，给出提示
            if (/prepare/.test(to.path)) {
                NProgress.done()
                return
            }
            // tode 判断现有token是否失效
            let expired_time = getExpiredTime(),
                now_time = new Date().getTime()
            if (expired_time && expired_time > now_time) {
                if (store.getters.name) {
                    next()
                } else {
                    try {
                        await store.dispatch('user/getUserInfo')
                        next()
                    } catch (err) {
                        await this.$store.dispatch('user/logout')
                        next(`/login?redirect=${to.path}`)
                        NProgress.done()
                        Message.error(err || '信息获取异常，请重新登录')
                    }
                }
            } else {
                next(`/login?redirect=${to.path}`)
                NProgress.done()
                Message.error('登录已过期，请重新登录')
            }
        }
    } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
    }
})

router.afterEach(() => {
    NProgress.done()
})
