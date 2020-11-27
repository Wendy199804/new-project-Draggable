<template>
    <div class="relative" >
        <moduletitle title="管理规模" type="manager">
            <div>
                <svg-icon :icon-class="`is-chart${isTable ? '' : '-active'}`" @click="isTable = false">
                </svg-icon><svg-icon :icon-class="`is-table${isTable ? '-active' : ''}`" style="margin-left: 0;" @click="isTable = true">
                </svg-icon>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>
        <div class="content">
            <div v-show="isTable" class="padding-lr">
                <el-table :data="tableData" :resizable="false" border max-height="322">
                    <el-table-column label="日期" prop="date" align="center" :resizable="false"></el-table-column>
                    <el-table-column label="管理规模" prop="manage_size" align="center" :resizable="false"></el-table-column>
                    <el-table-column label="较上期变动" prop="change" align="center" :resizable="false">
                        <template slot-scope="scope">
                            <span :class="{'color-red': scope.row.changeNum > 0, 'color-green': scope.row.changeNum < 0}">{{scope.row.change}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="接任或新开规模" prop="start_size" width="120" align="center" :resizable="false"></el-table-column>
                    <el-table-column label="离任或清盘规模" prop="end_size" width="120" align="center" :resizable="false"></el-table-column>
                </el-table>
            </div>
            <div v-show="!isTable" class="relative" id="managedFundSizeChart">
                <vHalfChart ref="chart_l"
                    type="line"
                    grid="grid_l_zoom"
                    :legend="legend"
                    :xData="xData"
                    :seriesData="seriesData"
                    :seriesOptions="seriesOptions"
                    :otherOptions="otherOptions"
                />
                <vLoading :show="isLoading" />
                <vNodata :show="!seriesData && !isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { push_request } from '@/api/analysis';

export default {
    data() {
        return {
            isLoading: false,

            legend: [],
            xData: [],
            seriesData: null,
            seriesOptions: [],
            otherOptions: {},

            isTable: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters([
            'managerInfo'
        ])
    },
    methods: {
        render() {
            this.isTable = false
            this.getChartData()
            this.getTableData()
        },

        // 管理规模
        async getChartData() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_manager_size',
                personal_id: this.managerInfo.id
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.seriesData = null
                return
            }
            this.legend = [this.managerInfo.name, '接任或新开', '离任或清盘']
            this.xData = res.ReportDate.map(item => item.slice(0, 10))
            let startData = res.Begin_QuartEnd.map(item => {
                return {
                    value: item ? 0 : null,
                    symbolOffset: [0, -10],
                }
            })
            let endData = res.End_QuartEnd.map((item, index) => {
                return {
                    value: item ? 0 : null,
                    symbolOffset: [0, res.Begin_QuartEnd[index] ? -26 : -10],
                }
            })
            this.seriesData = [
                res.MarketValue_all,
                startData,
                endData
            ]
            this.seriesOptions = [{
                areaStyle: {
                    opacity: 0.3
                }
            }, {
                type: 'scatter',
                color: '#47e5c9',
                symbol: 'path://M920.364138 408.364138C920.364138 681.842759 512 1019.762759 512 1019.762759S103.635862 681.842759 103.635862 408.364138a408.364138 408.364138 0 0 1 816.728276 0z',
                symbolSize: [10, 13]
            }, {
                type: 'scatter',
                color: '#47e5c9',
                symbol: 'path://M508.446058 942.770977 234.80784 574.5895c-30.972409-50.757011-47.344285-109.134583-47.344285-168.825057 0-178.949648 145.589866-324.536444 324.539514-324.536444S836.536444 226.815819 836.536444 405.764444c0 59.21566-16.134469 117.193119-46.64946 167.67793l-1.604544 2.647293L508.446058 942.770977zM331.257519 512.837064l178.346921 239.699244L693.396373 511.710404c18.753109-32.020274 28.64848-68.586075 28.64848-105.944937 0-115.822912-94.225011-210.050993-210.042807-210.050993-115.822912 0-210.048947 94.228081-210.048947 210.050993C301.954123 443.581748 312.075645 480.546637 331.257519 512.837064z',
                symbolSize: [11, 14]
            }]
            this.otherOptions = {
                dataZoom: [{
                    type: 'slider',
                    height: 22,
                    bottom: 8,
                    minSpan: 3 / (this.xData.length-1) * 100,
                    start: 100 - 11 / (this.xData.length-1) * 100,
                    end: 100,
                    showDetail: false
                }],
                tooltip: {
                    formatter: (params) => {
                        let date = params[0].axisValue,
                            str = `${date}<br>
                                ${params[0].seriesName}: ${params[0].data.toFixed(2)}亿`
                        let idx = this.xData.indexOf(date),
                            startNum = res.MarketValue_add[idx],
                            endNum = res.MarketValue_minus[idx]
                        startNum && (str += `<br>${params[1].seriesName}: ${startNum.toFixed(2)}亿`)
                        endNum && (str += `<br>${params[2].seriesName}: ${endNum.toFixed(2)}亿`)
                        return str
                    }
                }
            }
            this.draw('chart_l')
        },
        draw(refName) {
            if (!this.$refs[refName]) return
            this.$nextTick(() => {
                this.$refs[refName].drawChart()
            })
        },
        async getTableData() {
            this.isLoading = true
            const res = await push_request({
                type: 'get_manager_size_chart',
                personal_id: this.managerInfo.id
            })
            this.isLoading = false
            if (!res || JSON.stringify(res) == '{}') {
                this.tableData = []
                return
            }
            this.tableData = res.Date.map((x, index) => {
                return {
                    date: x.slice(0, 10),
                    manage_size: this.formatData(res.MarketValue[index]),
                    change: this.formatData(res.change_rate[index]),
                    changeNum: res.change_rate[index],
                    start_size: this.formatData(res.MarketValue_add[index]),
                    end_size: this.formatData(res.MarketValue_minus[index])
                }
            })
        },
        formatData(data) {
            if (data === null) return '- -'
            return data.toFixed(2) + '亿'
        },

        /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                {id: 'managedFundSizeChart', imgName: '管理规模'}
            ]
            this.$downloadImg(list)
        },
        /**
         * 下载Excel
         */
        handleExcel() {
            let table_data = this.tableData,
                props = ['日期', '管理规模', '较上期变动', '接任或新开规模', '离任或清盘规模'],
                keys = ['date', 'manage_size', 'change', 'start_size', 'end_size']
            this.$downloadExcel(table_data, props, keys, '管理规模')
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .color-red{
    color: #f04134;
}
/deep/ .color-green{
    color: #50c75a;
}
</style>