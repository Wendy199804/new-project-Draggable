<template>
    <div class="analysis-accumulativeReturn">
        <moduletitle title="累计收益率走势">
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
                        class="mr"
                        @change="getChartData"
                    />
                </keep-alive>
            </div>
            
        </moduletitle>
        <div class="content">
            <vNodata :show="!result&&!isLoading" />
            <vApartChart
            id="card"
                ref="chart"
                type="line"
                :legend="legend"
                :xData="xData"
                :seriesData="seriesData"
                :otherOptions="otherOptions"
                :isPct="true"
                style="margin-top:16px"
            />
            <vLoading :show="isLoading" />
        </div>
    </div>
</template>

<script>
import { push_request } from "@/api/analysis";
import { mapGetters } from "vuex";
import { allBenchmark, getIndexName } from "@/utils/benchmark";

export default {
    data() {
        return {
            benchmarkValue: ["1", "000300"], //基准,
            benchmarkOptions: allBenchmark,

            legend: [],
            xData: [],
            seriesData: [],
            seriesOptions: {
                yAxis: {
                    name: "收益率(%)",
                    nameLocation: "middle",
                    nameGap: "45"
                }
            },
            otherOptions:{
                tooltip: {
                    trigger: 'axis',
                    formatter: params => { 
                        return `<span>${params[0].axisValue}</span><br/><span>${params[0].seriesName}：${Number((params[0].value*100).toFixed(2))}%<br/><span>${params[1].seriesName}：${Number((params[1].value*100).toFixed(2))}%</span>`
                    }
                }
            },
            result: "",
            timeRange: "",
            isLoading: false
        };
    },
    computed: {
        ...mapGetters(["selectFundToAnalyze"]),
        index_name() {
            return getIndexName(this.benchmarkValue[1]);
        }
    },
    methods: {
        async getChartData() {
            this.legend = [this.selectFundToAnalyze.name, this.index_name];
            this.isLoading = true;
            try {
                const result = await push_request({
                    type: "cumulative_return_curve",
                    exec_type: "sync",
                    fund_code: this.selectFundToAnalyze.innercode.toString(),
                    index_code: this.benchmarkValue[1],
                    start_date: this.$refs.range.start_date,
                    end_date: this.$refs.range.end_date
                });
                this.result = JSON.stringify(result) == "{}" ? "" : result;
                this.handleResult();
                this.draw("chart");
                this.isLoading = false;
            } catch {
                this.isLoading = false;
            }
        },
        handleResult() {
            if (this.result) {
                this.xData = this.result.TradingDay.map(item => {
                    return item.split(" ")[0];
                });
                this.seriesData = [
                    this.result.fund_return,
                    this.result.index_return
                ];
            }
        },
        draw(refName) {
            this.$nextTick(() => {
                this.$refs[refName].drawChart();
            });
        },
         /**
         * 下载图片
         */
        handleDownload() {
            let list = [
                { id: "card", imgName: "累计收益走势" },
            ];
            this.$downloadImg(list)
        },
        render() {
            this.$refs.range.init();
        },
        refreshChart() {
            this.render();
        }
    }
};
</script>

<style lang="scss">
.analysis-accumulativeReturn {
    background-color: #ffffff;

    .content {
        padding: 16px;
        .noresult {
            height: 320px;
            text-align: center;
            line-height: 320px;
        }
    }
}
</style>