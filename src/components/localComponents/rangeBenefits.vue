<template>
    <div class="phase-increases">
        <div class="content" v-show="result">
            <vNodata :show="!result" style="border:1px solid red" />
            <div v-for="(item,index) in thead" :key="index+'a'" style="background-color:#f5f5f5">
                <div class="inlinediv">{{item}}</div>
            </div>
            <div v-for="(item,index) in arr1" :key="index+'b'">
                <div v-if="index === 0" class="inlinediv">{{item}}</div>
                <div
                    v-else
                    :class="[item>0 ? 'color-red':(item<0?'color-green':''),'inlinediv']"
                >{{item | toPercent}}</div>
            </div>
            <div v-for="(item,index) in arr2" :key="index+'c'">
                <div v-if="index === 0" class="inlinediv">{{item}}</div>
                <div
                    v-else
                    :class="[item>0 ? 'color-red':(item<0?'color-green':''),'inlinediv']"
                >{{item | toPercent}}</div>
            </div>
            <div v-for="(item,index) in arr3" :key="index+'d'">
                <div v-if="index === 0" class="inlinediv">{{item}}</div>
                <div
                    v-else
                    :class="[item>0 ? 'color-red':(item<0?'color-green':''),'inlinediv']"
                >{{item | toPercent}}</div>
            </div>
            <div v-for="(item,index) in arr4" :key="index+'e'">
                <div v-if="index === 0" class="inlinediv">四分位排名</div>
                <div v-else class="inlinediv">{{item}}</div>
            </div>
            <div v-for="(item,index) in arr5" :key="index+'f'">
                <div v-if="index === 0" class="inlinediv">四分位排名</div>
                <div v-else class="inlinediv">
                    <Waterrank :value="item" />
                </div>
            </div>
        </div>
        <div style="position: relative;height:300px;width:100%" v-show="!result">
            <vNodata :show="!result"/>
        </div>
    </div>
</template>

<script>
import Waterrank from '@/components/localComponents/waterRank'
import { toPercent } from '@/utils/analyze'
import { push_request } from '@/api/analysis'
import { mapGetters } from 'vuex'

export default {
    components: {
        Waterrank,
    },
    data() {
        return {
            thead: ['', '近1周', '近1月', '近3月', '近6月', '今年以来', '近1年', '近2年', '近3年'],
            arr1: [],
            arr2: [],
            arr3: [],
            arr4: [],
            arr5: [],
            result: false,
            isLoading: false,
        }
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        },
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
    },
    methods: {
        render() {
            this.getData()
        },
        getData() {
            this.isLoading = true
            push_request({ type: 'cal_first_page_rev_stat', exec_type: 'sync', fund_innercode: this.selectFundToAnalyze.innercode.toString() }).then((res) => {
                if (res.length == 0) {
                    this.result = false
                    this.isLoading = false
                } else {
                    this.result = true
                    let arr1 = [],
                        arr2 = [],
                        arr3 = [],
                        arr4 = [],
                        arr5 = []
                    Object.keys(res).map((item, index) => {
                        arr1[index] = res[item][0]
                        arr2[index] = res[item][1]
                        arr3[index] = res[item][2]
                        arr4[index] = res[item][3] || '- -'
                        arr5[index] = res[item][4]
                    })
                    this.arr1 = arr1
                    this.arr2 = arr2
                    this.arr3 = arr3
                    this.arr4 = arr4
                    this.arr5 = arr5
                    this.isLoading = false
                }
            }).catch(err=>{this.isLoading = false})
        },
    },
}
</script>

<style lang="scss">
.phase-increases {
    background-color: #ffffff;
    margin-bottom: 16px;
    color: #333;
    padding-bottom: 1px;
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50c75a;
    }
    .color-black {
        color: #333;
    }
    .content {
        margin: 20px;
        display: grid;
        position: relative;
        grid-template-columns: 14% repeat(8, 10.75%);
        grid-template-rows: 40px 40px 40px 40px 40px 100px;
        border-right: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;

        & > div {
            border-top: 1px solid #ddd;
            // border-right: 1px solid #ddd;
            // border-left: 1px solid #ddd;
            box-sizing: border-box;
        }
        // &>div:nth-child(1){
        //     border-left: 1px solid #ddd;
        // }
        // &>div:last-child{
        //     border-bottom: 1px solid #ddd;
        // }
    }
    .inlinediv {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // border-top: 1px solid #ddd;
    }
    ._content {
        width: 100%;
        margin: 20px;
    }
}
</style>