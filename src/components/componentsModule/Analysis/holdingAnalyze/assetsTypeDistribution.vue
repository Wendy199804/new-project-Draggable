<template>
    <div class="card">
        <moduletitle title="大类资产分布">
            
        </moduletitle>
        
        <div class="card-body">
            <div class="double">
                <div class="relative">
                    <div class="title-bar sub no-padding-l">
                        <span class="bold">大类资产分布</span>
                        <div class="options">
                            截止时间 <vDatePointPicker
                                ref="point" @change="getChartData1" />
                        </div>
                    </div>
                    <div class="relative" id="assetsTypeDistributionLeft">
                        <PieChart ref="chart_l"
                            title="资产"
                            :subTitle="subTitle1"
                            :legend="legend1"
                            :seriesData="seriesData1"
                            colorKey="assetsType" />
                        <vLoading :show="isLoading_l" />
                        <vNodata :show="!seriesData1 && !isLoading_l" />
                    </div>
                </div>

                <div class="relative" >
                    <div class="title-bar sub no-padding-r">
                        <span class="bold">大类资产分布变化</span>
                        <div class="options">
                            时段 <vDateRangePicker
                                type="quarter"
                                ref="range" @change="getChartData2" />
                        </div>
                    </div>
                    <div class="relative" id="assetsTypeDistributionRight">
                        <vHalfChart ref="chart_r"
                            :type="xData2.length == 1 ? 'bar' : 'line'"
                            grid="grid_r"
                            :legend="legend2"
                            :xData="xData2"
                            :seriesData="seriesData2"
                            colorKey="assetsType"
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
import PieChart from '@/components/Model/pieChart';
import { getAssetsTypeDistribution } from '@/api/analysis';
import { assetTypeDistributionLegend, assetTypeDistributionLegend_QDII } from '@/utils/benchmark';

export default {
    components: { PieChart },
    data() {
        return {
            isLoading_l: false,
            isLoading_r: false,

            legend1: [],
            subTitle1: '',
            seriesData1: null,

            legend2: [],
            xData2: [],
            seriesData2: null
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        isQDII() {
            return this.selectFundToAnalyze.firsttypeChi === 'QDII'
        },
        legend() {
            return this.isQDII ? assetTypeDistributionLegend_QDII : assetTypeDistributionLegend
        },
        lineStyleOption() {
            return this.legend2.map(item => {
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
            this.$refs.point.init()
            this.$refs.range.init('12')
        },

        getChartData1() {
            this.isLoading_l = true
            this.$refs['chart_l'].clear()
            let { innercode, firsttypeChi } = this.selectFundToAnalyze,
                date = this.$refs.point.date_value
            getAssetsTypeDistribution({
                innerCode: innercode,
                reportDate: date,
                fundType: firsttypeChi
            }).then(res => {
                this.isLoading_l = false
                if(!res || JSON.stringify(res) == '{}') {
                    this.seriesData1 = null
                    return
                }
                let data = res[date]
                this.legend1 = Object.keys(data)
                if (this.isQDII || !res.tag) {
                    this.subTitle1 = '占总资产比'
                    this.seriesData1 = this.legend1.map(item => data[item].ratioStock)
                } else {
                    this.subTitle1 = ['占总资产比', `同类平均(${firsttypeChi})`]
                    this.seriesData1 = [
                        this.legend1.map(item => data[item].ratioStock),
                        this.legend1.map(item => data[item].averageStock)
                    ]
                }
                this.draw('chart_l')
            })
        },
        getChartData2() {
            this.isLoading_r = true
            this.$refs['chart_r'].clear()
            let { innercode, firsttypeChi } = this.selectFundToAnalyze,
                { start_date, end_date } = this.$refs.range
            getAssetsTypeDistribution({
                innerCode: innercode,
                startReportDate: start_date,
                endReportDate: end_date,
                fundType: firsttypeChi
            }).then(res => {
                this.isLoading_r = false
                if(!res || JSON.stringify(res) == '{}') {
                    this.seriesData2 = null
                    return
                }
                this.legend2 = this.legend.filter(item => res.assetsName.includes(item))
                this.xData2 = Object.keys(res)
                this.xData2.pop()
                this.seriesData2 = this.legend2.map(item => {
                    return this.xData2.map(x => res[x][item] ? res[x][item].ratioStock : 0)
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
                {id: 'assetsTypeDistributionLeft', imgName: '大类资产分布'},
                {id: 'assetsTypeDistributionRight', imgName: '大类资产分布变化'}
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
/deep/ .legend .value1{
    width: 104px;
    margin-left: 0;
}
</style>