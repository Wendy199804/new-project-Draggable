<template>
    <div class="card">
        <moduletitle
            title="股票资产收益贡献"
            :tablist="tabList"
            :secondary="true"
            :isright="true"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        >
            <div>
                <span>行业</span>
                <el-select v-model="industry_value" placeholder="请选择" size="mini" class="mr" style="width: 130px;" @change="getChartData">
                    <el-option v-for="(item, index) in industryOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    type="year"
                    ref="range" @change="getChartData"
                />
            </div>
            <div>
                <svg-icon
                    :icon-class="`is-chart${isLineChart ? '-active' : ''}`"
                    @click="isLineChart = true, handleResult()">
                </svg-icon>
                <svg-icon
                    :icon-class="`is-bar${isLineChart ? '' : '-active'}`"
                    style="margin-left: 0;"
                    @click="isLineChart = false, handleResult()">
                </svg-icon>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div v-if="isLineChart" class="card-body no-padding-lr">
            <div class="double">
                <div class="relative" id="stockReturnAttributionLeft">
                    <p class="bold" style="margin: 0 0 4px 16px;">行业分布变化</p>
                    <vHalfChart ref="chart_l"
                        type="line"
                        grid="grid_l"
                        :legend="legend"
                        :xData="xData"
                        :seriesData="seriesData1"
                        :colorKey="`${industry_value}Industry`"
                        :isStack="true"
                        :isPct="true"
                        :hideZero="true"
                        formatterType="stackSort"
                        tooltipType="lineStack" />
                    <vLoading :show="isLoading" />
                    <vNodata :show="!seriesData1 && !isLoading" />
                </div>
                <div class="relative" id="stockReturnAttributionRight">
                    <p class="bold" style="margin: 0 0 4px 16px;">行业累计收益</p>
                    <vHalfChart ref="chart_r"
                        type="line"
                        grid="grid_r" 
                        :legend="legend"
                        :xData="xData"
                        :seriesData="seriesData2"
                        :colorKey="`${industry_value}Industry`"
                        :isPct="true"
                        :hideZero="true"
                        formatterType="lineSort" />
                    <vLoading :show="isLoading" />
                    <vNodata :show="!seriesData2 && !isLoading" />
                </div>
            </div>
        </div>
        <div v-else class="card-body">
            <div class="relative" id="stockReturnAttributionBar">
                <vApartChart ref="chart"
                    type="bar"
                    :legend="['行业累计收益', '行业平均占比']"
                    :xData="lastLegend"
                    :seriesData="lastSeriesData"
                    :isPct="true"
                    :seriesOptions="seriesOptions"
                    :otherOptions="otherOptions"
                    :exchangeXY="true"
                />
                <vLoading :show="isLoading" />
                <vNodata :show="!lastSeriesData && !isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { industryOptions } from '@/utils/benchmark';
import { push_request } from '@/api/analysis';

export default {
    data() {
        return {
            tabList: [
                {name: '前十大重仓股', id: 'top10'},
                {name: '全部持仓', id: 'all'}
            ],
            activeTab: 0,
            industryOptions: industryOptions,
            industry_value: '',

            isLoading: false,
            isLineChart: true,

            legend: [],
            xData: [],
            seriesData1: null,
            seriesData2: null,

            lastLegend: [],
            lastSeriesData: null,
            seriesOptions: [],
            otherOptions: {}
        }
    },
    computed: {
        ...mapGetters([
            'selectFundToAnalyze'
        ])
    },
    methods: {
        render() {
            this.industry_value = 'zz'
            this.$refs.range.init('one_year')
        },

        async getChartData() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_fund_industry_allocation_vachange',
                fund_innercode: this.selectFundToAnalyze.innercode,
                start_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date,
                industry_standard: this.industry_value,
                port_type: this.tabList[this.activeTab].id
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData1 = null
                this.seriesData2 = null
                return
            }
            const { industry_allocation, industry_vachange } = res
            this.legend = Object.keys(industry_allocation).filter(item => item !== 'EndDate')
            this.xData = industry_allocation.EndDate.map(item => item.slice(0, 10))
            this.seriesData1 = this.legend.map(item => industry_allocation[item])
            this.seriesData2 = this.legend.map(item => industry_vachange[item])

            // 水平柱状图
            let lastIdx = this.xData.length - 1
            let data1 = {}, data2 = {}
            this.legend.forEach((item, index) => {
                data1[item] = this.seriesData2[index][lastIdx]
                data2[item] = this.seriesData1[index][lastIdx]
            })
            this.lastLegend = [...this.legend].sort((a, b) => data1[a] - data1[b])
            this.lastSeriesData = [
                this.lastLegend.map(item => data1[item]),
                this.lastLegend.map(item => data2[item])
            ]
            this.otherOptions = {
                animation: false,
                grid: {
                    top: 0,
                    left: 10,
                    bottom: 10,
                    containLabel: true
                },
                dataZoom: [{
                    // type: 'inside',
                    yAxisIndex: 0,
                    start: 100 - 10 / this.legend.length * 100,
                    end: 100,
                    zoomLock: true,
                    right: 0,
                    width: 24,
                    showDetail: false
                }],
                xAxis: {
                    axisLine: {show: false},
                    axisTick: {show: false}
                }
            }
            this.handleResult()
        },
        handleResult() {
            this.$nextTick(() => {
                if (this.isLineChart) {
                    this.draw('chart_l')
                    this.draw('chart_r')
                } else {
                    this.draw('chart')
                }
            })
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = this.isLineChart ? [
                {id: 'stockReturnAttributionLeft', imgName: '股票行业分布变化'},
                {id: 'stockReturnAttributionRight', imgName: '股票行业累计收益'}
            ] : [
                {id: 'stockReturnAttributionBar', imgName: '股票资产收益贡献'}
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.apart{
    height: 340px !important;
    .chart{
        width: 100% !important;
    }
    .legend{
        top: 320px !important;
        border: 0 !important;
        width: 100% !important;
        height: auto !important;
        display: flex;
        justify-content: center;
        margin-top: 0 !important;
        padding: 0 !important;
        p{
            margin: 0 10px;
        }
    }
}
</style>