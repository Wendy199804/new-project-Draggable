import { post } from '@/utils/request'
import { Message } from 'element-ui'

export default function getData(param, callback) {
    post('/model/push_request', param).then(res => {
        getResult(res, callback)
    })
}

// 根据返回id获取对应数据
function getResult(requestId, callback) {
    try {
        post('/model/get_result', { request_id: requestId }).then(function(res) {
            if (res.status === 'ERROR') {
                Message.error('ERROR')
            }
            if (res.status === 'FINISHED') {
                if (callback) {
                    callback(res.result)
                    return
                }
                return res
            }
            if (res.status === 'Result.PROCESSING') {
                setTimeout(function() {
                    getResult(requestId, callback)
                }, 1000)
            }
        })
    } catch (error) {
        Message.error(error.msg)
    }
}