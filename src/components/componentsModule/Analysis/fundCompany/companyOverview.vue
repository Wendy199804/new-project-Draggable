<template>
    <div class="card">
        <moduletitle title="基金公司概览"></moduletitle>

        <div class="card-body">
            <div class="table-wrap">
                <div v-for="(key, index) in Object.keys(infos)" :key="index" class="item">
                    <div class="label">{{key}}</div>
                    <div class="content">{{infos[key]}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFundCompanyInfo } from '@/api/analysis'

export default {
    data() {
        return {
            infos: {}
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.getTableData()
        },
        async getTableData() {
            const res = await getFundCompanyInfo({
                innerCode: this.selectFundToAnalyze.innercode
            })
            this.infos = {
                '名称': res.companyName,
                '成立时间': res.companyDate,
                '总管理规模': `${res.nv.toFixed(2)}亿元`,
                '总规模排名': `${res.rankNum}/${res.allNum}`,
                '非货币理财规模': `${res.currencyNv.toFixed(2)}亿元`,
                '非货币理财规模排名': `${res.currencyRankNum}/${res.currencyAllNum}`,
                '旗下基金数': `${res.fundNumber}只`,
                '旗下基金经理人数': `${res.managerNumber}人`,
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.table-wrap{
    // width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1fr);
    font-size: 13px;
    color: #444;
    .item{
        border: 1px solid #ddd;
        margin-left: -1px;
        margin-top: -1px;
        .label, .content{
            float: left;
            height: 36px;
            line-height: 36px;
        }
        .label{
            width: 40%;
            background: #f5f5f5;
            padding-left: 24px;
        }
        .content{
            width: 60%;
            padding-left: 16px;
        }
    }
}
</style>