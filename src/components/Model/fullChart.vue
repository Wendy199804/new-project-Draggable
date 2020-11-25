<template>
    <div class="full">
        <div ref="chart" class="chart"></div>
        <div class="legend row">
            <p :class="type == 'line' ? 'line' : 'rect'" v-for="(item, index) in legend" :key="index">
                <span :style="`background: ${colors[index]};`"></span>{{ item }}
            </p>
        </div>
    </div>
</template>

<script>
import commonStyle from '@/utils/chartStyle'
import tooltipFormatter from '@/utils/chartFormatter'
import chartMixin from './echarts'
import otherTooltip from '@/utils/chartTooltip'

export default {
    /**
     * @props
     * type: 'line'/'bar'
     * xData: x轴坐标值
     * seriesData: []
     */
    props: [
        'type',
        'legend',
        'xData',
        'seriesData',
        'colorKey', // 指定配色关系
        'isPct',
        'otherOptions',
        'seriesOptions',
        'nameOptions',
        'hideZero', // tooltip是否需要过滤0值
        'formatterType',
        'tooltipType',
        'name',
        "diyborderWidth"
    ],
    mixins: [chartMixin],
    data() {
        return {
            noNegative: false,
            noPositive: false,
            minState: [], // 最小值是否大于0
            maxState: [], // 最大值是否小于0
            yAxisIsPct0: [], // 第一坐标系的刻度格式
            yAxisIsPct1: [], // 第二坐标系的刻度格式
            chart: '',
            yAxis_value:''
        }
    },
    methods: {
        drawChart() {
            let chart = this.$echarts.init(this.$refs.chart)
            this.chart = chart
            chart.clear()
            chart.resize()

            if (this.xData == null || this.seriesData == null) {
                chart.showLoading(commonStyle.loadingStyle)
                return
            }
            this.checkMaxAndMin()
            let options = {
                // animation: false,
                grid: commonStyle.grid_f,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: (this.seriesData[0].type || this.type) == 'bar' ? true : false,
                        data: this.xData
                    },
                    {
                        type: 'category'
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    },
                    {
                        type: 'value',
                        splitLine: {
                            show: false,
                            showMaxLabel: false,
                            showMinLabel: false
                        }
                    }
                ]
            }
            if (this.tooltipType) {
                options.tooltip = otherTooltip[this.tooltipType](this.isPct)
            } else {
                options.tooltip = Object.assign({}, commonStyle.tooltip, {
                    axisPointer: {
                        type: (this.seriesData[0].type || this.type) == 'bar' ? 'shadow' : 'line'
                    },
                    formatter: params => {
                        return tooltipFormatter[this.formatterType || 'doubleY'](params, this.isPct, this.hideZero)
                    }
                })
            }

            options.yAxis.forEach((y, index) => {
                if (!this.seriesData[index]) return
                let minInterval = this.getInterval(index)
                let axisLabel = this.getLabelFormatter(index, minInterval)
                let yName = {}
                if (this.nameOptions && this.nameOptions[index]) {
                    yName = this.nameOptions[index]
                }
                return Object.assign(y, {
                    minInterval,
                    axisLabel,
                    ...yName
                })
            })
            options.series = this.seriesData.map((item, index) => {
                let type = item.type || this.type || 'line'
                let series = {
                    name: item.name,
                    type: type,
                    symbolSize: item.data.length == 1 ? 4 : 1,
                    data: item.data,
                    color: item.color || this.colors[index]
                }
                if (type == 'bar') {
                    series.barGap = 0
                    this.diyborderWidth ? series.barWidth = '20%' : series.barMaxWidth = '20%'
                }
                if (item.isArea) {
                    series.areaStyle = {
                        color: item.color || this.colors[index],
                        opacity: 1
                    }
                    item.opacity && (series.areaStyle.opacity = item.opacity)
                    series.lineStyle = { width: 0 }
                }
                if (index > 0) {
                    series.yAxisIndex = 1
                }
                if (this.seriesOptions && this.seriesOptions[index]) {
                    Object.keys(this.seriesOptions[index]).forEach(key => {
                        series[key] = this.seriesOptions[index][key]
                    })
                }
                return series
            })

            // 单坐标、双坐标系显示
            if (options.series.filter(item => item.yAxisIndex == 1).length == 0) {
                options.yAxis[1].axisLine = { show: false }
                options.grid = commonStyle.grid_f
            } else {
                options.grid = commonStyle.grid_f_2
                // options.grid.right = 60
                // 判断双坐标系的数值格式
                options.series.forEach((series, index) => {
                    if (series.yAxisIndex == 1) {
                        this.yAxisIsPct1.push(this.isPct[index])
                    } else {
                        this.yAxisIsPct0.push(this.isPct[index])
                    }
                })
                // 设置双坐标系时的数值分布
                options.yAxis[0].max = this.getMax0
                options.yAxis[0].min = this.getMin0
                options.yAxis[0].splitNumber = 4

                options.yAxis[1].max = this.getMax1
                options.yAxis[1].min = this.getMin1
                options.yAxis[1].splitNumber = 4
            }

            if (this.otherOptions && Object.keys(this.otherOptions).length > 0) {
                Object.keys(this.otherOptions).forEach(key => {
                    if (!options[key]) {
                        options[key] = this.otherOptions[key]
                    } else {
                        if (this.otherOptions[key] instanceof Array) {
                            options[key] = this.otherOptions[key]
                        } else {
                            options[key] = Object.assign({}, options[key], this.otherOptions[key])
                        }
                    }
                })
            }
            chart.hideLoading()
            chart.setOption(options)
            if (this.name == 'returnTrend') {
                this.yAxis_value = chart.getModel().getComponent('yAxis').axis.scale._extent // y轴刻度范围
            }
        },
        // 清空画布
        clear() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
        },
        // 当窗口或者大小发生改变时需要重新绘制图表
        resize() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.resize()
        },

        /**
         * 获取坐标轴的最小间隔 和 坐标轴位数
         */
        getInterval(n) {
            let interval
            if (!this.isPct[n]) {
                interval = 1
            }
            let cut =
                this.seriesData[n].data.length > 1
                    ? (Math.max(...this.seriesData[n].data) - Math.min(...this.seriesData[n].data)) * 100
                    : Math.abs(this.seriesData[n].data[0]) * 100
            if (cut > 2) interval = 0.01
            if (cut > 0.1 && cut <= 2) interval = 0.001
            if (cut > 0.01 && cut <= 0.1) interval = 0.0001
            if (cut <= 0.01) interval = 0.00001
            if (cut == 0) interval = 0.01
            return interval
        },
        getLabelFormatter(n, interval) {
            const formatter = value => {
                if (this.isPct[n]) {
                    let level = (interval * 10 + '').length - 3
                    return (value * 100).toFixed(level) + '%'
                }
                return value
            }
            return { formatter }
        },
        /**
         * 数据中最大值最小值与0坐标轴的判断
         */
        checkMaxAndMin() {
            this.minState = []
            this.maxState = []
            for (let i = 0; i < this.seriesData.length; i++) {
                this.minState.push(Math.min(...this.seriesData[i].data) >= 0)
                this.maxState.push(Math.max(...this.seriesData[i].data) <= 0)
            }
            this.noNegative = this.minState.indexOf(false) > -1 ? false : true
            this.noPositive = this.maxState.indexOf(false) > -1 ? false : true
        },
        /**
         * 获取左右两侧坐标轴的刻度
         */
        getMax0({ max, min }) {
            return this.getMax(max, min, 0)
        },
        getMin0({ max, min }) {
            return this.getMin(max, min, 0)
        },
        getMax1({ max, min }) {
            return this.getMax(max, min, 1)
        },
        getMin1({ max, min }) {
            return this.getMin(max, min, 1)
        },
        /**
         * 获取坐标轴刻度最大值
         */
        getMax(max, min, index) {
            let { _max, _min } = this.getMaxAndMin(max, min)
            let interval = this.getInterval(index)
            if (this.noPositive) return 0
            let maxVal
            if (this.noNegative) {
                maxVal = Math.ceil(_max / interval) * interval
            } else {
                const absMax = Math.max(Math.abs(_max), Math.abs(_min))
                maxVal = Math.ceil(absMax / interval) * interval
            }
            return this.formatCeilNum(maxVal, this['yAxisIsPct' + index][0])
        },
        /**
         * 获取坐标轴刻度最小值
         */
        getMin(max, min, index) {
            let { _max, _min } = this.getMaxAndMin(max, min)
            let interval = this.getInterval(index)
            if (this.noNegative) return 0
            let minVal
            if (this.noPositive) {
                minVal = 0 - Math.ceil(Math.abs(_min) / interval) * interval
            } else {
                const absMax = Math.max(Math.abs(_max), Math.abs(_min))
                minVal = 0 - Math.ceil(absMax / interval) * interval
            }
            return this.formatFloorNum(minVal, this['yAxisIsPct' + index][0])
        },
        /**
         * 判断最大最小值相等的情况
         */
        getMaxAndMin(max, min) {
            let _max = max,
                _min = min
            if (max == min) {
                _max = max > 0 ? max : 0
                _min = max > 0 ? 0 : max
            }
            return { _max, _min }
        },
        /**
         * 调整最大最小刻度格式
         */
        formatCeilNum(num, isPct) {
            let interval = this.getFormatInterval(isPct ? Math.abs(num / 100) : Math.abs(num))
            return Math.ceil(num * (1 / interval)) / (1 / interval)
        },
        formatFloorNum(num, isPct) {
            let interval = this.getFormatInterval(isPct ? Math.abs(num / 100) : Math.abs(num))
            return Math.floor(num * (1 / interval)) / (1 / interval)
        },
        getFormatInterval(num) {
            let interval
            if (num > 50000) interval = 10000
            if (num > 5000 && num <= 50000) interval = 1000
            if (num > 500 && num <= 5000) interval = 100
            if (num > 50 && num <= 500) interval = 10
            if (num > 5 && num <= 50) interval = 1
            if (num > 0.5 && num <= 5) interval = 0.1
            if (num > 0.05 && num <= 0.5) interval = 0.01
            if (num > 0.0005 && num <= 0.05) interval = 0.001
            if (num <= 0.005) interval = 0.0001
            return interval
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    margin: 0;
    padding: 0;
    width: 100%;
}
</style>
