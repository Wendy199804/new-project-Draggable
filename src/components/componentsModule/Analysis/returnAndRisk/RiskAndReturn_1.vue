<template>
    <div class="risk-and-return">
        <moduletitle title="风险收益">
            <div class="timeframe">
                <span>时段</span>
                <vDateRangePicker ref="range" type="year" class="mr" :config="['custom', 'since_founded', 'year_start']" @change="getData" />
            </div>
            
        </moduletitle>
        <div class="content" id="fxsy">
            <vLoading :show="isLoading" />
            <vNodata
                :show="!result && !isLoading"
                :text="text"
                style="font-size: 14px; font-weight: 400; text-align: center; justify-content: center"
            />
            <div class="bold">
                <p>与全市场比较</p>
                <p>与{{ selectFundToAnalyze.firsttypeChi }}比较</p>
            </div>
            <div class="pic">
                <div v-for="(item, index) in list" :key="index">
                    <p style="border-top: 1px solid #ddd; padding-top: 5px; margin-bottom: 15px">{{ item.title }}</p>
                    <Riskcon v-if="item.rank" :rank="item.rank" :type="item.dec" />
                    <vNodata :show="result && !item.rank" text="基金数据不足" style="height: 110px; margin-top: 25px" />
                </div>
            </div>
            <p class="summary">{{ discrib }}</p>
        </div>
    </div>
</template>

<script>

import Riskcon from '@/components/localComponents/riskCon'
import { push_request } from '@/api/analysis'
import { mapGetters } from 'vuex'

export default {
    components: {
        Riskcon
    },
    data() {
        return {
            tablist: [
                { name: 'tab1', id: 1 },
                { name: 'tab2', id: 2 }
            ],
            curtab: { id: 1 },
            list: [
                { title: '收益', dec: 'earn', rank: null },
                { title: '收益', dec: 'earn', rank: null },
                { title: '风险', dec: 'risk', rank: null },
                { title: '风险', dec: 'risk', rank: null }
            ],
            isLoading: false,
            result: false,
            discrib: '',
            text: '暂无数据'
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.$refs.range.init('one_year')
            // this.getData()
        },
        clickTab(index) {
            this.curtab = this.tablist[index]
        },
        handleDownload() {
            let list = [{ id: 'fxsy', imgName: '风险收益' }]
            this.$downloadImg(list)
        },
        getData() {
            this.isLoading = true
            push_request({
                type: 'get_return_risk_rank',
                exec_type: 'sync',
                fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                interval: this.$refs.range.value
            }).then(res => {
                if (res.if) {
                    let data = res.return_risk_rank
                    this.result = JSON.stringify(data) == '{}' ? false : true
                    this.text = '暂无数据'
                    this.list[0].rank = data.return_rank_market
                    this.list[1].rank = data.return_rank_class
                    this.list[2].rank = data.risk_rank_market
                    this.list[3].rank = data.risk_rank_class
                    this.getDiscrib()
                    this.isLoading = false
                } else {
                    this.text = `基金成立不足${this.$refs.range.range_chi}`
                    this.result = false
                    this.isLoading = false
                }
            })
        },
        getDiscrib() {
            push_request({
                type: 'get_return_risk_rank_new',
                exec_type: 'sync',
                fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                interval: this.$refs.range.value
            })
                .then(res => {
                    this.discrib = res
                })
                .catch(err => {
                    this.isLoading = false
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.risk-and-return {
    background: #ffffff;
    .content {
        width: 100%;
        padding: 16px;
        position: relative;
        & > div:first-child {
            display: flex;
            justify-content: space-between;
            color: #333333;
            margin-bottom: 16px;
            & > p {
                width: 47%;
            }
        }
        .pic {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            & > div {
                width: 47%;
                position: relative;
                min-height: 144px;
            }
        }
    }
    // 时段隐藏
    /deep/ .title .el-range-editor.el-input__inner {
        width: 220px;
        height: 24px;
        padding-right: 0;
        display: none;
    }
    /deep/ .title .select-box > div {
        margin-left: 0;
    }
}
</style>