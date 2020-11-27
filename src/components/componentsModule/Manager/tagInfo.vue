<template>
    <div class="tagInfo">
        <!-- 基金评测页面方框内标签、基本信息、收益数据等信息组件 -->

        <div class="content">
            <div class="basic-msg">
                <div class="basic-msg-l">
                    <vLoading :show="isLoadingl" />
                    <div v-for="(item,index) in resultFundMsgL" :key="index">
                        <span>
                            {{item.label}}：
                            <span
                                v-if="item.key === 'size'||item.key === 'sizeNoMf'"
                            >{{curFundMsgL[item.key] | unitConverter}}</span>
                            <span
                                v-else-if="item.key === 'careerAnnualReturn'|| item.key === 'baseAnnualReturn'"
                            >{{curFundMsgL[item.key] | toPercent}}</span>
                            <span v-else>{{curFundMsgL[item.key] || '- -'}}</span>
                        </span>
                    </div>
                </div>
                <!--  -->
                <div class="basic-msg-r">
                    <vLoading :show="isLoadingr" />
                    <div class="col2">
                        <el-select v-model="value" placeholder="请选择" @change="changeTimerange">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <span>
                            计算日期：
                            <span>{{today}}</span>
                        </span>
                    </div>
                    <div v-for="(item,index) in resultFundMsgR" :key="index">
                        <div>
                            <span>{{item.label}}：</span><span
                                :class="(item.key=='intervalReturn'||item.key=='exAnnualReturn'||item.key=='annualReturn')?(Number(item.index1)>0 ? 'color-red':Number(item.index1)<0?'color-green':'color-black'):''"
                            >
                                <span v-if="item.key!=='sharpe'">{{item.index1 | toPercent}}</span>
                                <span v-else>{{item.index1 | tofixed}}</span>
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;<svg-icon icon-class="trophy" />
                            <span>{{item.index2}}&nbsp;/&nbsp;{{item.index3}}</span>
                        </div>
                        <!-- <div v-if="!curFundMsgR[item.value]">
              <span>{{item.label}}</span>
              <span>- -</span>
              <svg-icon icon-class="trophy" />
              <span>- - / - -</span>
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Zjrate from '@/components/localComponents/zjRate'
import Zjtag from '@/components/localComponents/zjTag'
import { getManagerInfo, getManagerIndex } from '@/api/manager'
import { toPercent, unitConverter } from '@/utils/analyze'

export default {
    data() {
        return {
            options: [
                {
                    value: 'oneyears',
                    label: '近一年'
                },
                {
                    value: 'threeyears',
                    label: '近三年'
                },
                {
                    value: 'fiveyears',
                    label: '近五年'
                }
            ],
            value: 'oneyears',

            isLoadingl: false, //加载动画
            isLoadingr: false,

            curFundMsgL: {},
            curFundMsgR: {},

            resultFundMsgL: [
                {
                    label: '现任公司',
                    key: 'company'
                },
                {
                    label: '从业年限',
                    key: 'experienceTime'
                },
                {
                    label: '在管规模',
                    key: 'size'
                },
                {
                    label: '剔除货币规模',
                    key: 'sizeNoMf'
                },
                {
                    label: '在管产品',
                    key: 'fundsUnderManagement'
                },
                {
                    label: '累计管理产品',
                    key: 'fundsInTotal'
                },
                {
                    label: '学历',
                    key: 'chiEducation'
                },
                {
                    label: '代表产品',
                    key: 'representFund'
                },
                {
                    label: '代表基金年化回报',
                    key: 'careerAnnualReturn'
                },
                {
                    label: '同期大盘年化回报',
                    key: 'baseAnnualReturn'
                }
            ],
            resultFundMsgR: [
                {
                    label: '累计收益',
                    key: 'intervalReturn',
                    value: 'mfmIntervalReturn'
                },
                {
                    label: '年化波动率',
                    key: 'volatility',
                    value: 'mfmVolatility'
                },
                {
                    label: '年化绝对收益',
                    key: 'annualReturn',
                    value: 'mfmAnnualReturn'
                },
                {
                    label: '最大回撤',
                    key: 'maximumDrawdown',
                    value: 'mfmMaximumDrawdown'
                },
                {
                    label: '年化超额收益',
                    key: 'exAnnualReturn',
                    value: 'mfmExAnnualReturn'
                },
                {
                    label: '夏普率',
                    key: 'sharpe',
                    value: 'mfmSharpe'
                }
            ],

            today: '', //今日日期 yyyy-mm-dd
            oneyears: [],
            threeyears: [],
            fiveyears: []
        }
    },
    components: {
        Zjrate,
        Zjtag
    },
    filters: {
        /**转换为百分数 */
        toPercent(num) {
            if (isNaN(num)) {
                return '- -'
            }
            return toPercent(num)
        },
        /**最新规模 加单位 */
        unitConverter(num) {
            return unitConverter(num)
        },
        /**保留两位小数 */
        tofixed(num) {
            if (isNaN(num)) {
                return '- -'
            }
            return Number(num).toFixed(2)
        }
    },
    computed: {
        ...mapGetters(['managerInfo', 'selectFundToAnalyze'])
    },
    watch: {
        $route(val) {}
    },
    methods: {
        init(){
            this.curFundMsgL= {}
            this.curFundMsgR= {}
            this.today= '' 
            this.oneyears= []
            this.threeyears= []
            this.fiveyears= []
            this.value = 'oneyears'
        },
        render(){
            this.init()
            this.getManagerInfo()
            this.getManagerIndex()
        },
        /**切换指标时间段 */
        changeTimerange(value) {
            this.resultFundMsgR = this.resultFundMsgR.map((item, index) => {
                return Object.assign(item, this[value][index])
            })
        },
 
        /**基金经理基本信息 */
        async getManagerInfo() {
            this.isLoadingl = true
            try {
                const result = await getManagerInfo({
                    personalCode: this.managerInfo.id,
                    managerType: this.managerInfo.type
                })
                let stars = { star3: result.current3yearRating, star5: result.current5yearRating }
                this.$emit('getmsg', stars, true)
                this.curFundMsgL = result
                this.isLoadingl = false
            } catch (err) {
                this.isLoadingl = false
            }
        },

        /**获得基金经理指标 */
        async getManagerIndex() {
            this.isLoadingr = true
            try {
                const result = await getManagerIndex({
                    personalCode: this.managerInfo.id,
                    managerType: this.managerInfo.type
                })
                this.curFundMsgR = result
                this.handleResult()
                this.today = `${result.mfmIntervalReturn.endDate.year}/${result.mfmIntervalReturn.endDate.monthValue}/${result.mfmIntervalReturn.endDate.dayOfMonth}`
                this.isLoadingr = false
            } catch (err) {
                this.isLoadingr = false
            }
        },
        handleResult() {
            let arr = this.resultFundMsgR
            let arr4 = this.curFundMsgR
            this.oneyears = []
            this.threeyears = []
            this.fiveyears = []
            let options = [
                {key: 'oneyears', value: '1'},
                {key: 'threeyears', value: '3'},
                {key: 'fiveyears', value: '5'},
            ]
            arr.forEach((item, index) => {
                options.forEach(option => {
                    let {key, value} = option
                    let data = arr4[item.value]
                    this[key].push(data ? {
                        index1: data[item.key + value] || '- - ',
                        index2: data['rank' + value] || '- - ',
                        index3: data['rankAllNum' + value] || '- - '
                    } : {
                        index1: '- -',
                        index2: '- -',
                        index3: '- -'
                    })
                })
            })
            this.changeTimerange(this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.tagInfo {
    padding: 16px 0;
    padding-top: 0;
    box-sizing: border-box;
    background-color: #ffffff;
    color: #333333;
    position: relative;

    .content {
        width: 100%;
        border: 1px solid #dddddd;
        border-top: none;
        padding: 17px 24px;
        position: relative;
        font-size: 13px;
        // &::before {
        //     content: '';
        //     width: 100%;
        //     height: 2px;
        //     display: block;
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     background: linear-gradient(90deg, rgba(236, 34, 28, 1) 0%, rgba(78, 124, 238, 1) 100%);
        //     z-index: 10;
        // }

        .tags {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > div {
                margin-right: 6px;
            }
            margin-bottom: 10px;
        }

        .zjrate {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            & > span {
                margin-right: 5px;
            }
        }

        .basic-msg {
            // margin-top: 24px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            & > div {
                width: 50%;
                height: 100%;
            }

            .basic-msg-l {
                display: grid;
                grid-template-columns: 45% 55%;
                grid-row-gap: 15px;
                align-items: center;
                border-right: 4px solid #5f80aa;

                .managerate {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                }
            }

            .basic-msg-r {
                display: grid;
                grid-template-columns: 50% 50%;
                grid-template-rows: 32px 30px 30px 30px;
                padding-left: 24px;
                align-items: end;

                .col2 {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    grid-column-start: 1;
                    grid-column-end: 3;
                }

                .color-red {
                    color: #f04134;
                }

                .color-green {
                    color: #50C75A;
                }

                .color-black {
                    color: #333333;
                }
            }
        }
    }

    .col2 /deep/ .el-input__icon {
        line-height: 30px;
    }

    // /deep/ .el-rate__icon {
    //     margin: 0;
    // }

    /deep/ .el-autocomplete {
        width: 100%;
    }
    /deep/ .el-popper[x-placement^='bottom'] {
        left: 30px;
        width: 100%;
    }
}
</style>