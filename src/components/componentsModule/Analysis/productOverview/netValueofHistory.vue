<template>
    <div class="netValueofHistory">
        <moduletitle :title="'历史净值'">
            <div class="timeframe" style="margin-right:8px">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker
                        ref="range"
                        type="year"
                        class="mr"
                        @change="changeDate"
                    />
                </keep-alive>
            </div>
            
        </moduletitle>
        <div class="content">
            <div :class="['table-contain',toggle_down ? 'div-height-auto' : 'div-height0']">
                <el-table
                    :data="tableData"
                    border
                    v-loading="isLoading"
                    style="width: 100%;transition: height 0.3s;"
                >
                    <el-table-column label="序号" type="index" width="50" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="EndDate" label="净值日期" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="unitnv_cumulative_nv" label="单位净值" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="accuunitnv_cumulative_nv" label="累计净值" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="complexnv_cumulative_nv" label="复权单位净值" align="center" :resizable="false"></el-table-column>
                    <el-table-column prop="complex_return" label="日收益率" align="center" :resizable="false">
                        <template slot-scope="scope">
                            <span
                                :class="scope.row.complex_return>0?'red': scope.row.complex_return<0 ? 'green': 'black'"
                            >{{scope.row.complex_return | toPercent}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="funcs">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        :disabled="ifpageDisabled"
                    ></el-pagination>
                </div>
            </div>
            <div
                class="unfold-block"
                @click="toggleTable"
                :style="toggle_down ? 'transform: translateY(0px);' : 'transform: translateY(-10px);'"
            >
                <span v-show="!toggle_down">
                    展开明细
                    <i class="el-icon-arrow-down"></i>
                </span>
                <span v-show="toggle_down">
                    收起明细
                    <i class="el-icon-arrow-up"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>

import apiExportExcel from '@/utils/apiExportExcel'
import { push_request, getNvReturnTable } from '@/api/analysis'
import { toPercent } from '@/utils/analyze'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            toggle_down: false, //展开/收起
            tableData: [],
            currentPage: 1, //当前页
            total: 0, //总数
            pagesize: 10, //页容量
            isLoading: false,
            ifpageDisabled: false, //禁止分页
            start_date: '',
            end_date: ''
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        }
    },
    methods: {
        render() {
            this.$refs.range.init('one_year')
        },
        /**
         * 刷新
         */
        refreshChart() {
            this.render()
        },
        /**下载表格 */
        async handleExcel() {
            if (JSON.parse(JSON.stringify(this.tableData)).length === 0) {
                this.$message({
                    message: '该时段下暂无数据',
                    type: 'warning'
                })
            } else {
                try {
                    await apiExportExcel(
                        Object.assign(
                            {},
                            {
                                type: 'get_nv_return_table',
                                fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                                start_date: this.start_date,
                                end_date: this.end_date
                            }
                        ),
                        `${this.selectFundToAnalyze.name}历史净值`,
                        '/nvReturnTable/getNvReturnTable'
                    )
                } catch {}
            }
        },
        changeDate(value) {
            this.currentPage = 1
            this.getTableData()
        },
        async getTableData() {
            if (!this.$refs.range.start_date || !this.$refs.range.end_date) {
                this.ifpageDisabled = true
                this.$message.error('时段不能为空')
            } else {
                this.ifpageDisabled = false
                this.isLoading = true
                this.start_date = this.$refs.range.start_date
                this.end_date = this.$refs.range.end_date
                try {
                    const result = await push_request({
                        type: 'get_nv_return_table',
                        exec_type: 'sync',
                        fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                        start_date: this.$refs.range.start_date || '',
                        end_date: this.$refs.range.end_date || '',
                        pagenum: this.pagesize,
                        num: this.currentPage
                    })
                    this.result = JSON.stringify(result) == '{}' ? '' : result
                    this.handleResult()
                    // setTimeout(() => {
                    this.isLoading = false
                    // }, 200)
                } catch {
                    this.isLoading = false
                }
            }
        },
        handleResult() {
            if (this.result) {
                this.total = this.result.all_num
                let data = this.result.nv_return_table
                this.tableData = data.EndDate.map((item, index) => {
                    return {
                        EndDate: item.substr(0, 10),
                        unitnv_cumulative_nv: data.unitnv_cumulative_nv[index].toFixed(4),
                        accuunitnv_cumulative_nv: data.accuunitnv_cumulative_nv[index].toFixed(4),
                        complexnv_cumulative_nv: data.complexnv_cumulative_nv[index].toFixed(4),
                        complex_return: data.complex_return[index]
                    }
                })
            } else {
                this.tableData = []
                this.total = 0
            }
        },
        //展开收起
        toggleTable() {
            setTimeout(() => {
                this.toggle_down = !this.toggle_down
                if (this.toggle_down) {
                    // 页面向上滑动
                    // let pageoffset = window.pageYOffset
                    // setTimeout(() => {
                    //     // window.scrollTo(0, pageoffset + 500)
                    // }, 350)
                    this.$emit('WrapScroll',this.toggle_down)
                }
            }, 200)
        },
        handleSizeChange(val) {
            this.pagesize = val
            this.getTableData()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getTableData()
        }
    }
}
</script>

<style lang="scss" scoped>
.div-height0 {
    max-height: 0px;
}
.table-height0 {
    height: 0px;
}
.div-height-auto {
    max-height: 2100px;
}
.table--height-auto {
    height: 2050px;
}
.translate0 {
    transform: translateY(-2px);
}
.translate-30 {
    transform: translateY(-34px);
}
.red {
    color: #fd484c;
}
.green {
    color: #50c75a;
}
.black {
    color: #333;
}
.netValueofHistory {
    background-color: #ffffff;
    .content {
        padding: 10px 0;
        .table-contain {
            width: 100%;
            overflow: hidden;
            padding: 5px 16px 10px 16px;
            transition: max-height 0.3s;
        }
        //展开按钮
        .unfold-block {
            width: 100%;
            height: 50px;
            cursor: pointer;
            color: #4e7cee;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #ffffff;
            transform: translateY(0px);
            transition: all 0.3s;
            &:hover {
                background: rgba($color: rgb(240, 239, 239), $alpha: 1);
            }
        }
        //底部分页功能
        .funcs {
            margin-top: 15px;
            /deep/ .el-pagination {
                display: flex;
                justify-content: flex-end;
                position: relative;
            }
            /deep/ .el-pagination__total {
                position: absolute;
                left: 0;
            }
        }
    }
    /deep/ .el-table--border td {
        border-right: none;
    }
}
</style>