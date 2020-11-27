<template>
    <div class="card">
        <moduletitle
            title="股票持仓详情"
            :tablist="tabList"
            :secondary="true"
            :isright="true"
            :curtab="tabList[activeTab]"
            @clickTab="(index) => {activeTab = index, render()}"
        >
            <!-- <div class="timeframe">
                <span>报告期</span>
                <vDatePointPicker 
                    v-if="activeTab == 0"
                    ref="point"
                />
                <vDatePointPicker 
                    v-else
                    ref="point"
                    @change="handleChange"
                />
            </div>
            <div class="timeframe"
                v-show="activeTab == 0"
                style="width: 0; margin-left: 0; overflow: hidden;"
            >
                <span>时段</span>
                <vDateRangePicker
                    ref="range"
                    @change="handleChange"
                />
            </div> -->

            
        </moduletitle>

        <TopStockHoldings ref="comp0" v-show="activeTab == 0" />
        <AllStockHoldings ref="comp1" v-show="activeTab == 1" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TopStockHoldings from './topStockHoldings';
import AllStockHoldings from './allStockHoldings';

export default {
    components: { TopStockHoldings, AllStockHoldings },
    data() {
        return {
            activeTab: 0
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        isQDII() {
            return this.selectFundToAnalyze.firsttypeChi == 'QDII'
        },
        tabList() {
            let dft = [
                {name: '前十大重仓股', id: 0},
                {name: '全部持仓', id: 1},
            ]
            return this.isQDII ? [dft[0]] :dft
        }
    },
    methods: {
        render() {
            // this.$refs.point.init()
            // this.$refs.range.init('12')
            this.$nextTick(() => {
                this.$refs[`comp${this.activeTab}`].render()
            })
        },
        // handleChange() {
        //     this.$nextTick(() => {
        //         this.$refs[`comp${this.activeTab}`].render()
        //     })
        // },
        handleExcel() {
            this.$refs[`comp${this.activeTab}`].handleExcel()
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .sub-title{
    margin-bottom: 4px;
}
</style>