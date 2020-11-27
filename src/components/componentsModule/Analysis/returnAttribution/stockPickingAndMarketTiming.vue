<template>
    <div class="card">
        <div class="card-body">
            <div class="double divided">
                <div class="relative">
                    <moduletitle title="调仓时机">
                        <div class="benchmark">
                            <span>时段</span>
                            <el-select v-model="interval_value" placeholder="请选择" size="mini" @change="getChartData1" class="mr">
                                <el-option v-for="(item, index) in intervalOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                        <div>
                            <svg-icon icon-class="download" @click="handleDownload(0)"></svg-icon>
                            <svg-icon icon-class="reload" @click="getChartData1"></svg-icon>
                        </div>
                    </moduletitle>
                    <div class="relative" id="holdingChangeChart" style="padding: 16px 0;">
                        <vHalfChart ref="chart"
                            type="line"
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
                </div>

                <div class="relative">
                    <moduletitle title="选股择时">
                        <div>
                            <svg-icon icon-class="download" @click="handleDownload(1)"></svg-icon>
                            <svg-icon icon-class="reload" @click="getChartData2"></svg-icon>
                        </div>
                    </moduletitle>
                    <div class="relative flex-wrap" id="selectAndTimingChart">
                        <div v-for="(item, idx) in ['stock', 'timing']" :key="idx">
                            <div class="flex-label">{{{'stock': '选股', 'timing': '择时'}[item]}}能力</div>
                            <div v-for="(period, index) in periodOptions" :key="index" class="flex-item">
                                <div v-if="timingData && timingData[item]" class="border"> 
                                    <div v-for="(level, i) in levelOption" :key="i"
                                        :class="[{'active': level.value == timingData[item][period.value]}, `level${i}`]"
                                    >
                                        {{level.label}}
                                    </div>
                                </div>
                                <p v-if="idx == 0" class="mark">{{period.label}}</p>
                            </div>
                        </div>
                        <vLoading :show="isLoading_r" />
                        <vNodata :show="!timingData && !isLoading_r" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { baseBenchmark } from '@/utils/benchmark';
import { push_request } from '@/api/analysis';

export default {
    data() {
        return {
            intervalOptions: [
                {label: '最近1年', value: 'one_year'},
                {label: '最近2年', value: 'two_years'},
                {label: '最近3年', value: 'three_years'},
                {label: '最近5年', value: 'five_years'},
                {label: '最近10年', value: 'ten_years'},
                {label: '成立以来', value: 'all'}
            ],
            interval_value: 'five_years',

            isLoading_l: false,
            legend: [],
            xData: [],
            seriesData: null,
            seriesOptions: [],
            otherOptions: {},
            add: [],
            count: [],

            periodOptions: [
                {label: '成立以来', value: 'since_founded'},
                {label: '近两年', value: 'two_years'},
                {label: '近三年', value: 'three_years'},
                {label: '近五年', value: 'five_years'}
            ],

            index_value: '000300',
            model_value: 'tm',
            isLoading_r: false,
            timingData: null,
            levelOption: [
                {label: '不显著', value: 0},
                {label: '一般', value: 1},
                {label: '强', value: 2},
            ]
        }
    },
    computed: {
        ...mapGetters([
            'selectFundToAnalyze'
        ])
    },
    methods: {
        render() {
            this.getChartData1()
            this.getChartData2()
        },

        async getChartData1() {
            this.isLoading_l = true
            const res = await push_request({
                type: 'get_adjust_time',
                fund_innercode: this.selectFundToAnalyze.innercode,
                interval: this.interval_value
            })
            this.isLoading_l = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = ['沪深300']
            this.xData = res['收盘数据'].date.map(item => item.slice(0, 10))
            this.seriesData = [
                res['收盘数据'].close
            ]
            this.seriesOptions = [null]

            // 加仓、减仓标识
            let addData = res['加仓时机'].date.map(item => {
                let x = item.slice(0, 10),
                    idx = this.xData.indexOf(x)
                if (idx < 0) {
                    idx = this.getClosestX(this.xData, x)
                }
                return [this.xData[idx], this.seriesData[0][idx]]
            })
            let countData = res['减仓时机'].date.map(item => {
                let x = item.slice(0, 10),
                    idx = this.xData.indexOf(x)
                if (idx < 0) {
                    idx = this.getClosestX(this.xData, x)
                }
                return [this.xData[idx], this.seriesData[0][idx]]
            })
            this.add = res['加仓时机'].date.map(item => item.slice(0, 10))
            this.count = res['减仓时机'].date.map(item => item.slice(0, 10))

            // if (addData.length) {
                this.legend.push('大幅加仓')
                this.seriesData.push([])
                this.seriesOptions.push({
                    type: 'scatter',
                    silent: true,
                    symbol: 'path://M920.364138 408.364138C920.364138 681.842759 512 1019.762759 512 1019.762759S103.635862 681.842759 103.635862 408.364138a408.364138 408.364138 0 0 1 816.728276 0z',
                    symbolSize: [13, 16],
                    symbolOffset: [0, -14],
                    color: '#FF6673',
                    label: {
                        show: true,
                        formatter: '＋',
                        fontWeight: 900,
                        color: '#fff',
                        offset: [0, -1]
                    },
                    data: addData
                })
            // }
            // if (countData.length) {
                this.legend.push('大幅减仓')
                this.seriesData.push([])
                this.seriesOptions.push({
                    type: 'scatter',
                    silent: true,
                    symbol: 'path://M909.426667 12C863.906667 12 545.333333 398.84 545.333333 649.16c0 200.253333 163.84 364.093333 364.093334 364.093333s364.093333-163.84 364.093333-364.093333C1273.506667 398.84 954.933333 12 909.426667 12z',
                    symbolSize: [13, 16],
                    symbolOffset: [0, 14],
                    color: '#52DE60',
                    label: {
                        show: true,
                        formatter: '－',
                        fontWeight: 900,
                        offset: [0, 1]
                    },
                    data: countData
                })
            // }
            this.otherOptions = {
                tooltip: {
                    formatter: (params) => {
                        let str = ``
                        params.forEach((item, index) => {
                            if (index == 0) {
                                str += `${item.axisValue}
                                <br>${item.marker}${item.seriesName}: ${item.data.toFixed(2)}`
                            } else {
                                str += `<br>${item.marker}${item.seriesName}`
                                // let all = [...this.add, ...this.count].map(item => item.slice(0, 10))
                                // if (!all.find(i => i == item.axisValue)) {
                                //     let idx = item.dataIndex,
                                //         list = item.seriesName == '大幅加仓' ? this.add : this.count
                                //     str += `(${list[idx]})`
                                // }
                            }
                        })
                        return str
                    }
                }
            }
            this.draw('chart')
        },
        getClosestX(list, x) {
            return list.findIndex((item, index) => {
                if (item == x) return true
                let boo1 = index == 0 ? true : this.getDateCount(list[index-1], x) > 0
                let boo2 = index == list.length - 1 ? true : this.getDateCount(x, list[index+1]) > 0
                return  boo1 && boo2
            })
        },
        getDateCount(date1, date2) {
            let n1 = date1.split('-').join(''),
                n2 = date2.split('-').join('')
            return +n2 - +n1
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        async getChartData2() {
            this.isLoading_r = true
            const res = await push_request({
                type: 'get_fund_index_model',
                fund_innercode: this.selectFundToAnalyze.innercode,
                index_code: this.index_value
            })
            this.isLoading_r = false
            if (!res || JSON.stringify(res) == '{}') {
                this.timingData = null
                return
            }
            let stock = {}, timing = {}
            this.periodOptions.forEach((period) => {
                let data = res.params_dict[period.value][`params_page_${this.model_value}`]
                stock[period.value] = this.getLevel(data['选股能力'])
                timing[period.value] = this.getLevel(data['择时能力'])
            })
            this.timingData = {stock, timing}
        },
        getLevel(str) {
            if (str == '强') return 2
            if (str == '一般') return 1
            return 0
        },

        /**
         * 下载图片
         */
        handleDownload(n) {
            let list = [
                {id: 'holdingChangeChart', imgName: '调仓时机'},
                {id: 'selectAndTimingChart', imgName: '选股择时'}
            ]
            this.$downloadImg([list[n]])
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    background: transparent !important;
    .card-body{
        padding: 0 !important;
    }
}
.flex-wrap{
    display: flex;
    justify-content: center;
    .flex-label{
        font-size: 16px;
        font-weight: 600;
        margin-top: 18px;
    }
    .flex-item{
        display: flex;
        align-items: center;
        height: 68px;
        .border{
            display: flex;
            height: 32px;
            line-height: 32px;
            border-radius: 32px;
            overflow: hidden;
            background: #ddd;
            color: #fff;
            > div{
                width: 90px;
                text-align: center;
                &.level0.active{
                    background: #C0D2FF;
                }
                &.level1.active{
                    background: #8FAEFE;
                }
                &.level2.active{
                    background: #6F8EE6;
                }
                &:first-child{
                    border-right: 1px solid #fff;
                }
                &:last-child{
                    border-left: 1px solid #fff;
                }
            }
        }
        .mark{
            width: 80px;
            text-align: center;
            font-weight: 600;
        }
    }
}
</style>