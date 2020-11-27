<template>
    <div class="card">
        <moduletitle title="股票资产分布" type="manager">
            <div>
                <span>分布</span>
                <el-select v-model="distribution_value" placeholder="请选择"
                    size="mini" style="width: 190px;"
                    @change="handleChangeDistribution">
                    <el-option v-for="(item, index) in distributionOptions" :key="index"
                        :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    ref="range"
                    use="manager" 
                    :type="rangeType"
                    :database="rangeType == 'period' ? '2' : ''"
                    :config="['-1','custom']"
                    @change="getChartData"
                />
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body">
            <div class="relative" id="stockAssetsDistribution">
                <vHalfChart ref="chart"
                    :type="xData.length == 1 ? 'bar' : 'line'"
                    grid="grid_l"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :colorKey="`${distribution_value}Industry`"
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
import { distributionOptions, stockDistributionLegend } from '@/utils/benchmark';

export default {
    data() {
        return {
            distributionOptions: distributionOptions,
            distribution_value: '',

            rangeType: '',
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
            this.handleChangeDistribution('zz')
        },
        handleChangeDistribution(value) {
            this.distribution_value = value
            if (value == 'zjh') {
                this.rangeType = 'quarter'
                this.$nextTick(() => {
                    this.$refs.range.init('12')
                })
            } else {
                this.rangeType = 'period'
                this.$nextTick(() => {
                    this.$refs.range.init('6')
                })
            }
        },
        async getChartData() {
            this.isLoading = true
            const res = await push_request({
                type: 'industry_distribution_change',
                industry_standard: this.distribution_value,
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
            this.seriesData = this.legend.map(item => res[item])
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
                {id: 'stockAssetsDistribution', imgName: '股票分布变化'}
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.timeframe /deep/ .el-range-editor.el-input__inner{
    display: none;
}

.card-body /deep/ .chart{
    height: 300px;
}
</style>