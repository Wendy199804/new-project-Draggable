<template>
    <div class="risk-and-return2">
        <moduletitle title="风险收益分析">
            <div class="benchmark" style="margin-right: 8px">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker ref="range" type="year" class="mr" :config="['custom', 'since_founded', 'year_start']" @change="getChartData" />
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>
        <div class="content" id="fxsyfx">
            <vLoading :show="isLoading" />
            <vNodata :show="!result && !isLoading" :text="text"/>
            <div class="chart" ref="chart"></div>
            <p class="summary" v-html="discrib"></p>
        </div>
    </div>
</template>

<script>

import { benchmarkValue } from '@/utils/analyze'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'

export default {
    data() {
        return {
            benchmarkvalue: '',
            benchmarkOptions: [...allBenchmark], // 基准可选
            isLoading: false,
            result: false,
            text: '暂无数据',
            discrib: ''
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        benchmarkValue: {
            get() {
                return this.benchmarkvalue === '' ? benchmarkValue(this.selectFundToAnalyze) : this.benchmarkvalue
            },
            set(val) {
                this.benchmarkvalue = val
            }
        },
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        }
    },
    methods: {
        render() {
            this.$refs.range.init('one_year')
        },

        getChartData() {
            this.isLoading = true
            push_request({
                type: 'get_return_risk_data',
                exec_type: 'sync',
                fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                index_code: this.benchmarkValue[1],
                interval: this.$refs.range.value
            })
                .then(res => {//zIndex.sync
                    if (res.if) {
                        let result = res.return_risk_rank
                        this.discrib = result.sentence
                        this.result = JSON.stringify(result) === '{}' ? false : true
                        this.text='暂无数据'
                        Object.keys(result).slice(0,5).map(item => {
                            result[item][0] = Number((result[item][0] * 100).toFixed(2))
                            result[item][1] = Number((result[item][1] * 100).toFixed(2))
                        })
                        this.handleResult(result)
                        this.isLoading = false
                    } else {
                        this.text=`基金成立不足${this.$refs.range.range_chi}`
                        this.result = false
                        this.isLoading = false
                    }
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
        handleResult(data) {
            let [index_x, index_y] = data.index // 原点  --  沪深300坐标
            let [ymax, ymin] = data.return
            let [xmax, xmin] = data.risk
            let [x1, y1] = data.fund
            let [x2, y2] = data.class

            let fund_data = [
                //基金
                [x1 - index_x, y1 - index_y]
            ]
            let class_data = [
                //同类平均
                [x2 - index_x, y2 - index_y]
            ]
            let yaxismax = ymax - index_y
            let chart = this.$echarts.init(this.$refs.chart)
            chart.clear()
            chart.resize()

            let option = {
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '8%',
                    top: '3%',
                    containLabel: true
                },
                legend: {
                    data: [this.selectFundToAnalyze.name, `同类平均(${this.selectFundToAnalyze.firsttypeChi})`, this.index_name],
                    bottom: '0'
                },
                xAxis: [
                    {
                        type: 'value',
                        scale: true,
                        splitNumber: 8,
                        interval: Number(((xmax - xmin) / 8).toFixed(2)),
                        max: xmax - index_x,
                        min: xmin - index_x,
                        axisLabel: {
                            showMaxLabel: true,
                            showMinLabel: true,
                            formatter: (value, index) => {
                                if (value === xmax - index_x) {
                                    return '高风险'
                                } else if (value === xmin - index_x) {
                                    return '低风险'
                                }
                                return `${(value + index_x).toFixed(2)}%`
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        scale: true,
                        splitNumber: 6,
                        interval: Number(((ymax - ymin) / 6).toFixed(2)),
                        max: ymax - index_y,
                        min: ymin - index_y,
                        axisLabel: {
                            showMaxLabel: true,
                            showMinLabel: true,
                            formatter: (value, index) => {
                                if (value === ymax - index_y) {
                                    return '高收益'
                                } else if (value === ymin - index_y) {
                                    return '低收益'
                                }
                                return `${(value + index_y).toFixed(2)}%`
                            }
                        }
                    }
                ],
                tooltip: {
                    formatter: params => {
                        //[index_x, index_y]
                        let str = `${params.marker}<span>${params.seriesName}：</span>`
                        if (params.seriesName == this.index_name) {
                            str += `<span>[ ${index_x}%&nbsp;,&nbsp;${index_y}% ]</span>`
                        } else if (params.seriesName == this.selectFundToAnalyze.name) {
                            str += `<span>[ ${x1}%&nbsp;,&nbsp;${y1}% ]</span>`
                        } else if (params.seriesName == `同类平均(${this.selectFundToAnalyze.firsttypeChi})`) {
                            str += `<span>[ ${x2}%&nbsp;,&nbsp;${y2}% ]</span>`
                        }
                        return str
                    }
                },
                series: [
                    {
                        name: this.selectFundToAnalyze.name,
                        type: 'scatter',
                        color: '#6F8EE6',
                        symbolSize: 15,
                        data: fund_data
                    },
                    {
                        name: `同类平均(${this.selectFundToAnalyze.firsttypeChi})`,
                        type: 'scatter',
                        color: '#5ABEFF',
                        symbolSize: 15,
                        data: class_data
                    },
                    {
                        name: this.index_name,
                        type: 'scatter',
                        symbol: 'rect',
                        symbolSize: 15,
                        color: '#FFC069',
                        data: [[0, 0]]
                    }
                ]
            }
            chart.setOption(option, true)
        },
        refreshChart() {
            this.getChartData()
        },
        handleDownload() {
            let list = [{ id: 'fxsyfx', imgName: '风险收益分析' }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-and-return2 {
    background: #ffffff;
    .content {
        position: relative;
        height: calc(100% - 50px);
        padding: 16px 0;
    }
    .chart {
        width: 100%;
        height: 320px;
    }
    // 时段隐藏
    /deep/ .title .el-range-editor.el-input__inner {
        width: 220px;
        height: 24px;
        padding-right: 0;
        display: none;
    }
    /deep/ .title .select-box > div {
        margin-left: 0;
    }
    .summary{
        margin: 16px 16px 0 16px;
    }
}
</style>