<template>
    <!-- 货币型/理财型 -->
    <div class="trajectory">
        <moduletitle :title="'业绩走势'">
            <div class="timeframe" style="margin-right:8px">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker
                        ref="range"
                        type="year"
                        class="mr"
                        @change="getChartData"
                    />
                </keep-alive>
            </div>
            
        </moduletitle>

        <div class="content">
            <div id="anamwfsy">
                <p>每万份收益</p>
                <vHalfChart
                    ref="chart_l"
                    type="line"
                    grid="grid_l"
                    :legend="legend"
                    :xData="xData_L"
                    :seriesData="seriesData_L"
                    :otherOptions="otherOptions_l"
                ></vHalfChart>
                <vLoading :show="isLoading" />
                <vNodata :show="!result&&!isLoading" />
                <div class="legend"></div>
            </div>
            <div id="anaqrnhsy">
                <p>七日年化收益</p>
                <vHalfChart
                    ref="chart_r"
                    type="line"
                    grid="grid_r"
                    :legend="legend"
                    :xData="xData_R"
                    :seriesData="seriesData_R"
                    :otherOptions="otherOptions_r"
                    :isPct="true"
                ></vHalfChart>
                <vLoading :show="isLoading" />
                <vNodata :show="!result&&!isLoading" />
                <div class="legend"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { push_request, getDailyProfitAndYield } from '@/api/analysis'
import { allBenchmark, getIndexName } from '@/utils/benchmark'

import html2canvas from 'html2canvas'

export default {
    data() {
        return {
            legend: '',
            xData_L: [],
            seriesData_L: [],
            otherOptions_l:{
                tooltip: {
                    trigger: 'axis',
                    formatter: params => { 
                        return `<span>${params[0].axisValue}</span><br/><span>${params[0].seriesName}：${Number(params[0].value.toFixed(4))}</span>`
                    }
                }
            },
            xData_R: [],
            seriesData_R: [],
            otherOptions_r:{
                tooltip: {
                    trigger: 'axis',
                    formatter: params => { 
                        return `<span>${params[0].axisValue}</span><br/><span>${params[0].seriesName}：${Number((params[0].value*100).toFixed(4))}%</span>`
                    }
                }
            },
            isLoading: false,
            result: '',
            timeRange: {} //时段
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
       
    },
    methods: {
        /**
         * 下载图片
         */
        async handleDownload() {
            let list = [
                { id: 'anamwfsy', imgName: '每万份收益' },
                { id: 'anaqrnhsy', imgName: '七日年化收益' }
            ]
            this.$downloadImg(list)
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        async getChartData(date) {
            this.legend = [this.selectFundToAnalyze.name]
            this.isLoading = true
            try {
                const result = await getDailyProfitAndYield({
                    startDate: this.$refs.range.start_date,
                    endDate: this.$refs.range.end_date,
                    innerCode: this.selectFundToAnalyze.innercode
                })

                // this.result = JSON.stringify(result) == '{}' ? '' : result
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                this.draw('chart_l')
                this.draw('chart_r')
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                
                // this.resultl = JSON.stringify(this.result.dailyProfits) == '{}' ? '' : this.result.dailyProfits
                // this.resultr = JSON.stringify(this.result.latestWeeklyYields) == '{}' ? '' : this.result.latestWeeklyYields
                this.xData_L = this.xData_R = this.result.endDate
                this.seriesData_L = [this.result.dailyProfits]
                this.seriesData_R = [this.result.latestWeeklyYields]
            }
        },
        render() {
            this.$refs.range.init('one_year')
        },
        refreshChart() {
            this.render()
        }
    }
}
</script>

<style lang="scss" scoped>
.trajectory {
    background-color: #ffffff;
    margin-bottom: 16px;
    color: #333;
    .content {
        width: 100%;
        height: 390px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        position: relative;

        & > div {
            width: 50%;
            position: relative;

            & > p {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
                margin-left: 16px;
            }
        }
        & > div:first-child {
            border-right: 1px solid #dddddd;
        }
        /deep/ .chart {
            width: 100%;
            height: 320px;
        }
    }
    /deep/ .el-select {
        width: 120px;
    }
}
</style>