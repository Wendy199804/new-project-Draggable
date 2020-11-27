<template>
    <div class="card">
        <div class="card-body">
            <div class="relative">
                <div class="sub-title no-mt">
                    <span>前十大重仓股票</span>
                    <div class="options">
                        报告期 <vDatePointPicker 
                            ref="point"
                            @change="getTableData1"
                        />
                    </div>
                </div>
                <el-table
                    :data="tableData1"
                    v-loading="isLoading_t"
                    :cell-style="getCellStyle"
                >
                    <el-table-column label="序号" width="70" align="center" fixed>
                        <template slot-scope="scope">{{scope.row.id}}</template>
                    </el-table-column>
                    <el-table-column prop="code" :label="isQDII ? '证券代码' : '股票代码'" fixed align="center"></el-table-column>
                    <el-table-column prop="name" :label="isQDII ? '公司名称' : '股票名称'" fixed show-overflow-tooltip></el-table-column>
                    <el-table-column v-if="isQDII" prop="area" label="所属国家(地区)" width="120" fixed align="center"></el-table-column>
                    <el-table-column prop="weight" label="持仓占比" align="center"></el-table-column>
                    <el-table-column prop="change" label="较上期变化" align="center"></el-table-column>
                    <el-table-column prop="growth_rate" label="近1年涨跌幅" align="center"></el-table-column>
                    <el-table-column prop="PE" label="PE" align="center"></el-table-column>
                    <el-table-column prop="industry" label="行业" align="center"></el-table-column>
                </el-table>
            </div>

            <div class="relative">
                <div class="sub-title" style="margin-top: 24px;">
                    <span>前十大重仓股票权重变化</span>
                    <div class="options" style="width: 0; margin-left: 0; overflow: hidden;">
                        <vDateRangePicker
                            ref="range"
                            @change="getTableData2"
                        />
                    </div>
                </div>
                <el-table max-height="440"
                    :data="tableData2"
                    v-loading="isLoading_b"
                    :cell-class-name="getCellClass2"
                >
                    <el-table-column type="index" label="序号" width="50" align="center" fixed></el-table-column>
                    <el-table-column prop="code" :label="isQDII ? '证券代码' : '股票代码'" fixed align="center"></el-table-column>
                    <el-table-column prop="name" :label="isQDII ? '公司名称' : '股票名称'" fixed show-overflow-tooltip></el-table-column>
                    <el-table-column v-if="isQDII" prop="area" label="所属国家(地区)" width="120" fixed align="center"></el-table-column>
                    <el-table-column v-for="(item, index) in tableHeader" :key="index"
                                    :prop="'col' + index" :label="item"
                                    align="right" min-width="100">
                    </el-table-column>
                    <el-table-column prop="quarter" label="持有季度" align="center" fixed="right"></el-table-column>
                </el-table>
                <!-- <div class="zj-pagination">
                    <span>共{{totalSize}}条</span>
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next, jumper"
                        :total="totalSize">
                    </el-pagination>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getTopStockHoldings, getTopStockWeights } from '@/api/analysis';
import holdingTableMixin from './holdingTable';

export default {
    mixins: [holdingTableMixin],
    data() {
        return {
            isLoading_t: false,
            tableData1: [],

            isLoading_b: false,
            tableHeader: [],
            tableData2: [],
            onePageData: [],

            totalSize: 0,
            currentPage: 1,
            pageSize: 10
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        isQDII() {
            return this.selectFundToAnalyze.firsttypeChi === 'QDII'
        },
        point() {
            // return this.$parent.$refs.point
            return this.$refs.point
        },
        range() {
            // return this.$parent.$refs.range
            return this.$refs.range
        }
    },
    methods: {
        render() {
            this.$refs.point.init()
            this.$refs.range.init('12')
            // this.getTableData1()
            // this.getTableData2()
        },
        getTableData1() {
            this.isLoading_t = true
            getTopStockHoldings({
                innerCode: this.selectFundToAnalyze.innercode,
                reportDate: this.point.date_value,
                fundType: this.selectFundToAnalyze.firsttypeChi
            }).then(res => {
                this.isLoading_t = false
                if(!res || JSON.stringify(res) == '{}') {
                    this.tableData1 = []
                    return
                }
                let data = res.data.map((item, index) => {
                    return {
                        id: index + 1,
                        code: item.secuCode,
                        name: item.secuAbbr,
                        area: item.homeCountryDesc || '--',
                        weight: this.formatData(item.ratioInNV),
                        change: item.change || '--',
                        growth_rate: this.formatData(item.changePCTR12M),
                        PE: item.pe ? item.pe.toFixed(2) : '--',
                        industry: item.hkIndustryName || '--'
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
                this.tableData1 = data
            })
        },
        getTableData2() {
            this.isLoading_b = true
            getTopStockWeights({
                innerCode: this.selectFundToAnalyze.innercode,
                startReportDate: this.range.start_date,
                endReportDate: this.range.end_date,
                fundType: this.selectFundToAnalyze.firsttypeChi
            }).then(res => {
                this.isLoading_b = false
                if (!res || !res.length) {
                    this.tableData2 = []
                    return
                }
                this.tableHeader = Object.keys(res[0])
                                    .filter(key => /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(key))
                                    .sort().reverse()
                this.tableData2 = res.map(item => {
                    let obj = {
                        code: item.SecuCode,
                        name: item.SecuAbbr,
                        quarter: item.count,
                        area: item.HomeCountryDesc || '--'
                    }
                    this.tableHeader.forEach((date, index) => {
                        let weight = item[date]
                        weight === 0 && (weight = null)
                        obj['col' + index] = this.formatData(weight)
                    })
                    return obj
                })
                this.totalSize = this.tableData2.length
                this.handleCurrentChange(1)
            })
        },
        handleCurrentChange(current) {
            this.currentPage = current
            let start = (this.currentPage - 1) * this.pageSize,
                end = this.currentPage * this.pageSize
            this.onePageData = this.tableData2.slice(start, end)
        },
        getCellClass2({row, column}) {
            if (!column.property || column.property.indexOf('col') < 0) return
            let data = row[column.property]
            if (data == '--') return
            return `bg-level-${this.getLevel(+data.substring(0, data.length-1))}`
        },
        getLevel(num) {
            const levels = [0, 2, 3, 3.5, 4.5, 5.5, 6.5, 7, 8, 8.5, 100]
            return levels.findIndex((item, index) => {
                return num >= item && num < levels[index + 1]
            })
        },

        /**
         * 下载Excel
         */
        handleExcel() {
            let table_data1 = this.tableData1,
                props1 = ['序号', '证券代码', '公司名称', '所属国家(地区)', '持仓占比', '较上期变化', '近1年涨跌幅', 'PE', '行业'],
                keys1 = ['id', 'code', 'name', 'area', 'weight', 'change', 'growth_rate', 'PE', 'industry']
            if (!this.isQDII) {
                props1.splice(3, 1)
                keys1.splice(3, 1)
            }
            this.$downloadExcel(table_data1, props1, keys1, '前十大重仓股票')

            let table_data2 = this.tableData2.map((item, index) => Object.assign(item, {index: index + 1})),
                props2 = ['序号', this.isQDII ? '证券代码' : '股票代码', this.isQDII ? '公司名称' : '股票名称', ...this.tableHeader, '持有季度'],
                keys2 = ['index', 'code', 'name', ...this.tableHeader.map((item, index) => `col${index}`), 'quarter']
            this.$downloadExcel(table_data2, props2, keys2, '前十大重仓股票权重变化')
        }
    }
}
</script>

<style lang="scss" scoped>
.zj-pagination{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 7px;
}
/deep/ .el-table{
    td{
        padding: 0 10px !important;
        .cell{
            padding-left: 2px;
            padding-right: 2px;
        }
    }
    .bg-level-0 .cell{background: #B2C7FE;}
    .bg-level-1 .cell{background: #CBD9FE;}
    .bg-level-2 .cell{background: #E5ECFE;}
    .bg-level-3 .cell{background: #FFF2F2;}
    .bg-level-4 .cell{background: #FFE6E6;}
    .bg-level-5 .cell{background: #FFCCCC;}
    .bg-level-6 .cell{background: #FFB3B3;}
    .bg-level-7 .cell{background: #FF9999;}
    .bg-level-8 .cell{background: #FF8C8C;}
    .bg-level-9 .cell{background: #FF8080;}
}
</style>