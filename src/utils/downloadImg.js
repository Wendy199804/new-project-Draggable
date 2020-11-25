import { Message, Loading } from 'element-ui'
import store from '@/store'

// list = [{id: '', imgName: ''}]

function downloadImg(list) {
    if (store.getters.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
    Message({
        message: '开始下载，稍后请前往下载文件夹查看',
        type: 'info',
        duration: 4000,
        showClose: true
    })
    setTimeout(() => {
        import('@/vendor/htmlToImg').then(img => {
            list.forEach(item => {
                // console.log(item.imgName)
                img.downloadIMG(item.id, item.imgName)
            })
        })
    }, 500)
}

export default downloadImg
