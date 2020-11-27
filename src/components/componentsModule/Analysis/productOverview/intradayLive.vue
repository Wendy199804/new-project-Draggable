<template>
    <div class="intraday-live">
        <moduletitle title="盘中实况"></moduletitle>
        <div class="content">
            <div>
                <RealtimeValuation ref="realtime"
                    :code="selectFundToAnalyze.innercode"
                    :height="350"
                />
            </div>

            <div class="holdings">
                <p>
                    <span class="bold">股票持仓&nbsp;&nbsp;&nbsp;</span>
                    持仓截止日期：{{updateTime}}
                </p>
                <el-table
                    :data="tableData"
                    v-loading="isLoading"
                    max-height="338"
                    :summary-method="getSummaries"
                    show-summary
                    style="width: 100%; margin-top: 7px"
                >
                    <el-table-column label="股票代码/名称" width="240" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div class="ellipsis">{{scope.row.code}}&nbsp;&nbsp;{{scope.row.name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="持仓占比" min-width="200" align="center">
                        <template slot-scope="scope">
                            <div class="bold">{{scope.row.amount1 | toPercent}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="涨跌幅" min-width="100" align="center">
                        <template slot-scope="scope">
                            <div :class="['bold', priceList[scope.$index] > 0 ? 'color-red' : priceList[scope.$index] < 0 ? 'color-green' : '']">
                                {{tofixed(priceList[scope.$index])}}%
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>

import { toPercent } from '@/utils/analyze'
import { mapGetters } from 'vuex'
import RealtimeValuation from '@/components/localComponents/realtimeValuation'
import { getTop10Stocks, push_request } from '@/api/analysis'

export default {
    components: {
        RealtimeValuation
    },
    data() {
        return {
            legend: [],
            xData: [],
            seriesData: [],
            otherOptions: {},
            valuation: 1.4563016554,
            gains: 0.00563,

            isLoading: false,
            tableData: [],
            priceList: [], // 实时价格
            updateTime: ''
        }
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        },
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.$refs.realtime.render()
            this.getTableData()

            let interval = setInterval(() => {
                this.getCurrentPrice()
            }, 300000)
            this.$once('hook:beforeDestroy', () => {
                clearInterval(interval)
            })
        },
        async getTableData() {
            this.isLoading = true
            const res = await getTop10Stocks({
                innerCode: this.selectFundToAnalyze.innercode,
                fundType: this.selectFundToAnalyze.firsttypeChi
            })
            this.isLoading = false
            this.tableData = res.mfStockportfoliodetailVoList.map((item, index) => {
                return {
                    code: item.secuCode,
                    name: item.secuAbbr,
                    amount1: item.ratioInNV
                }
            })
            this.updateTime = res.reportDate
            this.getCurrentPrice()
        },
        async getCurrentPrice() {
            const res = await push_request({
                type: 'get_json_current_stock_price',
                index_codes: this.tableData.map(item => item.code)
            })
            if (!res.index_data) {
                this.priceList = this.tableData.map(item => null)
                return
            }
            this.priceList = res.index_data.map(item => item[0])
        },
        // 合计行
        getSummaries(param) {
            const { columns, data } = param
            const sums = []
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '前十大持仓占比合计'
                    return
                }
                const values = data.map((item) => Number(item[column.property]))
                if (column.label === '持仓占比') {
                    let sum = data.reduce(
                        (prev, curr) => {
                            return { amount1: Number(prev.amount1) + Number(curr.amount1) }
                        },
                        { amount1: 0 }
                    )
                    sums[index] = toPercent(sum.amount1)
                }
            })
            return sums
        },
        tofixed(num) {
            if (num === null) return '--'
            return Number(num).toFixed(2)
        }
    },
}
</script>

<style lang="scss" scoped>
.intraday-live {
    background-color: #ffffff;
    margin-bottom: 16px;
    color: #333;
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50C75A;
    }
    .content {
        width: 100%;
        height: 390px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        & > p {
            text-align: center;
            line-height: 350px;
            width: 50%;
            font-size: 13px;
        }
        & > div {
            width: 50%;
            position: relative;
            margin: 10px 0;
            height: 350px;
        }
        & > div:last-child {
            border-left: 1px solid #dddddd;
            padding: 0 15px;
        }
        /deep/ .chart {
            width: 100%;
            height: 350px !important;
        }
    }

    .holdings /deep/ .el-table{
        border: none !important;
        td {
            border-bottom: none;
            height: 28px;
            line-height: 28px;
        }
        .el-table__footer-wrapper td {
            border: none;
            background-color: #f5f5f5;
        }
        &::before {
            height: 0;
        }
        thead th {
            background: #f5f5f5 !important;
            border-bottom: 0;
            height: 28px;
            line-height: 28px;
        }
        .cell{
            padding-left: 26px;
        }
        .ellipsis{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>