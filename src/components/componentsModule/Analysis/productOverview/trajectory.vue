<template>
    <!-- 非货基 -->
    <div class="trajectory">
        <moduletitle title="业绩走势">
            <div class="benchmark">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>

            <div class="timeframe" style="margin-right: 8px">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker ref="range" type="year" :config="_config" :showOneMonth="true" class="mr" @change="getChartData" />
                </keep-alive>
            </div>
            
        </moduletitle>
        <div class="content">
            <div id="anasyzs">
                <p class="bold">收益表现</p>
                <vHalfChart
                    ref="chart_l"
                    type="line"
                    grid="grid_change_manager"
                    :legend="legend"
                    :xData="xData"
                    :otherOptions="otherOptions"
                    :seriesData="seriesData_L"
                    :seriesOptions="seriesOptions_L"
                    colorKey="average"
                    :isPct="true"
                ></vHalfChart>
                <vLoading :show="isLoading" />
                <vNodata :show="!result && !isLoading" />
                <div class="legend"></div>
            </div>
            <div id="anadthc">
                <p class="bold">动态回撤
                    <el-popover
                        v-if="analisisAnnotation(`动态回撤`)[0]"
                        ref="popover"
                        placement="right"
                        width="300"
                        trigger="hover"
                        propper-class="propper-box"
                        :content="analisisAnnotation(`动态回撤`)[0]"
                    >
                        <span slot="reference">
                            <svg-icon icon-class="mark" class="annotation" />
                        </span>
                    </el-popover>
                </p>
                <vHalfChart
                    ref="chart_r"
                    type="line"
                    grid="grid_change_manager"
                    :legend="legend"
                    :xData="xData"
                    :otherOptions="otherOptions"
                    :seriesData="seriesData_R"
                    :seriesOptions="seriesOptions_R"
                    colorKey="average"
                    :isPct="true"
                    name="needy"
                ></vHalfChart>
                <vLoading :show="isLoading" />
                <!-- <vNodata :show="isLoading&&xData_R.length===0" /> -->
                <vNodata :show="!result && !isLoading" />
                <div class="legend"></div>
            </div>
        </div>
    </div>
</template>
 
<script>
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { benchmarkValue, getClosestX } from '@/utils/analyze'

import analisisAnnotation from '@/utils/analisisAnnotation'

export default {
    props: {
        config: { type: Array, default: () => [] },
        daterange_init: ''
    },
    data() {
        return {
            networthValue: 'complexnv', //净值
            showValue: 'return', //显示
            sv: '收益',

            showOptions: [
                { value: 'return', label: '收益' },
                { value: 'nv', label: '净值' }
            ],
            networthOptions: [
                { label: '复权单位净值', value: 'complexnv' },
                { label: '单位净值', value: 'unitnv' },
                { label: '累计净值', value: 'accuunitnv' }
            ],
            benchmarkOptions: [...allBenchmark], // 基准可选

            legend: [],
            xData: [],
            otherOptions: {},
            seriesData_L: [],
            seriesOptions_L: [{}, {}, {}, {}, {}],
            seriesData_R: [],
            seriesOptions_R: [{ areaStyle: {} }, {}, {}, {}, {}],

            isLoading: false,
            result: '',
            timeRange: {}, //时段
            benchmarkvalue: ''
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
            }
        },
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        },
        _config() {
            return this.config.length === 0 ? [] : this.config
        }
    },
    created() {
        this.benchmarkOptions[this.benchmarkOptions.length - 1].label === '业绩比较基准'
            ? ''
            : this.benchmarkOptions.push({ label: '业绩比较基准', value: 'benchmark' })
    },
    methods: {
        analisisAnnotation(label) {
            return analisisAnnotation(label)
        },
        render() {
            !this.daterange_init ? this.$refs.range.init('one_year') : this.$refs.range.init(this.daterange_init)
        },

        async getChartData(date) {
            this.isLoading = true
            try {
                const result = await push_request({
                    type: 'get_fund_historical_performance',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    index_code: this.benchmarkValue.length === 1 ? this.benchmarkValue[0] : this.benchmarkValue[1],
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            this.init()
            let aa = this.networthValue === 'complexnv' ? 'complex' : this.networthValue === 'unitnv' ? 'unit' : 'cum'
            let index_code = this.benchmarkValue.length === 1 ? this.benchmarkValue[0] : this.benchmarkValue[1]
            let legend = this.benchmarkValue.length === 1 ? '业绩比较基准' : this.index_name
            this.legend = [this.selectFundToAnalyze.name, `同类平均(${this.selectFundToAnalyze.firsttypeChi})`, legend]
            let data_l = this.result['cumulative_' + this.showValue + '_unitnv']
            let data_r = this.result.drawdown_unitnv
            if (this.result) {
                this.xData = data_l.EndDate.map(item => item.slice(0, 10))
                this.seriesData_L = [
                        data_l[this.networthValue + '_cumulative_' + this.showValue],
                        data_l['class_' + aa + '_return'],
                        data_l[index_code],
                        [],
                        []
                    ]
                this.seriesData_R = [
                    data_r[this.networthValue + '_drawdown'],
                    data_r['class_' + aa + '_drawdown'],
                    data_r[index_code],
                    [], []
                ]
                this.setMark()
                this.draw('chart_l')
                this.draw('chart_r')
            }
        },
        setMark() {
            let managerdate = this.result.manager_change_info,
                date_all = Object.values(managerdate.all),
                date_part = Object.values(managerdate.part),
                mark_all = [],
                mark_part = []
            // 添加标记
            let mark = { symbolSize: 15 }
            let y = 320 - 30
            // 变更全部基金经理 实心标记
            if (date_all.length) {
                date_all.map((item, index) => {
                    let i = this.xData.indexOf(item)
                    i < 0 && (i = getClosestX(this.xData, item))
                    mark_all.push({
                        name: `更换基金经理${index + 1}`,
                        xAxis: i,
                        y,
                        itemStyle: { color: '#47E5C9' }
                    })
                })
                let markPoint = Object.assign({ data: [...mark_all] }, mark)
                this.seriesOptions_L[3] = { markPoint }
                this.seriesOptions_R[3] = { markPoint }
                this.legend.push('更换基金经理')
            }
            // 变更部分基金经理 空心标记
            if (date_part.length) {
                date_part.map((item, index) => {
                    let i = this.xData.indexOf(item)
                    i < 0 && (i = getClosestX(this.xData, item))
                    mark_part.push({
                        name: `更换部分基金经理${index + 1}`,
                        xAxis: i,
                        y,
                        itemStyle: { color: '#fff', borderColor: '#47E5C9' }
                    })
                })
                let markPoint = Object.assign({ data: [...mark_part] }, mark)
                this.seriesOptions_L[4] = { markPoint }
                this.seriesOptions_R[4] = { markPoint }
                this.legend.push('更换部分基金经理')
            }
            // tooltip
            this.otherOptions = {
                tooltip: {
                    trigger: 'axis',
                    formatter: params => {
                        let str = `<span>${params[0].axisValueLabel}</span><br/>`
                        params.forEach(item => {
                            str += `${item.marker}<span>${item.seriesName}：${(item.value * 100).toFixed(2)}%</span><br/>`
                        })
                        if (mark_all.map(item => item.xAxis).includes(params[0].dataIndex)) {
                            str += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#47E5C9;"></span>更换基金经理`
                        }
                        if (mark_part.map(item => item.xAxis).includes(params[0].dataIndex)) {
                            str += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#47E5C9;"></span>更换部分基金经理`
                        }
                        return str
                    }
                }
            }
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        init() {
            this.xData = []
            this.seriesData_L = []
            this.seriesData_R = []
            this.seriesOptions_L = [{}, {}, {}, {}, {}]
            this.seriesOptions_R = [{ areaStyle: {} }, {}, {}, {}, {}]
        },
        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                { id: 'anasyzs', imgName: '收益表现' },
                { id: 'anadthc', imgName: '动态回撤' }
            ]
            this.$downloadImg(list)
        },
    }
}
</script>

<style lang="scss" scoped>
.trajectory {
    background-color: #ffffff;
    margin-bottom: 16px;
    color: #333;
    .content {
        width: 100%;
        height: 390px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        & > p {
            text-align: center;
            line-height: 320px;
            width: 50%;
        }
        & > div {
            width: 50%;
            position: relative;

            & > p {
                margin-bottom: 4px;
                margin-left: 16px;
            }
        }
        & > div:first-child {
            border-right: 1px solid #dddddd;
        }
        /deep/ .chart {
            width: 100%;
            height: 320px;
        }
    }
    /deep/ .el-select {
        width: 120px;
    }
    .annotation {
        color: #333;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>