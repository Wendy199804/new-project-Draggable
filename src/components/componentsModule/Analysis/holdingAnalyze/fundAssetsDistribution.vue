<template>
    <div class="card">
        <moduletitle title="基金资产分布">
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>
        
        <div class="card-body">
            <div class="double">
                <div class="relative" >
                    <div class="title-bar sub no-padding-l">
                        <span class="bold font16">基金资产分布</span>
                        <div class="options" v-if="interval">
                            截止时间 <vDatePointPicker
                                :interval="interval"
                                :database="interval == 6 ? '2' : ''"
                                ref="point" @change="getChartData1" />
                        </div>
                    </div>
                    <div class="relative" id="fundAssetsDistributionLeft">
                        <PieChart ref="chart_l"
                            title="类型"
                            subTitle="占净资产比"
                            :legend="legend1"
                            :seriesData="seriesData1"
                            :colorKey="`${distribution_value}OfFund`" />
                        <vLoading :show="isLoading_l" />
                        <vNodata :show="!seriesData1 && !isLoading_l" />
                    </div>
                </div>

                <div class="relative" >
                    <div class="title-bar sub no-padding-r">
                        <span class="bold font16">基金资产分布变化</span>
                        <div class="options" v-if="rangeType">
                            时段 <vDateRangePicker
                                :type="rangeType"
                                :database="rangeType == 'period' ? '2' : ''"
                                ref="range" @change="getChartData2" />
                        </div>
                    </div>
                    <div class="relative" id="fundAssetsDistributionRight">
                        <vHalfChart ref="chart_r"
                            :type="xData2.length == 1 ? 'bar' : 'line'"
                            grid="grid_r"
                            :legend="legend2"
                            :xData="xData2"
                            :seriesData="seriesData2"
                            :colorKey="`${distribution_value}OfFund`"
                            :isStack="true"
                            :isPct="true"
                            :seriesOptions="xData2.length == 1 ? [{barMaxWidth: 50}]: lineStyleOption"
                            :hideZero="true"
                            formatterType="stackSort"
                            tooltipType="lineStack" />
                        <vLoading :show="isLoading_r" />
                        <vNodata :show="!seriesData2 && !isLoading_r" />
                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import getData from '@/api/model';
import PieChart from '@/components/Model/pieChart'
import { getFundAssetsDistribution } from '@/api/analysis';
import { fundDistributionLegend } from '@/utils/benchmark';

export default {
    components: { PieChart },
    data() {
        return {
            interval: null,
            rangeType: '',

            isLoading_l: false,
            isLoading_r: false,

            legend1: [],
            seriesData1: null,

            legend2: [],
            xData2: [],
            seriesData2: null
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        lineStyleOption() {
            return this.legend.map(item => {
                return {
                    lineStyle: {
                        color: '#ffffff',
                        width: 1
                    }
                }
            })
        }
    },
    methods: {
        render() {
            this.handleChangeDistribution(this.distributionOptions[0].value)
        },
        handleChangeDistribution(value) {
            this.distribution_value = value
            if (value == 'kind') {
                this.interval = 3
                this.rangeType = 'quarter'
            } else {
                this.interval = 6
                this.rangeType = 'period'
            }
            this.$nextTick(() => {
                this.$refs.point.init()
                this.$refs.range.init('6')
            })
        },

        getChartData1() {
            this.isLoading_l = true
            this.$refs['chart_l'].clear()
            let { innercode } = this.selectFundToAnalyze,
                date = this.$refs.point.date_value
            let params = {
                // type: this.distribution_value,
                innerCode: innercode,
                reportDate: date
            }
            if (this.distribution_value == 'rating') {
                params.tcrtype = this.ratingType_value
            }
            getFundAssetsDistribution(params).then(res => {
                this.isLoading_l = false
                if(!res || JSON.stringify(res) == '{}') {
                    this.seriesData1 = null
                    return
                }
                let data = res[date]
                this.legend1 = Object.keys(data)
                this.seriesData1 = this.legend1.map(item => data[item])
                this.draw('chart_l')
            })
        },
        getChartData2() {
            this.isLoading_r = true
            this.$refs['chart_r'].clear()
            let { innercode } = this.selectFundToAnalyze,
                { start_date, end_date } = this.$refs.range
            let params = {
                // type: this.distribution_value,
                innerCode: innercode,
                startReportDate: start_date,
                endReportDate: end_date,
            }
            if (this.distribution_value == 'rating') {
                params.tcrtype = this.ratingType_value
            }
            getFundAssetsDistribution(params).then(res => {
                this.isLoading_r = false
                if(!res || JSON.stringify(res) == '{}') {
                    this.seriesData2 = null
                    return
                }
                this.legend2 = this.legend.filter(item => res.assetsName.includes(item))
                this.xData2 = Object.keys(res)
                this.xData2.pop()
                this.seriesData2 = this.legend2.map(item => {
                    return this.xData2.map(x => res[x][item] || 0)
                })
                this.draw('chart_r')
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
            let list = [
                {id: 'fundAssetsDistributionLeft', imgName: '基金资产分布'},
                {id: 'fundAssetsDistributionRight', imgName: '基金资产分布变化'}
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.relative /deep/ .half .tc{
    display: none;
}
.title-bar.sub{
    border-bottom: 0 !important;
}
</style>