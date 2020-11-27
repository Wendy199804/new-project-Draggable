<template>
    <div class="card">
        <moduletitle
            title="股票风格"
            :tablist="tabList"
            :secondary="true"
            :isright="true"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        ></moduletitle>

        <div class="card-body">
            <div class="double">
                <div class="relative">
                    <div class="sub-title no-mt">
                        <span class="font14 bold">股票风格箱</span>
                        <div class="options">
                            <span>
                                <svg-icon icon-class="download" @click="handleDownload(0)"></svg-icon>
                                <svg-icon icon-class="reload" @click="getData1"></svg-icon>
                            </span>
                        </div>
                    </div>
                    <div class="relative hidden" id="stockStyle1">
                        <div class="left">
                            <GridChart ref="gridChart"
                                :xData="xData1"
                                :yData="yData1"
                                :seriesData="seriesData1"
                            />
                        </div>
                        <div class="right right-table">
                            <p class="header p">
                                <span class="left">报告时间</span>
                                <span class="right">股票风格</span>
                            </p>
                            <div class="body">
                                <p v-for="(item, index) in tableData1" :key="index" class="p">
                                    <span class="left">{{item.reportTime}}</span>
                                    <span class="right">{{item.style}}</span>
                                </p>
                            </div>
                        </div>
                        <p style="clear: both; font-size: 13px; color: #999; padding: 16px 0;">注：数字代表该基金在各风格上的投资占比；由于数据的四舍五入可能导致最终占比相加不为100。</p>
                        <vLoading :show="isLoading_l" />
                        <vNodata :show="!seriesData1 && !isLoading_l" text="该基金最新一期暂无股票持仓"/>
                    </div>
                </div>

                <div class="relative">
                    <div class="sub-title no-mt">
                        <span class="font14 bold">因子暴露
                            <vAnnotationPop title="因子暴露" />
                        </span>
                        <div class="options">
                            <span>
                                <svg-icon
                                    :icon-class="`is-chart${isChart ? '-active' : ''}`"
                                    style="margin-right: 0;"
                                    @click="isChart = true">
                                </svg-icon><svg-icon
                                    :icon-class="`is-table${isChart ? '' : '-active'}`"
                                    @click="isChart = false">
                                </svg-icon>
                                <svg-icon icon-class="download" @click="handleDownload(1)"></svg-icon>
                                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                                <svg-icon icon-class="reload" @click="getData2"></svg-icon>
                            </span>
                        </div>
                    </div>
                    <div class="relative" style="min-height: 300px;" id="stockStyle2">
                        <div v-if="isChart" id="stockStyle1">
                            <div class="range-bars">
                                <div v-for="(item, index) in tableData2" :key="index"
                                    @mouseenter="hoverIndex = index"
                                    class="pointer"
                                >
                                    <p class="name">{{item.factor}}</p>
                                    <RangeBar :item="item" />
                                </div>
                            </div>
                            <div class="summary" style="margin-top: 4px; padding: 4px 12px; font-size: 13px;">
                                {{hoverText}}
                            </div>
                            <p class="legend">
                                <span v-for="(item, index) in legend" :key="index" class="item">
                                    <span :style="`background: ${colors[index]};`"></span>{{item}}
                                </span>
                            </p>
                        </div>
                        <el-table v-else :data="tableData2" max-height="322">
                            <el-table-column label="因子" prop="factor" align="center"></el-table-column>
                            <el-table-column label="当前因子暴露" prop="current" align="center"></el-table-column>
                            <el-table-column label="最小因子暴露" prop="low" align="center"></el-table-column>
                            <el-table-column label="最大因子暴露" prop="high" align="center"></el-table-column>
                            <el-table-column label="同类平均因子暴露" prop="average" align="center"></el-table-column>
                        </el-table>
                        <vLoading :show="isLoading_r" />
                        <vNodata :show="!tableData2.length && !isLoading_r" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GridChart from '@/components/localComponents/gridChart';
import RangeBar from '@/components/localComponents/rangeBar';
import { getStockStyle, push_request } from '@/api/analysis';
import factorsAnnotation from '@/utils/factors';

export default {
    components: { GridChart, RangeBar },
    data() {
        return {
            tabList: [
                {name: '前十大重仓股', id: 'top10'},
                {name: '全部持仓', id: 'all'}
            ],
            activeTab: 0,

            isLoading_l: false,
            isLoading_r: false,

            xData1: ['价值', '平衡', '成长'],
            yData1: ['小盘', '中盘', '大盘'],
            seriesData1: null,
            tableData1: [],

            hoverIndex: 0,

            isChart: true,
            tableData2: [],

            colors: ['#8FAEFE', '#E5ECFF', '#333']
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        legend() {
            return [this.selectFundToAnalyze.name, '历史变动范围', `同类平均(${this.selectFundToAnalyze.firsttypeChi})`]
        },
        hoverText() {
            if (!this.tableData2.length) return ''
            let name = this.tableData2[this.hoverIndex].factor
            return `${name}：${factorsAnnotation[name]}`
        }
    },
    methods: {
        render() {
            this.getData1()
            this.getData2()
        },
        async getData1() {
            this.isLoading_l = true
            const res = await getStockStyle({
                innerCode: this.selectFundToAnalyze.innercode,
                port_type: this.tabList[this.activeTab].id
            })
            this.isLoading_l = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData1 = null
                return
            }
            let dates = Object.keys(res)
            this.tableData1 = dates.map(date => {
                return {
                    reportTime: date, 
                    style: res[date][0].style
                }
            })
            this.seriesData1 = res[dates[0]].map(item => {
                let [x, y] = item.style.split('-'),
                    xIndex = this.xData1.indexOf(y.slice(0, 2)),
                    yIndex = this.yData1.indexOf(x),
                    value = Math.round(item.ratio * 100)
                return [xIndex, yIndex, value]
            })
            // this.seriesData1 = [
            //     [0,0,30],[0,1,10],[0,2,40],
            //     [1,0,0],[1,1,30],[1,2,10],
            //     [2,0,20],[2,1,40],[2,2,80]
            // ]
            this.$nextTick(() => {
                this.$refs.gridChart.draw()
            })
        },
        async getData2() {
            this.isLoading_r = true
            const res = await push_request({
                type: 'get_fund_factor_exposure_by_port_type',
                fund_innercode: this.selectFundToAnalyze.innercode,
                port_type: this.tabList[this.activeTab].id
            })
            this.isLoading_r = false
            if (!res || JSON.stringify(res) == '{}') {
                this.tableData2 = []
                return
            }
            let factors = Object.keys(res).filter(item => item !== 'type')
            this.tableData2 = factors.map(factor => {
                let item = res[factor],
                    type = res.type
                return {
                    factor,
                    topText: '高',
                    bottomText: '低',
                    min: this.formatData(item[type.indexOf('min')]), // 指标最小值
                    max: this.formatData(item[type.indexOf('max')]), // 指标最大值
                    low: this.formatData(item[type.indexOf('fund_low')]), // 该基金最小值
                    high: this.formatData(item[type.indexOf('fund_high')]), // 该基金最大值
                    current: this.formatData(item[type.indexOf('fund')]), // 该基金当前值
                    average: this.formatData(item[type.indexOf('average')]) // 同类基金平均值
                }
            })
        },
        formatData(data) {
            return parseInt(data * 100) / 100
        },

        /**
         * 下载图片
         */
        handleDownload(n) {
            let list = [
                {id: 'stockStyle1', imgName: '股票风格箱'},
                {id: 'stockStyle2', imgName: '因子暴露'}
            ]
            this.$downloadImg([list[n]])
        },
        /**
         * 导出Excel
         */
        handleExcel() {
            let table_data = this.tableData2,
                props = ['因子', '当前因子暴露', '最小因子暴露', '最大因子暴露', '同类平均因子暴露'],
                keys = ['factor', 'current', 'min', 'max', 'average']
            this.$downloadExcel(table_data, props, keys, '因子暴露')
        }
    }
}
</script>

<style lang="scss" scoped>
.card-body{
    padding: 14px 0 !important;
    .double > .relative{
        padding: 0 16px !important;
    }
    .sub-title{
        margin-bottom: 10px;
    }
}
.right-table{
    width: 304px;
    margin-top: 25px;
    .header{
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        border-top: 1px solid #ddd;
    }
    .p{
        overflow: hidden;
        padding: 0 16px;
    }
    .body{
        height: 226px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-left: 0;
        border-right: 0;
        .p{
            line-height: 28px;
        }
    }
}

.range-bars{
    display: flex;
    justify-content: space-between;
    .name{
        text-align: center;
        line-height: 24px;
    }
}
.legend{
    display: flex;
    justify-content: center;
    margin-top: 10px;
    .item{
        margin: 0 20px;
        > span{
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            vertical-align: top;
            margin-right: 5px;
        }
    }
}
</style>