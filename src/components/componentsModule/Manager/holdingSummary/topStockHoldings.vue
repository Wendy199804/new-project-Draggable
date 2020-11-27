<template>
    <div class="card">
        <div class="card-body">
            <div class="relative">
                <div class="sub-title no-mt">
                    <span>前十大重仓股票</span>
                    <div class="options">
                        报告期
                        <vDatePointPicker 
                            ref="point"
                            use="manager"
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
                    <el-table-column prop="code" label="股票代码" fixed align="center"></el-table-column>
                    <el-table-column prop="name" label="股票名称" fixed show-overflow-tooltip></el-table-column>
                    <el-table-column prop="weight" label="持仓占比" align="center"></el-table-column>
                    <el-table-column prop="change" label="较上期变化" align="center"></el-table-column>
                    <el-table-column prop="number" label="持有基金个数" align="center"></el-table-column>
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
                            use="manager"
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
                    <el-table-column prop="code" label="股票代码" fixed align="center"></el-table-column>
                    <el-table-column prop="name" label="股票名称" fixed show-overflow-tooltip></el-table-column>
                    <el-table-column v-for="(item, index) in tableHeader" :key="index"
                                    :prop="'col' + index" :label="item"
                                    align="right" min-width="100">
                    </el-table-column>
                    <el-table-column prop="quarter" label="持有季度" align="center" fixed="right"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { push_request } from '@/api/analysis';
import holdingTableMixin from './holdingTable';

export default {
    mixins: [holdingTableMixin],
    data() {
        return {
            isLoading_t: false,
            tableData1: [],

            isLoading_b: false,
            tableHeader: [],
            tableData2: []
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),

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
        async getTableData1() {
            this.isLoading_t = true
            const res = await push_request({
                type: 'get_manager_top10_stock',
                personal_id: this.managerInfo.id,
                end_date: this.$refs.point.date_value
            })
            this.isLoading_t = false
            if(!res || JSON.stringify(res) == '{}') {
                this.tableData1 = []
                return
            }
            this.tableData1 = res.SecuCode.map((code, index) => {
                if (code == '--') {
                    return {
                        isSummary: true,
                        id: '合计',
                        weight: this.formatData(res.ratio_in_nv[index]),
                        change: res.change[index] || '--'
                    }
                }
                return {
                    id: index + 1,
                    code,
                    name: res.ChiNameAbbr[index],
                    weight: this.formatData(res.ratio_in_nv[index]),
                    change: res.change[index] || '--',
                    number: res.count[index] || '--',
                    growth_rate: this.formatData(res.return_12[index]),
                    PE: res.PE[index] ? res.PE[index].toFixed(2) : '--',
                    industry: res.Industry[index] || '--'
                }
            })
        },
        async getTableData2() {
            this.isLoading_b = true
            const res = await push_request({
                type: 'max_stocks_changes',
                personal_id: this.managerInfo.id,
                begin_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date
            })
            this.isLoading_b = false
            if (!res || JSON.stringify(res) == '{}') {
                this.tableData2 = []
                return
            }
            this.tableHeader = Object.keys(res)
                            .filter(key => /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(key))
            this.tableData2 = res.SecuCode.map((code, index) => {
                let obj = {
                    code,
                    name: res.ChiNameAbbr[index],
                    quarter: res.num[index]
                }
                this.tableHeader.forEach((date, i) => {
                    obj['col' + i] = this.formatData(res[date][index])
                })
                return obj
            })
        },
        formatData(data) {
            if (data === 0) return '0%'
            if (!data) return '--'
            return (data * 100).toFixed(2) + '%'
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
                props1 = ['序号', '股票代码', '股票名称', '持仓占比', '较上期变化', '持有基金个数', '近1年涨跌幅', 'PE', '行业'],
                keys1 = ['id', 'code', 'name', 'weight', 'change', 'number', 'growth_rate', 'PE', 'industry']
            this.$downloadExcel(table_data1, props1, keys1, '前十大重仓股票')

            let table_data2 = this.tableData2.map((item, index) => Object.assign(item, {index: index + 1})),
                props2 = ['序号', '股票代码', '股票名称', ...this.tableHeader, '持有季度'],
                keys2 = ['index', 'code', 'name', ...this.tableHeader.map((item, index) => `col${index}`), 'quarter']
            this.$downloadExcel(table_data2, props2, keys2, '前十大重仓股票权重变化')
        }
    }
}
</script>

<style lang="scss" scoped>
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