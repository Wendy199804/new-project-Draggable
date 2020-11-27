<template>
    <div class="intervalReturn">
        <moduletitle :title="'区间收益'" type="manager">
            
        </moduletitle>
        <div class="content">
            <el-table v-loading="isLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="title" width="90"> </el-table-column>
                <el-table-column v-for="(item, index) in interval_list" :key="index" :prop="item" :label="intervals[item]" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.title === '四分位排名'" class="four-rank">
                            <Waterrank :value="scope.row[item]" class="water-rank" />
                        </div>
                        <div v-else-if="scope.row.title === '同类排名'">
                            {{ scope.row[item] || '- -' }}
                        </div>
                        <div v-else :class="[parseFloat(scope.row[item])>0 ? 'color-red':(parseFloat(scope.row[item])<0?'color-green':'color-black')]">
                            {{ scope.row[item] }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import Waterrank from '@/components/localComponents/waterRank'
import { toPercent, getRank } from '@/utils/analyze'

export default {
    components: {
        Waterrank
    },
    data() {
        return {
            isLoading: false,
            tableData: [],
            intervals: {
                one_month: '近1月',
                three_months: '近3月',
                six_months: '近6月',
                year_start: '今年以来',
                one_year: '近1年',
                three_years: '近3年'
            },
            interval_list: ['one_month', 'three_months', 'six_months', 'year_start', 'one_year', 'three_years']
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
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
            push_request({
                type: 'get_manager_interval_return', 
                exec_type: 'sync',
                personal_id: this.managerInfo.id,
                manager_type: this.managerInfo.type,
                index_code: '000300'
            })
            .then(res => {
                this.rows = {
                    manager_interval_returns: this.managerInfo.name,
                    'same type mean': '同类平均',
                    index_interval_returns: '沪深300',
                    quantile: '四分位排名',
                    rank: '同类排名'
                }
                let dateobj = {}
                let indexnum = res.intervals.map((item, index) => {
                    Object.assign(dateobj, { [item]: index })
                })
                let tabledata = Object.keys(res)
                    .filter(item => item !== 'intervals')
                    .map((item, index) => {
                        return item === 'quantile' || item === 'rank'
                            ? {
                                    title: this.rows[item],
                                    one_month: res[item][dateobj['one_month']],
                                    three_months: res[item][dateobj['three_months']],
                                    six_months: res[item][dateobj['six_months']],
                                    year_start: res[item][dateobj['year_start']],
                                    one_year: res[item][dateobj['one_year']],
                                    three_years: res[item][dateobj['three_years']]
                                }
                            : {
                                    title: this.rows[item],
                                    one_month: toPercent(res[item][dateobj['one_month']]),
                                    three_months: toPercent(res[item][dateobj['three_months']]),
                                    six_months: toPercent(res[item][dateobj['six_months']]),
                                    year_start: toPercent(res[item][dateobj['year_start']]),
                                    one_year: toPercent(res[item][dateobj['one_year']]),
                                    three_years: toPercent(res[item][dateobj['three_years']])
                                }
                    })
                this.tableData = [tabledata[4], tabledata[3], tabledata[0], tabledata[1], tabledata[2]]
                this.isLoading = false
            })
            .catch(() => {
                this.isLoading = false
            })
        },
        
        handleExcel() {
            let data_copy = JSON.parse(JSON.stringify(this.tableData))
            let table_data = data_copy.map((item, index) => {
                if (item.title == '四分位排名') {
                    this.interval_list.forEach(key => {
                        let level = item[key]
                        level > 0 && (item[key] = ['低', '较低', '较高', '高'][level - 1])
                    })
                }
                return item
            })
            let props = ['', ...this.interval_list.map(item => this.intervals[item])],
                keys = ['title', ...this.interval_list]
            this.$downloadExcel(table_data, props, keys, '区间收益')
        }
    }
}
</script>

<style lang="scss" scoped>
.intervalReturn {
    .content {
        padding: 16px;
        background: #ffffff;
        height: calc(100% - 52px);
    }
    .four-rank {
        height: 98px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>