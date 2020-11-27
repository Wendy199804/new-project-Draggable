<template>
    <div class="card">
        <moduletitle title="基金经理变更">
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body">
            <div class="relative" id="managerChange">
                <div class="chart-wrap">
                    <div ref="chart" class="chart"></div>
                    <div v-if="tooltipData" class="tooltip-box">
                        <p class="bold hover-highlight" @click="handleClickManager(tooltipData.code)">{{ tooltipData.name }}</p>
                        <p class="font13">
                            任职时间 <span class="right">{{ tooltipData.start }}至{{ tooltipData.end || '今' }}</span>
                        </p>
                        <p class="font13">
                            任职天数 <span class="right">{{ tooltipData.days }}天</span>
                        </p>
                        <p class="font13">
                            任职回报
                            <span v-if="tooltipData.performance === null" class="right">- -</span>
                            <span v-else :class="['right', { 'color-red': tooltipData.performance > 0, 'color-green': tooltipData.performance < 0 }]">
                                {{ tooltipData.returns }}%
                            </span>
                        </p>
                    </div>
                </div>
                <p class="tip">注：基金成立时间为{{ startDate }}</p>
                <vLoading :show="isLoading" />
                <vNodata :show="!managers.length && !isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHistoryManagers } from '@/api/analysis'
import today from '@/utils/getCurrentDate'

export default {
    data() {
        return {
            isLoading: false,
            managers: [],
            minX: '',
            maxX: '',
            startDate: '',
            activeManagerIndex: null
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        tooltipData() {
            if (!this.managers.length) return null
            return this.managers[this.activeManagerIndex]
        }
    },
    methods: {
        render() {
            this.getChartData()
        },
        async getChartData() {
            this.isLoading = true
            const res = await getHistoryManagers({
                innerCode: this.selectFundToAnalyze.innercode
            })
            let managers = res
                .map(item => {
                    return {
                        code: item.personalCode,
                        name: item.name,
                        start: item.accessionDate,
                        end: item.dimissionDate || today,
                        days: item.managementTime,
                        performance: item.performance,
                        returns: (item.performance * 100).toFixed(2)
                    }
                })
                .reverse()
            this.managers = [{}, ...managers, {}]
            // 起始时间至少为距今五年的年初，结束时间为当前
            this.startDate = managers.map(item => item.start).sort()[0]
            let minStart = this.startDate.slice(0, 4)
            // let before5 = today.split('-')[0] - 5
            // this.minX = `${Math.min(+minStart, before5)}-01-01`
            this.minX = `${minStart}-01-01`
            this.maxX = today
            this.isLoading = false
            this.draw()
        },
        // 绘制甘特图
        draw() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()
            let option = {
                animation: false,
                grid: {
                    left: 16,
                    right: 0,
                    top: 20,
                    bottom: 30
                },
                xAxis: {
                    type: 'value',
                    min: this.getTimestamp(this.minX),
                    max: this.getTimestamp(this.maxX),
                    splitLine: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    interval: 3600 * 24 * 1000,
                    axisLabel: {
                        formatter: value => {
                            let time = new Date(value),
                                y = time.getFullYear(),
                                m = time.getMonth(),
                                d = time.getDate()
                            if (m == 0 && d == 1) return y
                        },
                        showMinLabel: true //
                    }
                },
                yAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    data: this.managers.map(item => item.name)
                },
                series: [
                    {
                        type: 'bar',
                        stack: '基金运行期',
                        itemStyle: { color: 'transparent' },
                        silent: true,
                        data: this.managers.map(item => {
                            return {
                                value: this.getTimestamp(item.start),
                                label: this.getLableOption(0, item)
                            }
                        })
                    },
                    {
                        type: 'bar',
                        stack: '基金运行期',
                        itemStyle: { color: '#8FAEFE' },
                        emphasis: {
                            itemStyle: {
                                color: '#6F8EE6'
                            }
                        },
                        markArea: {
                            silent: true,
                            data: this.getSplitArea()
                        },
                        data: this.managers.map(item => {
                            return {
                                value: this.getTimestamp(item.start, item.end),
                                label: this.getLableOption(1, item)
                            }
                        })
                    },
                    {
                        type: 'bar',
                        stack: '基金运行期',
                        itemStyle: { color: 'transparent' },
                        silent: true,
                        data: this.managers.map(item => {
                            return {
                                value: this.getTimestamp(item.end, this.maxX),
                                label: this.getLableOption(2, item)
                            }
                        })
                    }
                ]
            }
            chart.setOption(option)
            // 设置默认激活索引
            let dftActive = this.activeManagerIndex || this.managers.length - 2
            this.setActiveManager(chart, dftActive)
            // 鼠标悬浮：高亮当前，取消高亮其他所有
            chart.on('mouseover', params => {
                this.setActiveManager(chart, params.dataIndex)
            })
        },
        getLableOption(index, item) {
            let l = this.getTimestamp(this.minX, item.start, true),
                r = this.getTimestamp(item.end, this.maxX, true)
            const S = 0.08
            return [{
                show: l > r && l > S,
                formatter: '{b}',
                color: '#333',
                position: 'insideRight'
            }, {
                show: (l > r && l < S) || (r > l && r < S),
                formatter: '{b}',
                color: '#fff',
                position: (l > r && l < S) ? 'insideLeft' : 'insideRight'
            }, {
                show: r > l && r > S,
                formatter: '{b}',
                color: '#333',
                position: 'insideLeft'
            }][index]
        },
        setActiveManager(chart, index) {
            ;[0, 1, 2].forEach(i => {
                chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: i
                })
            })
            chart.dispatchAction({
                type: 'highlight',
                dataIndex: index
            })
            this.activeManagerIndex = index
        },
        handleClickManager(id) {
            this.$routeOpen({ name: 'Manager', query: { id } })
        },
        // 获取日期时间戳
        getTimestamp(date1, date2, isPct) {
            let count
            if (date1 && date2) {
                count = new Date(date2).getTime() - new Date(date1).getTime()
            } else {
                count = new Date(date1 || null).getTime()
            }
            return isPct ? count / (new Date(this.maxX).getTime() - new Date(this.minX).getTime()) : count
        },
        // 获取x轴分割规则
        getSplitArea() {
            let start = +this.minX.slice(0, 4),
                end = +this.maxX.slice(0, 4),
                years = new Array(end - start + 1).fill('').map((v, i) => start + i)
            return years.map((year, index) => {
                return [
                    {
                        xAxis: new Date(`${year}-01-01`).getTime(),
                        itemStyle: { color: `rgba(0,0,0,${index % 2 == 0 ? 0.06 : 0})` }
                    },
                    {
                        xAxis: new Date(`${year}-12-31`).getTime()
                    }
                ]
            })
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [{ id: 'managerChange', imgName: '基金经理变更' }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.color-red {
    color: #ff6673;
}
.color-green {
    color: #50c75a;
}

.chart-wrap {
    overflow: hidden;
    height: 300px;
    .chart,
    .tooltip-box {
        float: left;
        height: 100%;
    }
    .chart {
        width: calc(100% - 396px);
    }
    .tooltip-box {
        width: 396px;
        height: calc(100% - 50px);
        margin-top: 20px;
        border: 1px solid #ddd;
        padding-top: 30px;
        p {
            height: 44px;
            line-height: 44px;
            border-top: 1px solid #ddd;
            padding: 0 80px 0 56px;
            &:first-child {
                border-top: 0;
            }
        }
        .font13 {
            font-size: 13px;
        }
    }
}
.tip {
    color: #999;
}
</style>