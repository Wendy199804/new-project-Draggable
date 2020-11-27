<template>
    <div class="card">
        <moduletitle
            type="manager"
            :tablist="tabList"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, filterFundList()}"
        >
            <div class="benchmark">
                <span>基金类型</span>
                <el-select v-model="type_value" size="mini" @change="filterFundList">
                    <el-option v-for="(item, index) in typeOptions" :key="index"
                        :lable="item" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body">
            <el-table :data="tableData" v-loading="isLoading" max-height="400">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="code" label="基金代码" width="80" align="center">
                    <template slot-scope="scope">
                        <span class="highlight" @click="toFundDetail(scope.row.innercode)">
                            {{scope.row.code}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="基金简称" width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="highlight" @click="toFundDetail(scope.row.innercode)">
                            {{scope.row.name}}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="status" label="运行状态" align="center"></el-table-column> -->
                <el-table-column prop="type" label="基金类型" width="80" align="center"></el-table-column>
                <el-table-column prop="fundDate" label="成立日期" align="center"></el-table-column>
                <el-table-column prop="totalReturn" label="成立以来收益" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.totalReturn > 0 ? 'color-red' : scope.row.totalReturn < 0 ? 'color-green' : ''">
                            {{scope.row.showTotalReturn}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="startDate" label="任职开始日期" align="center"></el-table-column>
                <el-table-column v-if="activeTab !== 0" :key="Math.random()" prop="endDate" label="任职结束日期" align="center"></el-table-column>
                <el-table-column prop="duringReturn" label="任职期收益" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.duringReturn > 0 ? 'color-red' : scope.row.duringReturn < 0 ? 'color-green' : ''">
                            {{scope.row.showDuringReturn}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="基金规模" align="center"></el-table-column>
                <el-table-column v-if="activeTab == 0" prop="star" label="基金星级" width="110" align="center">
                    <template slot-scope="scope">
                        <el-rate
                            v-model="scope.row.star"
                            disabled
                            disabled-void-color="#bfbfbf"
                            :colors="['#555', '#555', '#555']"
                        ></el-rate>
                    </template>
                </el-table-column>
                <el-table-column v-if="activeTab == 0" prop="rank" label="近1年收益排名" width="110" align="center"></el-table-column>
                <el-table-column v-if="activeTab == 0" prop="style" label="投资风格" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFundList } from '@/api/manager';

export default {
    data() {
        return {
            isLoading: false,
            result: [],
            tableData: [],

            statusOptions: [
                {label: '在管基金', value: 666},
                {label: '运行中', value: 1},
                {label: '已暂停', value: 3, hide: true},
                {label: '已清算', value: 5},
                {label: '其他', value: 9, hide: true},
                {label: '全部', value: 0}

            ],
            activeTab: 0,

            typeOptions: ['全部', 'ETF联接', 'FOF', 'QDII', '债券型', '指数型', '混合型', '理财型', '股票型', '货币型'],
            type_value: '全部'
        }
    },
    computed: {
        ...mapGetters([
            'managerInfo'
        ]),
        tabList() {
            return this.statusOptions.filter(item => !item.hide).map(({label, value}) => {
                let num = value == 0
                        ? this.result.length
                        : this.result.filter(fund => {
                            return value == 666 ? (fund.isCharge) : (fund.status == label)
                        }).length
                return {
                    name: `${label}(${num})`,
                    id: value
                }
            })
        }
    },
    methods: {
        render() {
            this.getTableData()
        },
        async getTableData() {
            this.isLoading = true
            const res = await getFundList({
                personalCode: this.managerInfo.id
            })
            this.isLoading = false
            this.result = res.map(item => {
                return {
                    code: item.secuCode,
                    innercode: item.innerCode,
                    name: item.chiNameAbbr,
                    status: this.getStatusLabel(item.listedState),
                    type: item.firstClassType || '--',
                    fundDate: item.startDate ? item.startDate.slice(0, 10) : '--',
                    startDate: item.accessionDate ? item.accessionDate.slice(0, 10) : '--',
                    endDate: !item.dimissionDate ? '至今' : item.dimissionDate.slice(0, 10),
                    totalReturn: item.sinceItsInception,
                    duringReturn: item.performance,
                    showTotalReturn: this.formatData(item.sinceItsInception),
                    showDuringReturn: this.formatData(item.performance),
                    size: this.handleSize(item.size),
                    star: item.fundStars,
                    rank: `${item.intervalRank12 ? `${item.intervalRank12}/${item.intervalRankAllNum12}` : '--'}`,
                    style: item.label || '--',

                    sortBy: new Date(item.accessionDate).getTime(),
                    isCharge: item.incumbent
                }
            }).sort((a, b) => a.sortBy -b.sortBy)
            let options = this.typeOptions.filter(option => {
                let i = this.result.findIndex(item => item.type == option)
                return i >= 0
            })
            this.typeOptions = ['全部', ...options]
            this.filterFundList()
        },
        getStatusLabel(value) {
            return this.statusOptions.find(item => item.value == value).label
        },
        filterFundList() {
            this.isLoading = true
            let status = this.tabList[this.activeTab].id
            let arr = status > 0
                ? this.result.filter(item => {
                    // let byEndDate = item.endDate == '至今' // 任职期
                    let byEndDate = item.isCharge // 是否在管
                    let byStatus = item.status == this.getStatusLabel(status) // 运行状态
                    return status == 666 ? byEndDate : byStatus
                })
                : this.result
            this.tableData = this.type_value == '全部'
                ? arr
                : arr.filter(item => item.type == this.type_value)
            this.isLoading = false
        },
        formatData(data) {
            if (data === null) return '--'
            if (data === 0) return '0%'
            return (data * 100).toFixed(2) + '%'
        },
        handleSize(size) {
            const Y = 100000000, W = 10000
            if (!size) return '--'
            if (size > Y) {
                return (size / Y).toFixed(2) + '亿'
            }
            return (size / W).toFixed(2) + '万'
        },
        toFundDetail(innercode) {
            this.$routeOpen({name: 'Analysis',query: {innercode}})
        },

        /**
         * 下载Excel
         */
        handleExcel() {
            let table_data = this.result.map((item, index) => Object.assign(item, {index: index + 1})),
                props = ['序号', '基金代码', '基金简称', '运行状态', '基金类型', '成立日期', '成立以来收益', '任职开始日期', '任职结束日期', '任职期收益', '基金规模', '基金星级', '近1年收益排名', '投资风格'],
                keys = ['index', 'code', 'name', 'status', 'type', 'fundDate', 'showTotalReturn', 'startDate', 'endDate', 'showDuringReturn', 'size', 'star', 'rank', 'style']
            this.$downloadExcel(table_data, props, keys, '旗下基金列表')
        }
    }
}
</script>

<style lang="scss" scoped>
.tag{
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0 8px;
    border-radius: 4px;
    margin-left: 20px;
    cursor: pointer;
    &.is-active{
        background: rgba(78,124,238,.2);
        color: #4E7CEE;
    }
}
/deep/ .el-rate__icon{
    margin-right: 0;
}
</style>