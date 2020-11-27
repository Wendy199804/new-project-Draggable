<template>
    <div class="card">
        <moduletitle title="前十大重仓股票权重变化" type="manager">
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    ref="range"
                    use="manager"
                    @change="getTableData"
                />
            </div>
            <div>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body">
            <el-table max-height="360"
                :data="tableData"
                v-loading="isLoading"
                :cell-class-name="getCellClass"
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
</template>

<script>
import { mapGetters } from 'vuex';
import { push_request } from '@/api/analysis';
import holdingTableMixin from '../holdingSummary/holdingTable';

export default {
    mixins: [holdingTableMixin],
    data() {
        return {
            isLoading: false,
            tableHeader: [],
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.$refs.range.init('12')
        },

        async getTableData() {
            this.isLoading = true
            const res = await push_request({
                type: 'max_stocks_changes',
                personal_id: this.managerInfo.id,
                begin_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.tableData = []
                return
            }
            this.tableHeader = Object.keys(res)
                            .filter(key => /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(key))
            this.tableData = res.SecuCode.map((code, index) => {
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

        getCellClass({row, column}) {
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
            let table_data = this.tableData.map((item, index) => Object.assign(item, {index: index + 1})),
                props = ['序号', '股票代码', '股票名称', ...this.tableHeader, '持有季度'],
                keys = ['index', 'code', 'name', ...this.tableHeader.map((item, index) => `col${index}`), 'quarter']
            this.$downloadExcel(table_data, props, keys, '前十大重仓股票权重变化')
        }
    }
}
</script>

<style lang="scss" scoped>
.timeframe /deep/ .el-range-editor.el-input__inner{
    display: none;
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