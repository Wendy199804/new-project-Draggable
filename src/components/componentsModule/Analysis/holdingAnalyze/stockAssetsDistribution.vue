<template>
    <div class="card">
        <moduletitle
            :title="`${title}分布`"
            :tablist="tabList"
            :secondary="true"
            :isright="true"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        >
            <div>
                <span>分布</span>
                <el-select
                    v-model="distribution_value"
                    placeholder="请选择"
                    size="mini"
                    :style="`width: ${isQDII ? 230: 190}px;`"
                    @change="handleChangeDistribution"
                >
                    <el-option
                        v-for="(item, index) in distributionOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            
        </moduletitle>
        
        <div class="card-body">
            <div class="double">
                <div class="relative">
                    <div class="title-bar sub no-padding-l">
                        <span class="bold">{{title}}分布</span>
                        <div class="options" v-if="interval">
                            截止时间
                            <vDatePointPicker
                                :interval="interval"
                                :database="interval == 6 ? '2' : ''"
                                ref="point"
                                @change="getChartData1"
                            /> 
                        </div>
                    </div>
                    <div class="relative" id="stockAssetsDistributionLeft">
                        <PieChart ref="chart_l"
                            :title="distribution_value == 'sector' ? '板块' : '行业'"
                            subTitle="占净资产比"
                            :legend="legend1"
                            :seriesData="seriesData1"
                            :colorKey="`${distribution_value}Industry`" />
                        <vLoading :show="isLoading_l" />
                        <vNodata :show="!seriesData1 && !isLoading_l" />
                    </div>
                </div>

                <div class="relative">
                    <div class="title-bar sub no-padding-r">
                        <span class="bold">{{title}}分布变化</span>
                        <div class="options" v-if="rangeType">
                            时段
                            <vDateRangePicker
                                :type="rangeType"
                                :database="rangeType == 'period' ? '2' : ''"
                                ref="range"
                                @change="getChartData2"
                            />
                        </div>
                    </div>
                    <div class="relative" id="stockAssetsDistributionRight">
                        <vHalfChart ref="chart_r"
                            :type="xData2.length == 1 ? 'bar' : 'line'"
                            grid="grid_r"
                            :legend="legend2"
                            :xData="xData2"
                            :seriesData="seriesData2"
                            :colorKey="`${distribution_value}Industry`"
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
import { mapGetters } from 'vuex'
import PieChart from '@/components/Model/pieChart'
import { distributionOptions, stockDistributionLegend } from '@/utils/benchmark'
import { getStockAssetsDistribution } from '@/api/analysis'

export default {
    components: { PieChart },
    data() {
        return {
            activeTab: 0,
            distribution_value: '',

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
        legend() {
            if (!this.distribution_value) return []
            return stockDistributionLegend[this.distribution_value]
        },
        isQDII() {
            return this.selectFundToAnalyze.firsttypeChi === 'QDII'
        },
        tabList() {
            let dft = [
                {name: '前十大重仓股', id: 'top10'},
                {name: '全部持仓', id: 'all'},
            ]
            return this.isQDII ? [dft[1]] :dft
        },
        distributionOptions() {
            return this.isQDII ? [
                {label: '行业分布 - 全球行业分类标准GICS', value: 'QDII'}
            ] : distributionOptions
        },
        title() {
            return this.isQDII ? '股票及存托凭证' : '股票资产'
        },
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
            this.handleChangeDistribution(this.isQDII ? 'QDII' : 'zz')
        },
        handleChangeDistribution(value) {
            this.distribution_value = value
            this.seriesData1 = null
            this.seriesData2 = null
            if (this.activeTab == 0 || value == 'zjh' || this.isQDII) {
                this.interval = 3
                this.rangeType = 'quarter'
                this.$nextTick(() => {
                    this.$refs.point.init()
                    this.$refs.range.init('12')
                })
            } else {
                this.interval = 6
                this.rangeType = 'period'
                this.$nextTick(() => {
                    this.$refs.point.init()
                    this.$refs.range.init('6')
                })
            }
        },
        getChartData1() {
            this.isLoading_l = true
            this.$refs['chart_l'].clear()
            let { innercode } = this.selectFundToAnalyze,
                date = this.$refs.point.date_value
            getStockAssetsDistribution({
                type: this.distribution_value,
                innerCode: innercode,
                reportDate: date,
                fundType: this.selectFundToAnalyze.firsttypeChi,
                port_type: this.tabList[this.activeTab].id
            }).then(res => {
                this.isLoading_l = false
                if (!res || JSON.stringify(res) == '{}') {
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
            getStockAssetsDistribution({
                type: this.distribution_value,
                innerCode: innercode,
                startReportDate: start_date,
                endReportDate: end_date,
                fundType: this.selectFundToAnalyze.firsttypeChi,
                port_type: this.tabList[this.activeTab].id
            }).then(res => {
                this.isLoading_r = false
                if (!res || JSON.stringify(res) == '{}') {
                    this.seriesData2 = null
                    return
                }
                this.legend2 = this.legend.filter(item => res.assetsName.includes(item))
                this.xData2 = Object.keys(res)
                this.xData2.pop()
                this.seriesData2 = this.legend2.map(item => {
                    return this.xData2.map(x => res[x][item])
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
                { id: 'stockAssetsDistributionLeft', imgName: `${this.title}分布` },
                { id: 'stockAssetsDistributionRight', imgName: `${this.title}分布变化` }
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.relative /deep/ .half .tc {
    display: none;
}
.title-bar.sub {
    border-bottom: 0 !important;
}
</style>