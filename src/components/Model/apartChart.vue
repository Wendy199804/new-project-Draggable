<template>
    <div :class="['apart', legendPosition == 'bottom' ? 'higher' : '']">
        <div ref="chart" class="chart"></div>
        <div v-if="isMultiple" class="legend" style="overflow-y: auto; z-index: 33;">
            <el-checkbox-group ref="checkBox" v-model="checkList" @change="changeCheckbox">
                <el-checkbox v-for="(item, index) in legend" :label="item" :key="index" style="display: block;">
                    <p :class="type == 'line' ? 'line' : 'rect'"
                        :style="{cursor: 'pointer'}"
                    >
                        <span :style="{background: checkList.includes(item) ? colors[index] : '#999'}"></span>{{item}}
                    </p>
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div v-else class="legend" style="overflow-y: auto;">
            <section v-for="(item, index) in legend" :key="index" @click="handleClick(index)">
                <p :class="getType(index) == 'line' ? 'line' : 'rect'"
                    :style="{color: hideindex.includes(index) ? '#999' : '#333', cursor: 'pointer'}"
                >
                    <span :style="{background: hideindex.includes(index) ? '#999' : colors[index]}"></span>{{item}}
                </p>
            </section>
        </div>
    </div>
</template>

<script>
import commonStyle from '@/utils/chartStyle';
import tooltipFormatter from '@/utils/chartFormatter';
import chartMixin from './echarts';
import otherTooltip from '@/utils/chartTooltip';

export default {
    /**
     * @props
     * type: 'line'/'bar'
     * legend: 图例
     * xData: x轴坐标值
     * seriesData: []
     */
    props: [
        'type',
        'legend',
        'xData',
        'seriesData',
        'colorKey', // 指定配色关系
        'isStack', // 是否为堆叠图
        'isMultiple', // 是否为CheckBox多选
        'isPct', // 坐标轴及tooltip数据是否为百分数
        'otherOptions',
        'seriesOptions',
        'hideZero', // tooltip是否需要过滤0值
        'formatterType', // tooltip的formatter函数
        'legendPosition', // 图例需要展示在下方（而不是右侧）时使用
        'tooltipType', // 特殊tooltip
        'exchangeXY'
    ],
    mixins: [chartMixin],
    data() {
        return {
            checkList: [],

            mylegend: {
                show: false,
                data: [],
                selected: {}
            },
            hideindex: [], // 所有不可见的index
        }
    },
    watch: {
        legend(val) {
            this.mylegend = {
                show: false,
                data: [],
                selected: {}
            }
            this.hideindex = []
        }
    },
    methods: {
        /**
         * 点击隐藏某条数据
         * @{index} seriesData索引
         */
        handleClick(index){
            // if(this.canhide){
                let name = this.legend[index]
                let hideindex_inndex = this.hideindex.indexOf(index) // 当前索引位置
                
                if(this.mylegend.selected[name] !== undefined){ // 非第一次操作
                    (this.mylegend.selected[name] = !this.mylegend.selected[name])
                    this.mylegend.selected[name] 
                    ? (hideindex_inndex !== -1 ?this.hideindex.splice(hideindex_inndex,1):'')  // 使可见 //若hideindex中存在，则删除 不存在则添加
                    : (hideindex_inndex !== -1 ?'':this.hideindex.push(index)) // 使不可见 //若存在，不操作，若不存在则添加
                }else{ 
                    this.mylegend.selected[name] = false
                    this.hideindex.push(index)
                }
                this.drawChart()
            // }
        },
        drawChart() {
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()

            if (this.xData == null || this.seriesData == null) {
                chart.showLoading(commonStyle.loadingStyle)
                return
            }
            
            // 处理legend可选
            let legend = this.legend, seriesData = this.seriesData
            if (this.isMultiple) {
                legend = this.legend.filter(item => this.checkList.indexOf(item) > -1)
                seriesData = this.seriesData.filter((item, index) => {
                    return this.checkList.indexOf(this.legend[index]) > -1
                })
            }
            this.mylegend.data = this.legend

            let options = {
                // animation: false,
                grid: commonStyle.grid_a,
                legend: this.mylegend,
                xAxis: {
                    type: 'category',
                    data: this.xData,
                    boundaryGap: this.type == 'line' ? false : true
                },
                yAxis: { type: 'value' }
            }
            if (this.tooltipType) {
                options.tooltip = otherTooltip[this.tooltipType](this.isPct)
            } else {
                options.tooltip = Object.assign({}, commonStyle.tooltip, {
                    axisPointer: {
                        type: this.type == 'bar' ? 'shadow' : 'line'
                    },
                    formatter: (params) => {
                        return tooltipFormatter[this.formatterType || 'defaultF'](params, this.isPct, this.hideZero)
                    }
                })
            }

            let minInterval = this.getInterval()
            options.yAxis.minInterval = minInterval
            options.yAxis.axisLabel = this.getLabelFormatter(minInterval)

            options.series = seriesData.map((data, index) => {
                let series = {
                    type: this.type,
                    name: legend[index],
                    data: data,
                    symbolSize: 1,
                    color: this.colors[index]
                }
                if (this.type == 'bar') {
                    series.barGap = 0
                    series.barMaxWidth = '30%'
                    series.itemStyle = {
                        borderWidth: 1,
                        borderColor: this.colors[index]
                    }
                }
                if (this.isStack) {
                    series.stack = '合计'
                    series.areaStyle = {
                        color: this.colors[index],
                        opacity: 1
                    }
                    series.lineStyle = {width: 0}
                }
                if (this.seriesOptions && this.seriesOptions[index]) {
                    Object.keys(this.seriesOptions[index]).forEach(key => {
                        series[key] = this.seriesOptions[index][key]
                    })
                }
                if (this.isMultiple) {
                    series.color = this.colors[this.legend.indexOf(legend[index])]
                }
                return series
            })

            if (this.otherOptions && Object.keys(this.otherOptions).length > 0) {
                Object.keys(this.otherOptions).forEach(key => {
                    if (!options[key]) {
                        options[key] = this.otherOptions[key]
                    } else {
                        if (this.otherOptions[key] instanceof Array) {
                            options[key] = this.otherOptions[key]
                        } else {
                            options[key] = Object.assign({}, options[key], this.otherOptions[key])
                        }
                    }
                })
            }
            if (this.exchangeXY) {
                let xAxis = Object.assign({}, options.xAxis),
                    yAxis = Object.assign({}, options.yAxis)
                options.xAxis = yAxis
                options.yAxis = xAxis
            }
            chart.hideLoading()
            chart.setOption(options)
        },
        getType(n) {
            if (this.seriesOptions && this.seriesOptions[n]) {
                return this.seriesOptions[n].type || this.type
            }
            return this.type
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
        },
        /**
         * 获取坐标轴的最小间隔 和 坐标轴位数
         */
        getInterval() {
            let interval
            if (!this.isPct) {
                interval = 1
            }
            let temp_data_arr = []
            if (this.isMultiple) {
                this.seriesData.filter((item, index) => {
                    return this.checkList.indexOf(this.legend[index]) > -1
                }).forEach(data => {
                    data && temp_data_arr.push(...data)
                })
            } else {
                this.seriesData.forEach(data => {
                    data && temp_data_arr.push(...data)
                })
            }
            let cut = temp_data_arr.length > 1
            ? (Math.max(...temp_data_arr) - Math.min(...temp_data_arr)) * 100
            : Math.abs(temp_data_arr[0]) * 100
            if (cut > 2) interval = 0.01
            if (cut > 0.1 && cut <= 2) interval = 0.001
            if (cut > 0.01 && cut <= 0.1) interval = 0.0001
            if (cut <= 0.01) interval = 0.00001
            if (cut == 0) interval = 0.01
            return interval
        },
        getLabelFormatter(interval) {
            const formatter = (value) => {
                if (this.isPct) {
                    let level = (interval * 10 + '').length - 3
                    return (value * 100).toFixed(level) + '%'
                }
                return value
            }
            return {formatter}
        },
        // legend多选
        changeCheckbox(list) {
            this.checkList = list
            this.drawChart()
        }
    }
};
</script>

<style lang="scss" scoped>

.chart{
    margin: 0;
    padding: 0;
}

// 隐藏legend
.apart.higher{
    min-height: 380px !important;
    .chart{
        width: 100% !important;
    }
    .legend{
        width: 100% !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 20px !important;
        max-height: 80px !important;
        overflow: hidden;
        /deep/ .el-checkbox{
            float: left;
        }
    }
}
</style>
