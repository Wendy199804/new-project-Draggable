<template>
    <div class="component-wrap">
        <div id="component-wrap" v-show="!finished">
            item222
            <div class="chart" ref="chart"></div>
            had chart
        </div>

        <img v-show="finished" :src="blob" alt="" />
    </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
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
        toimg() {
            let that = this
            // event.preventDefault()
            let canvas2 = document.createElement('canvas')
            let _canvas = document.getElementById('component-wrap')
            let w = parseInt(window.getComputedStyle(_canvas).width)
            let h = parseInt(window.getComputedStyle(_canvas).height)
            canvas2.width = w
            canvas2.height = h
            canvas2.style.width = w - 1 + 'px'
            canvas2.style.height = h - 1 + 'px'
            let context = canvas2.getContext('2d')
            context.scale(1, 1)
            html2canvas(_canvas, {
                canvas: canvas2,
            }).then((res) => {
                let blob = that.getBlob(res)
                this.blob = window.URL.createObjectURL(blob)
                this.finished = true
            })
        },
        getBlob(canvas) {
            //获取blob对象
            let data = canvas.toDataURL('image/jpeg', 1)
            data = data.split(',')[1]
            data = window.atob(data)
            let ia = new Uint8Array(data.length)
            for (let i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i)
            }
            return new Blob([ia], {
                type: 'image/jpeg',
            })
        },
        //echarts=>img
        echartsToimg() {
            // console.log('echartsToimg==');
            this.src = this.chart.getDataURL()
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
    border: 1px solid rgb(0, 81, 255);
}
.chart {
    width: 100%;
    height: 320px;
}
</style>