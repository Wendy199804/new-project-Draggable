import ts2date from './timestamp2date'

/**
* @desc: 格式化时间戳过滤器
* @return: 返回时间字符串
*/
export function formatDateStr(value){
    if (!value) return ' '
    return ts2date(value)
}