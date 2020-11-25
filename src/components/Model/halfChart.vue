<template>
    <div class="half">
        <div class="tc">{{title}}</div>
        <div ref="chart" class="chart"></div>
        <div class="legend row">
            <p :class="type == 'bar' || isStack ? 'rect' : 'line'"
                v-for="(item, index) in legend" :key="index">
                <section v-if="item == '分红'">
                    <span class="triangle" style="background: blue;"></span>分红
                </section>
                <section v-if="item!=='分红' && item!==null"
                    @click="handleClick(index)"
                    :style="{
                        color: hideindex.includes(index) ? '#999':'#333',
                        cursor: 'pointer'
                    }"
                >
                    <span :class="{'water-drop': ['大幅加仓', '大幅减仓', '更换基金经理', '更换部分基金经理', '接任或新开', '离任或清盘'].includes(item)}"
                        :style="{background: hideindex.includes(index) ? '#999' : colors[index]}"
                    ></span>
                    <i v-if="item == '大幅加仓'" :class="['drop-solid drop-red', {'solid-disabled': hideindex.includes(index)}]"></i>
                    <i v-if="item == '大幅减仓'" :class="['drop-solid drop-green', {'solid-disabled': hideindex.includes(index)}]"></i>
                    <i v-if="item == '更换基金经理'" :class="['drop-solid', {'solid-disabled': hideindex.includes(index)}]"></i>
                    <i v-if="item == '更换部分基金经理'" :class="['drop-empty', {'empty-disabled': hideindex.includes(index)}]"></i>
                    <i v-if="item == '接任或新开'" :class="['drop-solid', {'solid-disabled': hideindex.includes(index)}]"></i>
                    <i v-if="item == '离任或清盘'" :class="['drop-empty', {'empty-disabled': hideindex.includes(index)}]"></i>
                    {{item}}
                </section>
            </p>
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
     * grid: 'left'/'right'
     * legend: 图例
     * xData: x轴坐标值
     * seriesData: []
     * seriesOptions:[]
     */
    props: [
        'type',
        'grid', // grid_l 或 grid_r
        'title',
        'legend',
        'xData',
        'seriesData',
        'colorKey', // 指定配色关系
        'isStack', // 是否为堆叠图
        'isPct',
        'otherOptions',
        'seriesOptions',
        'hideZero', // tooltip是否需要过滤0值
        'formatterType',
        'tooltipType',
        'name'
    ],
    mixins: [chartMixin],
    data() {
        return {
            mylegend: {
                show: false,
                data: [],
                selected: {}
            },
            hideindex: [], // 所有不可见的index
            // canhide: true
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
            this.mylegend.data = this.legend
            if (this.seriesOptions) {
                // 传入自定义配色
                this.seriesOptions.forEach((item2,index2) => {
                    this.colors[index2] = item2&&item2.color 
                    ? item2.color 
                    : this.colors[index2] 
                })
            }

            let options = {
                // animation: false,
                grid: commonStyle[this.grid],
                legend: this.mylegend,
                xAxis: {
                    type: 'category',
                    data: this.xData,
                    boundaryGap: this.type == 'line' ? false : true
                },
                yAxis: { type:'value' }
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

            options.series = this.seriesData.map((data, index) => {
                let series = {
                    type: this.type,
                    name: this.legend[index],
                    data: data,
                    symbolSize: 1,
                    color: this.colors[index]
                }
                if (this.type == 'bar') {
                    series.barGap = 0
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
            chart.hideLoading()
            chart.setOption(options)

            this.legend[2] == '分红' && chart.on('datazoom', (params) => {
                chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 2
                })
            })
            if (this.name == 'needy') {
                this.yAxis_value = chart.getModel().getComponent('yAxis').axis.scale._extent // y轴刻度范围
            }
            this.$forceUpdate()
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
            this.seriesData.forEach(data => {
                data && temp_data_arr.push(...data)
            })
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
        }
    }
};
</script>

<style lang="scss" scoped>

.chart{
    margin: 0;
    padding: 0;
}
.triangle{
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border-right: 13px solid blue;
    border-top: 7px solid transparent;
    border-left: 13px solid transparent;
    border-bottom: 7px solid transparent;
    transform: rotate(90deg);
    transform-origin: center;
    margin: -18px -4px 0 0 !important;
}
.canhide{
    cursor: pointer;
}

.water-drop {
    display: none !important;
}
.drop-solid, .drop-empty{
    display: inline-block;
    width: 12px;
    height: 16px;
    position: relative;
    left: 0;
    top: 0;
    margin-right: 3px;
}
.drop-solid{
    vertical-align: text-bottom;
    &::before {
        content: '';
        display: block;
        position: absolute;
        left: 1px;
        top: 10px;
        border-top: 6px solid #47e5c9;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
    }
    &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0px;
        top: 1px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #47e5c9;
    }
}
.drop-empty {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #47e5c9;
    &::before {
        content: '';
        display: block;
        position: absolute;
        left: 0px;
        top: 8px;
        border-top: 5px solid #47e5c9;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid transparent;
    }
    &::after {
        content: '';
        display: block;
        position: absolute;
        left: 1px;
        top: 6px;
        border-top: 4px solid #ffffff;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        border-bottom: 3px solid transparent;
    }
}
$red: #FF6673;
$green: #52DE60;
$gray: #999999;
.drop-red{
    &::before{
        border-top: 6px solid $red;
    }
    &::after{
        background: $red;
    }
}
.drop-green{
    transform: rotate(180deg);
    &::before{
        border-top: 6px solid $green;
    }
    &::after{
        background: $green;
    }
}
.solid-disabled{
    &::before{
        border-top: 6px solid $gray;
    }
    &::after{
        background: $gray;
    }
}
.empty-disabled{
    border: 2px solid $gray;
    &::before{
        border-top: 6px solid $gray;
    }
}
</style>
