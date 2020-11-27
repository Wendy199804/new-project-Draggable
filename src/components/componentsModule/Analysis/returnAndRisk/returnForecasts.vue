<template>
    <div class="returnForecasts"> 
        <moduletitle :title="'收益预测'">
            <div class="networth" v-if="selectFundToAnalyze.type !== 2">
                <span>持有周期</span>
                <el-select v-model="HoldingperiodValue" placeholder="请选择" @change="getChartData">
                    <el-option
                        v-for="item in HoldingperiodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>

            <div class="timeframe" style="margin-right:8px">
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
        <div class="card-body chart-wrap">
            <div class="height320">
                <vApartChart
                    id="anashycc"
                    ref="chart"
                    type="bar"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :otherOptions="seriesOptions"
                    :isPct="true"
                />
            </div>  
            <p style="padding:16px 16px 16px 57px;color:#999">注：该基金在{{dateRange}}任意时点买入，{{legend[0]}}，盈利的概率是{{return1}}，亏损的概率是{{return2}}。</p>
            <vLoading :show="isLoading" />
            <vNodata :show="!result&&!isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { push_request } from '@/api/analysis'
import { toPercent } from '@/utils/analyze'


export default {
    data() {
        return {
            legend: ['持有三个月'],
            xData: [],
            seriesData: [],
            seriesOptions: {
                yAxis: {
                    name: '概率',
                    nameLocation: 'middle',
                    nameGap: '35'
                }
            },
            HoldingperiodValue: '3m', //持有周期
            HoldingperiodOptions: [
                { label: '一个月', value: '1m' },
                { label: '三个月', value: '3m' },
                { label: '一年', value: '12m' }
            ],

            result: '',
            isLoading: false,

            timeRange: '',

            onem: [],
            threem: [],
            oney: [],
            dateRange:'',
            return1:'',
            return2:''
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
        // index_name() {
        //   return getIndexName(this.benchmarkValue[1])
        // }
    },
    methods: {
        async getRangeTime() {
            this.isLoading = true
            try {
                const timeres = await push_request({
                    type: 'get_fund_period',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    exec_type: 'sync'
                })

                let timeRange = {}
                timeres.period_name.map((item, index) => {
                    timeRange[item] = {
                        start_date: timeres.start_date[index].split(' ')[0],
                        end_date: timeres.end_date[index].split(' ')[0]
                    }
                })
                this.timeRange = timeRange
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },

        async getChartData() {
            this.isLoading = true
            try {
                const result = await push_request({
                    type: 'get_return_forecast',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                this.draw('chart')
                // this.$forceUpdate()
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                let arr = Object.keys(this.result['30_d']).map((item, index, arr) => {
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
                if (this.HoldingperiodValue === '1m') {
                    this.seriesData = [Object.values(this.result['30_d'])]
                    Object.values(this.result['30_d']).every(item => item==null) ? this.result = '' : ''
                    this.legend = ['持有一个月']
                    this.return1 = this.addReturn(this.seriesData[0].slice(4))
                    this.return2 = this.addReturn(this.seriesData[0].slice(0,4))
                } else if (this.HoldingperiodValue === '3m') {
                    this.seriesData = [Object.values(this.result['90_d'])]
                    Object.values(this.result['90_d']).every(item => item==null) ? this.result = '' : ''
                    this.legend = ['持有三个月']
                    this.return1 = this.addReturn(this.seriesData[0].slice(4))
                    this.return2 = this.addReturn(this.seriesData[0].slice(0,4))
                } else if (this.HoldingperiodValue === '12m') {
                    this.seriesData = [Object.values(this.result['360_d'])]
                    Object.values(this.result['360_d']).every(item => item==null) ? this.result = '' : ''
                    this.legend = ['持有一年']
                    this.return1 = this.addReturn(this.seriesData[0].slice(4))
                    this.return2 = this.addReturn(this.seriesData[0].slice(0,4))
                }
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
        addReturn(num){
            let sum = num.reduce((pre,cur) => {
                // console.log( cur)
                return pre + cur
            },0)
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
            let list = [{ id: 'anashycc', imgName: `收益预测` }]
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
        padding: 16px 16px 0 0;
    }
    .networth {
        /deep/ .el-select {
            width: 80px;
        }
    }
}
</style>