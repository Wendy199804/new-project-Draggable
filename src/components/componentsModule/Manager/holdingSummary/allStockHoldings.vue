<template>
    <div class="card">
        <div class="card-body">
                <div class="sub-title no-mt">
                    <span>全部持仓</span>
                    <div class="options">
                        报告期
                        <vDatePointPicker
                            ref="point"
                            use="manager"
                            :interval="6"
                            @change="getTableData"
                        />
                    </div>
                </div>
                <el-table
                    :data="onePageData"
                    v-loading="isLoading"
                    :cell-style="getCellStyle"
                >
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <el-table-column prop="code" label="股票代码" align="center"></el-table-column>
                    <el-table-column prop="name" label="股票名称" align="center"></el-table-column>
                    <el-table-column prop="weight" label="持仓占比" align="center"></el-table-column>
                    <el-table-column prop="change" label="较上期持仓变化" align="center"></el-table-column>
                    <el-table-column label="近4期占比变化" align="center" width="230">
                        <template slot-scope="scope">
                            <vFullChart class="full-chart"
                                :ref="'chart'+scope.row.id"
                                :xData="scope.row.xData"
                                :seriesData="scope.row.seriesData"
                                :isPct="[true]"
                                :seriesOptions="seriesOptions"
                                :otherOptions="otherOptions"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="growth_rate" label="近1年涨跌幅" align="center"></el-table-column>
                    <el-table-column prop="PE" label="PE" align="center"></el-table-column>
                    <el-table-column prop="industry" label="行业" align="center"></el-table-column>
                </el-table>
                <div class="zj-pagination">
                    <span>共{{totalSize}}条</span>
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="prev, pager, next, jumper"
                        :total="totalSize">
                    </el-pagination>
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
            isLoading: false,
            tableData: [],
            onePageData: [],

            totalSize: 0,
            currentPage: 1,
            pageSize: 10
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),
        point() {
            // return this.$parent.$refs.point
            return this.$refs.point
        }
    },
    methods: {
        render() {
            this.point.init()
            // this.getTableData()
        },
        async getTableData() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_manager_all_stock',
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
                return {
                    id: +index + 1,
                    code,
                    name: res.ChiNameAbbr[index],
                    weight: this.formatData(res.ratio_in_nv[index]),
                    change: res.change[index] || '--',
                    growth_rate: this.formatData(res.return_12[index]),
                    PE: res.PE[index] ? res.PE[index].toFixed(2) : '--',
                    industry: res.Industry[index] || '--',
                    xData: ['近4', '近3', '近2', '近1'],
                    seriesData: [{
                        type: 'line',
                        name: '权重',
                        data: res.last[index]
                    }]
                }
            })
            // this.totalSize = res.total
            this.totalSize = this.tableData.length
            this.handleCurrentChange(1)
            // this.$nextTick(() => {
            //     this.tableData.forEach(row => {
            //         this.$refs['chart' + row.id].drawChart()
            //     })
            // })
        },
        handleCurrentChange(current) {
            this.currentPage = current
            // this.getTableData()
            let start = (this.currentPage - 1) * this.pageSize,
                end = this.currentPage * this.pageSize
            this.onePageData = this.tableData.slice(start, end)
            this.$nextTick(() => {
                this.onePageData.forEach(row => {
                    this.$refs['chart' + row.id].drawChart()
                })
            })
        },

        /**
         * 导出Excel
         */
        handleExcel() {
            let table_data = this.tableData,
                props = ['序号', '股票代码', '股票名称', '持仓占比', '较上期变化', '近1年涨跌幅', 'PE', '行业'],
                keys = ['id', 'code', 'name', 'weight', 'change', 'growth_rate', 'PE', 'industry']
            this.$downloadExcel(table_data, props, keys, '全部持仓')
        }
    }
}
</script>

<style lang="scss" scoped>
.full-chart /deep/ .chart{
    height: 36px !important;
}
.zj-pagination{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 7px;
}
</style>