<template>
    <div class="card">
        <moduletitle title="前五大重仓债券">
            <div class="timeframe">
                <span>报告期</span>
                <vDatePointPicker
                    ref="point"
                    use="manager"
                    @change="getTableData"
                />
            </div>
            <!-- <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    ref="range" 
                    use="manager"
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
import { push_request } from '@/api/analysis';
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
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.$refs.point.init()
            // this.$refs.range.init()
        },
        async getTableData() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_manager_top5_bond',
                personal_id: this.managerInfo.id,
                end_date: this.$refs.point.date_value
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.tableData = []
                return
            }
            this.tableData = Object.keys(res.SecuCode).map(index => {
                let code = res.SecuCode[index]
                if (code == '--') {
                    return {
                        isSummary: true,
                        id: '合计',
                        weight: this.formatData(res.ratio_in_nv[index]),
                        change: res.change[index] || '--'
                    }
                }
                return {
                    id: +index + 1,
                    code,
                    name: res.ChiNameAbbr[index],
                    weight: this.formatData(res.ratio_in_nv[index]),
                    change: res.change[index] || '--',
                    xData: ['近4', '近3', '近2', '近1'],
                    seriesData: [{
                        type: 'line',
                        name: '权重',
                        data: res.last[index]
                    }]
                }
            })
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
            this.$downloadExcel(table_data, props, keys, '前五大重仓债券')
        }
    }
}
</script>

<style lang="scss" scoped>
.full-chart /deep/ .chart{
    height: 36px !important;
}
</style>