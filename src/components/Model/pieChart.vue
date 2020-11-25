<template>
    <div class="half">
        <div ref="chart" class="chart"></div>
        <div v-if="allSeriesData" class="legend flex-wrap">
            <div class="line head-line">
                <div>{{ title }}</div>
                <section>
                    <div v-for="(item, index) in allCols" :key="index" :class="['value', `value${index}`]">
                        {{ item }}
                    </div>
                </section>
            </div>
            <div class="body">
                <section v-for="(item, index) in legend" :key="index">
                    <div v-if="allSeriesData[0][index] > 0 || legend.length == 1" class="line">
                        <div>
                            <span :style="`background: ${colors[index]};`" class="circle"></span>
                            {{ item }}
                        </div>
                        <section>
                            <div v-for="(list, idx) in allSeriesData" :key="idx" :class="['value', `value${idx}`]">
                                {{ formatData(list[index], isNum) }}
                            </div>
                        </section>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import commonStyle from '@/utils/chartStyle'
import chartMixin from './echarts'

export default {
    /**
     * @props
     * title: 分布类型
     * legend: 图例
     * xData: x轴坐标值
     * seriesData: []
     */
    props: [
        'title',
        'subTitle',
        'legend',
        'seriesData',
        'colorKey', // 指定配色关系
        'isNum', // 是否非百分数的数字
    ],
    mixins: [chartMixin],
    data() {
        return {}
    },
    computed: {
        allCols() {
            if (this.subTitle instanceof Array) {
                return this.subTitle
            } else {
                let dft = this.isNum ? '数量' : (this.subTitle || '占比')
                return [dft]
            }
        },
        allSeriesData() {
            if (!this.seriesData) return null
            return this.allCols.length == 1 ? [this.seriesData] : this.seriesData
        }
    },
    methods: {
        drawChart() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()

            if (this.seriesData == null) {
                chart.showLoading(commonStyle.loadingStyle)
                return
            }

            let options = {
                tooltip: {
                    trigger: 'item',
                    // formatter: '{b} : {c} ({d}%)'
                    formatter: params => {
                        return `${params.name}: ${this.isNum ? params.value : (params.value * 100).toFixed(2) + '%'}`
                    }
                },
                series: [
                    {
                        name: '大类资产分布',
                        type: 'pie',
                        radius: ['56%', '90%'],
                        center: ['24%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        data: this.allSeriesData[0].map((data, index) => {
                            return {
                                name: this.legend[index],
                                value: data,
                                itemStyle: {
                                    color: this.colors[index]
                                }
                            }
                        })
                    }
                ]
            }
            chart.hideLoading()
            chart.setOption(options)
        },
        formatData(data, isNum) {
            if (!data && data > 0) return '--'
            if (isNum) return data
            return `${data === 0 ? 0 : (data * 100).toFixed(2)}%`
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
        }
    }
}
</script>

<style lang="scss" scoped>
.chart {
    margin: 0;
    padding: 0;
}
.flex-wrap {
    position: absolute;
    width: 50%;
    min-height: 100%;
    right: 16px;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.line{
    color: #666;
    height: 26px;
    line-height: 26px;
    padding-left: 36px;
    padding-right: 16px;
    position: relative;
    display: flex;
    justify-content: space-between;
    &.head-line {
        height: 40px;
        line-height: 40px;
        padding-left: 16px;
        color: #666;
        font-weight: bold;
        border: 1px solid #ddd;
        border-left: 0;
        border-right: 0;
    }
    .value{
        display: inline-block;
        margin-left: 10px;
        width: 60px;
        text-align: right;
    }
}
.body{
    max-height: 268px;
    padding: 4px 0;
    border-bottom: 1px solid #ddd;
    overflow-y: auto;
    span.circle{
        position: absolute;
        left: 16px;
        top: -1px;
        width: 12px !important;
        height: 12px !important;
        border-radius: 50%;
    }
}
</style>
