<template>
    <div class="wrap">
        <moduletitle title="同公司基金">
            
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
                            <el-rate v-if="scope.row.star" v-model="scope.row.star" disabled disabled-void-color="#bfbfbf" :colors="['#555', '#555', '#555']">
                            </el-rate>
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

import { getCompanyRatedFunds } from '@/api/analysis'
import { mapGetters } from 'vuex'
import { toPercent } from '@/utils/analyze'

export default {
    data() {
        return {
            tableData: [],
            isLoading:false
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
                name = '同公司基金'

            this.$downloadExcel(table_data, props, keys, name)
        },
        getData() {
            this.isLoading = true
            getCompanyRatedFunds({ innerCode: this.selectFundToAnalyze.innercode, orderCondition: 'desc' }).then(res => {
                let result = res.map((item, index) => {
                    return {
                        name: item.chiNameAbbr,
                        star: item.fundStars,
                        innercode: item.innerCode,
                        num1: item.annualReturn36 || '- -',
                        num2: item.volatility36 || '- -',
                        num3: item.maximumDrawdown36 || '- -',
                        purchase: item.applyingType || '- -',
                        redemption: item.redeemType || '- -'
                    }
                })
                this.tableData = result
                this.isLoading = false
            }).catch(err=>{this.isLoading = false})
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    background-color: #ffffff;
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
    }
    // .name {
    //     display: inline-block;
    //     white-space: nowrap;
    //     width: 100px;
    //     overflow: hidden;
    //     text-overflow: ellipsis;
    // }
    /deep/ .el-rate__icon {
        margin-right: 0;
    }
    /deep/ .el-table th>.cell {
    padding-left: 5px;
    padding-right: 5px;
    }
}
</style>