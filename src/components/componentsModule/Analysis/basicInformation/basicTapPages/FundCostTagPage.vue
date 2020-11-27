<template>
    <div class="fund-cost">
        <div class="flex">
            <div class="cost-module module1">
                <Zjtitle>申购与赎回金额</Zjtitle>
                <div class="grid-box">
                    <div v-for="(item, index) in msg1" :key="index" class="grid-cell">
                        <div>{{ item.name }}</div>
                        <div>{{ resultList[item.key] || '- -' }}</div>
                    </div>
                </div>
            </div>

            <div class="cost-module module3">
                <Zjtitle>运作费用</Zjtitle>
                <div class="grid-box">
                    <div v-for="(item, index) in msg3" :key="index" class="grid-cell">
                        <div>{{ item.name }}</div>
                        <div>{{ resultList[item.key] || '- -' }}</div>
                    </div>
                </div>
            </div>

            <div class="cost-module module1">
                <Zjtitle>交易确认日</Zjtitle>
                <div class="grid-box">
                    <div v-for="(item, index) in msg2" :key="index" class="grid-cell">
                        <div>{{ item.name }}</div>
                        <div>
                            <span v-if="item.key != 'prconfirmationdate'">{{ resultList[item.key] || '- -' }}</span>
                            <span v-if="item.key == 'prconfirmationdate' && resultList[item.key]">T + {{ resultList[item.key] }}</span>
                            <span v-if="item.key == 'prconfirmationdate' && !resultList[item.key]">- -</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex2">
            <div class="cost-module">
                <Zjtitle>申购费率（前端）</Zjtitle>
                <el-table :data="msg4" border>
                    <el-table-column prop="amount" :resizable="false" label="适用金额"></el-table-column>
                    <el-table-column prop="rate" :resizable="false" label="费率"></el-table-column>
                </el-table>
            </div>

            <div class="cost-module">
                <Zjtitle>赎回费率</Zjtitle>
                <el-table :data="msg5" border>
                    <el-table-column prop="amount" :resizable="false" label="适用金额"></el-table-column>
                    <el-table-column prop="rate" :resizable="false" label="费率"></el-table-column>
                </el-table>
            </div>
        </div>

        <vLoading :show="isLoading" />
    </div>
</template>

<script>
import Zjtitle from '@/components/localComponents/zjTableTitle'
import { mapGetters } from 'vuex'
import { FundCustInfo } from '@/api/analysis'

export default {
    data() {
        return {
            msg1: [
                {
                    name: '最低申购金额下限（元）',
                    key: 'lowestSumPurLL'
                },
                {
                    name: '最低赎回份额（份）',
                    key: 'lowestSumRedemption'
                },
                {
                    name: '最低持有份额（份）',
                    key: 'lowestSumForHolding'
                }
            ],
            msg2: [
                {
                    name: '申购确认日',
                    key: 'prconfirmationdate'
                },
                {
                    name: '赎回确认日',
                    key: 'prconfirmationdate'
                }
            ],
            msg3: [
                {
                    name: '管理费率',
                    key: 'managementFee'
                },
                {
                    name: '托管费率',
                    key: 'custodyFee'
                },
                {
                    name: '销售服务费',
                    key: 'saleServiceFee'
                }
            ],
            msg4: [],
            msg5: [],

            resultList: '',
            isLoading: false
        }
    },
    components: {
        Zjtitle
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },

    methods: {
        async getFundCustInfo() {
            this.isLoading = true
            try {
                const result = await FundCustInfo({ innerCode: this.selectFundToAnalyze.innercode })
                this.resultList = result
                this.msg4 = result.subscriptionRateVos.map(item => {
                    return {
                        amount: item.divIntervalDes || '- -',
                        rate: item.chargeRateDes || '- -'
                    }
                })
                this.msg5 = result.redemptionRateVos.map(item => {
                    return {
                        amount: item.divIntervalDes || '- -',
                        rate: item.chargeRateDes || '- -'
                    }
                })
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        }
    },
    mounted() {
        // this.getFundCustInfo()
    }
}
</script>

<style lang="scss" scoprd>
.fund-cost {
    padding: 16px;
    font-size: 13px;
    position: relative;
    .cost-module {
        margin-bottom: 24px;
    }
    .grid-box {
        display: grid;
        grid-template-rows: 36px;
        .grid-cell {
            display: flex;
            justify-content: flex-start;
            & > div:first-child {
                background-color: #f5f5f5;
                flex-shrink: 0;
                width: 66%;
            }
            & > div:last-child {
                width: 33%;
            }
            & > div {
                line-height: 36px;
                text-align: center;
            }
        }
    }
    .grid-box {
        & > div:last-child {
            border-bottom: 1px solid #dddddd;
        }
        .grid-cell {
            border: 1px solid #dddddd;
            border-bottom: none;
        }
    }
    .flex {
        display: flex;
        justify-content: flex-start;
        & > div:not(:last-child) {
            border-right: 1px solid #dddddd;
        }
        & > div {
            width: 33%;
            padding: 0 15px;
        }
        & > div:first-child {
            padding-left: 0;
        }
    }
    .flex2{
        & > div {
            width: 50%;
        }
    }
}
</style>