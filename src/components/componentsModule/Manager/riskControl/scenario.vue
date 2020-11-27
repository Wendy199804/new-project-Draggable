<template>
    <div class="risk-and-return-manager">
        <moduletitle title="情景分析" type="manager">
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
                    grid="grid_l"
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
                    <el-table :data="tableData2" v-loading="isLoading">
                        <el-table-column label="行情" align="center">
                            <el-table-column label="经理/指数" prop="col1" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column v-for="(item, index) in thead2" :key="index" align="center">
                            <template slot="header"
                                ><div :style="{ background: item.symbol === 'up' ? '#FD484C19' : '#50C75A19' }">{{ item.title }}</div></template
                            >
                            <el-table-column label="杨浩" :prop="`manager_l_${index + 1}`" align="center"></el-table-column>
                            <el-table-column label="沪深300" :prop="`index_r_${index + 1}`" align="center"></el-table-column>
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
            tableData: [],
            thead2: [
                // { title: '2018-01-01 ~ 2020-08-08 上涨行情', symbol: 'up' },
                // { title: '2018-01-01 ~ 2020-08-08 下跌行情', symbol: 'down' },
                // { title: '2018-01-01 ~ 2020-08-08 上涨行情', symbol: 'up' },
                // { title: '2018-01-01 ~ 2020-08-08 下跌行情', symbol: 'down' }
            ],
            tableData2: [
                {
                    col1: '收益',
                    manager_l_1: '1：manager_l_1', //第一列
                    index_r_1: '1：index_r_1',
                    manager_l_2: '1：manager_l_2', //第二列
                    index_r_2: '1：index_r_2',
                    manager_l_3: '1：manager_l_3',
                    index_r_3: '1：index_r_3',
                    manager_l_4: '1：manager_l_4',
                    index_r_4: '1：index_r_4'
                },
                {
                    col1: '回撤',
                    manager_l_1: '2：manager_l_1',
                    index_r_1: '2：index_r_1',
                    manager_l_2: '2：manager_l_2',
                    index_r_2: '2：index_r_2',
                    manager_l_3: '2：manager_l_3',
                    index_r_3: '2：index_r_3',
                    manager_l_4: '2：manager_l_4',
                    index_r_4: '2：index_r_4'
                },
                {
                    col1: '超额收益',
                    manager_l_1: '3：manager_l_1',
                    index_r_1: '3：index_r_1',
                    manager_l_2: '3：manager_l_2',
                    index_r_2: '3：index_r_2',
                    manager_l_3: '3：manager_l_3',
                    index_r_3: '3：index_r_3',
                    manager_l_4: '3：manager_l_4',
                    index_r_4: '3：index_r_4'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),
        fund_name() {
            return this.managerInfo.name
        },
        index_name() {
            let idx = this.indexOptions.find(item => item.value == this.index_value)
            return idx ? idx.label : ''
        }
    },
    methods: {
        headClass() {
            return 'text-align: center;background:#eef1f6;'
        },
        render() {
            !this.index_value && (this.index_value = '000300')
            this.$refs.range.init()
            // this.getChartData()
        },
        async getChartData() {
            this.isLoading = true
            const res = await push_request({
                // type: 'get_scenarios_return',
                // fund_innercode: '90614',
                // start_date: '2020-01-01',
                // end_date: '2020-11-03',
                type: 'get_manager_scenarios_return',
                request_id: 'test',
                exec_type: 'sync',
                personal_id: '101001815',
                manager_type: '1',
                start_date: '2015-01-01',
                end_date: '2020-11-04'
            })
            console.log(res);
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
            this.thead2 = []
            if (!summary.index) {
                this.allTableData = []
            } else {
                this.allTableData = summary.index.map((item, index) => {
                    this.thead2.push({
                        title: `${summary.start_date[index].slice(0, 10)} ~ ${summary.end_date[index].slice(0, 10)} ${
                            summary[this.index_value][index] > 0 ? '上涨行情' : '下跌行情'
                        }`,
                        symbol: summary[this.index_value][index] > 0 ? 'up' : 'down'
                    })
                    console.log(summary.start_date[index].slice(0, 10));
                    return {
                        title: item,
                        start: summary.start_date[index].slice(0, 10),
                        end: summary.end_date[index].slice(0, 10),
                        current: this.manageData(summary.cum_manager_r[index]),
                        index: this.manageData(summary[this.index_value][index]),
                        current2: summary.cum_manager_r[index],
                        index2: summary[this.index_value][index]
                    }
                })
                console.log(this.allTableData);
                summary.index.map((item, index) => {
                    return {
                        current: this.manageData(summary.cum_manager_r[index]),
                        index: this.manageData(summary[this.index_value][index]),
                        current2: summary.cum_manager_r[index],
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
                this.legend = [this.managerInfo.name, this.index_name]
                this.xData = summary.EndDate.map(item => item.slice(0, 10))
                this.seriesData = [summary.cum_manager_r, summary[this.index_value]]
                this.otherOptions = {
                    tooltip: {
                        axisPointer: {
                            type: 'none'
                        },
                        formatter: params => {
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
                                            show: end - start > len * 0.1
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
                props = ['事件', '起止日期', this.managerInfo.name, this.index_name].map(item => {
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
.risk-and-return-manager {
    background: #ffffff;
    .content {
        // display: flex;
        // justify-content: space-between;
        position: relative;
        padding: 16px;
        margin-bottom: 16px;
        // & > div {
        //     width: 50%;
        //     padding: 10px 0 16px 0;
        // }
        & > div:last-child {
            padding-top: 12px;
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
    /deep/ .el-table th > .cell {
        padding: 0;
        height: 100%;
        line-height: 39px;
    }
    /deep/ .el-table td:first-child {
        background: #f5f5f5;
    }
    /deep/ .el-table thead th:not(:first-child) {
        background: #fff;
    }
}
</style>