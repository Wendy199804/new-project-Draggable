<template>
    <section>
        <div class="left">
            <GridChart ref="gridChart" :xData="xData" :yData="yData" :seriesData="seriesData" @handleClickCell="handleClickCell" />
            <p class="tip">注：数字代表基金经理旗下对应风格的基金数量</p>
        </div>
        <div class="right right-table">
            <p class="header p">
                <span class="left">基金</span>
                <span class="right">风格</span>
            </p>
            <div class="body">
                <p v-for="(item, index) in tableData" :key="index" class="p">
                    <span class="left">{{item.name}}</span>
                    <span class="right">{{item.style}}</span>
                </p>
            </div>
        </div>
        <vLoading :show="isLoading" />
        <vNodata :show="!seriesData && !isLoading" />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import GridChart from '@/components/localComponents/gridChart'
import { getFundStyleDistribution } from '@/api/manager'

export default {
    components: { GridChart },
    data() {
        return {
            isLoading: false,
            xData: ['价值', '平衡', '成长'],
            yData: ['小盘', '中盘', '大盘'],
            seriesData: null,

            gridData: [],
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.getGridData()
        },
        // 基金风格分布
        async getGridData() {
            this.isLoading = true
            const res = await getFundStyleDistribution({
                personalCode: this.managerInfo.id
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.seriesData = []
            this.gridData = []
            let fundSums = []
            this.xData.forEach((x, i) => {
                this.yData.forEach((y, j) => {
                    let data = res[`${y}-${x}型`]
                    fundSums.push(data ? data.fundSum : 0)
                    this.seriesData.push([i, j, data ? data.fundSum : 0])
                    !this.gridData[i] && (this.gridData[i] = [])
                    this.gridData[i][j] = data
                        ? data.chiNames.map(item => {return {name: item,style: `${y}${x}`}})
                        : []
                })
            })
            this.$nextTick(() => {
                this.$refs.gridChart.draw()
            })
            this.switchGridTable([
                this.seriesData[fundSums.indexOf(Math.max(...fundSums))][0],
                this.seriesData[fundSums.indexOf(Math.max(...fundSums))][1]
            ])
        },
        handleClickCell([x, y, value]) {
            this.switchGridTable([x, y])
        },
        /**
         * 显示对应风格的基金
         */
        switchGridTable([x, y]) {
            this.tableData = this.gridData[x][y]
        }
    }
}
</script>

<style lang="scss" scoped>
.tip{
    font-size: 13px;
    color: #999;
    padding: 8px 0;
    margin-top: -8px;
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
        .left{
            width: 78%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>