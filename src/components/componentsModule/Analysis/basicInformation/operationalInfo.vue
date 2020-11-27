<template>
    <div class="operationalInfo">
        <moduletitle :title="'运营信息'">
            <div class="timeframe" style="margin-right:8px">
                <span>时段</span>
                <el-select v-model="timevalue" placeholder="请选择" @change="getChartData">
                    <el-option
                        v-for="item in timeoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
        </moduletitle>
        <div class="taps">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="申赎情况" name="purchase_redemption" :lazy="true">
                    <vApartChart
                        v-if="key=='1'"
                        ref="chart1"
                        type="bar"
                        :legend="legend1"
                        :xData="xData1"
                        :seriesData="seriesData1"
                        :seriesOptions="seriesOptions1"
                        :otherOptions="otherOptions1"
                        style="margin-top:16px"
                    />
                    <vLoading :show="isLoading" />
                    <vNodata :show="!result1&&!isLoading" style="margin-top: 5px;"/>
                </el-tab-pane>
                <el-tab-pane label="规模变化" name="sizechange" :lazy="true">
                    <vApartChart
                        v-if="key=='2'"
                        ref="chart2"
                        type="bar"
                        :legend="legend2"
                        :xData="xData2"
                        :otherOptions="otherOptions2"
                        :seriesData="seriesData2"
                        style="margin-top:16px"
                    />
                    <vLoading :show="isLoading" />
                    <vNodata :show="!result2&&!isLoading" style="margin-top: 5px;"/>
                </el-tab-pane>
                <el-tab-pane label="基金持有人结构" name="fund_holder_structure" :lazy="true">
                    <vApartChart
                        v-if="key=='3'"
                        ref="chart3"
                        type="bar"
                        :legend="legend3"
                        :xData="xData3"
                        :seriesData="seriesData3"
                        :otherOptions="seriesOptions3"
                        style="margin-top:16px;"
                        :isPct="true"
                    />
                    <vLoading :show="isLoading" />
                    <vNodata :show="!result3&&!isLoading" style="margin-top: 5px;"/>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import { operationalInformation } from '@/api/analysis'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            activeName: 'purchase_redemption',
            key: 1,

            timevalue: '3',
            timeoptions: [
                { label: '近1年', value: '1' },
                { label: '近2年', value: '2' },
                { label: '近3年', value: '3' },
                { label: '近5年', value: '5' },
                { label: '全部', value: 'all' }
            ],

            isLoading: false,

            legend1: ['申购', '赎回', '净申购'],
            xData1: [],
            seriesData1: [],
            otherOptions1: {
                yAxis: {
                    name: '份额(亿)',
                    nameLocation: 'middle',
                    nameGap: '35'
                }
            },
            seriesOptions1:[null,null,{type:'line'}],
            legend2: '',
            xData2: [],
            seriesData2: [],
            otherOptions2: {
                // yAxis: {
                //     name: '亿',
                //     nameLocation: 'middle',
                //     nameGap: '35'
                // }
            },

            legend3: ['机构持有比例', '个人持有比例'],
            xData3: [],
            seriesData3: [],
            seriesOptions3: {
                xAxis: {
                    axisLabel: {
                        interval: 0
                    }
                }
            },
            result:'',
            result1:false,
            result2:false,
            result3:false,

        }
    },
    watch:{
        $route(){
            this.key = 1
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        handleClick(tab, event) {
            if (tab.index == '0') {
                this.key = 1
                this.draw('chart1')
            } else if (tab.index == '1') {
                this.key = 2
                this.draw('chart2')
            } else if (tab.index == '2') {
                this.key = 3
                this.draw('chart3')
            }
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        async getChartData() {
            this.isLoading = true
            try {
                const result = await operationalInformation({
                    innerCode: this.selectFundToAnalyze.innercode,
                    num: this.timevalue === 'all' ? '' : this.timevalue
                })
                this.result = JSON.stringify(result) == '{}' ? '' : result
                this.handleResult()
                if (this.$refs.chart2) {
                    this.draw('chart2')
                }
                if (this.$refs.chart3) {
                    this.draw('chart3')
                }
                if (this.$refs.chart1) {
                    this.draw('chart1')
                }
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            if (this.result) {
                let xData1 = []
                let seriesData1 = [[], [], []]
                this.result1 = this.result.mfShareschanges.length==0?false:true
                this.result.mfShareschanges.forEach(item => {
                    let str1 = this.addyi(item.applyingShares)
                    let str2 = this.addyi(item.redeemShares)
                    let str3 = this.addyi(item.sharesChange)
                    xData1.push(item.endDate.split(' ')[0])
                    seriesData1[0].push(Number(str1))
                    seriesData1[1].push(Number(str2))
                    seriesData1[2].push(Number(str3))
                })
                this.xData1 = xData1
                this.seriesData1 = seriesData1

                this.legend2 = [this.selectFundToAnalyze.name]
                let xData2 = []
                let seriesData2 = [[]]
                this.result2 = this.result.mfNetvalues.length==0?false:true
                this.result.mfNetvalues.forEach(item => {
                    let str = this.addyi(item.nv)
                    xData2.push(item.endDate.split(' ')[0])
                    seriesData2[0].push(str)
                })
                this.xData2 = xData2
                this.seriesData2 = seriesData2
                this.otherOptions2 = {
                    tooltip: {
                        formatter: params => {
                            let str = `<span>${params[0].axisValueLabel}</span><br/>`
                            params.forEach(item => {
                                str += `<span>${item.seriesName}：${item.value}亿</span><br/>`
                            })
                            return str
                        }
                    }
                }

                let xData3 = []
                let seriesData3 = [[], []]
                this.result3 = this.result.mfHolderinfos.length==0?false:true
                this.result.mfHolderinfos.forEach(item => {
                    xData3.push(item.endDate.split(' ')[0])
                    let str4 = this.addper(item.institutionHoldRatio)
                    let str5 = this.addper(item.individualHoldRatio)
                    seriesData3[0].push(str4)
                    seriesData3[1].push(str5)
                })
                this.xData3 = xData3
                this.seriesData3 = seriesData3
                this.seriesOptions3 = {
                    tooltip: {
                        formatter: params => {
                            let str = `<span>${params[0].axisValueLabel}</span><br/>`
                            params.forEach(item => {
                                str += `<span>${item.seriesName}：${(item.value * 100).toFixed(2)}%</span><br/>`
                            })
                            return str
                        }
                    }
                }
            }
        },
        addyi(num) {
            if (typeof num !== 'number') {
                num = Number(num)
            }
            return (num / 100000000).toFixed(2)
        },
        addper(num) {
            if (typeof num !== 'number') {
                num = Number(num)
            }
            return (num / 100).toFixed(2)
        },
        render() {
            this.getChartData()
            this.activeName = 'purchase_redemption'
        }
    }
}
</script>

<style lang="scss" scoped>
.operationalInfo {
    background-color: #ffffff;
    min-height: 320px;
    .taps {
        padding: 16px 16px 16px 0;

        /deep/ .el-tabs--card > .el-tabs__header {
            display: inline-block;
            border-bottom: none;
            //   margin-top: 16px;
            margin-left: 24px;
            z-index: 100
        }
        /deep/ .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
            padding-right: 0;
        }
        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
            & > div {
                width: 120px;
                height: 30px;
                text-align: center;
                font-size: 14px;
                line-height: 30px;
                border-bottom: 1px solid #e4e7ed;
                &:hover {
                    border-bottom: 1px solid #4E7CEE;
                }
            }
            & > div:last-child {
                width: 162px;
            }
        }

        /deep/ .el-tabs__item:hover {
            border: 1px solid #4E7CEE;
            color: #4E7CEE;
        }

        /deep/ .el-tabs__item.is-active {
            border: 1px solid #4E7CEE;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
            border-bottom-color: #4E7CEE;
            border-left-color: #4E7CEE;
            color: #4E7CEE;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child.is-active {
            border-left: 1px solid #4E7CEE;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child:hover {
            border-left: 1px solid #4E7CEE;
        }
        /deep/ .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2),
        .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
            padding-left: 0;
        }
        .section-wrap[data-v-c20ace0e] .page .apart .chart {
            height: 350px;
        }
    }
}
</style>