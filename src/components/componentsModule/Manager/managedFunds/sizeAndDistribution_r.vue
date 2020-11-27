<template>
    <div class="relative">
        <moduletitle
            type="manager"
            :tablist="tabList"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        >
            <div v-if="activeTab == 1" class="benchmark">
                <span>时段</span>
                <el-select v-model="range_value" size="mini" @change="getBarChart">
                    <el-option v-for="(item, index) in rangeOption" :key="index"
                        :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div v-if="activeTab == 1" class="freq">
                <span>频率</span>
                <el-select v-model="freq_value" size="mini" @change="getBarChart">
                    <el-option v-for="(item, index) in freqOptions1" :key="index"
                        :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="content" id="managedFundDistributionChart">
            <div v-if="activeTab == 0" class="relative padding-lr hidden">
                <GridChart ref="gridChart" />
            </div>
            <div v-else class="relative">
                <vHalfChart
                    ref="chart_r"
                    grid="grid_r"
                    type="bar"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :otherOptions="otherOptions"
                    :isStack="true"
                />
                <vLoading :show="isLoading" />
                <vNodata :show="!seriesData && !isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { push_request } from '@/api/analysis';
import GridChart from './styleDistribution'

export default {
    components: { GridChart },
    data() {
        return {
            freqOptions1: [
                {label: '月', value: 'month'},
                {label: '季', value: 'quarter'},
                {label: '年', value: 'year'}
            ],
            freq_value: '',
            rangeOption: [
                {label: '今年以来', value: 'year_start'},
                {label: '最近1年', value: 'one_year'},
                {label: '最近2年', value: 'two_years'},
                {label: '最近3年', value: 'three_years'},
                {label: '最近5年', value: 'five_years'},
                {label: '成立以来', value: 'since_founded'}
            ],
            range_value: '',

            tabList: [
                {name: '基金风格分布', id: 'style'},
                {name: '基金类型分布', id: 'type'},
            ],
            activeTab: 0,

            isLoading: false,
            legend: [],
            xData: [],
            seriesData: null,
            otherOptions: {}
        }
    },
    computed: {
        ...mapGetters([
            'managerInfo'
        ])
    },
    methods: {
        render() {
            if (this.activeTab == 0) {
                this.$nextTick(() => {
                    this.$refs.gridChart.render()
                })
            } else {
                this.range_value = 'three_years'
                this.freq_value = 'month'
                this.getBarChart()
            }
        },

        // 基金类型分布 
        async getBarChart() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_funds_number_by_freq_and_types',
                period: this.range_value,
                freq: this.freq_value,
                personal_id: this.managerInfo.id
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = Object.keys(res).filter(item => !['year', 'month', 'quarter'].includes(item))
            this.xData = res.year.map((y, index) => {
                let item = y
                if (this.freq_value !== 'year') {
                    let append = res[this.freq_value][index]
                    item = `${y}-${this.freq_value == 'month' && append < 10 ? '0' : ''}${append}`
                }
                return item
            })
            this.seriesData = this.legend.map(item => {
                return res[item] || new Array(this.xData.length).fill(0)
            })
            this.otherOptions = {
                tooltip: {
                    formatter: (params) => {
                        return params[0].axisValue + '<br>'
                            + params.map(item => `${item.seriesName}: ${item.data}<br>`).join('')
                    }
                }
            }
            this.draw('chart_r')
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
            let tab = this.tabList[this.activeTab]
            let list = [
                {id: 'managedFundDistributionChart', imgName: tab.name}
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.benchmark{
    margin-left: 0 !important;
}
.freq /deep/ .el-select{
    width: 60px !important;
}
</style>