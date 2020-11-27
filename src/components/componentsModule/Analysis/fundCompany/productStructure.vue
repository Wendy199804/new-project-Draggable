<template>
    <div class="card">
        <moduletitle title="旗下产品结构">
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>

        <div class="card-body">
            <div class="double">
                <div class="relative"
                    style="border-right-color: transparent;"
                    id="productDistribution"
                >
                    <PieChart ref="chart"
                        title="基金类型"
                        subTitle="占比"
                        :legend="legend"
                        :seriesData="seriesData"
                        colorKey="" />
                    <vLoading :show="isLoading_l" />
                    <vNodata :show="!seriesData && !isLoading_l" />
                </div>

                <div class="relative" style="display: flex; align-items: center;">
                    <el-table
                        class="right-table"
                        :data="tableData"
                        v-loading="isLoading_r"
                    >
                        <el-table-column label="基金类型" prop="type" align="center"></el-table-column>
                        <el-table-column label="基金数量" prop="number" align="center"></el-table-column>
                        <el-table-column label="基金个数排名" prop="numberRank" align="center"></el-table-column>
                        <el-table-column label="规模合计(亿元)" prop="size" align="center"></el-table-column>
                        <el-table-column label="规模排名" prop="sizeRank" align="center"></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieChart from '@/components/Model/pieChart'
import { getCompanyProductsChart, getCompanyProductsTable } from '@/api/analysis'

export default {
    components: { PieChart },
    data() {
        return {
            isLoading_l: false,
            legend: [],
            seriesData: null,

            isLoading_r: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.getChartData()
            this.getTableData()
        },

        async getChartData() {
            this.isLoading_l = true
            const res = await getCompanyProductsChart({
                innerCode: this.selectFundToAnalyze.innercode
            })
            this.isLoading_l = false
            this.legend = Object.keys(res)
            this.seriesData = this.legend.map(item => res[item])
            this.draw('chart')
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },

        async getTableData() {
            this.isLoading_r = true
            const res = await getCompanyProductsTable({
                innerCode: this.selectFundToAnalyze.innercode
            })
            this.isLoading_r = false
            this.tableData = res.map(item => {
                return {
                    type: item.firstClassType,
                    number: item.fundNumber || '--',
                    numberRank: item.fundNumber ? `${item.numberRankNum}/${item.numberAllNum}` : '--',
                    size: this.formatData(item.nv),
                    sizeRank: `${item.rankNum}/${item.allNum}`
                }
            })
        },
        formatData(data) {
            if (data ===  0) return 0
            if (!data) return '--'
            return data.toFixed(2)
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                {id: 'productDistribution', imgName: '旗下产品结构'}
            ]
            this.$downloadImg(list)
        },
        /**
         * 导出Excel
         */
        handleExcel() {
            let table_data = this.tableData,
                props = ['基金类型', '基金数量', '基金个数排名', '规模合计(亿元)', '规模排名'],
                keys = ['type', 'number', 'numberRank', 'size', 'sizeRank']
            this.$downloadExcel(table_data, props, keys, '旗下产品结构')
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/.right-table{
    thead th, td{
        height: 33px !important;
        line-height: 33px !important;
    }
}
</style>