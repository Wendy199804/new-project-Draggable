<template>
    <div class="intervalReturn">
        <moduletitle :title="'区间收益'">
            <div class="benchmark" v-if="selectFundToAnalyze.type !== 2">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>
            <div class="jiezhidate">
                <span>截止日期：</span>
                <el-date-picker
                    v-model="end_date"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    @change="getChartData"
                    style="width:150px"
                ></el-date-picker>
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>
        <div class="card-body chart-wrap">
            <div id="qjsy" class="height320" style="width:100%">
                <vApartChart
                    ref="chart"
                    type="bar"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :isPct="true"
                />
                    <p v-show="min_startdate" class="annotation-p">
                        <!-- <svg-icon icon-class="mark" class="annotation" /> -->
                        注：区间最小起始日期为 <span>{{min_startdate}}</span>
                    </p>
            </div>
            <vLoading :show="isLoading" />
            <vNodata :show="!result&&!isLoading" />
        </div>
        <Riskcon :color="'#FFCCCC'" :rank="0.15"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Riskcon from '@/components/localComponents/riskCon'
import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { push_request } from '@/api/analysis'
import { benchmarkValue } from '@/utils/analyze'

export default {
    data() {
        return {
            legend: '',
            xData: [],
            seriesData: [],

            // benchmarkValue: ['1', '000300'], //基准
            benchmarkOptions: allBenchmark,

            result: '',
            isLoading: false,
            end_date: '', //截止日期

            xdata: {
                year_start: '今年以来',
                one_month: '近一个月',
                three_months: '近三个月',
                six_months: '近六个月',
                one_year: '近一年',
                three_years: '近三年',
                five_years: '近五年',
                since_founded: '成立以来'
            },
            min_startdate:'', 

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
        }
    },
    components: {
        Riskcon
    },
    methods: {
        async getEndDate() {
            try {
                const result = await push_request({
                    type: 'get_fund_latest_nv_day',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString()
                })
                this.end_date = JSON.stringify(result) == '{}' ? '' : result
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        async getChartData(date) {
            this.isLoading = true
            if (this.end_date == '') {
                setTimeout(() => {
                    this.isLoading = false
                }, 150)
                return
            }
            this.legend = [this.selectFundToAnalyze.name, this.index_name]
            try {
                const result = await push_request({
                    type: 'get_fund_index_interval_return',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                    index_code: this.benchmarkValue[1],
                    end_date: this.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                this.draw('chart')
                // this.$forceUpdate()
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                let data = this.result.interval_returns
                this.xData = data.intervals.map((item, index) => {
                    return this.xdata[item]
                })
                this.seriesData = [data.fund_interval_returns, data.index_interval_returns]
                this.min_startdate = this.result.start
            }
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        async render() {
            await this.getEndDate()
            await this.getChartData()
        },
        refreshChart() {
            this.render()
        },
        handleDownload() {
            let list = [{ id: 'qjsy', imgName: `区间收益` }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.intervalReturn {
    background-color: #ffffff;
    margin-bottom: 16px;
    position: relative;
    .chart-wrap {
        position: relative;
        padding: 16px 16px 0 0;
    }
    .annotation-p {
        padding: 16px 30px;
        color: #999;
        
        .annotation {
            font-size: 14px;
            color: #999;
            margin-right: 5px;
        }
    }
    /deep/ .el-input__suffix-inner{
        display: none;
    }
    /deep/ .el-icon-circle-close:before {
        content: '\E78D';
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
    }
}
</style>