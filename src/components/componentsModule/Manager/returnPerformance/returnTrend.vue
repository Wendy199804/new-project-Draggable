<template>
    <div class="returnTrend">
        <moduletitle :title="'收益波动走势'" type="manager">
            <div class="benchmark">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>

            <div class="timeframe" style="margin-right:8px">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker
                        ref="range"
                        type="year"
                        use="manager"
                        class="mr"
                        @change="getChartData"
                    />
                </keep-alive>
            </div>
            
        </moduletitle>
        <div class="content">
            <vNodata :show="!result&&!isLoading" />
            <vFullChart
                id="mansybdzs"
                ref="chart"
                type="line"
                :legend="legend"
                :xData="xData"
                :seriesData="seriesData"
                :seriesOptions="seriesOptions"
                :otherOptions="otherOptions"
                :isPct="true"
                @getyAxisMax="getyAxisMax"
                name="returnTrend"
                style="margin-top:16px"
                formatterType="lineSort"
            />
            <vLoading :show="isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import getData from '@/api/model'


export default {
    data() {
        return {
            benchmarkValue: ['1', '000300'], //基准
            benchmarkOptions: allBenchmark, // 基准可选

            legend: [],
            xData: [],
            seriesData: [],
            seriesOptions: [
                {
                    connectNulls: true,
                    markArea: {}
                },
                {
                    yAxisIndex: 0,
                    connectNulls: true,
                },
                {
                    yAxisIndex: 0,
                    connectNulls: true
                }
            ],
            otherOptions: {
                tooltip: {
                    trigger: 'axis',
                    formatter: params => {
                        let str = `<span>${params[0].axisValueLabel}</span><br/>`
                        params.forEach(item => {
                            str += item.value ? `${item.marker}<span>${item.seriesName}：${(item.value * 100).toFixed(2)}%</span><br/>` : ''
                        })
                        return str
                    }
                },
                grid: { right: 20 },
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            fontSize: 12,
                            formatter: (value, index) => {
                                let num = (value * 100).toFixed(1)
                                return `${num}%`
                            }
                        }
                    },
                    {
                        type: 'value',
                        interval: 0.00001,
                        min: 0,
                        splitLine: {
                            //去除网格线
                            show: false
                        },
                        axisTick: {
                            //y轴刻度线不显示
                            show: false
                        }
                    }
                ]
            },

            result: '',
            timeRange: '',
            isLoading: false
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        }
    },
    methods: {
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        /**下载图片 */
        handleDownload() {
            let list = [{ id: 'mansybdzs', imgName: '收益波动走势' }]
            this.$downloadImg(list)
        },
        async getChartData() {
            this.legend = [this.managerInfo.name, this.index_name]
            this.isLoading = true
            try {
                const result = await push_request({
                    type: 'return_and_volatility',
                    exec_type: 'sync',
                    personal_id: this.managerInfo.id.toString(),
                    manager_type: this.managerInfo.type.toString(),
                    index_code: this.benchmarkValue[1],
                    begin: this.$refs.range.start_date,
                    end: this.$refs.range.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result.con_vols
                this.handleResult()
                this.draw('chart')
                this.$nextTick(() => {
                    this.getyAxisMax(this.$refs.chart.yAxis_value, result.threshold) // y轴刻度范围
                })
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        // y 轴右侧数据显示规则
        getyAxisMax(value, arr) {
            if (value && JSON.stringify(arr) != '{}') {
                this.seriesOptions[1].markArea={
                        silent: true,
                        data: [[
                            {
                                x: 61,
                                yAxis: arr.high[0]
                            },
                            {
                                xAxis: this.xData[this.xData.length-1],
                                yAxis: arr.low[0],
                                itemStyle: {
                                    color: '#f5f5f5',
                                    opacity: '0.74'
                                }
                            }
                        ]]
                    }
                let volatility_critical = [0, Number(arr.low[0].toFixed(5)), Number(arr.high[0].toFixed(5)), value[1]] //四个边界
                let risk_value = [] //低中高三个点
                volatility_critical.reduce((pre, cur, index) => {
                    let num = Number(((cur - pre) / 2 + pre).toFixed(5))
                    num !== 0 ? risk_value.push(num) : ''
                    return cur
                }, 0)
                let px_h =  ((volatility_critical[3] - arr.high[0])/(volatility_critical[3]))*320 //高波动 像素 长度
                let px_m =  ((arr.high[0]-arr.low[0])/(volatility_critical[3]))*320 //中波动 像素 长度
                let px_l =  ((arr.low[0] - 0)/(volatility_critical[3]))*320 //低波动 像素 长度
                this.otherOptions.yAxis[1].max = volatility_critical[3] // 右侧 y轴最大值
                this.otherOptions.yAxis[1].axisLabel = {
                    margin: -0.5,
                    formatter: (value, index) => {
                        if (volatility_critical[3] && value === risk_value[2]) {
                            return px_h>=40 ?'  高\n  波\n  动':'  高'
                        } else if (volatility_critical[2] && value === risk_value[1]) {
                            return px_m>=40 ?'  中\n  波\n  动':'  中'
                        } else if (volatility_critical[1] && value === risk_value[0]) {
                            return px_l>=40 ?'  低\n  波\n  动':'  低'
                        } else if (volatility_critical.includes(value)) {
                            return '-'
                        }
                        return ''
                    }
                }
                this.draw('chart')
                this.$forceUpdate()
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                this.xData = this.result.TradingDay.map(item => {
                    return item.split(' ')[0]
                })
                // this.seriesData = [this.result.manager_vol, this.result.base_vol]
                this.seriesData = [
                    {
                        type: 'line',
                        name: this.managerInfo.name,
                        data: this.result.manager_vol
                    },
                    {
                        type: 'line',
                        name: this.index_name,
                        data: this.result.base_vol
                    }
                ]
            }
        },
        
        render() {
            this.$refs.range.init('one_year')
        }
    }
}
</script>

<style lang="scss" scoped>
.returnTrend {
    background-color: #ffffff;
    // margin-bottom: 16px;

    .content {
        padding: 16px;
        position: relative;
    }
    /deep/ .el-select + div {
        display: none;
    }
}
</style>