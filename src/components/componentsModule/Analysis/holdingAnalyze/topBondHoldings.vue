<template>
    <div class="card">
        <moduletitle :title="`前${topNum}大重仓债券`">
            <div class="timeframe">
                <span>报告期</span>
                <vDatePointPicker
                    ref="point"
                    @change="getTableData"
                />
            </div>
            <!-- <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    ref="range" 
                    :config="['-1', 'custom', '20']"
                    @change="getTableData"
                />
            </div> -->
            <div>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>
        
        <div class="card-body">
            <el-table
                :data="tableData"
                v-loading="isLoading"
                :cell-style="getCellStyle"
            >
                <el-table-column label="序号" width="70" align="center">
                    <template slot-scope="scope">{{scope.row.id}}</template>
                </el-table-column>
                <el-table-column prop="code" label="债券代码" min-width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="债券名称" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column prop="weight" label="持仓占比" align="center"></el-table-column>
                <el-table-column prop="change" label="较上期变化" align="center"></el-table-column>
                <el-table-column label="近4期占比变化" align="center" width="230">
                    <template slot-scope="scope">
                        <vFullChart v-if="!scope.row.isSummary" class="full-chart"
                            :ref="'chart'+scope.row.id"
                            :xData="scope.row.xData"
                            :seriesData="scope.row.seriesData"
                            :isPct="[true]"
                            :seriesOptions="seriesOptions"
                            :otherOptions="otherOptions"
                        />
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getTopBondHoldings } from '@/api/analysis';
import holdingTableMixin from './holdingTable';

export default {
    mixins: [holdingTableMixin],
    data() {
        return {
            isLoading: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        topNum() {
            let num = '五'
            this.selectFundToAnalyze.type == 2 && (num = '十')
            return num
        }
    },
    methods: {
        render() {
            this.$refs.point.init()
            // this.$refs.range.init()
        },
        async getTableData() {
            this.isLoading = true
            const res = await getTopBondHoldings({
                innerCode: this.selectFundToAnalyze.innercode,
                reportDate: this.$refs.point.date_value,
                fundType: this.selectFundToAnalyze.firsttypeChi
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.tableData = []
                return
            }
            let data = res.data.map((item, index) => {
                let x = [3, 2, 1, 0]
                return {
                    id: index + 1,
                    code: item.secuCode,
                    name: item.secuAbbr,
                    weight: this.formatData(item.ratioInNV),
                    change: item.change || '--',
                    xData: x,
                    seriesData: [{
                        type: 'line',
                        name: '权重',
                        data: x.map(i => {
                            let iData = item.mfBondportifoliodetailVos[i]
                            return iData ? iData.ratioInNV : 0
                        })
                    }]
                }
            })
            let summary1 = res['合计'],
                summary2 = res['集中度']
            summary1 && data.push({
                isSummary: true,
                id: '合计',
                weight: this.formatData(summary1.ratioInNV),
                change: summary1.change || '--'
            })
            summary2 && data.push({
                isSummary: true,
                id: '集中度',
                weight: this.formatData(summary2.ratioInNV),
                change: summary2.change || '--'
            })
            this.tableData = data
            this.$nextTick(() => {
                this.tableData.forEach(row => {
                    if (row.isSummary) return
                    this.$refs[`chart${row.id}`].drawChart()
                })
            })
        },

        /**
         * 下载Excel
         */
        handleExcel() {
            let table_data = this.tableData,
                props = ['序号', '债券代码', '债券名称', '持仓占比', '较上期变化'],
                keys = ['id', 'code', 'name', 'weight', 'change']
            this.$downloadExcel(table_data, props, keys, `前${this.topNum}大重仓债券`)
        }
    }
}
</script>

<style lang="scss" scoped>
.full-chart /deep/ .chart{
    height: 36px !important;
}
</style>