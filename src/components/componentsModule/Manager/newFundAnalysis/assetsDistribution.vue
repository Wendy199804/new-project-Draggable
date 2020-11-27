
<template>
    <div class="card">
        <moduletitle title="大类资产分布" type="manager">
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    ref="range"
                    use="manager"
                    :config="['-1', 'custom']"
                    @change="getChartData"
                />
            </div>
            
        </moduletitle>

        <div class="card-body">
            <div class="relative" id="assetsTypeDistribution">
                <vHalfChart ref="chart"
                    :type="xData.length == 1 ? 'bar' : 'line'"
                    grid="grid_l"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    colorKey="assetsType"
                    :isStack="true"
                    :isPct="true"
                    :seriesOptions="xData.length == 1 ? [{barMaxWidth: 50}]: lineStyleOption"
                    :hideZero="true"
                    formatterType="stackSort"
                    tooltipType="lineStack" />
                <vLoading :show="isLoading" />
                <vNodata :show="!seriesData && !isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { push_request } from '@/api/analysis';
import { assetTypeDistributionLegend } from '@/utils/benchmark';

export default {
    data() {
        return {
            isLoading: false,

            legend: [],
            xData: [],
            seriesData: null
        }
    },
    computed: {
        ...mapGetters([
            'managerInfo'
        ]),
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
            this.$refs.range.init('12')
        },
        async getChartData() {
            this.isLoading = true
            const res = await push_request({
                type: 'asset_distribution_change',
                personal_id: this.managerInfo.id,
                begin_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = Object.keys(res).filter(item => item !== 'ReportDate')
            this.xData = res.ReportDate.map(item => item.slice(0, 10))
            this.seriesData = this.legend.map(item => res[item] || 0)
            this.draw('chart')
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
                {id: 'assetsTypeDistribution', imgName: '大类资产分布变化'}
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.card-body /deep/ .chart{
    height: 300px;
}
</style>