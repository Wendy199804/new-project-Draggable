<template>
    <div class="intervalReturn">
        <moduletitle :title="'区间最大回撤'" type="manager">
            <div class="benchmark">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>
            <div class="jiezhidate">
                <span>截止日期</span>
                <el-date-picker
                    v-model="end_date"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    @blur="getChartData"
                    style="width:150px"
                ></el-date-picker>
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>
        <div class="card-body chart-wrap content">
            <div class="height320">
                <vApartChart
                    id="manqjzdhc"
                    ref="chart"
                    type="bar"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :isPct="true"
                />
                <p v-show="min_startdate" class="annotation-p">
                    注：区间最小起始日期为
                    <span>{{min_startdate}}</span>
                </p>
            </div>
            <vLoading :show="isLoading" />
            <vNodata :show="!result&&!isLoading" />
        </div>

        <!--  -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { allBenchmark, getIndexName } from '@/utils/benchmark'
import { push_request } from '@/api/analysis'

export default {
    data() {
        return {
            legend: '',
            xData: [],
            seriesData: [],

            benchmarkValue: ['1', '000300'], //基准
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
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        }
    },
    methods: {
        async getEndDate() {
            try {
                const result = await push_request({
                    type: 'get_end_date',
                    exec_type: 'sync',
                    personal_id: this.managerInfo.id.toString(),
                    manager_type: this.managerInfo.type
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
            
            this.legend = [this.managerInfo.name, this.index_name]
            try {
                const result = await push_request({
                    type: 'manager_interval_draw_down',
                    exec_type: 'sync',
                    personal_id: this.managerInfo.id.toString(),
                    index_code: this.benchmarkValue[1],
                    manager_type: this.managerInfo.type,
                    end_date: this.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                this.draw('chart')
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                this.min_startdate = this.result.start
                let data = this.result.interval_mdds
                this.xData = data.intervals.map((item, index) => {
                    return this.xdata[item]
                })
                this.seriesData = [data.manager_max_draw_down, data.base_max_draw_down]
            }
        },
        /**下载图片 */
        handleDownload() {
            let list = [{ id: 'manqjzdhc', imgName: '区间最大回撤' }]
            this.$downloadImg(list)
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
        }
    }
}
</script>

<style lang="scss" scoped>
.intervalReturn {
    background-color: #ffffff;
    margin-bottom: 16px;
    // position: relative;
    .chart-wrap {
        margin-top: 16px;
        position: relative;
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
    .content {
        position: relative;
        padding-right: 16px;
    }
    /deep/ .el-icon-circle-close:before {
        content: '\E78D';
        top: 50%;
        position: absolute;
        transform: translateY(-50%);
    }
    /deep/ .el-input__suffix-inner{
        display: none;
    }
}
</style>