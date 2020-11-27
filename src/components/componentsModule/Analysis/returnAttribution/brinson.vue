<template>
    <div class="card">
        <moduletitle
            title="Brinson归因"
            :tablist="tabList"
            :secondary="true"
            :isright="true"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        >
            <div class="benchmark">
                <span>基准</span>
                <el-select v-model="index_value" size="mini" class="mr" @change="getBrinsonData">
                    <el-option v-for="(item, index) in indexOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div>
                <span>行业</span>
                <el-select v-model="industry_value" placeholder="请选择" size="mini" class="mr" style="width: 130px;" @change="getBrinsonData">
                    <el-option v-for="(item, index) in industryOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    type="year"
                    ref="range" @change="getBrinsonData"
                />
            </div>
            
        </moduletitle>

        <div class="card-body" data-reportFlag="true">
            <div class="card-table" data-reportFlag="long">
                <el-table v-if="!tableData.length"
                    :data="tableData"
                    v-loading="isLoading"
                >
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column
                        v-for="(item, index) in Object.keys(tableHeader)" :key="index"
                        :label="tableHeader[item]" align="center">
                    </el-table-column>
                </el-table>
                <el-table v-else
                    :data="tableData"
                    v-loading="isLoading"
                    max-height="480"
                >
                    <el-table-column type="index" label="序号" align="center">
                        <el-table-column label="" width="50" align="center">
                            <template slot-scope="scope" v-if="!scope.row.isSummary">
                                {{scope.row.index}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        v-for="(item, index) in Object.keys(tableHeader)" :key="index"
                        :label="tableHeader[item]" align="center">
                        <el-table-column :label="`${summary[item]}`" :prop="item" align="center">
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { industryOptions } from '@/utils/benchmark';
import { push_request } from '@/api/analysis';

export default {
    data() {
        return {
            tabList: [
                {name: '前十大重仓股', id: 'top10'},
                {name: '全部持仓', id: 'all'}
            ],
            activeTab: 0,
            indexOptions: [
                {label: '沪深300', value: '000300'},
                {label: '上证50', value: '000016'},
                {label: '中证100', value: '000903'},
                {label: '深证100', value: '399330'},
                {label: '上证180', value: '000010'},
                {label: '中证500', value: '000905'},
                {label: '中证800', value: '000906'},
                {label: '上证综指', value: '000001'},
                {label: '深证成指', value: '399001'},
                {label: '创业板指', value: '399006'},
                {label: '中小板指', value: '399005'}
            ],
            index_value: '',
            industryOptions: industryOptions,
            industry_value: '',

            tableHeader: {
                'Industry': '行业',
                'excess_effect': '超额收益',
                'allocation_effect': '配置效应',
                'selection_effect': '选股效应',
                // 'cross_effect': '交互效应',
            },
            isLoading: false,
            tableData: [],
            summary: {}
        }
    },
    computed: {
        ...mapGetters([
            'selectFundToAnalyze'
        ])
    },
    methods: {
        render() {
            this.index_value = '000300'
            this.industry_value = 'zz'
            this.$refs.range.init('one_year')
        },
        async getBrinsonData() {
            this.isLoading = true
            const res = await push_request({
                type: 'fund_multi_brinson',
                fund_innercode: this.selectFundToAnalyze.innercode,
                index_code: this.index_value,
                start_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date,
                industry_standard: this.industry_value,
                port_type: this.tabList[this.activeTab].id
            })
            this.isLoading = false
            if (!res || !res.Industry) {
                this.tableData = []
                return
            }
            let list = res.Industry.map((item, index) => {
                let obj = { index }
                Object.keys(this.tableHeader).forEach(key => {
                    obj[key] = this.manageData(res[key][index])
                })
                if (item == '合计') {
                    obj.isSummary = true
                    obj.index = ''
                }
                return obj
            })
            this.summary = list.shift()
            // this.tableData = [...list, summary]
            this.tableData = list
        },
        manageData(data) {
            if (typeof(data) == 'string') return data
            if (data === 0) return '0%'
            if (!data) return '--'
            return Math.round(data * 10000)/100 + '%'
        },


        /**
         * 下载Excel
         */
        handleExcel() {
            let table_data = [this.summary, ...this.tableData],
                props = ['序号', ...Object.keys(this.tableHeader).map(key => this.tableHeader[key])],
                keys = ['index', ...Object.keys(this.tableHeader)]
            this.$downloadExcel(table_data, props, keys, 'Brinson归因')
        }
    }
}
</script>

<style lang="scss" scoped>
.card-table /deep/ .el-table{
    thead tr:nth-child(2){
        th{
            font-weight: bold;
        }
    }
}
</style>