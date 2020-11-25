<template>
    <div>
        <div ref="chart" class="chart"></div>
    </div>
</template>

<script>
export default {
    props: ['xData', 'yData', 'seriesData'],
    data() {
        return {

        }
    },
    methods: {
        draw() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()
            
            let option = {
                grid: {
                    top: 25,
                    bottom: 10,
                    left: 35,
                    right: 0
                },
                xAxis: {
                    type: 'category',
                    data: this.xData,
                    position: 'top',
                    axisTick: { show: false },
                    axisLine: { show: false },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#fff',
                            width: 2,
                        },
                    }
                },
                yAxis: {
                    type: 'category',
                    data: this.yData,
                    axisTick: { show: false },
                    axisLine: { show: false },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#fff',
                            width: 2,
                        },
                    }
                },
                visualMap: {
                    type: 'piecewise',
                    top: 40,
                    right: 20,
                    align: 'left',
                    itemWidth: 12,
                    itemHeight: 12,
                    pieces: [
                        {gte: 50, label: '50+', color: '#4E7CEE'},
                        {gte: 25, max: 49, color: '#6F8EE6'},
                        {gte: 10, max: 24, color: '#8FAEFE'},
                        {gte: 0, max: 9, color: '#E5ECFF'},
                        {lte: 0, color: '#F5F5F5'}
                    ],
                    show: false
                },
                series: [{
                    name: '股票风格',
                    type: 'heatmap',
                    zlevel: -1, // 用于分层，显示网格线
                    data: this.seriesData.map(item => {
                        return {
                            value: item,
                            label: {
                                show: true,
                                fontSize: 30,
                                fontWeight: 200,
                                color: item[2] < 25 ? '#333' : '#fff'
                            }
                        }
                    })
                }]
            }
            chart.setOption(option)
            chart.on('click', (param) => {
                this.$emit('handleClickCell', param.value)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.chart{
    width: 300px;
    height: 300px;
}
</style>