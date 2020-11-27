<template>
    <div class="card">
        <moduletitle
            title="股票组合的收益因子分解"
            :tablist="tabList"
            :secondary="true"
            :isright="true"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        >
            <div class="benchmark">
                <span>基准</span>
                <el-select v-model="index_value" size="mini" class="mr" @change="getChartData">
                    <el-option v-for="(item, index) in indexOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </div>
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker
                    type="year"
                    :config="['since_founded']"
                    ref="range" @change="getChartData"
                />
            </div>
            <div>
                <svg-icon
                    :icon-class="`is-chart${isChart ? '-active' : ''}`"
                    @click="isChart = true">
                </svg-icon>
                <svg-icon
                    :icon-class="`is-table${isChart ? '' : '-active'}`"
                    style="margin-left: 0;"
                    @click="isChart = false">
                </svg-icon>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body no-padding-lr">
            <div class="relative" v-show="isChart">
                <moduletitle
                    :secondary="true"
                    :hasborder="false"
                    :tablist="subTabList"
                    :curtab="subTabList[activeIndex]"
                    @clickTab="handleTabClick"
                >
                    <div>
                        <span>图表</span>
                        <el-select v-model="type_value" size="mini" class="mr" style="width: 196px;" @change="handleResult">
                            <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>频率</span>
                        <el-select v-model="freq_value" size="mini" @change="handleResult" style="width: 80px;">
                            <el-option v-for="(item, index) in freqOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </moduletitle>
                <div id="factorDistributionChart" class="padding-r">
                    <vApartChart ref="chart1"
                        type="bar"
                        :legend="legend"
                        :xData="xData"
                        :seriesData="seriesData"
                        :colorKey="colorKeyMap[type_value.split('_')[0]]"
                        :seriesOptions="seriesOptions"
                        :isStack="true"
                        :isPct="true"
                        :hideZero="['industry_total', 'industry'].includes(type_value) ? true : false"
                        :formatterType="['style_total', 'style', 'industry_total', 'industry'].includes(type_value) ? 'stackSort' : ''"
                        :tooltipType="['style_total', 'style', 'industry_total', 'industry'].includes(type_value) ? 'barStack' : ''"
                    />
                </div>
                <div class="padding-lr" v-if="seriesData">
                    <div class="summary" v-html="annotation"></div>
                </div>
                <vLoading :show="isLoading" />
                <vNodata :show="!seriesData && !isLoading" />
            </div>
            <div v-if="!isChart" class="padding-lr" style="margin-top: 16px; overflow: hidden;">
                <el-table class="left" style="width: 50%; border-right: 0;"
                    ref="table1"
                    :data="tableData1"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    :expand-row-keys="expandRows"
                    @expand-change="handleExpandChange"
                    :cell-style="getCellStyle"
                >
                    <el-table-column label="收益/因子" prop="label"></el-table-column>
                    <el-table-column label="收益贡献" prop="value" align="center"></el-table-column>
                </el-table>
                <el-table class="left" style="width: 50%;"
                    ref="table2"
                    :data="tableData2"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    :expand-row-keys="expandRows"
                    @expand-change="handleExpandChange"
                    :cell-style="getCellStyle"
                >
                    <el-table-column label="收益/因子" prop="label"></el-table-column>
                    <el-table-column label="收益贡献" prop="value" align="center"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { push_request } from '@/api/analysis';
import { getCurrentSummary } from './summary';

export default {
    data() {
        return {
            tabList: [
                {name: '前十大重仓股', id: 'top10'},
                {name: '全部持仓', id: 'all'}
            ],
            activeTab: 0,
            indexOptions: [
                {label: '上证50', value: '000016'},
                {label: '沪深300', value: '000300'},
                {label: '中证500', value: '000905'},
                {label: '中证100', value: '000903'},
                {label: '上证180', value: '000010'},
                {label: '深证100', value: '399330'},
                {label: '创业板指', value: '399006'},
                {label: '中小板指', value: '399005'}
            ],
            index_value: '',

            isLoading: false,
            result: null,
            isChart: true,

            subTabList: [
                {name: '总收益', id: 'total'},
                {name: '主动性收益', id: 'active'},
            ],
            activeIndex: 0,
            totalOptions: [
                {label: '组合总收益分解', value: 'total'},
                {label: '组合总收益因子分解', value: 'total_level2'},
                {label: '组合总收益风格因子分解', value: 'style_total'},
                {label: '组合总收益行业因子分解', value: 'industry_total'}
            ],
            activeOptions: [
                {label: '组合主动性收益因子分解', value: 'active'},
                {label: '组合主动性收益风格因子分解', value: 'style'},
                {label: '组合主动性收益行业因子分解', value: 'industry'}
            ],
            type_value: '',
            colorKeyMap: {
                'total': 'returnAttribution',
                'style': 'styleFactors',
                'industry': 'swIndustry',
                'active': 'activeReturnAttribution'
            },
            freqOptions: [
                {label: '日频', value: 'daily'},
                {label: '月频', value: 'monthly'}
            ],
            freq_value: '',

            legend: [],
            xData: null,
            seriesData: null,
            seriesOptions: [],
            annotation: '',

            tableData1: [],
            tableData2: [],
            expandRows: ['1']
        }
    },
    computed: {
        ...mapGetters([
            'selectFundToAnalyze'
        ]),
        typeOptions() {
            return this[`${this.subTabList[this.activeIndex].id}Options`]
        }
    },
    methods: {
        render() {
            this.index_value = '000300'
            this.$refs.range.init('one_year')
        },
        handleTabClick(index) {
            this.activeIndex = index
            this.type_value = this.typeOptions[1-index].value
            this.handleResult()
        },
        async getChartData() {
            this.isChart = true
            this.isLoading = true
            const res = await push_request({
                type: 'stock_portfolio_return_decomposition_by_port_type',
                fund_innercode: this.selectFundToAnalyze.innercode,
                index_code: this.index_value,
                start_date: this.$refs.range.start_date,
                end_date: this.$refs.range.end_date,
                port_type: this.tabList[this.activeTab].id
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                this.annotation = ''
                return
            }
            this.result = res
            this.handleTabClick(0)
            this.getTableData()
        },
        /**
         * 股票组合收益分解
         */
        handleResult() {
            try {
                !this.freq_value && (this.freq_value = 'daily')
                this.summary1 = this.result[this.type_value + '_' + this.freq_value + '_return_decomposition']
                switch (this.type_value) {
                    case 'total':
                        this.updateChart1()
                        break
                    case 'total_level2':
                        this.updateChart2('portfolio')
                        break
                    case 'active':
                        this.updateChart2('active')
                        break
                    case 'style_total':
                        this.updateChart3()
                        break
                    case 'industry_total':
                        this.updateChart3()
                        break
                    case 'style':
                        this.updateChart3()
                        break
                    case 'industry':
                        this.updateChart3()
                        break
                }
            } catch (err) {
                this.seriesData = null
            }
        },
        updateChart1() {
            this.legend = ['总收益', '主动性收益', '基准收益']
            this.getXData1()
            this.seriesData = [
                this.summary1.portfolio_return,
                this.summary1.active_return,
                this.summary1.index_return
            ]
            this.seriesOptions = [{
                type: 'line',
                symbolSize: 4,
                stack: '',
                lineStyle: {width: 2},
                areaStyle: {color: 'transparent'}
            }, null, null]

            // 文案
            this.annotation = getCurrentSummary(this.type_value, {
                slot1: this.formatData(this.summary1.portfolio_return.slice(-1)[0], true),
                slot2: this.formatData(this.summary1.index_return.slice(-1)[0],true),
                slot3: this.formatData(this.summary1.active_return.slice(-1)[0], true)
            })
            this.draw('chart1')
        },
        updateChart2(type) {
            this.legend = [type == 'active' ? '主动性收益' : '总收益', '风格因子', '行业因子', '全A因子', '个股选择']
            this.getXData1()
            this.seriesData = [
                this.summary1[type + '_return'],
                this.summary1.style_factor,
                this.summary1.industry_factor,
                this.summary1.country,
                this.summary1.stock_selection
            ]
            this.seriesOptions = [{
                type: 'line',
                symbolSize: 4,
                stack: '',
                lineStyle: {width: 2},
                areaStyle: {color: 'transparent'}
            }, null, null, null]

            // 文案
            this.annotation = getCurrentSummary(this.type_value)
            this.draw('chart1')
        },
        updateChart3() {
            this.legend = Object.keys(this.summary1)
            if (this.freq_value == 'daily') {
                this.legend.splice(this.legend.indexOf('EndDate'), 1)
            } else {
                this.legend.splice(this.legend.indexOf('year'), 1)
                this.legend.splice(this.legend.indexOf('month'), 1)
            }
            this.getXData1()
            this.seriesData = this.legend.map(factor => {
                return this.summary1[factor]
            })
            this.seriesOptions = []

            // 文案
            let last = this.legend.map(factor => {
                return this.summary1[factor].slice(-1)[0]
            }),
                max = Math.max(...last),
                min = Math.min(...last)
            this.annotation = getCurrentSummary(this.type_value, {
                slot1: this.legend[last.findIndex(item => item == max)],
                slot2: this.formatData(max, true),
                slot3: this.legend[last.findIndex(item => item == min)],
                slot4: this.formatData(min, true)
            })
            this.draw('chart1')
        },
        getXData1() {
            if (this.freq_value == 'daily') {
                this.xData = this.summary1.EndDate.map(item => item.slice(0, 10))
            } else {
                this.xData = this.summary1.year.map((year, index) => year + '-' + this.summary1.month[index])
            }
        },
        formatData(data, isPct) {
            if (data === 0) return `0${isPct ? '%' : ''}`
            if (!data) return '--'
            if (isPct) return (data * 100).toFixed(2) + '%'
            return (data * 100).toFixed(2)
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        getTableData() {
            let tables = [
                {label: '总收益', key:'total_level2', key2: 'portfolio_return'},
                {label: '主动性收益', key: 'active', key2: 'active_return'},
            ].map((item, index) => {
                item.id = '1'
                item.children = [
                    {id: '10', label: '全A因子', key: 'country'},
                    {id: '11', label: '风格因子', key: 'industry_factor',
                        childrenKey: `style${index == 0 ? '_total' : ''}`},
                    {id: '12', label: '行业因子', key: 'style_factor',
                        childrenKey: `industry${index == 0 ? '_total' : ''}`},
                    {id: '13', label: '个股选择', key: 'stock_selection'}
                ]
                return item
            })
            tables.forEach((table, index) => {
                const suffix = '_daily_return_decomposition'
                let data = this.result[`${table.key}${suffix}`],
                    idx = data.EndDate.length - 1
                table.value = this.formatData(data[table.key2][idx], true)
                table.children.forEach(child => {
                    child.value = this.formatData(data[child.key][idx], true)
                    if (child.childrenKey) {
                        let childrenData = this.result[`${child.childrenKey}${suffix}`]
                        let labels = Object.keys(childrenData).filter(item => item !== 'EndDate')
                        child.children = labels.map((label, i) => {
                            return {
                                id: `${child.id}${i}`,
                                label,
                                value: this.formatData(childrenData[label][idx], true)
                            }
                        })
                    }
                })
                this[`tableData${index+1}`] = [table]
            })
        },
        handleExpandChange(row, expanded) {
            this.$refs['table1'].toggleRowExpansion(row, expanded)
            this.$refs['table2'].toggleRowExpansion(row, expanded)
        },
        getCellStyle({row, column, columnIndex}) {
            if (+row.id > 100) {
                return { 'background': 'rgba(143, 174, 254, .04)' }
            } else {
                if (columnIndex == 1) {
                    let data = row[column.property],
                        num = data == '--' ? 0 : data.slice(0, -1)
                    return { 'color': num > 0 ? '#FD484C' : (num < 0 ? '#50C75A' : '') }
                }
            }
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                {id: 'factorDistributionChart', imgName: '股票组合收益分解'},
            ]
            this.$downloadImg(list)
        },
        handleExcel() {
            let table_data = [
                    this.getDeepData([], this.tableData1),
                    this.getDeepData([], this.tableData2)
                ],
                props = ['收益/因子', '收益贡献'],
                keys = ['label', 'value']
            this.$downloadExcel(
                table_data,
                [props, props],
                [keys, keys],
                ['总收益因子分解', '主动性收益因子分解'],
                false, true
            )
        },
        getDeepData(copy, data) {
            data.forEach(item => {
                copy.push({
                    label: item.label,
                    value: item.value
                })
                if (item.children) {
                    return this.getDeepData(copy, item.children)
                }
            })
            return copy
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    .card-body{
        padding-top: 0 !important;
        .title-bar{
            padding: 0 !important;
            margin-bottom: 10px;
            &.ml{ margin-left: 20px; }
            &.mr{ margin-right: 20px; }
        }
        .tab{
            display: inline-block;
        }
    }
}
</style>