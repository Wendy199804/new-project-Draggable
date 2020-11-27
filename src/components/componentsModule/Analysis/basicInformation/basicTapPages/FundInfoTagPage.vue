<template>
    <div class="fund-info">
        <div class="grid-box">
            <div v-for="(item, index) in dataList" :key="index" class="grid-cell">
                <div>{{ item.name }}</div>
                <div>
                    {{ resultList[item.key] || '- -'}}
                    <span v-if="item.key === 'firstClassType' && secondClassType[0] !== null">
                        <span v-for="(item2, index2) in secondClassType" :key="index2">&nbsp;|&nbsp;{{ item2 }}</span>
                    </span>
                </div>
            </div>
            <vLoading :show="isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fundNetValue, FundInfomsg } from '@/api/analysis'
import { unitConverter } from '@/utils/analyze'

export default {
    data() {
        return {
            nu: [null],
            isLoading: false,
            resultList: {},
            secondClassType: [],
            dataList: [
                {
                    key: 'chiNameAbbr',
                    name: '基金简称'
                },
                {
                    key: 'secuCode',
                    name: '基金代码'
                },
                {
                    key: 'chiName',
                    name: '基金全称'
                },
                {
                    key: 'company',
                    name: '基金公司'
                },
                {
                    key: 'managerList',
                    name: '基金经理'
                },
                {
                    key: 'startDate',
                    name: '成立日期'
                },
                {
                    key: 'size',
                    name: '最新规模'
                },
                {
                    key: 'firstClassType',
                    name: '基金类型'
                },
                {
                    key: 'chiOperateType',
                    name: '运作方式'
                },
                {
                    key: 'chiListedState',
                    name: '运行状态'
                },
                {
                    key: 'ifInsideTrade',
                    name: '场内交易'
                },
                {
                    key: 'applyingType',
                    name: '申购状态'
                },
                {
                    key: 'redeemType',
                    name: '赎回状态'
                },
                {
                    key: 'performanceBenchMark',
                    name: '业绩比较基准'
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        async getfundNetValue() {
            this.isLoading = true
            try {
                const result = await FundInfomsg({ innerCode: this.selectFundToAnalyze.innercode })
                this.resultList = result.fundInformation
                this.secondClassType = result.secondClassType || []
                let managerList = result.fundManagerListNow.map(item => {
                    return item.name
                })
                managerList.join(',')
                Object.assign(this.resultList, {
                    applyingType: result.applyingType,
                    redeemType: result.redeemType,
                    managerList: managerList.join(','),
                    firstClassType: result.firstClassType,
                    chiOperateType: result.chiOperateType,
                    chiListedState: result.chiListedState,
                    ifInsideTrade: result.ifInsideTrade
                })
                this.resultList.size = unitConverter(result.fundInformation.size)
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.fund-info {
    .grid-box {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 36px;
        margin: 16px;
        position: relative;

        & > div:nth-child(3),
        & > div:last-child {
            grid-column-start: 1;
            grid-column-end: 3;
        }
        & > div:nth-child(1),
        & > div:nth-child(2) {
            border-top: 1px solid #dddddd;
            height: 100%;
            & > div:first-child {
                // border-top:1px solid #dddddd;
                height: 100%;
            }
        }
        & > div:nth-child(2),
        & > div:nth-child(3),
        & > div:nth-child(5),
        & > div:nth-child(7),
        & > div:nth-child(9),
        & > div:nth-child(11),
        & > div:nth-child(13),
        & > div:nth-child(14) {
            border-right: 1px solid #dddddd;
        }
        // & > div:nth-child(3){
        //    & > div:first-child{
        //   border-top:1px solid #dddddd;;
        // }
        // }
    }
    .grid-cell {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-left: 1px solid #dddddd;
        border-bottom: 1px solid #dddddd;
        font-size: 13px;
        color: #444;

        & > div:nth-child(1) {
            width: 160px;
            flex-shrink: 0;
            background-color: rgba(245, 245, 245, 1);
            border-right: 1px solid #dddddd;
            padding-left: 24px;
            line-height: 36px;
        }
        & > div:nth-child(2) {
            padding-left: 16px;
            box-sizing: border-box;
            color: #333333;
        }
    }
}
</style>