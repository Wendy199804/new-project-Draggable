
import axios from 'axios'

/**
 * @description excel下载
 * @param {data} 请求携带参数 
 * @param {name} 下载文件名
 */
export default function apiExportExcel(data, name, apiPath) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: process.env.VUE_APP_BASE_API + apiPath,
            data: data,
            responseType: 'blob',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            const blob = new Blob([res])
            const fileName = name + '.xls'
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href)
            document.body.removeChild(elink)
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}