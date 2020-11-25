<template>
    <div class="manageAbility-content">
        <div class="manageAbility-content-left">
            <p>管理年限</p>
            <vHalfChart
                ref="chart"
                type="bar"
                grid="grid_l"
                :legend="legend"
                :xData="xData_L"
                :seriesData="my_seriesData"
                :otherOptions="otherOptions1"
                :seriesOptions="seriesOptions"
            ></vHalfChart>
        </div>
        <div class="manageAbility-content-right">
            <p>
                业绩水平<span>(管理年限{{ year }}的{{ managerInfo.typechi }}基金经理)</span>
            </p>
            <vHalfChart
                ref="chart2"
                type="bar"
                grid="grid_l"
                :legend="legend"
                :xData="xData_L"
                :seriesData="my_seriesData2"
                :otherOptions="otherOptions2"
                :seriesOptions="seriesOptions2"
            ></vHalfChart>
        </div>
    </div>
</template>

<script>
import Gradient from '@/components/Manager/components/gradientChart'

export default {
    props: {
        managerInfo: {},
        year: {},
        size: {},
        Gradientvalue: {},
        Gradientvalue_dialog: {},
        seriesData: { type: Array, default: () => [] },
        seriesData2: { type: Array, default: () => [] }
    },
    components: { Gradient },
    data() {
        return {
            legend: [],
            xData_L: [],
            my_seriesData: [[23, 234, 290, 497, 333, 630]],
            my_seriesData2: [[23, 234, 290, 497, 333, 630]],
            otherOptions: {
                grid: {
                    left: 0,
                    right: 20,
                    containLabel: true
                },
                xAxis: {
                    name: '人数',
                    nameLocation: 'middle',
                    nameGap: '30',
                    type: 'value',
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    axisTick: {
                        show: false
                    },
                    data: []
                },
                tooltip: { show: false }
            }
        }
    },
    computed: {
        otherOptions1() {
            let options = JSON.parse(JSON.stringify(this.otherOptions))
            options.grid.right = 30
            options.yAxis.data = ['<1年', '1-3年', '3-5年', '5-7年', '7-10年', '>10年']
            return { ...options }
        },
        otherOptions2() {
            let options = JSON.parse(JSON.stringify(this.otherOptions))
            options.grid.right = 20
            options.yAxis.data = ['<10亿', '10-20亿', '20-50亿', '50-100亿', '100-300亿', '>300亿']
            return { ...options }
        },
        seriesOptions() {
            return this.getSeriesOptions(this.seriesData, this.otherOptions1, this.year)
        },
        seriesOptions2() {
            return this.getSeriesOptions(this.seriesData2, this.otherOptions2, this.size)
        }
    },
    methods: {
        render() {
            this.draw('chart')
            this.draw('chart2')
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        getSeriesOptions(seriesData, otherOptions, symbol) {
            let data = [...seriesData]
            let i = otherOptions.yAxis.data.findIndex(item => {
                return item === symbol
            })
            data[i] = { value: data[i], itemStyle: { color: '#4E7CEE' } }
            return [
                {
                    itemStyle: { color: '#C6D6FF' },
                    barWidth: '60%',
                    label: {
                        show: true,
                        color:  (symbol === this.size&&this.size === '<10亿')||(symbol === this.year&&this.year === '1-3年') ? '#fff' : '#333',
                        position: (symbol === this.size&&this.size === '<10亿')||(symbol === this.year&&this.year === '1-3年') ? 'insideRight' : 'right',
                        formatter: params => {
                            return params.name === symbol ? this.managerInfo.name : ''
                        }
                    },
                    data: data //[23, 234, 290, 497, { value: 744, itemStyle: { color: 'blue' } }, 630]
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.manageAbility-content {
    display: flex;
    justify-content: space-between;
    p {
        font-size: 14px;
        font-weight: 600;
    }
    .manageAbility-content-left {
        width: 50%;
    }
    .manageAbility-content-right {
        width: 50%;
        & > p > span {
            font-size: 12px;
            color: #666;
        }
    }
    /deep/ .chart {
        width: 105%;
        height: 320px;
    }
}
</style>