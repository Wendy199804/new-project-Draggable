<template>
    <div class="card">
        <div class="card-body">
            <div class="double divided">
                <div class="relative left">
                    <moduletitle
                        :tablist="tabList1"
                        :curtab="tabList1[activeTab1]"
                        @clickTab="(index) => {activeTab1 = index, getRatingData()}"
                    >
                        <div v-show="activeTab1 == 0" class="benchmark">
                            <span>基金类型</span>
                            <el-select v-model="fund_type_value" size="mini" @change="getRatingData"> 
                                <el-option v-for="(item, index) in fundTypeOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <div v-show="activeTab1 == 1" class="benchmark">
                            <span>基金经理类型</span>
                            <el-select v-model="manager_type_value" size="mini" @change="getRatingData"> 
                                <el-option v-for="(item, index) in managerTypeOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <div>
                            <svg-icon icon-class="excel" @click="handleExcel1"></svg-icon>
                            <svg-icon icon-class="reload" @click="leftRender"></svg-icon>
                        </div>
                    </moduletitle>
                    <div class="table-group relative">
                        <div class="rate-table">
                            <el-table :data="weightData">
                                <el-table-column label="智君星级">
                                    <template slot-scope="scope">
                                        <span v-if="!ratings[scope.$index]">暂无星级</span>
                                        <el-rate v-else
                                            v-model="ratings[scope.$index]"
                                            disabled
                                            disabled-void-color="#bfbfbf"
                                            :colors="['#FF6673', '#FF6673', '#FF6673']"
                                        ></el-rate>
                                    </template>
                                </el-table-column>
                                <el-table-column :label="activeTab1 == 0 ? '占总规模比重' : '占总人数比重'" align="right">
                                    <template slot-scope="scope">
                                        {{weightData[scope.$index]}}%
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="rate-table without-border relative">
                            <el-table :data="weightData">
                                <el-table-column label="">
                                    <template slot-scope="scope">
                                        <div class="weight-bar"
                                            :style="`width: ${weightData[scope.$index] / Math.max(...weightData) * 100}%;`">
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="weightData.length" class="mark-line">
                                <div class="item mid">
                                    <span class="text">{{midLine}}%</span>
                                </div>
                                <div class="item max">
                                    <span class="text">{{maxLine}}%</span>
                                </div>
                            </div>
                        </div>
                        <vLoading :show="isLoading_l" />
                        <vNodata :show="!weightData.length && !isLoading_l" />
                    </div>
                </div>

                <div class="relative right">
                    <moduletitle
                        :tablist="tabList2"
                        :curtab="tabList2[activeTab2]"
                        @clickTab="(index) => {activeTab2 = index, getTableData()}"
                    >
                        <div class="benchmark">
                            <span>基金类型</span>
                            <el-select v-model="type_value" size="mini" @change="getTableData"> 
                                <el-option v-for="(item, index) in fundTypeOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <div>
                            <svg-icon icon-class="excel" @click="handleExcel2"></svg-icon>
                            <svg-icon icon-class="reload" @click="rightRender"></svg-icon>
                        </div>
                    </moduletitle>
                    <div style="padding: 16px;">
                        <el-table :data="tableData" v-loading="isLoading_r">
                            <el-table-column label="基金名称" prop="name" width="150" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <router-link
                                    :to="{ name: 'Analysis', query: { innercode: scope.row.code } }"
                                    target="_blank"
                                    style="color: #4e7cee; font-size: 14px"
                                    >{{ scope.row.name }}</router-link
                                >
                            </template>
                            </el-table-column>
                            <el-table-column label="基金星级" prop="star" align="center" class-name="star-col">
                                <template slot-scope="scope">
                                    <el-rate
                                        v-model="scope.row.star"
                                        disabled
                                        disabled-void-color="#bfbfbf"
                                        :colors="['#555', '#555', '#555']">
                                    </el-rate>
                                </template>
                            </el-table-column>
                            <el-table-column label="年化收益率(近3年)" prop="annualReturn" width="96" align="center">
                                <template slot-scope="scope">
                                    <div :class="scope.row.annualReturn > 0 ? 'color-red' : (scope.row.annualReturn < 0 ? 'color-green' : '')">
                                        {{scope.row.annualReturn}}<span v-if="scope.row.annualReturn !== '--'">%</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="收益率(近3年)" prop="intervalReturn" width="74" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.intervalReturn}}<span v-if="scope.row.intervalReturn !== '--'">%</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="最大回撤(近3年)" prop="maxDrawdown" width="84" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.maxDrawdown}}<span v-if="scope.row.maxDrawdown !== '--'">%</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="申赎状态" prop="status" align="center" width="110"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyFundsRating, getCompanyManagersRating, getCompanyRatedFunds } from '@/api/analysis'

export default {
    data() {
        return {
            tabList1: [
                {name: '基金星级分布', id: 0},
                {name: '基金经理星级分布', id: 1}
            ],
            activeTab1: 0,
            fundTypeOptions: [
                {label: '不限', value: ''},
                {label: '股票型', value: '股票型'},
                {label: '混合型', value: '混合型'},
                {label: '债券型', value: '债券型'},
                {label: '指数型', value: '指数型'}
            ],
            fund_type_value: '',
            managerTypeOptions: [
                {label: '不限', value: ''},
                {label: '权益类', value: '1'},
                {label: '债券类', value: '2'},
                {label: '指数类', value: '3'},
            ],
            manager_type_value: '',
            isLoading_l: false,
            ratings: [5, 4, 3, 2, 1],
            weightData: [],

            tabList2: [
                {name: '高星级基金', id: 'desc'},
                {name: '低星级基金', id: 'asc'}
            ],
            activeTab2: 0,
            type_value: '',
            isLoading_r: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        maxLine() {
            return Math.max(...this.weightData).toFixed(0)
        },
        midLine() {
            return (this.maxLine / 2).toFixed(0)
        }
    },
    methods: {
        render() {
            this.leftRender()
            this.rightRender()
        },
        leftRender() {
            this.fund_type_value = ''
            this.manager_type_value = ''
            this.getRatingData()
        },
        rightRender() {
            this.type_value = ''
            this.getTableData()
        },

        async getRatingData() {
            this.isLoading_l = true
            let param = { innerCode: this.selectFundToAnalyze.innercode }
            this.activeTab1 == 0 && (param.firstClassType = this.fund_type_value)
            this.activeTab1 == 1 && (param.managerType = this.manager_type_value)
            let res = this.activeTab1 == 0
                ? await getCompanyFundsRating(param)
                : await getCompanyManagersRating(param)
            this.isLoading_l = false
            if (!res || JSON.stringify(res) == '{}') {
                this.weightData = []
                return
            }
            this.weightData = [5, 4, 3, 2, 1, 0].map(i => (res[i].nv * 100).toFixed(0))
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        async getTableData() {
            this.isLoading_r = true
            const res = await getCompanyRatedFunds({
                innerCode: this.selectFundToAnalyze.innercode,
                orderCondition: this.tabList2[this.activeTab2].id,
                firstClassType: this.type_value
            })
            this.isLoading_r = false
            this.tableData = res.map(item => {
                return {
                    code: item.innerCode,
                    name: item.chiNameAbbr,
                    star: item.fundStars,
                    annualReturn: this.formatData(item.annualReturn36),
                    intervalReturn: this.formatData(item.intervalReturn36),
                    maxDrawdown: this.formatData(item.maximumDrawdown36),
                    status: `${item.applyingType || '--'} | ${item.redeemType || '--'}`
                }
            })
        },
        formatData(data) {
            if (data === 0) return 0
            if (!data) return '--'
            return (data * 100).toFixed(2)
        },
        
        /**
         * 导出Excel
         */
        handleExcel1() {
            let table_data = [5, 4, 3, 2, 1, 0].map((item, index) => {
                return {
                    star: `${item > 0 ? item+'星' : '暂无星级'}`,
                    weight: this.weightData[index]
                }
            }),
                props = ['智君星级', '占总规模比重(%)'],
                keys = ['star', 'weight']
            this.$downloadExcel(table_data, props, keys, this.tabList1[this.activeTab1].name)
        },
        handleExcel2() {
            let table_data = this.tableData,
                props = ['基金名称', '基金星级', '年化收益率', '收益率(近3年)', '最大回撤(近3年)', '申赎状态'],
                keys = ['name', 'star', 'annualReturn', 'intervalReturn', 'maxDrawdown', 'status']
            this.$downloadExcel(table_data, props, keys, this.tabList2[this.activeTab2].name)
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    background: transparent !important;
    .card-body{
        padding: 0 !important;
    }
}
.table-group{
    overflow: hidden;
    padding-bottom: 30px;
}
.rate-table{
    width: 50%;
    float: left;
    /deep/ .el-table{
        border: 0 !important;
        thead th{
            background: none !important;
            padding: 0 16px !important;
            color: #333 !important;
            font-weight: bold !important;
        }
        &::before{
            background-color: transparent;
        }
        td{
            height: 36px !important;
            line-height: 36px !important;
            padding: 0 16px !important;
        }
        .cell{
            padding-left: 0;
            padding-right: 0;
        }
    }
    &.without-border /deep/ .el-table{
        thead th{
            border-bottom: 0;
        }
        td{
            border-bottom: 0;
        }
    }
}
.weight-bar{
    height: 26px;
    background: #8FAEFE;
}
.mark-line{
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    top: 40px;
    right: 0;
    .item{
        position: absolute;
        width: 1px;
        height: 100%;
        background: #ddd;
        &.mid{
            left: 50%;
        }
        &.max{
            right: 15px;
        }
        .text{
            position: absolute;
            bottom: -20px;
            right: -14px;
            font-size: 13px;
            color: #666;
        }
    }
}

/deep/ .el-table{
    .color-red{
        color: #FD484C
    }
    .color-green{
        color: #50C75A;
    }
    .star-col{
        .cell{
            padding-left: 0;
            padding-right: 0;
            .el-rate__icon{
                margin-right: 0
            }
        }
    }
}
</style>