/**
 * @description 堆叠图的tooltip 只显示鼠标所在色块的数据
 * @param {barStask}
 * @param {lineStack}
 */
export default {
    barStack: (isPct) => {
        return {
            trigger: 'item',
            formatter: (params) => {
                let data = isPct ? (params.data * 100).toFixed(2) + '%' : params.data.toFixed(2)
                return `${params.name}<br>${params.marker}${params.seriesName}: ${data}`
            }
        }
    },
    lineStack: (isPct) => {
        return {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    formatter: function(params) {
                        if (params.seriesData.length === 0) {
                            window.mouseCurValue = params.value
                        }
                    },
                    show: false
                }
            },
            formatter: function(params) {
                let res = '', sum = 0
                for (let i = 0; i < params.length; i++) {
                    let series = params[i]
                    sum += Number(series.data)
                    if (sum >= window.mouseCurValue) {
                        let data = isPct ? (series.data * 100).toFixed(2) + '%' : series.data.toFixed(2)
                        res = `${series.axisValue}<br>${series.marker}${series.seriesName}: ${data}`
                        break
                    }
                }
                return res
            }
        }
    }
}