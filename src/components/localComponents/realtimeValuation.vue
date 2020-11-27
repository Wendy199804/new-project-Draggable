<template>
    <div class="relative">
        <p v-if="lastData">
            <span class="bold">盘中实时估值：</span>
            <span class="mr20">{{lastData.time}}</span>
            <span class="gray">估值：</span>
            <span v-if="lastData.nv == null">--</span>
            <span v-else :class="{'bold': true, 'red': lastData.nv > this.base, 'green': lastData.nv < this.base}">{{lastData.nv.toFixed(4)}}</span>
            <span class="gray ml10">涨幅：</span>
            <span v-if="lastData.return == null">--%</span>
            <span v-else :class="{'bold': true, 'red': lastData.return > 0, 'green': lastData.return < 0}">{{lastData.return.toFixed(2)}}%</span>
        </p>
        <section>
            <!-- 可交互图表 -->
            <!-- <div ref="chart" class="chart"></div> -->

            <!-- 有水印图片 -->
            <div ref="watermarkChart" class="chart chart-bg" :style="heightStyle"></div>
            <canvas id="canvas" class="chart" :style="heightStyle"></canvas>
            <img src="@/assets/images/zhijun_watermark.png" id="watermark" class="chart-bg" alt="">
        </section>
        <vLoading :show="isFirstLoading" />
        <vNodata :show="!yData1 && !isFirstLoading" />
    </div>
</template>

<script>
import { getRealTimeValuation } from '@/api/analysis'

export default {
    props: ['code', 'height'],
    data() {
        return {
            xData: [
                '9:30','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '10:30','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '11:30/13:00','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '14:00','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
                '15:00'
            ],
            isFirstLoading: false,
            base: 0,
            yData1: null,
            yData2: null,
            lastData: null
        }
    },
    computed: {
        heightStyle() {
            return `height: ${this.height || 240}px;`
        }
    },
    methods: {
        render() {
            this.getChartData()
            let interval = setInterval(() => {
                this.getChartData()
            }, 60000)
            this.$once('hook:beforeDestroy', () => {
                clearInterval(interval)
            })
        },
        async getChartData() {
            !this.yData1 && (this.isFirstLoading = true)
            const res = await getRealTimeValuation({
                fund_innercode: this.code
            })
            this.isFirstLoading && (this.isFirstLoading = false)
            // if (!res || JSON.stringify(res) == '{}') {
            //     this.yData1 = null
            //     return
            // }
            if (!res.mfFundnetvaluere) {
                this.yData1 = null
                return
            }
            this.base = res.mfFundnetvaluere.unitNV
            let UnitNV = [], returns = [], time = []
            Object.keys(res.linkedHashMap).forEach(key => {
                let item = res.linkedHashMap[key]
                UnitNV.push(item.UnitNV_now)
                returns.push(item.track_return_now)
                time.push(item.time_now[0])
            })
            this.yData1 = UnitNV
            this.yData2 = returns
            let idx = 0
            if (UnitNV.findIndex(item => item == null) > -1) {
                let reversedY = UnitNV.concat([]).reverse()
                idx = reversedY.findIndex((item, index) => item !== null)
            }
            let lastIdx = UnitNV.length - 1 - idx
            this.lastData = {
                time: time[lastIdx],
                nv: UnitNV[lastIdx],
                return: returns[lastIdx] * 100
            }
            this.$nextTick(() => {
                this.draw()
            })
        },
        draw() {
            let ref = this.$refs['watermarkChart']
            if (!ref) return
            let chart = this.$echarts.init(ref)
            let availableY = this.yData1.filter(item => item !== null),
                max = Math.max(...availableY),
                min = Math.min(...availableY),
                abs = Math.max(max - this.base, this.base - min) * 1.12 // y坐标轴单向长度
            const _red = '#FD484C', _green = '#50C75A', _black = '#333'
            let option = {
                grid: {
                    top: 14,
                    bottom: 30,
                    left: 60,
                    right: 66
                },
                // tooltip: {
                //     trigger: 'axis',
                //     formatter: (params) => {
                //         return `${params[0].name}<br>
                //             ${params[0].seriesName}: ${params[0].value.toFixed(4)}<br>
                //             ${params[1].seriesName}: ${(params[1].value * 100).toFixed(2)}%`
                //     }
                // },
                xAxis: [{
                    type: 'category',
                    scale: false,
                    data: this.xData,
                    axisLabel: { interval: 59 },
                    axisTick: { show: false },
                }],
                yAxis: [{
                    axisLabel: {
                        color: (value, index) => {
                            return index > 4 ? _red : index < 4 ? _green : _black
                        },
                        formatter: (value, index) => {
                            return value.toFixed(4)
                        }
                    },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    max: this.base + abs,
                    min: this.base - abs,
                    interval: abs/4
                }, {
                    axisLabel: {
                        color: (value, index) => {
                            return index > 4 ? _red : index < 4 ? _green : _black
                        },
                        formatter: (value, index) => {
                            if (index == 4) return '0.00%'
                            return (value * 100).toFixed(2) + '%'
                        }
                    },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    max: abs/this.base,
                    min: -abs/this.base,
                    interval: abs/4/this.base
                }],
                series: [{
                    name: '实时净值',
                    type: 'line',
                    data: this.yData1,
                    symbolSize: this.yData1.length > 1 ? 0 : 3,
                    color: this.lastData.nv > this.base ? _red : this.lastData.nv < this.base ? _green : _black
                }, {
                    name: '实时涨幅',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.yData2,
                    symbolSize: 0,
                    color: 'transparent'
                }]
            }
            chart.setOption(option)
            chart.on('rendered', () => {
                let src = chart.getDataURL({
                    pixelRatio: 2,
                    backgroundColor: '#fff'
                })
                // 加水印
                let canvas = document.getElementById('canvas')
                if (!canvas) return 
                let ctx = canvas.getContext('2d')
                let img = new Image()
                img.src = src
                img.onload = () => {
                    canvas.width = img.width
                    canvas.height = img.height
                    ctx.drawImage(img, 0, 0)
                    let logo = document.getElementById('watermark')
                    ctx.drawImage(logo, img.width-500, img.height-136, logo.width*2, logo.height*2)
                }
            })
        },
        clear() {
            this.isFirstLoading = false
            this.base = 0
            this.yData1 = null
            this.yData2 = null
            this.lastData = null
        },
    }
}
</script>

<style lang="scss" scoped>
    .font16{font-size: 16px;}
    .mr20{margin-right: 20px;}
    .ml10{margin-left: 10px;}
    .red{color: #FD484C;}
    .green{color: #50C75A;}
    .gray{color: #999;}
    .chart-bg{
        position: absolute;
        z-index: -1;
        left: 0;
    }
    .chart{
        width: 100%;
    }
</style>