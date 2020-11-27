<template>
    <div class="risk-and-return3">
        <moduletitle title="" :tablist="tablist" :curtab="curtab" @clickTab="clickTab">
            <div v-show="curtab.id === 2">
                <span>频率</span>
                <div class="secondary-title">
                    <div
                        class="item"
                        v-for="item in freqOptions"
                        :key="item.label"
                        :style="{
                            background: item.value === freqValue ? 'rgba(78, 124, 238, 0.1)' : 'transparent',
                            color: item.value === freqValue ? '#4E7CEE' : '#666',
                            borderColor: item.value === freqValue ? '#4E7CEE' : '#aaa'
                        }"
                        @click="clickSecondTab(item.value)"
                    >
                        {{ item.label }}
                    </div>
                </div>
            </div>
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon></div
        ></moduletitle>
        <div class="content">
            <vNodata :show="!seriesData && !isLoading" />
            <vHalfChart
                id="anaqjzdhc"
                ref="chart"
                type="bar"
                grid="grid_r"
                :legend="legend"
                :xData="xData"
                :seriesData="seriesData"
                :seriesOptions="seriesOptions"
                colorKey="average"
                :otherOptions="otherOptions"
                :isPct="true"
            />
            <vLoading :show="isLoading" />
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'
import base from '@/mixins/base_index'


export default {
    mixins: [base], 
    data() {
        return {
            freqValue: 'quarter', //'monthly' 'quarter' 'annual',
            freqOptions: [
                { label: '月', value: 'monthly' },
                { label: '季', value: 'quarter' },
                { label: '年', value: 'annual' }
            ],
            tablist: [
                { name: '区间最大回撤', id: 1 },
                { name: '滚动最大回撤', id: 2 }
            ],
            curtab: { id: 1 },
            //
            legend: [],
            xData: [],
            seriesData: null,
            seriesOptions: [null, null, {}],
            otherOptions: {},
            isLoading: false,
            result: true
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.getChartData()
        },
        //切换二级标题
        clickSecondTab(value) {
            this.freqValue = value
            this.render()
        },
        clickTab(index) {
            this.curtab = this.tablist[index]
            this.render()
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        getChartData() {
            this.isLoading = true
            let param =
                this.curtab.id === 1
                    ? {
                          type: 'get_fund_and_index_interval_maximum_drawdown',
                          exec_type: 'sync',
                          fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                          index_code: this.base_index_code
                      }
                    : { 
                          type: 'get_rolling_mdds',
                          exec_type: 'sync',
                          fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                          index_code: this.base_index_code,
                          freq: this.freqValue
                      }
            push_request(param)
                .then(res => {
                    this.isLoading = false
                    if (!res || JSON.stringify(res) == '{}') {
                        this.seriesData = null
                        return
                    }
                    this.legend = [this.selectFundToAnalyze.name, this.base_index_name, `同类平均(${this.selectFundToAnalyze.firsttypeChi})`]
                    this.xData =
                        this.curtab.id === 1
                            ? ['今年以来', '近1个月', '近3个月', '近6个月', '近1年', '近3年', '近5年']
                            : res.calendar.map(item => {
                                if(this.freqValue === 'quarter'){
                                    return `${item.split('-')[0].substr(2)}年${item.split('-')[1]}季度`
                                }else if(this.freqValue === 'monthly'){
                                    return `${item.split('-')[0].substr(2)}年${Number(item.split('-')[1])}月`
                                }else if(this.freqValue === 'annual'){
                                    return `${item}年`
                                }
                                  
                              })
                    this.seriesData =
                        this.curtab.id === 1
                            ? [res.interval_mdds.fund_interval_mdds, res.interval_mdds.index_interval_mdds, res.interval_mdds.class_interval_mdds]
                            : [res.fund, res.index, res.class]
                    this.otherOptions =
                        this.curtab.id === 1
                            ? {}
                            : {
                                  xAxis: {
                                      axisLabel: {
                                          show: true,
                                          textStyle: {
                                              fontSize: '11'
                                          }
                                      }
                                  }
                              }
                    this.draw('chart')
                })
                .catch(() => {
                    this.isLoading = false
                })
            this.draw('chart')
        },
        refreshChart() {
            this.render()
        },
        handleDownload() {
            let list = [{ id: 'anaqjzdhc', imgName: this.curtab.id === 1 ? `区间最大回撤` : '滚动最大回撤' }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-and-return3 {
    background: #ffffff;
    .content {
        position: relative;
        padding: 16px 0;
        /deep/ .chart {
            width: 100%;
            height: 320px;
        }
    }
    .secondary-title {
        display: flex;
        justify-content: flex-start;
        .item {
            border: 1px solid;
            font-size: 12px;
            padding: 5px 10px 4px 10px;
            border-right: none;
            cursor: pointer;
        }
        & > div:first-child {
            border-radius: 4px 0 0 4px;
        }
        & > div:last-child {
            border-radius: 0 4px 4px 0;
            border-right: 1px solid;
        }
    }
}
</style>