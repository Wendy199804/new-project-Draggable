<template>
    <div class="trajectory">
        <moduletitle :title="'业绩走势'" type="manager">
            <div class="benchmark">
                <span>基准</span>
                <el-cascader
                    v-model="benchmarkValue"
                    :options="benchmarkOptions"
                    :props="{ expandTrigger: 'hover' }"
                    @change="getChartData"
                ></el-cascader>
            </div>

            <div class="timeframe" style="margin-right:8px">
                <span>时段</span>
                <keep-alive>
                    <vDateRangePicker
                        ref="range"
                        type="year"
                        use="manager"
                        class="mr"
                        @change="getChartData"
                    />
                </keep-alive>
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>

        <div class="content" id="manjlzs">
            <p class="bold">基金经理指数
                <el-popover class="font14"
                    v-if="managerAnnotation('基金经理指数')[0]"
                    ref="popover"
                    placement="right"
                    width="300"
                    trigger="hover"
                    propper-class="propper-box"
                    :content="managerAnnotation('基金经理指数')[0]"
                >
                    <span slot="reference">
                        <svg-icon icon-class="mark" class="pointer" />
                    </span>
                </el-popover>
            </p>
            <vHalfChart
                ref="chart_l"
                type="line"
                grid="grid_l"
                :legend="legend"
                :xData="xData_L"
                :seriesData="seriesData_L"
                :isPct="true"
                formatterType="lineSort"
            ></vHalfChart>
            <vLoading :show="isLoading" />
            <vNodata :show="!result&&!isLoading" />
            <div class="legend"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import { allBenchmark, getIndexName } from '@/utils/benchmark'

import managerAnnotation from '@/utils/managerAnnotation'

export default {
    data() {
        return {
            networthValue: 'complexnv', //净值
            showValue: 'return', //显示
            benchmarkValue: ['1', '000300'], //基准

            showOptions: [
                { value: 'return', label: '收益' },
                { value: 'nv', label: '净值' }
            ],
            networthOptions: [
                { label: '复权单位净值', value: 'complexnv' },
                { label: '原始净值', value: 'unitnv' },
                { label: '累计净值', value: 'accuunitnv' }
            ],
            benchmarkOptions: allBenchmark, // 基准可选

            legend: '',
            xData_L: [],
            seriesData_L: [],

            isLoading: false,

            result: '',
        }
    },
    computed: {
        ...mapGetters(['managerInfo']),
        index_name() {
            return getIndexName(this.benchmarkValue[1])
        }
    },
   
    methods: {
        managerAnnotation(label) {
            return managerAnnotation(label)
        },
        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                { id: 'manjlzs', imgName: '基金经理指数' }
            ]
            this.$downloadImg(list)
        },
        /**
         * 刷新
         */
        refreshChart() {
            this.render()
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        async gettime() {
            try {
                const result = await push_request({
                    type: 'manager_index_curve',
                    exec_type: 'sync',
                    personal_id: this.managerInfo.id.toString(),
                    manager_type: this.managerInfo.type
                })
            } catch {}
        },
        /**数据 */
        async getChartData() {
            this.legend = [this.managerInfo.name, this.index_name]
            this.isLoading = true
            try {
                const result = await push_request({
                    type: 'manager_index_curve',
                    exec_type: 'sync',
                    personal_id: this.managerInfo.id.toString(),
                    manager_type: this.managerInfo.type,
                    index_code: this.benchmarkValue[1],
                    begin: this.$refs.range.start_date,
                    end: this.$refs.range.end_date
                })
                // this.result = result
                this.result = JSON.stringify(result) == '{}' ? '' : result
                // this.resultr = JSON.stringify(result.manager_index_drawdown) == '[]' ? '' : result.manager_index_drawdown
                // this.resultl = JSON.stringify(result.manager_index) == '[]' ? '' : result.manager_index
                this.handleResult()
                this.draw('chart_l')
                this.isLoading = false
                
            } catch {
                this.isLoading = false
            }
        },

        handleResult() {
            let data = this.result
            if (data) {
                this.xData_L = data.TradingDay.map(item => item.split(' ')[0])
                this.seriesData_L = [data.manager_index, data.base]
            }
           
        },
        render() {
            this.$refs.range.init('one_year')
        }
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
        padding: 16px 0;
        position: relative;
        & > p {
            padding-left: 16px;
            margin-bottom: 4px;
        }
        /deep/ .chart {
            width: 100%;
            height: 320px;
        }
    }
    /deep/ .el-select {
        width: 120px;
    }
}
</style>