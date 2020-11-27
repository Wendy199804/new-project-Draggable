<template>
    <div class="rotation-in-market">
        <moduletitle title="市场轮动表现">
            
        </moduletitle>
        <div class="content">
            <el-table v-loading="isLoading" :data="tableData" style="width: 100%" :default-sort="{ prop: '1', order: 'descending' }">
                <el-table-column prop="title" label="" width="180"> </el-table-column>
                <el-table-column prop="date" label="更新日期" align="center"></el-table-column>
                <el-table-column
                    v-for="item in timelist"
                    :key="item.value"
                    :prop="`real${item.value}`"
                    :label="item.label"
                    sortable
                    align="center"
                    :sort-orders="['descending', 'ascending', null]"
                >
                    <template slot-scope="scope">
                        <div :class="[scope.row[`${item.value}class`]]">
                            {{ scope.row[item.value] }}
                            <svg-icon class="tag" v-if="scope.row[`${item.value}show`]"
                                :icon-class="`tag-${scope.row[`${item.value}index`] < 3 ? 'top' : 'bottom'}`"
                            ></svg-icon>
                            <div class="num">{{ scope.row[`${item.value}show`] }}</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { push_request } from '@/api/analysis'
import { mapGetters } from 'vuex'
import { toPercent } from '@/utils/analyze'
import { getRotarionMarket } from '@/utils/benchmark'

export default {
    data() {
        return {
            timelist: [
                { value: '1', label: '近1月' },
                { value: '3', label: '近3月' },
                { value: '6', label: '近6月' },
                { value: '12', label: '近1年' },
                { value: '2020', label: '2020年' },
                { value: '2019', label: '2019年' },
                { value: '2018', label: '2018年' },
                { value: '2017', label: '2017年' }
            ],
            tableData: [],
            isLoading: false
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
            this.getData()
        },
        //数组降序
        arrSort(arr) {
            return [...arr].sort((a, b) => b - a)
        },
        getData() {
            let paramsarr = ['1', '3', '6', '12', '2020', '2019', '2018', '2017']
            this.isLoading = true
            push_request({ type: 'get_market_performance', exec_type: 'sync' })
                .then(res => {
                    let data = Object.assign({}, res)
                    let obj = {}
                    paramsarr.forEach((item, index) => {
                        obj[`arr${item}`] = this.arrSort(data[item]) //排好序的列数据
                    })
                    let tabledata = data['1'].map((item, index) => {
                        let nums = {},
                            classes = {}
                        paramsarr.forEach(item2 => {
                            nums[`real${item2}`] = data[item2][index]
                            nums[`${item2}`] = toPercent(data[item2][index])
                            let idx = obj[`arr${item2}`].indexOf(data[item2][index]),
                                count = obj[`arr${item2}`].length - idx
                            classes[`${item2}index`] = idx
                            classes[`${item2}show`] = idx < 3 ? (idx + 1) : (count < 4 ? count : '')
                            classes[`${item2}class`] = `rank rank${idx} ${idx < 3 ? 'high' : 'low'}`
                        })
                        nums.title = getRotarionMarket(data.code[index])
                        nums.date = data.EndDate[index].slice(0, 10)
                        return Object.assign(nums, classes)
                    })
                    this.tableData = tabledata
                    this.isLoading = false
                })
                .catch(() => {
                    this.isLoading = false
                })
        },
        handleExcel() {
            let keys = ['title', 'date', '1', '3', '6', '12', '2020', '2019', '2018', '2017'],
                props = [
                    ...['', '更新日期'],
                    ...this.timelist.map(item => item.label)
                ],
                name = '市场轮动表现'
            this.$downloadExcel(this.tableData, props, keys, name)
        }
    }
}
</script>

<style lang="scss" scoped>
.rotation-in-market {
    .content {
        padding: 16px;
        min-height: 100px;
    }
    /deep/ .el-table th > .cell,
    /deep/ .el-table tr > td:first-child {
        font-weight: 700;
    }
    /deep/ .el-table th {
        text-align: center;
    }

    .rank{
        .tag, .num{
            position: absolute;
            top: 8px;
            right: 8px;
            text-align: center;
        }
        .tag{ font-size: 24px; }
        .num{
            width: 24px;
            font-size: 12px;
            color: #fff;
        }
        &.high .num{
            line-height: 28px;
        }
        &.low .num{
            line-height: 20px;
        }
    }
    .rank0 .svg-icon {
        color:  #FF6673;
    }
    .rank1 .svg-icon {
        color:  #FF7A66;
    }
    .rank2 .svg-icon {
        color:  #FF8F66;
    }
    .rank8 .svg-icon {
        color:  #B3C750;
    }
    .rank9 .svg-icon {
        color:  #8CC750;
    }
    .rank10 .svg-icon {
        color:  #50C75A;
    }
}
</style>