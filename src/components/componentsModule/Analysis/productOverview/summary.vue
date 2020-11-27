<template>
    <div class="analysis-summary">
        <moduletitle :title="'产品总结'"></moduletitle>
        <div class="main fhbx">
            <div v-if="selectFundToAnalyze.type === 1">
                <p v-if="selectFundToAnalyze.isNew" class="isnew-p"><span>基金经理</span><span>基金公司</span></p>
                <div>
                    <summaryModule
                        v-for="(item, index) in list"
                        :key="index"
                        :summaryTitle="item.title"
                        :bgcolor="item.bgcolor"
                        class="summaryModule"
                    >
                        <p v-html="result1[index]"></p>
                        <vLoading :show="item.isLoading" />
                        <vNodata :show="!result1[index]" />
                    </summaryModule>
                </div>
            </div>
            <div v-else>
                <div v-if="result.length == 1">
                    <p v-html="result[0]" style="padding-top: 30px"></p>
                </div>
                <div v-else>
                    <summaryModule
                        v-for="(item, index) in list2"
                        v-show="result[index]"
                        :key="index"
                        :summaryTitle="item.title"
                        :bgcolor="item.bgcolor"
                    >
                        <p v-html="result[index]"></p>
                        <!-- <p v-if="!result[index]">- -</p> -->
                    </summaryModule>
                </div>
            </div>

            <vLoading :show="isLoading" />
            <vNodata :show="this.selectFundToAnalyze.type === 2 && !result && !isLoading" />
        </div>
    </div>
</template>

<script>

import summaryModule from '@/components/localComponents/summaryModule'
import { push_request } from '@/api/analysis'
import { mapGetters } from 'vuex'

export default {
    props:{
        proplist:{type:Array,default:()=>[]}
    },
    data() {
        return {
            isLoading: false,
            result: '',
            result1: [null, null, null, null],
            list: [],
            list2: []
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    components: {
        summaryModule
    },
    methods: {
        init() {
            this.list = this.proplist.length===0?[
                {
                    title: '绩效分析',
                    bgcolor: '#6F8EE6',
                    content: ''
                },
                {
                    title: '投资风格',
                    bgcolor: '#5ABEFF',
                    content: ''
                },
                {
                    title: '基金经理',
                    bgcolor: '#58CBC4',
                    content: ''
                },
                {
                    title: '基金公司',
                    bgcolor: '#5F80AA',
                    content: ''
                }
            ]:this.proplist

            this.list2 = [
                {
                    title: '业绩收益',
                    bgcolor: '#62BBF5',
                    content: ''
                },
                {
                    title: '业绩比较',
                    bgcolor: '#F57B7B',
                    content: ''
                }
            ]
        },
        async getNotCurrencyData() {
            this.isLoading = true
            try {
                const result = await push_request({
                    type: 'money_fund_remark',
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString()
                })
                this.result = result
                this.handleResult()
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        async getCurrencyData() {
            let pro1 = this.getdata(1)
            let pro2 = this.getdata(2)
            let pro3 = this.getdata(3)
            let pro4 = this.getdata(4)
        },
        async getdata(num) {
            this.list[num-1].isLoading = true
            try {
                const result = await push_request({
                    type: `fund_remark_${num}`,
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString()
                })
                this.result1[num - 1] = result[0]
                this.list[num-1].isLoading = false
                this.$forceUpdate()
            } catch {
                this.list[num-1].isLoading = false
            }
        },
        async getNewFundData(api,num) {
            this.list[num-1].isLoading = true
            try {
                const result = await push_request({
                    type: api,
                    exec_type: 'sync',
                    fund_innercode: this.selectFundToAnalyze.innercode.toString()
                })
                this.result1[num - 1] = result[0]
                this.list[num-1].isLoading = false
                this.$forceUpdate()
            } catch {
                this.list[num-1].isLoading = false
            }
        },
        handleResult() {
            this.result.forEach((item, index) => {
                item = item == '' ? '- -' : item
            })
        },
        render() {
            this.init()
            if(this.selectFundToAnalyze.type === 2){
                this.getNotCurrencyData()
            }else{
                if(this.selectFundToAnalyze.isNew === 1){
                    ['fund_remark_3','fund_manager_preferrence','fund_remark_4','fund_company_preferrence'].forEach((item,index)=>{
                        this.getNewFundData(item,index+1)
                    })
                }else{
                    this.getCurrencyData()
                }
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
.analysis-summary {
    background-color: #ffffff;
    margin-bottom: 16px;
    .isnew-p{
        display: flex;
        justify-content: space-between;
        margin-top:16px;
        &>span{
            display: inline-block;
            width: 48.8%;
            font-size: 16px;
            font-weight: 600;
        }
    }
    .summaryModule{
        position: relative;
    }
    .hbx {
        padding: 20px 24px 24px 24px;
        line-height: 24px;
    }
    .fhbx {
        padding: 0px 24px 24px 24px;
        line-height: 22px;
    }
    .main {
        position: relative;
        min-height: 80px;
        & > div > div {
            display: flex;
            justify-content: flex-start;

            & > div {
                width: 24%;
            }
            & > div:not(:last-child) {
                margin-right: 32px;
            }
        }

        .slotdiv {
            font-size: 14px;
            color: #333333;
            & > span {
                color: #fd484c;
            }
        }

        /deep/ .red {
            color: #fd484c;
        }
        /deep/ .green {
            color: #50c75a;
        }
    }
    /deep/ .loading-mask, /deep/ .nodata {
        height: calc(100% - 49px) !important;
        top: 49px;
    }
}
</style>
