<template>
    <div class="indicator">
        <moduletitle :title="'收益风险指标'">
            <div class v-if="selectFundToAnalyze.type !== 2">
                <span>频率</span>
                <el-select v-model="frequencyValue" placeholder="请选择" @change="getChartData">
                    <el-option
                        v-for="item in frequencyOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
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
                    <vDateRangePicker
                        ref="range"
                        type="year"
                        class="mr"
                        @change="getChartData"
                    />
                </keep-alive>
            </div>
            <div>
                <!-- <svg-icon icon-class="download" @click="handleDownload"></svg-icon> -->
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>

        <div class="content">
            <vNodata :show="!result&&!isLoading" />
            <el-table :data="incomeIndex" border style="width: 100%" v-loading="isLoading">
                <el-table-column prop="label" label="收益指标" :resizable="false">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.label}}</span>
                            <el-popover
                                ref="popover"
                                placement="right"
                                width="300"
                                trigger="hover"
                                propper-class="propper-box"
                                :content="getMarkText(scope.row.label)"
                            >
                                <span class="pointer" slot="reference">
                                    <svg-icon icon-class="mark" />
                                </span>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="value1" :label="selectFundToAnalyze.name" align="center" :resizable="false"></el-table-column>
                <el-table-column prop="value2" :label="index_name" align="center" :resizable="false"></el-table-column>
                <el-table-column prop="label2" label="风险指标" :resizable="false">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.label2}}</span>
                            <el-popover
                                ref="popover"
                                placement="right"
                                width="300"
                                trigger="hover"
                                propper-class="propper-box"
                                :content="getMarkText(scope.row.label2)"
                            >
                                <span class="pointer" slot="reference">
                                    <svg-icon icon-class="mark" />
                                </span>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="value3" :label="selectFundToAnalyze.name" align="center" :resizable="false"></el-table-column>
                <el-table-column prop="value4" :label="index_name" align="center" :resizable="false"></el-table-column>
            </el-table>
            <!-- <vLoading :show="isLoading" /> -->
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { topercentNum, benchmarkValue } from '@/utils/analyze'
import { getMarkText } from '@/utils/getMarkText'


export default {
    data() {
        return {
            // benchmarkValue: ['1', '000300'], //基准
            frequencyValue: 'daily', //频率

            frequencyOptions: [
                { value: 'daily', label: '原始频率' },
                { value: 'weekly', label: '周频' },
                { value: 'monthly', label: '月频' },
            ],

            benchmarkOptions: allBenchmark,

            isLoading: false,

            value1: '基金',
            value2: '指数',

            incomeIndex: [
                {
                    label: '区间收益(%)',
                    value1: '',
                    value2: '',
                    label2: '最大回撤(%)',
                    value3: '',
                    value4: '',
                },
                {
                    label: '年化收益(%)',
                    value1: '',
                    value2: '',
                    label2: '最大回撤区间月份数',
                    value3: '',
                    value4: '',
                },
                {
                    label: '阿尔法(%)',
                    value1: '',
                    value2: '',
                    label2: '最大回撤修复日期',
                    value3: '',
                    value4: '',
                },
                {
                    label: '夏普比率',
                    value1: '',
                    value2: '',
                    label2: '最大回撤修复月份数',
                    value3: '',
                    value4: '',
                },
                {
                    label: '信息比率',
                    value1: '',
                    value2: '',
                    label2: '年化标准差(%)',
                    value3: '',
                    value4: '',
                },
                {
                    label: '索提诺比率',
                    value1: '',
                    value2: '',
                    label2: '贝塔',
                    value3: '',
                    value4: '',
                },
                {
                    label: '特雷诺比率',
                    value1: '',
                    value2: '',
                    label2: '下行风险(%)',
                    value3: '',
                    value4: '',
                },
                {
                    label: '詹森指数(%)',
                    value1: '',
                    value2: '',
                    label2: '跟踪误差(%)',
                    value3: '',
                    value4: '',
                },
                {
                    label: 'M2(%)',
                    value1: '',
                    value2: '',
                    label2: '历史VaR(%)',
                    value3: '',
                    value4: '',
                },
                {
                    label: '胜率(%)',
                    value1: '',
                    value2: '',
                    label2: '历史CVaR(%)',
                    value3: '',
                    value4: '',
                },
            ],
            timeRange: '',
            result: '',
            benchmarkvalue: '',
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        benchmarkValue: {
            get() {
                return this.benchmarkvalue === '' ? benchmarkValue(this.selectFundToAnalyze) : this.benchmarkvalue
            },
            set(val) {
                this.benchmarkvalue = val
            },
        },
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        },
    },
    methods: {
        async getChartData() {
            this.isLoading = true
            try {
                const result = await push_request({
                    type: 'get_return_and_risk_indicators',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    index_code: this.benchmarkValue[1],
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date,
                    freq: this.frequencyValue,
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                let obj = this.result
                let index = 0
                let arr1 = []
                let arr2 = []
                for (let key in obj) {
                    if (index > 0) {
                        arr1.push(obj[key][0])
                        arr2.push(obj[key][1])
                    }
                    index++
                }
                let arr3 = arr1.splice(10)
                let arr4 = arr2.splice(10)
                this.incomeIndex.forEach((item, index) => {
                    if (item.label.indexOf('%') !== -1) {
                        item.value1 = arr1[index] == null ? '- -' : topercentNum(arr1[index])
                        item.value2 = arr2[index] == null ? '- -' : topercentNum(arr2[index])
                    } else {
                        item.value1 = arr1[index] == null ? '- -' : arr1[index].toFixed(2)
                        item.value2 = arr2[index] == null ? '- -' : arr2[index].toFixed(2)
                    }

                    if (index == 2) {
                        let date1 = arr3[2] == null ? '- -' : arr3[2].split(' ')[0]
                        item.value3 = date1 == '1900-01-01' ? '- -' : date1
                        let date2 = arr4[2] == null ? '- -' : arr4[2].split(' ')[0]
                        item.value4 = date2 == '1900-01-01' ? '- -' : date2
                    } else {
                        if (item.label2.indexOf('%') !== -1) {
                            item.value3 = arr3[index] == null ? '- -' : topercentNum(arr3[index])
                            item.value4 = arr4[index] == null ? '- -' : topercentNum(arr4[index])
                        } else {
                            if (index == 1||index == 3) {
                                item.value3 = arr3[index] == null ? '- -' : arr3[index]
                                item.value4 = arr4[index] == null ? '- -' : arr4[index]
                            } else {
                                item.value3 = arr3[index] == null ? '- -' : arr3[index].toFixed(2)
                                item.value4 = arr4[index] == null ? '- -' : arr4[index].toFixed(2)
                            }
                        }
                    }
                })
            }
            // this.$forceUpdate()
        },
        getMarkText(label) {
            return getMarkText(label)
        },
        /**下载图片 */
        handleDownload() {},
        /**下载表格 */
        handleExcel() {
            let table_data = this.incomeIndex,
                props = ['收益指标', `${this.selectFundToAnalyze.name}`, `${this.index_name}`, '风险指标', `${this.selectFundToAnalyze.name}`, `${this.index_name}`].map((item) => {
                    return {
                        name: item,
                        style: item == '收益指标' ? 'left' : 'right',
                    }
                }),
                keys = ['label', 'value1', 'value2', 'label2', 'value3', 'value4'],
                name = '收益风险指标'
            this.$downloadExcel(table_data, props, keys, name)
        },

        render() {
            this.$refs.range.init('one_year')
        },
        refreshChart() {
            this.render()
        },
    },
}
</script>

<style lang="scss" scoped>
.indicator {
    background-color: #ffffff;
    margin-bottom: 16px;
    color: #333;

    .content {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        position: relative;
        min-height: 320px;
        & > p {
            width: 100%;
        }
    }
    /deep/ .el-select {
        width: 95px;
    }
    /deep/ tbody > tr > td {
        &:first-child,
        &:nth-child(4) {
            background-color: #f5f5f5;
            padding-left: 15px;
        }
    }
}
</style>