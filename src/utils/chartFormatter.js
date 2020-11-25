/** 
 * @description 图表tooltip formatter
 * @function defaultF 默认
 * @function stackSort 显示marker + 按堆叠位置排序
 * @function lineSort 显示marker + 数值排序
 * @function doubleY 双Y轴
 * @param {params} 回调参数
 * @param {isPct} 是否百分数
 * @param {hideZero} 是否过滤0值
*/
export default {
    defaultF: (params, isPct, hideZero) => {
        let str = params[0].axisValue
        params.forEach(param => {
            let current = ''
            let check0 = !(hideZero && param.value == 0)
            if (typeof(param.value) == 'string' && param.value !== '') {
                current = `${str ? '<br>' : ''}${param.seriesName}: ${param.value}`
            }
            if (typeof(param.value) == 'number' && check0) {
                current = `${str ? '<br>' : ''}${param.seriesName}: ${isPct ? (param.value * 100).toFixed(2)+'%' : param.value.toFixed(2)}`
            }
            str += current
        })
        return str
    },
    stackSort: (params, isPct, hideZero) => {
        let over = params.filter(item => item.value >= 0),
            below = params.filter(item => item.value < 0)
        over.reverse()
        params = [...over, ...below]
        let str = params[0].axisValue
        params.forEach(param => {
            let current = ''
            let check0 = !(hideZero && param.value == 0)
            if (typeof(param.value) == 'string' && param.value !== '') {
                current = `${str ? '<br>' : ''}${param.marker}${param.seriesName}: ${param.value}`
            }
            if (typeof(param.value) == 'number' && check0) {
                current = `${str ? '<br>' : ''}${param.marker}${param.seriesName}: ${isPct ? (param.value * 100).toFixed(2)+'%' : param.value.toFixed(2)}`
            }
            str += current
        })
        return str
    },
    lineSort: (params, isPct, hideZero) => {
        params = params.sort((a, b) => b.value - a.value)
        let str = params[0].axisValue
        params.forEach(param => {
            let current = ''
            let check0 = !(hideZero && param.value == 0)
            if (typeof(param.value) == 'string' && param.value !== '') {
                current = `${str ? '<br>' : ''}${param.marker}${param.seriesName}: ${param.value}`
            }
            if (typeof(param.value) == 'number' && check0) {
                current = `${str ? '<br>' : ''}${param.marker}${param.seriesName}: ${isPct ? (param.value * 100).toFixed(2)+'%' : param.value.toFixed(2)}`
            }
            str += current
        })
        return str
    },
    doubleY: (params, isPct, hideZero) => {
        let str = params[0].axisValue
        params.forEach(param => {
            let current = ''
            let check0 = !(hideZero && param.value == 0)
            if (typeof(param.value) == 'string' && param.value !== '') {
                current = (str ? '<br>' : '') + param.seriesName + ': ' + param.value
            }
            if (typeof(param.value) == 'number' && check0) {
                if (isPct && isPct[param.seriesIndex]) {
                    current = (str ? '<br>' : '') + param.seriesName + ': ' + (param.value * 100).toFixed(2) + '%'
                } else {
                    current = (str ? '<br>' : '') + param.seriesName + ': ' + param.value.toFixed(2)
                }
            }
            str += current
        })
        return str
    }
}
