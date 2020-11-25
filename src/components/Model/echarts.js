
import commonStyle from '@/utils/chartStyle';
import { allBenchmark } from '@/utils/benchmark';

export default{
    data() {
        return {
            allBenchmarkName: []
        }
    },
    beforeMount() {
        let list = [
            '基准',
            '业绩比较基准',
            '80%×沪深300 + 20%×中证全债',
            '60%×沪深300 + 40%×中证全债',
        ]
        allBenchmark.forEach(group => {
            list = list.concat(group.children.map(item => item.label))
        })
        this.allBenchmarkName = list
    },
    computed: {
        colors() {
            let { colors, blockColors, lineColors } = commonStyle,
                isLine = ['line'].includes(this.type) && !this.isStack,
                chartColors = []
            // 分类、行业、评级、因子等指定颜色
            if (this.colorKey) {
                chartColors = this.legend.map((item, index) => {
                    let v = commonStyle[this.colorKey][item]
                    // 直接指定颜色值
                    if (typeof(v) == 'string' && v.indexOf('#') > -1) return v
                    // 指定在所有色块中的颜色索引（从1开始）
                    return v >= 0 ? colors[v - 1] : (isLine ? lineColors[index] : colors[blockColors[index] - 1])
                })
            } else {
                let repeat = isLine 
                    ? lineColors.slice(0, -1) 
                    : blockColors.map(i => colors[i - 1])
                chartColors = [...repeat, ...repeat, ...repeat]
            }
            // 指数、基准单独指定颜色
            if (this.legend && this.legend.length) {
                let benchmarkIndex = this.legend.findIndex(item => this.allBenchmarkName.includes(item))
                    benchmarkIndex > -1 && (chartColors[benchmarkIndex] = isLine 
                                        ? lineColors[lineColors.length-1]
                                        : colors[colors.length-1])
            }
            // 组件内部指定特殊颜色
            if (this.seriesOptions) {
                this.seriesOptions.forEach((item, index) => {
                    let c = ''
                    item && item.color && (c = item.color)
                    item && item.itemStyle && item.itemStyle.color && (c = item.itemStyle.color)
                    c && (chartColors[index] = c)
                })
            }
            return chartColors
        }
    }
}