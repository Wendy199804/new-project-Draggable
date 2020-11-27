<template>
    <div>
        <moduletitle title="区间收益" type="manager">
            
        </moduletitle>
        <div class="content">
            <el-table :data="tableData" ref="table" v-loading="isLoading" style="width: 100%" class="table2">
                <!-- 展开内容 -->
                <el-table-column type="expand" width="20">
                    <template>
                        <div :style="{ height: childrenlen <= 6 ? `${40 * childrenlen - 1}px` : `239px`, width: '100%' }">
                            <el-scrollbar style="height: 100%">
                                <el-table :data="childlist" style="width: 100%" :show-header="false">
                                    <el-table-column prop="" label="" width="20" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="title" label="" :width="header ? 120 : 350" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.innerCode" class="highlight" @click="toFundDetail(scope.row.innerCode)">
                                                {{ scope.row.title }}
                                            </span>
                                            <span v-else>{{ scope.row.title }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column v-for="item in thead" :key="item.value" :prop="item.value" :label="item.label" align="center">
                                        <template slot-scope="scope">
                                            <div :class="[ parseFloat(scope.row[item.value]) > 0 ? 'color-red': parseFloat(scope.row[item.value]) ? 'color-green': 'color-black']">
                                                {{ scope.row[item.value] | toPercent }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-scrollbar>
                        </div>
                    </template>
                </el-table-column>
                <!-- 展开内容结束 -->
                <el-table-column prop="title" label="" :width="header ? 120 : 350" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="cursor: pointer;" @click="enpandRow(tableData[0])">{{ scope.row.title }}</div>
                    </template>
                </el-table-column>
                <el-table-column v-for="item in thead" :key="item.value" :prop="item.value" :label="item.label" align="center">
                    <template slot-scope="scope">
                        <div :class="[parseFloat(scope.row[item.value]) > 0? 'color-red': parseFloat(scope.row[item.value])? 'color-green': 'color-black']">
                            {{ scope.row[`${item.value}_show`] }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getRangeReturn } from '@/api/manager'
import { mapGetters } from 'vuex'
import { toPercent } from '@/utils/analyze'

export default {
    props: ['header'],
    data() {
        return {
            theadOptions: [
                { value: 'intervalReturn0', label: '今年以来' },
                { value: 'intervalReturn0p25', label: '近1周' },
                { value: 'intervalReturn1', label: '近1月' },
                { value: 'intervalReturn3', label: '近3月' },
                { value: 'intervalReturn6', label: '近6月' },
                { value: 'intervalReturn12', label: '近1年' },
                { value: 'intervalReturn36', label: '近3年' },
                { value: 'intervalReturn60', label: '近5年' }
            ],
            tableData: [],
            childrenlen: 0,
            childlist: [],
            isLoading: false
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),
        thead() {
            if (!this.header) return this.theadOptions
            return this.theadOptions.filter(item => this.header.includes(item.label))
        }
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        }
    },
    methods: {
        render() {
            this.getData()
        },
        getData() {
            this.isLoading = true
            getRangeReturn({ personalCode: this.managerInfo.id }).then(res => {
                this.tableData = res.map((item, index) => {
                    let obj = item
                    obj.id = `${index}`
                    obj.title = item.chiNameAbbr || item.manager
                    this.updateDataProps(item)

                    item.childrenList && (this.childlist = item.childrenList.map((item2, index2) => {
                        item2.title = item2.chiNameAbbr
                        item2.id = `${index}-${index2}`
                        this.updateDataProps(item2)
                        this.childrenlen = item.childrenList.length
                        return item2
                    }))
                    return obj
                })
                this.$nextTick(()=>{ this.enpandRow(this.tableData[0]) })
                this.isLoading = false
            }).catch(()=>{this.isLoading = false})
        },
        // 处理为显示/下载的数据格式
        updateDataProps(obj) {
            this.thead.forEach(col => {
                obj[`${col.value}_show`] = toPercent(obj[col.value])
            })
        },
        enpandRow(row) {
            this.$refs.table.toggleRowExpansion(row)
        },
        toFundDetail(innercode) {
            this.$routeOpen({name: 'Analysis',query: {innercode}})
        },
        handleExcel() {
            let table_data = [this.tableData[0], ...this.childlist, this.tableData[1]],
                props = ['', ...this.thead.map(item => item.label)],
                keys = ['title', ...this.thead.map(item => `${item.value}_show`)]
            this.$downloadExcel(table_data, props, keys, '区间收益')
        }
    }
}
</script>


<style lang="scss" scoped>
.content {
    padding: 16px;
    background: #fff;
    height: calc(100% - 52px);
}
/deep/ .el-table--border td:first-child .cell {
    padding-left: 33px;
}
/deep/ .el-table__expand-icon {
    position: absolute;
    left: 10px;
    top: 9px;
}
/deep/ .el-table__indent,
/deep/ .el-table__placeholder {
    display: none;
}
/deep/ .el-table__body .el-table__row--level-1 {
    background: #8faefe0d;
}
.table2 {
    /deep/ tbody > tr:nth-child(2) .el-table__expand-icon,
    /deep/ tbody > tr:nth-child(3) .el-table__expand-icon {
        display: none;
    }
    /deep/ .el-table {
        border: none !important;
    }
    /deep/ .el-table td {
        background: #8faefe0d;
    }
    /deep/ .el-table__body {
        width: 100% !important;
    }
}
</style>