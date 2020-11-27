<template>
    <div class="riskAndReturn">
        <moduletitle title="风险收益表现" type="manager">
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>
        <div class="content">
            <div class="chart" ref="chart" id="riskAndReturnChart"></div>
            <vLoading :show="isLoading" />
            <vNodata :show="!resultlen && !isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toPercent } from '@/utils/analyze'
import getInterval from '@/utils/chartInterval'
import { getManagerFundRiskReturnPerformance } from '@/api/manager'

export default {
    data() {
        return {
            isLoading: false,
            resultlen: 0
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.getData()
        },
        getData() {
            this.isLoading = true
            getManagerFundRiskReturnPerformance({ personalCode: this.managerInfo.id })
                .then(res => {
                    this.resultlen = res.length
                    this.handleOptions(res)
                    this.isLoading = false
                })
                .catch(() => {
                    this.isLoading = false
                })
        },
        handleOptions(data) {
            let xData = [], yData = [], series = []
            data.sort((a, b) => {
                return b.size - a.size
            })
            data.forEach((item, index) => {
                let x = item.intervalRisk,
                    y = item.intervalReturn,
                    xy = [x, y]
                item.size = Number((item.size / 100000000).toFixed(2))
                item.intervalReturn = toPercent(item.intervalReturn)
                item.intervalRisk = toPercent(item.intervalRisk)
                xData.push(x)
                yData.push(y)
                series.push({
                    symbolSize: this.getSymbolSize(item.size),
                    data: [xy],
                    hoverAnimation: false,
                    type: 'scatter',
                    itemStyle: {
                        color: 'rgba(111, 142, 230, 0.7)'
                    },
                    emphasis: {
                        itemStyle: {
                            color: 'rgba(111, 142, 230, 1)'
                        }
                    },
                    z: index + 1
                })
                return item
            })
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()

            xData.push(0.4) // x轴风险最小值40%
            yData.push(0.99) // y轴收益最小值100%
            let X = getInterval(xData),
                Y = getInterval(yData)
            let options = {
                xAxis: {
                    name: '风险',
                    nameLocation: 'middle',
                    nameGap: '30',
                    interval: X.interval,
                    min: X.min,
                    max: X.max,
                    axisLabel: {
                        formatter: (value, index) => {
                            if (index == 0) return '低风险'
                            if (index == X.splitNumber) return '高风险'
                            return `${(value * 100).toFixed(1)}%`
                        }
                    }
                },
                yAxis: {
                    name: '收益',
                    nameLocation: 'middle',
                    nameGap: '52',
                    interval: Y.interval,
                    min: Y.min,
                    max: Y.max,
                    axisLabel: {
                        formatter: (value, index) => {
                            if (index == 0) return '低收益'
                            if (index == Y.splitNumber) return '高收益'
                            return `${(value * 100).toFixed(1)}%`
                        }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: param => {
                        let obj = data[param.seriesIndex]
                        return `${obj.chiNameAbbr}
                        </br>近一年收益率：${obj.intervalReturn}
                        </br>近一年波动率：${obj.intervalRisk}
                        </br>最新规模：${obj.size}亿`
                    }
                },
                grid: { top: 26, right: 20, left: 75, bottom: 50 },
                series: series
            }
            chart.setOption(options, true)
        },
        // 规模区间 单位 / 亿
        getSymbolSize(size) {
            if (size > 100) return 54
            else if (size > 50) return 45
            else if (size > 10) return 36
            else if (size > 5) return 27
            else if (size > 0) return 18
            else {
                return 9
            }
        },
        handleDownload() {
            let list = [{ id: 'riskAndReturnChart', imgName: '风险收益表现' }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.riskAndReturn {
    .content {
        padding: 16px;
        padding-left: 0;
        background: #ffffff;
        height: calc(100% - 52px);
        display: flex;
        align-items: center;
    }
    .chart {
        width: 100%;
        height: 340px;
    }
}
</style>