<template>
    <div class="component-wrap" ref="component-wrap">
        <div id="component-wrap" v-show="!finished">
            item222
            <div class="chart" ref="chart"></div>
        </div>

        <img v-show="finished" :src="blob" alt="" />
    </div>
</template>

<script>
import toimg from '@/mixins/toImg'

export default {
    mixins: [toimg],
    data() {
        return {
            finished: false,
            chart: '',
            blob: '',
        }
    },
    methods: {
        render() {
            this.$nextTick(() => {
                this.draw()
            })
        },
        draw() {
            // console.log(this.$echarts);
            let chart = this.$echarts.init(this.$refs.chart)
            this.chart = chart
            chart.clear()
            chart.resize()

            let option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
                yAxis: {
                    type: 'value',
                },
                grid: {
                    top: 10,
                    left: 5,
                    right: 10,
                    bottom: 0,
                    containLabel: true,
                },
                series: [
                    {
                        data: [1200, 800, 1050, 800, 700, 1100, 1030],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)',
                        },
                    },
                ],
            }
            chart.setOption(option, true)
            // 表画完后执行 ：
            // chart.on('finished', () => {
            //     console.log('finish')
            //     this.toimg()
            // })
        },
    },
}
</script>

<style lang="scss" scoped>
.component-wrap {
    height: 340px;
}
.chart {
    width: 100%;
    height: 320px;
}
</style>