<template>
    <div class="purchaseRede">
        <div class="chart-wrap">
            <div ref="chart" class="chart"></div>
            <div class="legend">
                <p v-for="(item,index) in legend" :key="index">
                    <span :style="`background: ${colors[index]};`"></span>
                    {{item}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
// import {operateInfo} from '@/api/analysis'

export default {
    props: {
        xData: {},
        seriesDatas: {}
    },
    data() {
        return {
            type: '',
            legend: ['申购', '赎回', '净申购'],
            seriesData: [
                {
                    type: 'bar',
                    name: '申购',
                    color: '#8FAEFE',
                    barGap: 0,
                    barWidth: 15,
                    data: []
                },
                {
                    type: 'bar',
                    name: '赎回',
                    color: '#D7B3F4',
                    barWidth: 15,
                    data: []
                },
                {
                    type: 'line',
                    name: '净申购',
                    color: '#7FD8DC',
                    data: []
                }
            ],
            colors: ['#8FAEFE', '#D7B3F4', '#7FD8DC']
        }
    },
    components: {},
    methods: {
        drawChart() {
            let chart = this.$echarts.init(this.$refs.chart)
            this.seriesData[0].data = this.seriesDatas[0]
            this.seriesData[1].data = this.seriesDatas[1]
            this.seriesData[2].data = this.seriesDatas[2]
            let options = {
                legend: { show: false },
                grid: { left: 50, top: 10, bottom: 30, right: -1 },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: params => {
                        let str =`<span>${params[0].axisValueLabel}</span><br/>`
                        params.forEach(item => {
                            str +=`<span>${item.seriesName}：${item.value}亿</span><br/>`
                        })
                        return str
                    }
                },
                xAxis: {
                    type: 'category',
                    //   position:'top',
                    axisTick: {
                        alignWithLabel: false
                    },
                    data: this.xData
                },
                yAxis: {
                    show: true,
                    type: 'value',
                    name: '份额(亿)',
                    nameLocation: 'middle',
                    nameGap: '35'
                },

                series: this.seriesData
            }

            chart.setOption(options, true)
        }
    }
}
</script>

<style lang="scss" scoped>
.purchaseRede {
    padding: 24px;
    .chart-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .chart {
            width: calc(100% - 160px);
            // max-width: 1123px;
            height: 320px;
        }
        .legend {
            width: 160px;
            height: 281px;
            border: 1px solid #dddddd;
            padding-top: 17px;
            padding-left: 10px;
            margin-top: 10px;
            & > p {
                font-size: 12px;
                margin: 0;
                margin-bottom: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }
            & > p > span {
                display: block;
                width: 12px;
                height: 12px;
                margin-right: 5px;
            }
        }
    }
}
</style>