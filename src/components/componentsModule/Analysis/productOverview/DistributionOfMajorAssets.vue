<template>
    <div class="wrap">
        <moduletitle title="大类资产分布">
            <div class="date-point-picker">
                <span>截止时间</span>
                <vDatePointPicker ref="point" @change="getChartData" />
            </div>
            
        </moduletitle>
        <div class="content">
            <div id="dlzcfb">
                <PieChart
                    ref="chart"
                    title="资产"
                    :subTitle="subTitle"
                    :legend="legend"
                    :seriesData="seriesData"
                    colorKey="assetsType"
                />
            </div>
            <vLoading :show="isLoading" />
            <vNodata :show="!seriesData && !isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieChart from '@/components/Model/pieChart'
import { getAssetsTypeDistribution } from '@/api/analysis'

export default {
    components: { PieChart },
    data() {
        return {
            isLoading: false,
            subTitle: '',
            legend: [],
            seriesData: null,
            interval: null,
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        isQDII() {
            return this.selectFundToAnalyze.firsttypeChi === 'QDII'
        }
    },
    methods: {
        render() {
            this.$refs.point.init()
        },
        async getChartData() {
            this.isLoading = true
            let { innercode, firsttypeChi } = this.selectFundToAnalyze,
                date = this.$refs.point.date_value
            const res = await getAssetsTypeDistribution({
                innerCode: innercode,
                reportDate: date,
                fundType: firsttypeChi
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            let data = res[date]
            this.legend = Object.keys(data)
            if (this.isQDII || !res.tag) {
                this.subTitle = '占总资产比'
                this.seriesData = this.legend.map(item => data[item].ratioStock)
            } else {
                this.subTitle = ['占总资产比', `同类平均(${this.selectFundToAnalyze.firsttypeChi})`]
                this.seriesData = [this.legend.map(item => data[item].ratioStock), this.legend.map(item => data[item].averageStock)]
            }
            this.draw('chart')
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        handleDownload() {
            let list = [{ id: 'dlzcfb', imgName: '大类资产分布' }]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    background-color: #ffffff;
    .content {
        padding: 16px;
        position: relative;
        height: calc(100% - 52px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        > div{
            width: 100%;
        }
    }
    /deep/ .chart {
        width: 100%;
        height: 300px;
    }
    /deep/ .legend .value1{
        width: 104px;
        margin-left: 0;
    }
}
</style>