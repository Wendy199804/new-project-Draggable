<template>
    <div class="wrap">
        <moduletitle title="收益风险指标">
            <div class="timeframe">
                <span>时段</span>
                <el-select v-model="timerange_value" placeholder="请选择" @change="getData">
                    <el-option v-for="item in timerange_options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </div>
            
        </moduletitle>
        <div class="content">
            <vNodata :show="tableData.length == 0" />
            <vLoading :show="isLoading" />
            <el-table v-loading="isLoading" :data="tableData" style="width: 100%">
                <el-table-column prop="type" width="120"> </el-table-column>
                <el-table-column
                    v-for="item in list"
                    :key="item.prop"
                    :prop="item.prop"
                    align="center"
                    :width="item.lable === '年化标准差' ? '110' : ''"
                >
                    <template slot="header">
                        {{ item.lable }}
                        <el-popover
                            ref="popover"
                            placement="right"
                            width="300"
                            trigger="hover"
                            propper-class="propper-box"
                            :content="getMarkText(item.lable)"
                        >
                            <span class="pointer" slot="reference">
                                <svg-icon icon-class="mark" />
                            </span>
                        </el-popover>
                    </template>
                    <template slot-scope="scope">
                        <div v-if="scope.row.type === '四分位排名'" class="four-rank">
                            <Waterrank :value="scope.row[item.prop]" class="water-rank" />
                        </div>
                        <div v-else-if="scope.row.type === '同类排名'">
                            {{ scope.row[item.prop] }}
                        </div>
                        <div v-else>
                            {{ scope.row[item.prop] }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <p style="color: #999">注：此处风险指标按原始频率，以沪深300为基准得出。</p>
        </div>
    </div>
</template>

<script>

import Waterrank from '@/components/localComponents/waterRank'
import { toPercent, getRank } from '@/utils/analyze'
import { push_request, getFundRiskIndicators } from '@/api/analysis'
import { mapGetters } from 'vuex'
import { getMarkText } from '@/utils/getMarkText'
import base from '@/mixins/base_index'

export default {
    mixins: [base],
    components: {
        Waterrank 
    },
    data() {
        return {
            isLoading: false,
            timerange_value: '12',
            timerange_options: [
                {
                    value: '0',
                    label: '今年以来'
                },
                {
                    value: '3',
                    label: '最近3月'
                },
                {
                    value: '6',
                    label: '最近6月'
                },
                {
                    value: '12',
                    label: '最近1年'
                },
                {
                    value: '36',
                    label: '最近3年'
                },
                {
                    value: '60',
                    label: '最近5年'
                }
            ],
            tableData: [],
            list: [
                {
                    lable: '阿尔法',
                    prop: 'alpha'
                },
                {
                    lable: '贝塔',
                    prop: 'beta'
                },
                {
                    lable: '最大回撤',
                    prop: 'maximumDrawdown'
                },
                {
                    lable: '年化标准差',
                    prop: 'volatility'
                },
                {
                    lable: '夏普比率',
                    prop: 'sharpe'
                }
            ]
        }
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.getData()
        },
        getMarkText(label) {
            return getMarkText(label)
        },
        handleExcel() {
            let table_data = JSON.parse(JSON.stringify(this.tableData)),
                props = ['', '阿尔法', '贝塔', '最大回撤', '年化标准差', '夏普比率'].map(item => {
                    return {
                        name: item,
                        style: item == '' ? 'left' : 'right'
                    }
                }),
                keys = ['type', 'alpha', 'beta', 'maximumDrawdown', 'volatility', 'sharpe'],
                name = '收益风险指标'
            for (let key in table_data[4]) {
                key == 'type' ? '' : (table_data[4][key] = getRank(table_data[4][key]))
            }
            this.$downloadExcel(table_data, props, keys, name)
        },
        getData() {
            this.isLoading = true
            this.tableData = []
            getFundRiskIndicators({ innerCode: this.selectFundToAnalyze.innercode, period: this.timerange_value })
                .then(res => {
                    let per_arr = ['同类排名', '四分位排名']
                    let typechi = this.selectFundToAnalyze.firsttypeChi
                    let result = res.map((item, index) => {
                        if (!per_arr.includes(item.type)) {
                            item = {
                                alpha: toPercent(item.alpha),
                                beta: (!item.beta&&item.beta!==0 ? '- -':Number(item.beta).toFixed(2)),
                                maximumDrawdown: toPercent(item.maximumDrawdown),
                                sharpe: !item.beta&&item.beta!==0 ? '- -': Number(item.sharpe).toFixed(2),
                                type: item.type,
                                volatility: toPercent(item.volatility)
                            }
                        }
                        // else
                        if (item.type === '同类排名') {
                            item = {
                                alpha: item.alpha.replace('/', '|')||'- -',
                                beta: item.beta.replace('/', '|')||'- -',
                                maximumDrawdown: item.maximumDrawdown.replace('/', '|')||'- -',
                                sharpe: item.sharpe.replace('/', '|')||'- -',
                                type: item.type,
                                volatility: item.volatility.replace('/', '|')||'- -'
                            }
                        }
                        if(!(typechi==='股票型'||typechi==='混合型')){
                            item.alpha = index === 4 ? '' : '- -'
                            item.beta = item.alpha
                        }
                        return item
                    })
                    this.tableData = result
                    this.isLoading = false
                })
                .catch(err => {
                    this.isLoading = false
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap {
    background-color: #ffffff;
    color: #333;
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50c75a;
    }
    .color-black {
        color: #333;
    }
    .content {
        padding: 16px;
        position: relative;
        height: calc(100% - 52px);
        & > p {
            margin-top: 16px;
        }
    }
    .inlinediv {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .four-rank{
        //四分位排名
        height: 98px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /deep/ .el-table .cell {
    line-height: 14px;
    }
}
</style>