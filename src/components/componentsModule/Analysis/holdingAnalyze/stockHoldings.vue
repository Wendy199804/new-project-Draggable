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
                {name: '前十大重仓股', id: 'top10'},
                {name: '全部持仓', id: 'all'},
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