<template>
    <div class="returnForecasts">
        <moduletitle :title="'收益概率'">
            <div class="networth" v-if="selectFundToAnalyze.type !== 2">
                <span>持有周期</span>
                <el-select v-model="HoldingperiodValue" placeholder="请选择" @change="getChartData">
                    <el-option v-for="item in HoldingperiodOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>

            <div class="timeframe" style="margin-right: 8px">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker
                        ref="range"
                        type="year"
                        :config="['year_start', 'three_months_before', 'six_months_before', 'custom']"
                        class="mr"
                        @change="getChartData"
                    />
                </keep-alive>
            </div>

            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>
        <div class="content">
            <div class="card-body chart-wrap">
                <vHalfChart
                    id="anashycc"
                    ref="chart"
                    type="bar"
                    grid="returns_the_probability"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :otherOptions="otherOptions"
                    :isPct="true"
                />
                <!-- <p style="padding: 16px 16px 16px 24px; color: #999">
                    注：该基金在{{ dateRange }}任意时点买入，{{ legend[0] }}，盈利的概率是{{ return1 }}，亏损的概率是{{ return2 }}。
                </p> -->
                <vLoading :show="isLoading" />
                <vNodata :show="!result && !isLoading" />
                <div class="legend"></div>
            </div>
            <div style="padding: 16px">
                <el-table :data="tableData" v-loading="isLoading_table" style="width: 100%" :row-style="{ height: '48px' }">
                    <el-table-column prop="probability" label="收益区间"> </el-table-column>
                    <el-table-column prop="fund" label="该基金" align="right"> </el-table-column>
                    <el-table-column prop="benchmark" :label="this.base_index_name" align="right"> </el-table-column>
                    <el-table-column prop="" label="" width="80"> </el-table-column>
                </el-table>
                <p v-if="discrib" class="summary" v-loading.lock="summary_Loading">{{ discrib }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { push_request } from '@/api/analysis'
import { toPercent } from '@/utils/analyze'
import base from '@/mixins/base_index'

export default {
    mixins: [base],
    data() {
        return {
            legend: [],
            xData: [],
            seriesData: [],
            otherOptions: {
                xAxis: {
                    name: '收益区间',
                    nameLocation: 'middle',
                    nameGap: '20',
                    splitLine: {
                        show: true,
                        interval: 3,
                        lineStyle: {
                            color: ['#ddd', '#333', '#ddd']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: '10'
                        }
                    }
                },
                yAxis: {
                    name: '概率',
                    nameLocation: 'middle',
                    nameGap: '35',
                    axisLine: {
                        lineStyle: {
                            width: 0
                        }
                    },
                    axisTick: {
                        show: false
                    }
                }
            },
            HoldingperiodValue: '90_d', //持有周期
            HoldingperiodOptions: [
                { label: '一个月', value: '30_d' },
                { label: '三个月', value: '90_d' },
                { label: '六个月', value: '180_d' },
                { label: '九个月', value: '270_d' },
                { label: '一年', value: '360_d' }
            ],

            result: '',
            isLoading: false,
            isLoading_table: false,
            summary_Loading: false,

            timeRange: '',

            onem: [],
            threem: [],
            oney: [],
            dateRange: '',
            return1: '',
            return2: '',

            tableData: [],
            discrib: '' //文案
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        async getDiscrib() {
            this.summary_Loading = true
            try {
                const result = await push_request({
                    type: 'get_return_forecast_new',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                })
                let ind = this.HoldingperiodOptions.findIndex(item=>{
                    return item.value === this.HoldingperiodValue
                })
                this.discrib = result[ind]
                this.summary_Loading = false
            } catch {
                ;() => {
                    this.summary_Loading = false
                }
            }
        },
        async getChartData() {
            this.isLoading = true
            this.isLoading_table = true
            this.getDiscrib()
            try {
                const result = await push_request({
                    type: 'get_return_forecast',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleTable()
                this.handleResult()
                this.draw('chart')
                // this.$forceUpdate()
                this.isLoading = false
            } catch {
                this.isLoading = false
                this.isLoading_table = false
            }
        },
        handleTable() {
            let data = JSON.parse(JSON.stringify(this.result.return_freq_new[this.HoldingperiodValue]))
            let arr = data.index.map((item, index) => {
                return {
                    probability: item,
                    fund: toPercent(data['该基金'][index]),
                    benchmark: toPercent(data[this.base_index_name][index])
                }
            })
            this.tableData = arr
            this.isLoading_table = false
        },
        handleResult() {
            if (this.result) {
                let arr = Object.keys(this.result.fund['30_d']).map((item, index, arr) => {
                    let str = item.replace(/n/g, '-')
                    str = str.replace(/p/g, '')
                    if (index === 0) {
                        str = `<${str}%`
                    } else if (index === arr.length - 1) {
                        str = `>${str}%`
                    } else {
                        let s1 = str.split('_')[0]
                        let s2 = str.split('_')[1]
                        str = `${s1}%~${s2}%`
                    }
                    return str
                })
                this.xData = arr

                if (this.HoldingperiodValue === '30_d') {
                    this.legend = ['持有一个月', this.base_index_name]
                } else if (this.HoldingperiodValue === '90_d') {
                    this.legend = ['持有三个月', this.base_index_name]
                } else if (this.HoldingperiodValue === '360_d') {
                    this.legend = ['持有一年', this.base_index_name]
                }
                this.seriesData = [
                    Object.values(this.result.fund[this.HoldingperiodValue]),
                    Object.values(this.result.index[this.HoldingperiodValue])
                ]
                Object.values(this.result.fund[this.HoldingperiodValue]).every(item => item == null) ? (this.result = '') : ''
                this.return1 = this.addReturn(this.seriesData[0].slice(4))
                this.return2 = this.addReturn(this.seriesData[0].slice(0, 4))
                this.dateRange = `${this.$refs.range.start_date}至${this.$refs.range.end_date}`
            }
        },
        changeCycle(value) {
            if (value === '1m') {
                this.seriesData = [this.onem]
                this.legend = ['持有一个月']
                this.draw('chart')
            } else if (value === '3m') {
                this.seriesData = [this.threem]
                this.legend = ['持有三个月']
                this.draw('chart')
            } else if (value === '12m') {
                this.seriesData = [this.oney]
                this.legend = ['持有一年']
                this.draw('chart')
            }
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        changeRangeDate(value) {
            if (value === '1m') {
                //成立以来 1 3 5 年 上月初
            } else if (value === '3m') {
                // 。。。 三月前的月初
            } else if (value === '12m') {
                // 。。。 十二月前的月初
            }
        },
        //累加
        addReturn(num) {
            let sum = num.reduce((pre, cur) => {
                // console.log( cur)
                return pre + cur
            }, 0)
            return toPercent(sum)
        },
        async render() {
            // await this.getRangeTime()
            this.$refs.range.init('three_years')
            // this.dateRange = `${this.$refs.range.start_date}至${this.$refs.range.end_date}`
        },
        refreshChart() {
            this.render()
        },
        handleDownload() {
            let list = [{ id: 'anashycc', imgName: `收益概率` }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.returnForecasts {
    background-color: #ffffff;
    margin-bottom: 16px;
    position: relative;
    .filter {
        background-color: rgba($color: #000000, $alpha: 0.1);
        filter: blur(10px);
    }
    .chart-wrap {
        position: relative;
        padding: 7px 16px 16px 0;
    }
    .networth {
        /deep/ .el-select {
            width: 80px;
        }
    }
    .content {
        display: flex;
        justify-content: space-between;
        & > div {
            width: 50%;
        }
        // &>div:first-child{
        //     flex-shrink: 0;
        // }
        // &>div:last-child{
        //     padding: 24px 0;
        // }
    }
    /deep/ .chart {
        width: 100%;
        height: 320px;
    }
}
</style>