<template>
    <div>
        <div ref="chart" class="chart"></div>
    </div>
</template>

<script>
export default {
    props: ['xData', 'yData', 'seriesData', 'levels'],
    data() {
        return {

        }
    },
    methods: {
        draw() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()
            
            let arr = this.levels || [0, 10, 25, 50]
            let pieces = [
                {lte: arr[0], color: '#F5F5F5'},
                {gte: arr[0], max: arr[1]-1, color: '#E5ECFF'},
                {gte: arr[1], max: arr[2]-1, color: '#8FAEFE'},
                {gte: arr[2], max: arr[3]-1, color: '#6F8EE6'},
                {gte: arr[3], label: `${arr[3]}+`, color: '#4E7CEE'}
            ]
            let total = this.seriesData.reduce((sum, item) => {
                return sum + item[2]
            }, 0)

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
                    pieces: pieces,
                    show: false
                },
                series: [{
                    name: '股票风格',
                    type: 'heatmap',
                    zlevel: -1, // 用于分层，显示网格线
                    data: this.seriesData.map(item => {
                        let ratio = Math.round(item[2] / total * 100)
                        return {
                            value: [item[0], item[1], ratio],
                            label: {
                                show: true,
                                fontSize: 30,
                                fontWeight: 200,
                                color: ratio < 25 ? '#333' : '#fff',
                                formatter: () => {
                                    return item[2]
                                }
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