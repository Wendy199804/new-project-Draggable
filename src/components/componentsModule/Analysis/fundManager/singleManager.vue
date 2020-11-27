<template>
    <div class="double">
        <div class="relative left-content">
            <div class="manager-item">
                <div class="manager-item-photo">
                    <div v-if="manager.personalData">
                        <img :src="`data:image/png;base64,${manager.personalData}`" />
                    </div>
                    <div v-else class="no-photo">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </div>
                <div>
                    <div class="manager-name" @click="handleClickManager(manager.personalCode)">{{ manager.name }}</div>
                    <div>
                        <el-form label-position="right" label-width="70px">
                            <el-form-item label="智君星级 :">
                                <div class="manager-rate">
                                    <span v-if="manager.period3Stars">
                                        3年
                                        <el-rate
                                            v-model="manager.period3Stars"
                                            disabled
                                            disabled-void-color="#bfbfbf"
                                            :colors="['#FF6673', '#FF6673', '#FF6673']"
                                        >
                                        </el-rate>
                                    </span>
                                    <span v-else>暂无星级</span>
                                    <span v-if="manager.period5Stars">
                                        5年
                                        <el-rate
                                            v-model="manager.period5Stars"
                                            disabled
                                            disabled-void-color="#bfbfbf"
                                            :colors="['#FF7952', '#FF7952', '#FF7952']"
                                        >
                                        </el-rate>
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="任职回报 :">
                                <span :class="manager.performance > 0 ? 'color-red' : manager.performance < 0 ? 'color-green' : ''">
                                    {{ manager.performance | toPercent }}
                                </span>
                            </el-form-item>
                            <el-form-item label="任职时间 :">
                                <span>{{ manager.accessionDate }} 至今</span>
                            </el-form-item>
                            <el-form-item label="个人经历 :">
                                <p class="desc">{{ manager.background }}</p>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative">
            <moduletitle
                :secondary="true"
                :hasborder="false"
                :tablist="tabList"
                :curtab="tabList[activeTab]"
                @clickTab="
                    index => {
                        activeTab = index
                    }
                "
            >
                <div v-show="activeTab == 0" class="benchmark">
                    <span>基准</span>
                    <el-cascader
                        style="width: 140px"
                        size="mini"
                        v-model="index_value"
                        :options="indexOptions"
                        :props="{ expandTrigger: 'hover' }"
                        @change="getChartData"
                    ></el-cascader>
                </div>
                <div v-show="activeTab == 0" class="timeframe">
                    <span>时段</span>
                    <el-select v-model="timerangeValue" placeholder="请选择" @change="getChartData">
                        <el-option v-for="(item, index) in timerangeOptions" :key="index" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                    <!-- <vDateRangePicker
                        ref="range"
                        type="year"
                        use="manager"
                        :config="['custom']"
                        @change="getChartData"
                    /> -->
                </div>
                <div v-show="activeTab == 1" class="benchmark">
                    <span>类型</span>
                    <el-select size="mini" v-model="type_value" @change="filterFundList">
                        <el-option v-for="(item, index) in typeOptions" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </div>
            </moduletitle>
            <div v-show="activeTab == 0" class="relative" :id="`singleManager${manager.personalCode}`">
                <vHalfChart ref="chart" type="line" grid="grid_r" :legend="legend" :xData="xData" :seriesData="seriesData" :isPct="true" />
                <vLoading :show="isLoading" />
                <vNodata :show="!seriesData && !isLoading" />
            </div>
            <div v-show="activeTab == 1" style="padding-left: 16px">
                <el-table :data="tableData" v-loading="isLoading" max-height="322">
                    <el-table-column label="基金代码" prop="code" align="center"></el-table-column>
                    <el-table-column label="基金名称" prop="name" width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <router-link
                                :to="{ name: 'Analysis', query: { innercode: scope.row.innercode } }"
                                target="_blank"
                                style="color: #4e7cee; font-size: 14px"
                                >{{ scope.row.name }}</router-link
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="基金类型" prop="type" align="center"></el-table-column>
                    <el-table-column label="任职开始日期" prop="startDate" align="center"></el-table-column>
                    <el-table-column label="任职结束日期" prop="endDate" align="center"></el-table-column>
                    <el-table-column label="任职期收益率" prop="duringReturn" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.duringReturn == '--'">--</span>
                            <span v-else :class="scope.row.duringReturn > 0 ? 'color-red' : scope.row.duringReturn < 0 ? 'color-green' : ''">
                                {{ scope.row.duringReturn }}%
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { push_request } from '@/api/analysis'
import { getFundList } from '@/api/manager'
import { toPercent } from '@/utils/analyze'

export default {
    props: ['manager'],
    data() {
        return {
            tabList: [
                { name: '基金经理指数', id: 0 },
                { name: '旗下基金业绩', id: 1 }
            ],
            activeTab: 0,
            isLoading: false,

            indexOptions: allBenchmark,
            index_value: ['1', '000300'],
            typeOptions: ['全部', 'ETF联接', 'FOF', 'QDII', '债券型', '指数型', '混合型', '理财型', '股票型', '货币型'],
            type_value: '全部',

            legend: [],
            xData: [],
            seriesData: null,
            timerangeOptions: [],
            timerangeValue: '',
            timerangeList: {
                since_founded: '成立以来',
                year_start: '今年以来',
                three_months: '最近3月',
                six_months: '最近6月',
                one_year: '最近1年',
                three_years: '最近3年',
                five_years: '最近5年'
            },

            tableData: []
        }
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        index_name() {
            return getIndexName(this.index_value[1])
        }
    },
    methods: {
        render() {
            this.activeTab = 0
            this.getrangeTime()
            this.getTableData()
        },
        getrangeTime() {
            push_request({
                type: 'manager_index_curve_time_period',
                personal_id: this.manager.personalCode,
                manager_type: this.getManagerType()
            }).then(res => {
                let data = res
                let options = data.period_name.map((item, index) => {
                    let value = `${data.start_date[index].substr(0, 10)} ${data.end_date[index].substr(0, 10)} ${item}`
                    item === 'three_years' ? (this.timerangeValue = value) : ''
                    return { label: this.timerangeList[item], value: value }
                })
                this.timerangeOptions = options
                this.getChartData()
            })
        },

        async getChartData() {
            let managerType = this.getManagerType()
            if (managerType === 0) {
                this.seriesData = null
                // this.activeTab = 1
                return
            }
            this.isLoading = true
            const res = await push_request({
                type: 'manager_index_curve',
                personal_id: this.manager.personalCode,
                index_code: this.index_value[1],
                begin: this.timerangeValue.split(' ')[0],
                end: this.timerangeValue.split(' ')[1],
                manager_type: managerType
            })
            this.isLoading = false
            this.legend = [this.manager.name, this.index_name]
            this.xData = res.TradingDay.map(item => item.slice(0, 10))
            this.seriesData = [res.manager_index, res.base]
            this.draw('chart')
        },
        getManagerType() {
            let type
            switch (this.selectFundToAnalyze.firsttypeChi) {
                case '股票型':
                    type = 1
                    break
                case '混合型':
                    type = 1
                    break
                case '债券型':
                    type = 2
                    break
                case '指数型':
                    type = 3
                    break
                default:
                    type = 0
            }
            return type
        },
        draw(refName) {
            this.$nextTick(() => {
                if (!this.$refs[refName]) return
                this.$refs[refName].drawChart()
            })
        },

        async getTableData() {
            const res = await getFundList({
                personalCode: this.manager.personalCode
            })
            this.result = res
                .map(item => {
                    return {
                        name: item.chiNameAbbr,
                        code: item.secuCode,
                        innercode: item.innerCode,
                        type: item.firstClassType,
                        startDate: item.accessionDate ? item.accessionDate.slice(0, 10) : '--',
                        endDate: !item.dimissionDate ? '至今' : item.dimissionDate.slice(0, 10),
                        duringReturn: this.formatData(item.performance),
                        sortBy: new Date(item.accessionDate).getTime()
                    }
                })
                .sort((a, b) => a.sortBy - b.sortBy)
            this.typeOptions = this.typeOptions.filter(option => {
                let i = this.result.findIndex(item => item.type == option)
                return i >= 0 || option == '全部'
            })
            this.filterFundList()
        },
        filterFundList() {
            // 只显示在管基金
            let arr = this.result.filter(item => item.endDate == '至今')
            this.tableData = this.type_value == '全部' ? arr : arr.filter(item => item.type == this.type_value)
        },
        formatData(data) {
            if (data === 0) return 0
            if (!data) return '--'
            return (data * 100).toFixed(2)
        },
        handleClickManager(id) {
            this.$routeOpen({ name: 'Manager', query: { id } })
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [{ id: `singleManager${this.manager.personalCode}`, imgName: '基金经理指数' }]
            this.$downloadImg(list)
        },
        /**
         * 导出Excel
         */
        handleExcel() {
            let table_data = this.tableData,
                props = ['基金代码', '基金名称', '基金类型', '任职开始日期', '任职结束日期', '任职期收益率(%)'],
                keys = ['code', 'name', 'type', 'startDate', 'endDate', 'duringReturn']
            this.$downloadExcel(table_data, props, keys, '旗下基金业绩')
        }
    }
}
</script>

<style lang="scss" scoped>
.color-red {
    color: #ff6673;
}
.color-green {
    color: #50c75a;
}

.left-content {
    min-height: 366px;
    /deep/ .el-form-item {
        margin-bottom: 0;
        .el-form-item__label,
        .el-form-item__content {
            // height: 26px;
            line-height: 26px;
            text-align: left;
            font-size: 13px;
        }
        .el-form-item__label {
            color: #666;
            font-weight: normal;
            padding-right: 0;
        }
        .el-form-item__content {
            color: #333;
        }
        .desc {
            line-height: 24px;
            padding-right: 5%;
            margin-top: 3px;
            height: 260px;
            overflow-y: auto;
        }
    }
    /deep/ .el-rate {
        display: inline;
        .el-rate__item {
            vertical-align: text-bottom;
        }
        .el-rate__icon {
            margin-right: 2px;
        }
    }
}

.manager-item {
    display: grid;
    grid-template-columns: 100px auto;
    grid-column-gap: 16px;

    &:not(:last-child) {
        margin-bottom: 40px;
    }

    .manager-item-photo {
        width: 100%;
        height: 120px;
        & > div {
            width: 100%;
            height: 100%;
        }
        img {
            width: 100%;
            height: 100%;
        }
        .no-photo{
            border: 1px solid #ddd;
            color: #bfbfbf;
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .manager-name {
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        height: 26px;
        line-height: 22px;
        &:hover {
            color: #4e7cee;
        }
    }
}

/deep/ .title {
    height: 44px;
    align-items: flex-start;
    .timeframe .el-date-editor.el-input__inner {
        display: none;
    }
}
/deep/ .el-table {
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50c75a;
    }
}
</style>