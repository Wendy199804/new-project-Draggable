<template>
    <div class="risk-and-return4">
        <moduletitle title="情景分析">
            <div class="benchmark">
                <span>基准</span>
                <el-select v-model="index_value" placeholder="请选择" size="mini" class="mr" @change="handleResult()">
                    <el-option v-for="(item, index) in indexOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>

            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker ref="range" type="year" class="mr" @change="getChartData" />
            </div>
        </moduletitle>
        <div class="content">
            <div class="relative">
                <vHalfChart
                    id="qjfx"
                    ref="chart"
                    type="line"
                    grid="grid_half"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :seriesOptions="seriesOptions"
                    :otherOptions="otherOptions"
                    :isPct="true"
                />
                <vLoading :show="isLoading" />
                <vNodata :show="!seriesData && !isLoading" />
            </div>
            <div>
                <div>
                    <el-table :data="allTableData" v-loading="isLoading">
                        <el-table-column label="事件" prop="title" align="center" width="100"></el-table-column>
                        <el-table-column label="起止日期" align="center" width="200">
                            <template slot-scope="scope"> {{ scope.row.start }} - {{ scope.row.end }} </template>
                        </el-table-column>
                        <el-table-column :label="fund_name || '当前基金'" prop="current" align="center">
                            <template slot-scope="scope">
                                <div :class="scope.row.current2 > 0 ? 'color-red' : scope.row.current2 < 0 ? 'color-green' : 'color-black'">
                                    {{ scope.row.current }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="index_name || '当前指数'" prop="index" align="center" width="120">
                            <template slot-scope="scope">
                                <div :class="scope.row.index2 > 0 ? 'color-red' : scope.row.index2 < 0 ? 'color-green' : 'color-black'">
                                    {{ scope.row.index }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { benchmarkValue } from '@/utils/analyze'
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'

export default {
    components: {
    },
    data() {
        return {
            // benchmarkOptions: allBenchmark, // 基准可选
            index_value: '',
            indexOptions: [
                { label: '沪深300', value: '000300' },
                { label: '上证50', value: '000016' },
                { label: '中证500', value: '000905' },
                { label: '中证全指', value: '000985' },
                { label: '中证全债指数', value: 'H11001' }
            ],
            legend: [],
            xData: [],
            seriesData: null,
            seriesOptions: [{ connectNulls: true }, { connectNulls: true }],
            otherOptions: {},

            result: '',
            timeRange: '',
            isLoading: false,
            benchmarkvalue: '',

            allTableData: [],
            totalSize: 0,
            pageSize: 10,
            currentPage: 1,
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze','analyzeFundDateRange']),
        fund_name() {
            return this.selectFundToAnalyze.name
        },
        index_name() {
            let idx = this.indexOptions.find(item => item.value == this.index_value)
            return idx ? idx.label : ''
        }
    },
    methods: {
        render() {
            !this.index_value && (this.index_value = '000300')
            this.$refs.range.init()
        },
        async getChartData() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_scenarios_return',
                fund_innercode: this.selectFundToAnalyze.innercode,
                start_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                this.allTableData = []
                return
            }
            this.result = res
            this.handleResult()
        },
        handleResult() {
            let summary = this.result.scenarios_return
            if (!summary.index) {
                this.allTableData = []
            } else {
                this.allTableData = summary.index.map((item, index) => {
                    return {
                        title: item,
                        start: summary.start_date[index].slice(0, 10),
                        end: summary.end_date[index].slice(0, 10),
                        current: this.manageData(summary.cumulative_return[index]),
                        index: this.manageData(summary[this.index_value][index]),
                        current2: summary.cumulative_return[index],
                        index2: summary[this.index_value][index]
                    }
                })
            }
            this.totalSize = this.allTableData.length
            this.handleTableData()
            this.$nextTick(() => {
                this.handleChartData()
            })
        },
        manageData(data) {
            if (data === 0) return 0
            if (!data) return '--'
            return (data * 100).toFixed(2) + '%'
        },
        handleChartData() {
            try {
                let summary = this.result.fund_index_cum_return
                this.legend = [this.fund_name, this.index_name]
                this.xData = summary.EndDate.map(item => item.slice(0, 10))
                this.seriesData = [summary.cumulative_return, summary[this.index_value]]
                this.otherOptions = {
                    tooltip: {
                        axisPointer: {
                            type: 'none'
                        },
                        formatter: (params) => {
                            let row = this.allTableData.find(item => {
                                let dateNum = params[0].name.split('-').join(''),
                                    startNum = item.start.split('-').join(''),
                                    endNum = item.end.split('-').join('')
                                return dateNum > startNum && dateNum < endNum
                            })
                            if (!row) return ''
                            return `${row.start} 至 ${row.end} ${row.title}<br>
                                ${this.fund_name}: ${row.current}<br>
                                ${this.index_name}: ${row.index}`
                        }
                    },
                    xAxis: {
                        axisLabel: { showMaxLabel: false }
                    }
                }
                this.seriesOptions = [
                    {
                        markArea: {
                            label: {
                                color: '#666',
                                position: 'inside'
                            },
                            emphasis: {
                                label: {
                                    position: 'inside'
                                }
                            },
                            data: this.allTableData.map(item => {
                                let start = this.xData.indexOf(item.start),
                                    end = this.xData.indexOf(item.end),
                                    len = this.xData.length
                                return [
                                    {
                                        name: item.title,
                                        xAxis: this.getDateAxis(item.start, -1),
                                        y: 30,
                                        itemStyle: {
                                            color: item.title.indexOf('上行') > 0 ? 'rgba(253, 72, 76, .1)' : 'rgba(80, 199, 90, .1)'
                                        },
                                        label: {
                                            show: (end - start) > len * 0.1
                                        }
                                    },
                                    {
                                        xAxis: this.getDateAxis(item.end, 1),
                                        y: 10
                                    }
                                ]
                            })
                        }
                    },
                    {
                        markArea: {
                            label: {
                                show: false
                            },
                            emphasis: {
                                label: {
                                    show: false
                                }
                            },
                            data: this.allTableData.map(item => {
                                return [
                                    {
                                        name: item.title,
                                        xAxis: this.getDateAxis(item.start, -1),
                                        y: 290,
                                        itemStyle: {
                                            color: 'transparent'
                                        },
                                        emphasis: {
                                            itemStyle: {
                                                color: item.title.indexOf('上行') > 0 ? 'rgba(253, 72, 76, .2)' : 'rgba(80, 199, 90, .2)'
                                            }
                                        }
                                    },
                                    {
                                        xAxis: this.getDateAxis(item.end, 1),
                                        y: 10
                                    }
                                ]
                            })
                        }
                    }
                ]
                this.draw('chart')
            } catch (err) {
                this.seriesData = null
            }
            this.draw('chart')
        },
        getDateAxis(date, type) {
            // 坐标轴上有事件日期
            if (this.xData.indexOf(date) > -1) {
                return date
            }
            // 寻找坐标轴上与date最相近的日期
            // type < 0 往前取；type > 0 往后取
            let newArr = this.xData.concat([])
            newArr.push(date)
            newArr.sort((a, b) => {
                return parseInt(a.replace(/-/g, '')) - parseInt(b.replace(/-/g, ''))
            })
            let index = newArr.indexOf(date)
            return type > 0 ? newArr[index + 1] : newArr[index - 1]
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        handleDownload() {
            let list = [{ id: 'qjfx', imgName: '情景分析' }]
            this.$downloadImg(list)
        },
        handleExcel() {
            let table_data = JSON.parse(JSON.stringify(this.tableData)).map(item => {
                    item.date = `${item.start} - ${item.end}`
                    return item
                }),
                props = ['事件', '起止日期', this.selectFundToAnalyze.name, this.index_name].map(item => {
                    return {
                        name: item,
                        style: item == '事件' ? 'left' : 'right'
                    }
                }),
                keys = ['title', 'date', 'current', 'index'],
                name = '情景分析'
            this.$downloadExcel(table_data, props, keys, name)
        },
        refreshChart() {
            this.render()
        },
        handleCurrentChange(current) {
            this.currentPage = current
            this.handleTableData()
        },
        handleTableData() {
            let startIndex = (this.currentPage - 1) * 10
            let endIndex = this.currentPage * 10
            endIndex > this.totalSize && (endIndex = this.totalSize)
            this.tableData = this.allTableData.slice(startIndex, endIndex)
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-and-return4 {
    background: #ffffff;
    .content {
        display: flex;
        justify-content: space-between;
        position: relative;
        // padding: 16px;
        & > div {
            width: 50%;
            padding: 10px 0 16px 0;
        }
        & > div:last-child {
            padding: 20px 16px;
            // display: flex;
            // flex-direction: column;
            // align-items: space-between;
            // justify-content: space-between;
        }
    }
    .zj-pagination {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
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
    /deep/ .chart {
        width: 100%;
        height: 320px;
    }
}
/deep/.legend {
        font-size: 12px;
        color: #555;
        // 横向排列图例
        &.row {
            width: 100%;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            padding: 0 10px;
            p {
                margin-right: 20px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        p {
            // height: 20px;
            line-height: 20px;
            span {
                // display: inline-block;
                // vertical-align: middle;
                // margin: -2px 3px 0 0;
                float: left;
                margin: 4px 4px 0 0;
            }
        }
        // 长方形图例
        .line span {
            width: 22px;
            height: 3px;
            margin-top: 8px;
        }
        // 正方形图例
        .rect span {
            width: 12px;
            height: 12px;
        }
    }
</style>