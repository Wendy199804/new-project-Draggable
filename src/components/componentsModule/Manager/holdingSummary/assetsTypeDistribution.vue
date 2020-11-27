<template>
    <div class="card">
        <moduletitle title="大类资产分布" type="manager">
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body">
            <div class="double">
                <div class="relative">
                    <div class="title-bar sub no-padding-l">
                        <span class="bold">大类资产分布</span>
                        <div class="options">
                            截止时间
                            <vDatePointPicker
                                ref="point"
                                use="manager"
                                @change="getTableData"
                            />
                        </div>
                    </div>
                    <div class="padding-r">
                        <el-table :data="tableData" v-loading="isLoading_l" height="322">
                            <el-table-column type="index" label="序号" width="50">
                                <template slot-scope="scope" v-if="!scope.row.isEmpty">
                                    {{scope.$index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="大类资产"></el-table-column>
                            <el-table-column prop="col1" label="资产净值(亿元)" align="center"></el-table-column>
                            <el-table-column prop="col2" label="占总资产比" align="center">
                                <template slot-scope="scope" v-if="!scope.row.isEmpty">
                                    {{formatData(scope.row.col2, true)}}%
                                </template>
                            </el-table-column>
                            <el-table-column prop="col3" label="比例变动" align="center">
                                <template slot-scope="scope" v-if="!scope.row.isEmpty">
                                    <span :class="scope.row.col3 > 0 ? 'red' : scope.row.col3 < 0 ? 'green' : ''">
                                        {{formatData(scope.row.col3, true)}}%
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="relative" >
                    <div class="title-bar sub">
                        <span class="bold">大类资产分布变化</span>
                        <div class="options">
                            时段
                            <vDateRangePicker
                                ref="range"
                                use="manager"
                                :config="['-1', 'custom']"
                                @change="getChartData"
                            />
                        </div>
                    </div>
                    <div class="relative" id="assetsTypeDistribution">
                        <vHalfChart ref="chart_r"
                            :type="xData.length == 1 ? 'bar' : 'line'"
                            grid="grid_r"
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
                        <vLoading :show="isLoading_r" />
                        <vNodata :show="!seriesData && !isLoading_r" />
                    </div>
                </div>
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
            isLoading_l: false,
            isLoading_r: false,

            tableData: [],

            legend: [],
            // legend: assetTypeDistributionLegend,
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
            this.$refs.point.init()
            this.$refs.range.init('12')
        },
        async getTableData() {
            this.isLoading_l = true
            const res = await push_request({
                type: 'asset_distribution',
                personal_id: this.managerInfo.id,
                end_date: this.$refs.point.date_value
            })
            this.isLoading_l = false
            if (!res || !res.asset) {
                this.tableData = []
                return
            }
            this.tableData = res.asset.map((item, index) => {
                return {
                    type: item,
                    col1: this.formatData(res.MarketValue[index]),
                    col2: res.ratio_in_all[index],
                    col3: res.ratio_changes[index]
                }
            })
            // 占位空行
            this.tableData.length < 7 && (this.tableData = this.tableData.concat(
                new Array(7 - this.tableData.length).fill({isEmpty: true})
            ))
        },
        formatData(data, isPct) {
            if (data === 0) return 0
            if (!data) return '--'
            if (!isPct) return data.toFixed(2)
            return (data * 100).toFixed(2)
        },
        async getChartData() {
            this.isLoading_r = true
            const res = await push_request({
                type: 'asset_distribution_change',
                personal_id: this.managerInfo.id,
                begin_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date
            })
            this.isLoading_r = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = Object.keys(res).filter(item => item !== 'ReportDate')
            this.xData = res.ReportDate.map(item => item.slice(0, 10))
            this.seriesData = this.legend.map(item => res[item] || 0)
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
            let list = [
                {id: 'assetsTypeDistribution', imgName: '大类资产分布变化'}
            ]
            this.$downloadImg(list)
        },
        /**
         * 下载Excel
         */
        handleExcel() {
            let table_data = this.tableData.map((item, index) => {
                let obj = Object.assign({index: index + 1}, item)
                obj.col2 = this.formatData(obj.col2, true) + '%'
                obj.col3 = this.formatData(obj.col3, true) + '%'
                return obj
            }),
                props = ['序号', '大类资产', '资产净值(亿元)', '占总资产比', '比例变动'],
                keys = ['index', 'type', 'col1', 'col2', 'col3']
            this.$downloadExcel(table_data, props, keys, '大类资产分布')
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
.card-body .el-table{
    /deep/ .red{
        color: #F04134;
    }
    /deep/ .green{
        color: #50C75A;
    }
}
</style>