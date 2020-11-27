<template>
    <div class="card">
        <moduletitle title="代表基金业绩" type="manager">
            <div>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body no-padding-lr">
            <div class="padding-lr">
                <p style="margin-bottom: 8px">
                    <span class="bold">收益走势</span>
                    <span class="right">
                        <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                    </span>
                </p>
            </div>
            <div class="relative chart-wrap padding-r" id="famousFund">
                <vApartChart
                    ref="chart"
                    type="line"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :seriesOptions="seriesOptions"
                    :isMultiple="true"
                    :isPct="true"
                    formatterType="lineSort"
                />
                <vLoading :show="isLoading || isLoading_t" />
                <vNodata :show="!seriesData && !isLoading_t" />
            </div>
            <div class="padding-lr">
                <p style="margin: 16px 0">
                    <span class="bold">收益风险指标</span>
                    <span class="right">
                        <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                    </span>
                    <span class="options right">
                        <span style="margin-right: 2px">时段</span>
                        <el-select v-model="period_value" size="mini" style="width: 110px;" @change="getTableData">
                            <el-option v-for="(item, index) in periodOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </span>
                </p>
                <el-table :data="tableData" v-loading="isLoading || isLoading_b" max-height="320" :summary-method="getSummaries" show-summary>
                    <el-table-column label="基金名称" prop="chiNameAbbr" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="highlight" @click="toFundDetail(scope.row.innerCode)">
                                {{ scope.row.chiNameAbbr }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, index) in cols" :key="index" :label="item.label" :prop="item.prop" align="center">
                        <template slot-scope="scope">
                            <span
                                :class="{
                                    'color-red': index < 2 && scope.row[`${item.prop}_origin`] > 0,
                                    'color-green': index < 2 && scope.row[`${item.prop}_origin`] < 0
                                }"
                            >{{ scope.row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import { getReturnAndRiskIndicators } from '@/api/manager'

export default {
    data() {
        return {
            isLoading: false,
            fundList: [],

            isLoading_t: false,
            legend: [],
            xData: [],
            seriesData: null,
            seriesOptions: null,

            periodOptions: [
                { label: '今年以来', value: 0 },
                { label: '最近3月', value: 3 },
                { label: '最近6月', value: 6 },
                { label: '最近1年', value: 12 },
                { label: '最近3年', value: 36 },
                { label: '最近5年', value: 60 }
            ],
            period_value: 0,

            isLoading_b: false,
            tableData: [],
            summary: {},
            cols: [
                { label: '区间收益', prop: 'intervalReturn', isPct: true },
                { label: '年化收益', prop: 'annualReturn', isPct: true },
                { label: '阿尔法', prop: 'alpha', isPct: true },
                { label: '夏普比率', prop: 'sharpe', isPct: false },
                { label: '最大回撤', prop: 'maximumDrawdown', isPct: true },
                { label: '年化标准差', prop: 'volatility', isPct: true },
                { label: '贝塔', prop: 'beta', isPct: false },
                { label: '历史VaR', prop: 'var', isPct: true }
            ]
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        async render() {
            this.isLoading = true
            const res = await push_request({
                type: 'represent_fund_select',
                personal_id: this.managerInfo.id
            })
            this.isLoading = false
            if (!res.InnerCode || !res.InnerCode.length) return
            this.fundList = res.InnerCode.map((code, index) => {
                return {
                    code,
                    name: res.ChiNameAbbr[index]
                }
            })
            this.getChartData()
            this.period_value = 0
            this.getTableData()
        },

        async getChartData() {
            this.isLoading_t = true
            if (!this.fundList.length) {
                this.isLoading = false
                this.seriesData = null
                return
            }
            const res = await push_request({
                type: 'represent_fund_curve',
                personal_id: this.managerInfo.id,
                inner_code_list: this.fundList.map(item => item.code)
            })
            this.isLoading_t = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = this.fundList.map(item => item.name)
            this.xData = res.TradingDay.map(item => item.slice(0, 10))
            this.seriesData = this.legend.map(item => res[item])
            this.seriesOptions = this.legend.map(item => {
                return { connectNulls: true }
            })
            this.draw('chart', [this.legend[0]])
        },
        draw(refName, n) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
                n && this.$refs[refName].changeCheckbox(n)
            })
        },
        async getTableData() {
            this.isLoading_b = true
            const res = await getReturnAndRiskIndicators({
                personalCode: this.managerInfo.id,
                period: this.period_value
            })
            this.isLoading_b = false
            if (!res || !res.length) {
                this.tableData = []
                return
            }
            this.tableData = res.map(item => {
                this.cols.map(col => {
                    item[`${col.prop}_origin`] = item[col.prop]
                    item[col.prop] = this.formatData(item[col.prop], col.isPct)
                    // 非股票型、混合型基金  阿尔法、贝塔不显示
                    if (!['股票型', '混合型'].includes(item.firstClassType) && ['alpha', 'beta'].includes(col.prop)) {
                        item[col.prop] = '--'
                    }
                })
                return item
            })
            this.summary = this.tableData.pop()
        },
        formatData(data, isPct) {
            if (data === null) return '--'
            if (isPct) return (data * 100).toFixed(2) + '%'
            return data.toFixed(2)
        },
        getSummaries(param) {
            const { columns } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '沪深300'
                    return
                }
                sums[index] = this.summary[column.property]
            })
            return sums
        },
        toFundDetail(innercode) {
            this.$routeOpen({name: 'Analysis',query: {innercode}})
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [{ id: 'famousFund', imgName: '代表基金业绩' }]
            this.$downloadImg(list)
        },
        /**
         * 下载表格
         */
        handleExcel() {
            let table_data = [...this.tableData, this.summary],
                props = ['基金名称', ...this.cols.map(item => item.label)],
                keys = ['chiNameAbbr', ...this.cols.map(item => item.prop)]
            this.$downloadExcel(table_data, props, keys, '收益风险指标')
        }
    }
}
</script>

<style lang="scss" scoped>
.card-body {
    .svg-icon {
        font-size: 24px;
        margin-left: 8px;
        cursor: pointer;
    }
    .chart-wrap {
        /deep/ .el-checkbox {
            margin-right: 0;
            white-space: normal;
            color: #999;
            .el-checkbox__label {
                padding-left: 0;
            }
            .el-checkbox__input {
                display: none;
            }
        }
    }
    .options {
        color: #999;
        font-size: 13px;
        margin-right: 16px;
        /deep/ .el-input--mini .el-input__inner {
            height: 24px;
            line-height: 24px;
        }
    }
}
</style>