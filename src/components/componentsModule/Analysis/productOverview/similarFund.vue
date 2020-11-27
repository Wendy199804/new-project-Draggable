<template>
    <div class="wrap">
        <moduletitle title="相似基金">
            
        </moduletitle>
        <div class="content">
            <el-table :data="tableData" style="width: 100%" v-loading="isLoading">
                <el-table-column prop="name" label="基金名称" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <router-link
                            :to="{ name: 'Analysis', query: { innercode: scope.row.innercode } }"
                            target="_blank"
                            style="color: #4e7cee; font-size: 14px"
                            >{{ scope.row.name }}</router-link
                        >
                    </template>
                </el-table-column>
                <el-table-column prop="star" label="基金星级" align="center" width="110">
                    <template slot-scope="scope">
                        <div>
                            <el-rate v-if="scope.row.star" v-model="scope.row.star" disabled disabled-void-color="#bfbfbf" :colors="['#555', '#555', '#555']"> </el-rate>
                            <span v-else>- -</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="num1" label="年化收益率" align="center" width="80">
                    <template slot-scope="scope">
                        <div :class="Number(scope.row.num1) > 0 ? 'color-red' : Number(scope.row.num1) < 0 ? 'color-green' : 'color-black'">
                            {{ scope.row.num1 | toPercent }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="num2" label="年化波动率" align="center" width="80">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.num2 | toPercent }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="num3" label="最大回撤" align="center" width="70">
                    <template slot-scope="scope">
                        <div>
                            {{ scope.row.num3 | toPercent }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="申赎状态" width="140" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.purchase }} | {{ scope.row.redemption }}</div>
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

export default {
    data() {
        return {
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
        handleExcel() {
            let table_data = JSON.parse(JSON.stringify(this.tableData)).map(item => {
                item.purchase = `${item.purchase} | ${item.redemption}`
                return item
            }),
            props = ['基金名称', '基金星级', '年化收益率', '年化波动率', '最大回撤', '申赎状态'].map(item => {
                return {
                    name: item,
                    style: item == '基金名称' ? 'left' : 'right'
                }
            }),
                keys = ['name', 'star', 'num1', 'num2', 'num3', 'purchase'],
                name = '相似基金'

            this.$downloadExcel(table_data, props, keys, name)
        },
        getData() {
            this.isLoading = true
            push_request({
                type: 'find_similar_funds',
                fund_code: this.selectFundToAnalyze.innercode
            }).then(res => {
                let tableData = res.SecuCode.map((code, index) => {
                    return {
                        name: res.ChiNameAbbr[index]===this.selectFundToAnalyze.name?'本基金':res.ChiNameAbbr[index],
                        innercode: res.InnerCode[index],
                        star: Number(res.stars[index]),
                        num1: res.annual_return[index] || '- -',
                        num2: res.volatility[index] || '- -',
                        num3: res.maximum_drawdown[index] || '- -',
                        purchase: res.ApplyingType[index] || '- -', // 申购状态
                        redemption: res.RedeemType[index] || '- -' // 赎回状态
                    }
                })
                this.tableData = tableData
                this.isLoading = false
            }).catch(err=>{this.isLoading = false})
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    background-color: #ffffff;
    .content {
        padding: 16px;
    }
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50c75a;
    }
    .color-black {
        color: #333;
    }
    /deep/ .el-rate__icon {
        margin-right: 0;
    }
    /deep/ .el-table th>.cell {
    padding-left: 5px;
    padding-right: 5px;
    }
}
</style>