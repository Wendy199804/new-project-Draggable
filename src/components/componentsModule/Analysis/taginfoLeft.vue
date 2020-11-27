<template>
    <div class="taginfo-left-valuation">
        <div class="valuation-top">
            <div
                v-for="(item,index) in valuation_list"
                :key="item.title"
                class="valuation-item"
                v-show="!(index==0&&!had)"
            >
                <div class="vLoading" v-show="index==0&&loading"> <div><i class="el-icon-loading"></i></div> </div>
                <p>
                    {{item.title}}
                    <span v-show="index !==2">({{item.time}})</span>
                </p>
                <div>
                    <span
                    v-show="index===0"
                        :class="[item.num3>0 ? 'color-red':(item.num3<0?'color-green':'color-black'),'num1']"
                    >{{item.num1 | num1Filter}}</span>
                    <span
                    v-show="index!==0"
                        :class="[valuation_list[1].num3>0 ? 'color-red':(valuation_list[1].num3<0?'color-green':'color-black'),'num1']"
                    >{{item.num1 | num1Filter}}</span>
                    <svg-icon v-show="index === 0&&item.num1!=''&&item.num2>0" class="icon" icon-class="valuation-up" />
                    <svg-icon v-show="index === 0&&item.num1!=''&&item.num2<0" class="icon" icon-class="valuation-down" />
                    <div class="num2-num3">
                        <span
                            v-show="index === 0"
                            :class="[item.num2>0 ? 'color-red':(item.num2<0?'color-green':'color-black')]"
                        >{{item.num2 | num2Filter}}</span>
                        <span
                            v-show="index !==2"
                            :class="[item.num3>0 ? 'color-red':(item.num3<0?'color-green':'color-black')]"
                        >{{item.num3 | num3Filter}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="valuation-bottom">
            <div v-for="item in intervalnumList" :key="item.key">
                {{item.key}}：
                <span
                    :class="[item.value>0 ? 'color-red':(item.value<0?'color-green':'color-black')]"
                >{{item.value | num4Filter}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { toPercent } from '@/utils/analyze'
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'

export default {
    props: {
        intervalnumList: { type: Array, default: () => [] },
        accuunitnv: { type: Number, default: 0 },
        unitnv: { type: Number, default: 0 },
        dayOfGrowth: { type: Number, default: 0 },
        endDate: {},
        arr1:{type:Object,default:() => {{}}}
    },
    data() {
        return { had: false,loading:false }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        valuation_list() {
            this.had = ((this.selectFundToAnalyze.firsttypeChi==='股票型' || this.selectFundToAnalyze.firsttypeChi === '混合型')&&this.selectFundToAnalyze.isNew === 0) ? true : false
            this.loading = false
            return [
                this.arr1,
                {
                    title: '单位净值',
                    time: this.endDate,
                    num1: this.unitnv,
                    num3: this.dayOfGrowth,
                },
                {
                    title: '累计净值',
                    num1: this.accuunitnv,
                },
            ]
        },
    },
    filters: {
        num1Filter(num) {
            return num ? Number(num).toFixed(4) : '--'
        },
        num2Filter(num) {
            if (!num) {
                return num==0?Number(num).toFixed(4):''
            }
            let newnum = Number(num).toFixed(4)
            return num > 0 ? `+${newnum}` : `${newnum}`
        },
        num3Filter(num) {
            if (!num) {
                return num==0?toPercent(num):''
            }
            let newnum = toPercent(num)
            return num > 0 ? `+${newnum}` : `${newnum}`
        },
        num4Filter(num) {
            if (!num) {
                return num==0?toPercent(num):'- -'
            }
            let newnum = toPercent(num)
            return num > 0 ? `+${newnum}` : `${newnum}`
        },
    },
    created(){
        this.loading = true
    }
}
</script>

<style lang="scss" scoped>
.taginfo-left-valuation {
    
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50C75A;
    }
    .color-black {
        color: #333;
    }
    .valuation-top {
        display: flex;
        justify-content: flex-start;
        & > div {
            // width: 30%;
            padding-right: 20px;
            margin-right: 20px;
        }
        & > div:not(:last-child) {
            border-right: 1px solid #dddddd;
        }
    }
    .valuation-item {
        position: relative;
        & > div {
            display: flex;
            justify-content: flex-start;
        }
        & > p {
            font-size: 12px;
            color: #333;
            margin-bottom: 5px;
        }
        .num1 {
            font-size: 30px;
        }
        .num2-num3 {
            font-size: 13px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: flex-start;
            margin-left: 5px;
            margin-bottom: 3px;
        }
    }
    .valuation-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        color: #666;
        margin-top: 20px;
        & > div {
            width: 30%;
            margin-bottom: 7px;
        }
    }

    .icon {
        vertical-align: middle;
        font-size: 31px;
        margin-right: -10px;
        margin-left: -5px;
    }
    .vLoading{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        justify-content: center !important;
        align-items: center;
        opacity: 0.8;
        .el-icon-loading{
            font-size: 22px;
            // color: #4E7CEE;
        }
    }
}
</style>