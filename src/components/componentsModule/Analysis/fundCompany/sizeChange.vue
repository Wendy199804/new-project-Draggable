<template>
    <div class="card">
        <moduletitle :title="isprop?'基金公司':'规模变化'">
            <div class="benchmark">
                <span>基金类型</span>
                <el-select v-model="type_value" @change="getChartData(), getTableData()">
                    <el-option v-for="(item, index) in typeOptions" :key="index"
                        :label="item.label" :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div class="timeframe">
                <span>时段</span>
                <el-select v-model="period_value" @change="getChartData(), getTableData()">
                    <el-option v-for="(item, index) in periodOptions" :key="index"
                        :label="item.label" :value="item.value"
                    ></el-option>
                </el-select>
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>
        <div v-if="isprop" v-loading.lock="company_isLoading" class="info">
                <p class="bold">{{ companyInfo.companyName }}</p>
                <p>
                    <span>成立时间：{{ companyInfo.companyDate }}</span
                    ><span>旗下基金数：{{ companyInfo.fundNumber }}</span
                    ><span>旗下基金经理数：{{ companyInfo.managerNumber }}</span>
                </p>
            </div>

        <div class="card-body">
            <div class="double">
                <div class="relative"
                    style="border-right-color: transparent;"
                    id="sizeChange"
                >
                    <vHalfChart ref="chart"
                        type="bar"
                        grid="grid_l"
                        :legend="legend"
                        :xData="xData"
                        :seriesData="seriesData"
                        :seriesOptions="seriesOptions"
                        :otherOptions="otherOptions"
                    />
                    <vLoading :show="isLoading_l" />
                    <vNodata :show="!seriesData && !isLoading_l" />
                </div>

                <div class="relative">
                    <el-table
                        class="right-table"
                        :data="tableData"
                        max-height="304"
                        v-loading="isLoading_r"
                    >
                        <el-table-column label="时间" prop="time" align="center"></el-table-column>
                        <el-table-column label="总规模(亿元)" prop="total_size" align="center"></el-table-column>
                        <el-table-column label="规模变化(亿元)" prop="size_change" align="center"></el-table-column>
                        <el-table-column label="规模排名" prop="rank" align="center"></el-table-column>
                        <el-table-column label="基金数" prop="number" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanySizeChart, getCompanySizeTable,getFundCompanyInfo } from '@/api/analysis'

export default {
    props:{
        isprop:{type:Boolean,default:false}
    },
    data() {
        return {
            typeOptions: [
                {label: '全部', value: '全部类型'},
                {label: '股票型', value: '股票型'},
                {label: '混合型', value: '混合型'},
                {label: '债券型', value: '债券型'},
                {label: 'QDII', value: 'QDII'},
                {label: '指数型', value: '指数型'},
                {label: '货币型', value: '货币型'},
                {label: 'ETF联接', value: 'ETF联接'},
                {label: '理财型', value: '理财型'},
                {label: 'FOF', value: 'FOF'}
            ],
            type_value: '',
            periodOptions: [
                {label: '最近3年', value: '12'},
                {label: '最近5年', value: '20'},
                {label: '最近10年', value: '40'}
            ],
            period_value: '',

            isLoading_l: false,
            legend: [],
            xData: [],
            seriesData: null,
            seriesOptions: [],
            otherOptions: {},

            isLoading_r: false,
            tableData: [],
            currentPage: 1,
            pageSize: 5,

            companyInfo: {},
            company_isLoading: false,
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.type_value = this.typeOptions[0].value
            this.period_value = '20'
            this.currentPage = 1
            this.isprop?this.getCompanyInfo():''
            this.getChartData()
            this.getTableData()
        },

        async getChartData() {
            this.isLoading_l = true
            const res = await getCompanySizeChart({
                innerCode: this.selectFundToAnalyze.innercode,
                firstClassType: this.type_value,
                quarter: this.period_value
            })
            this.isLoading_l = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = ['规模变化', '总规模']
            this.xData = []
            let data1 = [], data2 = []
            Object.keys(res).forEach(year => {
                res[year].forEach((quarter, index) => {
                    this.xData.push(quarter.companyDate)
                    data1.push(quarter.changeNv)
                    data2.push(quarter.nv)
                })
            })
            this.seriesData = [data1, data2]
            this.seriesOptions = [null, {
                type: 'line',
                areaStyle: {}
            }]
            // 首年数据可能不满4个季度
            let firstLen = res[this.xData[0].slice(0, 4)].length
            let interval = (index) => {
                if (index == 0 || (index + (4-firstLen)) % 4 == 0) return true
                return false
            }
            this.otherOptions = {
                xAxis: {
                    axisLabel: {
                        interval,
                        formatter: (value) => {
                            let [yyyy, mm, dd] = value.split('-')
                            return yyyy
                        },
                        align: 'right',
                        showMinLabel: firstLen == 4,
                    },
                    axisTick: {
                        interval,
                    },
                    splitArea: {
                        show: true,
                        interval,
                        areaStyle: {
                            color: ['transparent', 'rgba(245, 245, 245, .65)']
                        }
                    }
                },
                tooltip: {
                    formatter: (params) => {
                        return `${params[0].axisValue}<br>
                            ${params[0].seriesName}: ${params[0].data.toFixed(2)}亿元<br>
                            ${params[1].seriesName}: ${params[1].data.toFixed(2)}亿元
                        `
                    }
                }
            }
            this.draw('chart')
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        async getTableData() {
            this.isLoading_r = true
            const res = await getCompanySizeTable({
                innerCode: this.selectFundToAnalyze.innercode,
                firstClassType: this.type_value,
                quarter: this.period_value
            })
            this.isLoading_r = false
            this.tableData = Object.keys(res).map(time => {
                let row = res[time]
                return {
                    time,
                    total_size: this.formatData(row.nv),
                    size_change: this.formatData(row.changeNv),
                    rank: `${row.rankNum}/${row.allNum}`,
                    number: row.fundNumber || '--'
                }
            })
        },
        formatData(data) {
            if (data ===  0) return 0
            if (!data) return '--'
            return data.toFixed(2)
        },
        getCompanyInfo() {
            this.company_isLoading = true
            getFundCompanyInfo({ innerCode: this.selectFundToAnalyze.innercode })
                .then(res => {
                    this.companyInfo = res
                    this.company_isLoading = false
                })
                .catch(() => {
                    this.company_isLoading = false
                })
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                {id: 'sizeChange', imgName: '规模变化'}
            ]
            this.$downloadImg(list)
        },
        /**
         * 导出Excel
         */
        handleExcel() {
            let table_data = this.tableData,
                props = ['时间', '总规模(亿元)', '规模变化(亿元)', '规模排名', '基金数'],
                keys = ['time', 'total_size', 'size_change', 'rank', 'number']
            this.$downloadExcel(table_data, props, keys, '规模变化')
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.right-table{
    margin-top: 10px;
    thead th, td{
        height: 43px !important;
        line-height: 43px !important;
    }
}
.zj-pagination{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}
.info {
    min-height: 60px;
    padding: 16px 30px 0 43px;
    line-height: 30px;
    &>p:nth-child(2){
        span{
            margin-right: 30px;
        }
    }
}
</style>