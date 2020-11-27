<template>
    <div class="monthly-return">
        <moduletitle :title="'收益及分布'">
            <div class="show" v-if="selectFundToAnalyze.type !== 2">
                <span>频率</span>
                <el-select v-model="frequencyValue" placeholder="请选择" @change="getChartData">
                    <el-option v-for="item in frequencyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>

            <div class="benchmark" v-if="selectFundToAnalyze.type !== 2">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>

            <div class="timeframe">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker ref="range" type="year" class="mr" @change="getChartData" />
                </keep-alive>
            </div>
            <div>
                <div class="tab-change">
                    <svg-icon :icon-class="nowtab === 'chart' ? 'is-chart-active' : 'is-chart'" @click="changeToChart"></svg-icon>
                    <svg-icon :icon-class="nowtab === 'table' ? 'is-table-active' : 'is-table'" @click="changeToTable"></svg-icon>
                </div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>

        <div class="content" v-show="nowtab == 'chart'">
            <div id="return">
                <p class="bold">{{ curpl }}收益</p>
                <vHalfChart
                    ref="chart_l"
                    type="bar"
                    grid="grid_l_zoom"
                    :legend="legend_L"
                    :xData="xData_L"
                    :seriesData="seriesData_L"
                    :otherOptions="seriesOptions_L"
                    :isPct="true"
                ></vHalfChart>
                <vLoading :show="isLoading" />
                <vNodata :show="!result && !isLoading" />
            </div>
            <div id="returndis">
                <p class="bold">{{ curpl }}收益分布</p>
                <vHalfChart
                    ref="chart_r"
                    type="bar"
                    grid="grid_r"
                    :legend="legend_R"
                    :xData="xData_R"
                    :seriesData="seriesData_R"
                    :otherOptions="seriesOptions_R"
                    :isPct="true"
                ></vHalfChart>
                <vLoading :show="isLoading" />
                <vNodata :show="!result && !isLoading" />
            </div>
        </div>

        <div class="content tabletab" v-show="nowtab !== 'chart'">
            <Tableleft :list="list" :thead="thead1" />
            <Tableright :list1="list2" :list2="list3" :bname="index_name" />
        </div>

        <div class="summary discrib" v-loading.lock="summary_Loading">{{ discrib }}</div>
    </div>
</template>

<script>

import Tableleft from './tablepages/tableLeft.vue'
import Tableright from './tablepages/tableRight.vue'
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { toPercent, benchmarkValue } from '@/utils/analyze'

export default {
    data() {
        return {
            // benchmarkValue: ['1', '000300'], //基准
            frequencyValue: 'monthly', //频率

            frequencyOptions: [
                { value: 'monthly', label: '月度' },
                { value: 'quarter', label: '季度' },
                { value: 'annual', label: '年度' }
            ],

            benchmarkOptions: allBenchmark,

            legend_L: [],
            xData_L: [],
            seriesData_L: [],
            seriesOptions_L: {
                dataZoom: [
                    {
                        start: 90,
                        end: 100,
                        top: '90%',
                        bottom: '2%'
                    }
                ]
            },

            legend_R: [],
            xData_R: [],
            seriesData_R: [],
            seriesOptions_R: {},
            tooltipshow: true,

            isLoading: false,
            summary_Loading: false,
            result: '',
            // resultl: '',
            // resultr: '',
            nowtab: 'chart',
            //   config: ['year_start', 'three_months_before', 'six_months_before'],
            timeRange: {}, //时段

            list: [],
            list2: [],
            list3: [],
            thead1: [],
            thead2: [],
            thead3: [],

            curpl: '月度',
            benchmarkvalue: '',
            discrib: '' // 文案
        }
    },
    components: {
        Tableleft,
        Tableright
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        benchmarkValue: {
            get() {
                return this.benchmarkvalue === '' ? benchmarkValue(this.selectFundToAnalyze) : this.benchmarkvalue
            },
            set(val) {
                this.benchmarkvalue = val
            }
        },
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        }
    },
    methods: {
        /**下载表格 */
        handleExcel() {
            if (this.list.length === 0 && this.list2.length === 0 && this.list3.length === 0) {
                this.$message({
                    message: '该时段下暂无数据',
                    type: 'warning'
                })
            } else {
                let thead1 =
                    this.frequencyValue === 'monthly'
                        ? ['年份', '简称', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                        : this.frequencyValue === 'quarter'
                        ? ['年份', '简称', '第一季度', '第二季度', '第三季度', '第四季度']
                        : ['年份', '简称', '年度收益率']
                let table_data = this.list,
                    props = thead1.map(item => {
                        return {
                            name: item,
                            style: item == '年份' ? 'left' : 'right'
                        }
                    }),
                    keys =
                        this.frequencyValue === 'monthly'
                            ? ['year', 'name', 'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12']
                            : this.frequencyValue === 'quarter'
                            ? ['year', 'name', 'm03', 'm06', 'm09', 'm12']
                            : ['year', 'name', 'm12'],
                    name = '收益与风险'
                this.$downloadExcel(table_data, props, keys, name)

                let table_data2 = this.list2,
                    props2 = [
                        '收益率区间',
                        `${this.selectFundToAnalyze.name}数量`,
                        `${this.index_name}数量`,
                        `${this.selectFundToAnalyze.name}占比`,
                        `${this.index_name}占比`
                    ].map(item => {
                        return {
                            name: item,
                            style: item == '收益率区间' ? 'left' : 'right'
                        }
                    }),
                    keys2 = ['percent', 'mnum', 'bnum', 'mper', 'bper'],
                    name2 = '收益与风险'
                this.$downloadExcel(table_data2, props2, keys2, name2)

                let table_data3 = this.list3,
                    props3 = [
                        '收益率区间',
                        `${this.selectFundToAnalyze.name}数量`,
                        `${this.index_name}数量`,
                        `${this.selectFundToAnalyze.name}占比`,
                        `${this.index_name}占比`
                    ].map(item => {
                        return {
                            name: item,
                            style: item == '收益率区间' ? 'left' : 'right'
                        }
                    }),
                    keys3 = ['title', 'num1', 'num2', 'p1', 'p2'],
                    name3 = '收益与风险'
                this.$downloadExcel(table_data3, props3, keys3, name3)
            }
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                { id: 'return', imgName: `${this.curpl}收益` },
                { id: 'returndis', imgName: `${this.curpl}收益分布` }
            ]
            this.$downloadImg(list)
        },

        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        tofixed(num) {
            if (typeof num !== 'number') {
                num = Number(num)
            }
            return num.toFixed(2)
        },
        async getChartData() {
            this.nowtab = 'chart'
            this.result = ''
            this.isLoading = true
            this.legend_L = this.legend_R = [this.selectFundToAnalyze.name, this.index_name]
            this.getDiscrib()

            try {
                const result = await push_request({
                    type: 'get_fund_return_and_distribution',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    index_code: this.benchmarkValue[1],
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result

                this.handleResult()
                this.tableHandleResult(this.xData_L)
                this.draw('chart_l')
                this.draw('chart_r')
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },

        async getDiscrib() {
            this.summary_Loading = true
            try {
                const result = await push_request({
                    type: 'get_fund_return_distribution_new',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    index_code: this.benchmarkValue[1],
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                })
                this.discrib = this.frequencyValue === 'monthly' ? result[0] : this.frequencyValue === 'quarter' ? result[1] : result[2]
                this.summary_Loading = false
            } catch {
                ;() => {
                    this.summary_Loading = false
                }
            }
        },

        handleResult() {
            this.frequencyOptions.forEach(item => {
                this.frequencyValue === item.value ? (this.curpl = item.label) : ''
            })

            if (this.result) {
                let pl = this.frequencyValue
                let data = this.result[`fund_index_${pl}_return`] //最外层
                this.xData_L = pl === 'annual' ? data.EndDate.map(item => item.slice(0, 4)) : data.EndDate.map(item => item.slice(0, 7))
                this.seriesData_L = [data[`fund_${pl}_return`], data[`index_${pl}_return`]]
                let data_r = this.result.return_distribution[`${pl}_return_distribution`]
                let arr_r = this.result.return_distribution[`${pl}_bin_lims`].bin_lims
                let newarr = []
                let newarr1 = []
                let newarr2 = []

                arr_r.forEach((item, index, arr) => {
                    if (index !== arr_r.length - 1) {
                        newarr1.push(' ')
                        newarr2.push(' ')
                        newarr.push(item)
                        newarr1.push(data_r.fund_return_distribution[index])
                        newarr2.push(data_r.index_return_distribution[index])
                        newarr.push(' ')
                    } else if (index === arr_r.length - 1) {
                        newarr.push(item)
                    }
                })
                this.xData_R = newarr
                this.seriesData_R = [newarr1, newarr2]
            }
        },
        tableHandleResult(datel) {
            if (this.result) {
                let pl = this.frequencyValue
                let data = this.result[`fund_index_${pl}_return`] //最外层
                let datar = this.result.return_distribution[`${pl}_bin_lims`].bin_lims
                //table-left
                let newarr = [] //经理数组
                let newarr2 = [] // 基金数组
                //遍历横轴
                datel.forEach((item, index) => {
                    let m = item.substr(5, 2) || '12'
                    let obj = {
                        year: item.substr(0, 4),
                        name: this.selectFundToAnalyze.name
                    }
                    let obj2 = {
                        year: item.substr(0, 4),
                        name: this.index_name
                    }
                    obj[`m${m}`] = toPercent(this.seriesData_L[0][index])
                    obj2[`m${m}`] = toPercent(this.seriesData_L[1][index])
                    newarr.push(obj)
                    newarr2.push(obj2)
                })

                newarr.push({ year: '0000' })
                newarr2.push({ year: '0000' })
                let result1 = [] // 经理结果
                let result2 = [] // 基金结果
                newarr.reduce((pre, cur) => {
                    pre.year === cur.year ? Object.assign(cur, pre) : result1.push(pre)
                    return cur
                }, [])
                newarr2.reduce((pre, cur) => {
                    pre.year === cur.year ? Object.assign(cur, pre) : result2.push(pre)
                    return cur
                }, [])
                let result = [] //最终结果
                for (let i = 1; i < result1.length; i++) {
                    result.push(result1[i])
                    result.push(result2[i])
                }
                this.list = result
                let monthly1 = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                let quarter1 = [null, null, '第一季度', null, null, '第二季度', null, null, '第三季度', null, null, '第四季度']
                let annual1 = [null, null, null, null, null, null, null, null, null, null, null, '年度收益率']
                pl === 'monthly' ? (this.thead1 = monthly1) : pl === 'quarter' ? (this.thead1 = quarter1) : (this.thead1 = annual1)
                //************** */
                let resultr = []
                let data_rr = this.result.return_distribution[`${pl}_return_distribution`]
                let data_r = datar.forEach((item, index) => {
                    resultr.push({
                        percent: `${item}%~${datar[index + 1]}%`,
                        mnum: data_rr.fund_return_num[index],
                        bnum: data_rr.index_return_num[index],
                        mper: toPercent(data_rr.fund_return_distribution[index]),
                        bper: toPercent(data_rr.index_return_distribution[index])
                    })
                })
                resultr.pop()
                this.list2 = resultr

                //************** */
                let d = this.result.return_distribution_by_zero[`${pl}`]
                let result3 = [
                    {
                        title: '<=0',
                        num1: d.fund_lower_than_zero_num[0],
                        num2: d.index_lower_than_zero_num[0],
                        p1: toPercent(d.fund_lower_than_zero_ratio[0]),
                        p2: toPercent(d.index_lower_than_zero_ratio[0])
                    },
                    {
                        title: '>0',
                        num1: d.fund_higher_than_zero_num[0],
                        num2: d.index_higher_than_zero_num[0],
                        p1: toPercent(d.fund_higher_than_zero_ratio[0]),
                        p2: toPercent(d.index_higher_than_zero_ratio[0])
                    }
                ]
                this.list3 = result3
            }
        },
        /**图 /表 切换 */
        changeToChart() {
            this.nowtab = 'chart'
        },
        changeToTable() {
            this.nowtab = 'table'
        },
        render() {
            this.$refs.range.init()
        },
        refreshChart() {
            this.render()
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.seriesOptions_R = {
                xAxis: {
                    axisLabel: {
                        interval: 0 //代表显示所有x轴标签显示
                    },
                    boundaryGap: 0,
                    axisLabel: {
                        formatter: value => {
                            return value == ' ' ? '' : Math.round(value * 100) + '%'
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none'
                    },
                    formatter: params => {
                        if (params[0].dataIndex % 2 !== 0) {
                            // 奇数位时
                            let str = `<span>${(this.xData_R[params[0].dataIndex - 1] * 100).toFixed(0)}%~${(
                                this.xData_R[params[0].dataIndex + 1] * 100
                            ).toFixed(0)}%</span><br/>`
                            params.forEach(item => {
                                str += `<span>${item.seriesName}：${Number(item.value * 100).toFixed(2)}%</span><br/>`
                            })
                            return str
                        } else {
                            // return false
                        }
                    }
                }
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.monthly-return {
    background-color: #ffffff;
    padding-bottom: 1px;
    margin-bottom: 16px;
    color: #333;
    position: relative;

    .tab-change {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 50px;
        height: 20px;
        /deep/ .svg-icon {
            width: 50%;
            height: 100%;
            margin: 0;
            cursor: pointer;
        }
    }
    .content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        & > div {
            width: 50%;
            position: relative;
            & > p {
                padding-left: 16px;
                margin-bottom: 4px;
            }
            /deep/ .chart{
                width: 100%;
                height: 320px;
            }
        }
        & > div:first-child {
            border-right: 1px solid #dddddd;
        }
    }
    .tabletab {
        > div {
            width: calc(50% - 22px);
            &:first-child {
                margin-left: 16px;
            }
            &:last-child {
                margin-right: 16px;
            }
        }
    }
    .discrib {
        margin: 16px;
        margin-top: 0;
    }
}
</style>