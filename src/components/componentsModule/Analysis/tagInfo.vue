<template>
    <div class="tagInfo">
        <!-- 基金评测页面方框内标签、基本信息、收益数据等信息组件 -->
        <div class="tag-content">
            <!-- 非货币型基金 显示标签 -->
            <div class="tags" v-if="!isMonetary && labels">
                <Zjtag ref="zjtag" v-if="labels !== '{}'" :result="labels" :fundtype1="fundtype1" :fundtype2="fundtype2" />{{ Object.key }}
            </div>
            <!-- 非货币型基金 显示标签 end -->

            <!-- 老基金 显示星级 -->
            <div class="zjrate" v-if="!isNew" style="margin-bottom: 24px">
                <span>智君星级</span>
                <keep-alive>
                    <Zjrate :yaernum="3" :starlevel="curFundMsgL.threeFundStars" v-if="curFundMsgL.threeFundStars"></Zjrate>
                </keep-alive>
                <keep-alive>
                    <Zjrate :yaernum="5" :starlevel="curFundMsgL.fiveFundStars" v-if="curFundMsgL.fiveFundStars"></Zjrate>
                </keep-alive>
                <Zjrate v-if="!curFundMsgL.threeFundStars" :yaernum="3" starlevel="暂无星级"></Zjrate>
                <Zjrate v-if="!curFundMsgL.fiveFundStars" :yaernum="5" starlevel="暂无星级"></Zjrate>
            </div>
            <!-- 老基金 显示星级 end -->



            <!-- 待募集/募集中/募集结束 的非货币基金 -->
            <div v-if="!isMonetary && (isNew && !isIssued)" class="basic-msg">
                <!-- 左边 -->
                <div v-if="isRaising" v-loading.lock="collect_period_loading" class="the-raiseState">
                    <p>距离认购期结束还剩</p>
                    <p>{{ collect_period.remain }}</p>
                    <p>认购期：{{ collect_period.start }} ~ {{ collect_period.end }}
                        <vAnnotationPop content="以基金公司公告为准" />
                    </p>
                </div>
                <div v-else class="the-raiseState">
                    <p>&nbsp;</p>
                    <p>认购已结束</p>
                </div>
                <!-- 右边 -->
                <div class="new-fund-right">
                    <div style="display: flex">
                        基金经理：
                        <span v-if="!collect_period_r.managerPersonalCodeList || !collect_period_r.managerPersonalCodeList.length">- -</span>
                        <div class="managerate" v-for="(item, index) in collect_period_r.managerPersonalCodeList" :key="index">
                            <span class="toManager" @click="toManager(item.personalCode)">{{ item.name }}</span>
                            <el-rate
                                v-if="item.managerStars"
                                v-model="item.managerStars"
                                disabled
                                disabled-void-color="#bfbfbf"
                                :colors="['#555', '#555', '#555']"
                            ></el-rate>
                            <span v-if="item.managerLabel" class="gold-manager">{{ item.managerLabel }}</span>
                            <span
                                style="margin: 0 5px"
                                v-if="
                                    collect_period_r.managerPersonalCodeList.length > 1 &&
                                    index !== collect_period_r.managerPersonalCodeList.length - 1
                                "
                            >|</span>
                        </div>
                    </div>
                    <div>基金公司：{{ collect_period_r.company || '- -' }}</div>
                    <div>运作方式：{{ collect_period_r.chiOperateType || '- -' }}</div>
                    <div>基金类型：{{ collect_period_r.firstClassType || '- -' }}</div>
                </div>
            </div>
            <!-- 待募集/募集中/募集结束 的非货币基金 end -->

            <div v-else class="basic-msg">
                <!-- 募集成功的非货币基金左边 -->
                <Taginfoleft
                    v-if="!isMonetary && (!isNew || isIssued)"
                    :intervalnumList="intervalnumList"
                    :accuunitnv="accuunitnv"
                    :unitnv="unitnv"
                    :dayOfGrowth="dayOfGrowth"
                    :endDate="endDate"
                    :arr1="arr1"
                    ref="Taginfoleft"
                />
                <!-- 募集成功的非货币基金左边 end -->

                <!-- 募集成功的非货币基金右边 / 货币基金左边 -->
                <div
                    v-if="(!isNew || isIssued) || isMonetary"
                    class="basic-msg-l"
                    :style="{
                        borderLeft: !isMonetary ? '4px solid #5f80aa' : 'none',
                        borderRight: isMonetary ? '4px solid #5f80aa' : 'none'
                    }"
                >
                    <vLoading :show="isLoadingl" />
                    <div v-for="(item, index) in isMonetary ? noresultFundMsgL : resultFundMsgL" :key="index">
                        <div v-if="item.label === '二级分类'">
                            <span>二级分类：</span>
                            <span v-if="!curFundMsgL.secondClassType || !curFundMsgL.secondClassType.length">- -</span>
                            <span v-for="(item2, index2) in curFundMsgL.secondClassType" :key="index2">
                                <span v-if="item2 !== null">{{ item2 }}</span>
                                <span v-else>无</span>
                                <span
                                    style="margin: 0 5px"
                                    v-if="curFundMsgL.secondClassType.length > 1 && index2 !== curFundMsgL.secondClassType.length - 1"
                                >|</span>
                            </span>
                        </div>
                        <div v-else-if="item.label === '基金经理'" class="managerate">
                            <div style="width: 69px">基金经理：</div>
                            <div v-if="isMonetary" class="managerate" style="flex-wrap: wrap">
                                <span v-if="!curFundMsgL.managers || !curFundMsgL.managers.length">- -</span>
                                <div class="color3 managerate" v-for="(item, index) in curFundMsgL.managers" :key="index">
                                    <span class="toManager" @click="toManager(curFundMsgL.personalCode[index])">{{ item }}</span>
                                    <span style="margin: 0 5px" v-if="curFundMsgL.managers.length > 1 && index !== curFundMsgL.managers.length - 1">|</span>
                                </div>
                            </div>
                            <div v-else class="managerate" style="flex-wrap: wrap">
                                <span v-if="!curFundMsgL.mfFundmanagernewVos || !curFundMsgL.mfFundmanagernewVos.length">- -</span>
                                <div class="color3 managerate" v-for="(item, index) in curFundMsgL.mfFundmanagernewVos" :key="index">
                                    <span class="toManager" @click="toManager(item.personalCode)">{{ item.name }}</span>
                                    <el-rate
                                        v-if="item.period3Stars"
                                        v-model="item.period3Stars"
                                        disabled
                                        disabled-void-color="#bfbfbf"
                                        :colors="['#555', '#555', '#555']"
                                    ></el-rate>
                                    <span
                                        style="margin: 0 5px"
                                        v-if="curFundMsgL.mfFundmanagernewVos.length > 1 && index !== curFundMsgL.mfFundmanagernewVos.length - 1"
                                    >|</span>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <span>{{ item.label }}：</span>
                            <span v-if="item.key === 'size'">{{ curFundMsgL[item.key] | unitConverter }}</span>
                            <span v-else :class="item.key === 'unitnv' || item.key === 'complexnv' ? 'bold' : ''">
                                {{ curFundMsgL[item.key] || '- -' }}
                                <span v-if="item.key2">/ {{ curFundMsgL[item.key2] || '- -' }}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 募集成功的非货币基金 / 货币基金右边 end -->

                <!-- 货币型基金右边 -->
                <div v-if="isMonetary">
                    <p style="font-weight: 700; padding-left: 24px">
                        七日年化收益率均值
                        <span style="float: right; font-weight: 400">
                            计算日期：<span>{{ today }}</span>
                        </span>
                    </p>
                    <div class="basic-msg-r">
                        <vLoading :show="isLoadingr" />
                        <div v-for="(item, index) in noresultFundMsgR" :key="index">
                            <div>
                                <span>{{ item.label }}：</span>
                                <span>{{ curFundMsgR[item.key] | toPercent2 }}</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <svg-icon icon-class="trophy" style="margin-left: 10px" />
                                <span>{{ curFundMsgR[item.rank] }}&nbsp;/&nbsp;{{ curFundMsgR[item.rankall] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 货币型基金右边 end -->
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Zjrate from '@/components/localComponents/zjRate'
import Zjtag from '@/components/localComponents/zjTag'
import { resultFundMsgL, resultFundMsgR, noresultFundMsgL, noresultFundMsgR } from './taginfo_data'
import { fundNetValue, FundIndAndRank, nfundNetValue, nFundIndAndRank, fundselectLabels } from '@/api/analysis'
import { toPercent, unitConverter } from '@/utils/analyze'
import Taginfoleft from '@/components/componentsModule/Analysis/taginfoLeft'
import { getCurrentValuation, searchNewFund } from '@/api/analysis'

export default {
    name: 'taginfo',
    data() {
        return {
            fundtype1: '',
            fundtype2: '',
            tagcolors: ['red', 'blue', 'perple', 'cyan', 'blue', 'pink', 'green'],
            labels: [],

            isLoadingl: false, //加载动画
            isLoadingr: false,

            curFundMsgL: {},
            curFundMsgR: {},
            today: '',

            resultFundMsgL: [...resultFundMsgL],
            resultFundMsgR: [...resultFundMsgR],
            noresultFundMsgL: [...noresultFundMsgL],
            noresultFundMsgR: [...noresultFundMsgR],

            intervalnumList: [], //传到taginfoleft
            accuunitnv: 0, //传到taginfoleft  累计净值
            unitnv: 0, //taginfoleft 单位净值
            dayOfGrowth: 0, //taginfoleft 单位净值增长率
            endDate: '', //taginfoleft 单位净值时间
            had: false,
            arr1: {},

            timer: null, //实时估算定时器
            collect_period: {
                start: '',
                end: '',
                day: '',
                hour: ''
            }, //待募集、募集中左边数据
            collect_period_loading: false,
            collect_period_r: {}
        }
    },
    components: {
        Zjrate,
        Zjtag,
        Taginfoleft
    },
    filters: {
        /**转换为小数 */
        toFixed(num) {
            if (isNaN(num)) {
                return '- -'
            }
            return Number(num).toFixed(2)
        },
        /**转换为百分数 */
        toPercent(num) {
            return toPercent(num)
        },
        toPercent2(num) {
            return toPercent(num, 4)
        },
        /**最新规模 加单位 */
        unitConverter(num) {
            return unitConverter(num)
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        isMonetary() { // 是货币型基金
            return this.selectFundToAnalyze.type === 2
        },
        isNew() { // 是新基金
            return this.selectFundToAnalyze.isNew
        },
        isIssued() { // 是募集成功的基金
            return this.selectFundToAnalyze.raiseState === 5
        },
        isRaising() { // 是待募集/募集中的基金
            return this.selectFundToAnalyze.raiseState === 1 || this.selectFundToAnalyze.raiseState === 3
        }
    },
    watch: {
        $route(val) {}
    },
    methods: {
        render() {
            this.isLoadingl = this.isLoadingr = this.collect_period_loading = true
            this.init()
            this.getFundLabels()
            this.getLiveprice()
            this.getfundNetValu()
            this.getFundIndAndRank()
            if (this.selectFundToAnalyze.isNew === 1) {
                this.getNewFund()
                this.collectPeriod()
            }
        },
        //新基金信息
        getNewFund() {
            searchNewFund({ innerCode: this.selectFundToAnalyze.innercode }).then(res => {
                this.collectPeriod(res.issueStartDate, res.issueEndDate, res.toEndDate)
                this.collect_period_r = res
            })
        },
        //募集期时间
        collectPeriod(start, end, remain) {
            // this.collect_period_loading = true
            if (start && end) {
                // let diff = new Date(end + ':00').getTime() - new Date().getTime()
                // day: Math.floor(diff / (24 * 3600 * 1000)),
                // hour: Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000))
                let collect_period = { start, end, remain }
                this.collect_period = collect_period
                this.collect_period_loading = false
            }
        },
        init() {
            this.had = this.selectFundToAnalyze.firsttypeChi === '股票型' || this.selectFundToAnalyze.firsttypeChi === '混合型' ? true : false
            this.labels = []
            this.curFundMsgL = {}
            this.curFundMsgR = {}
            this.today = '- -'
        },
        /**跳转到基金经理 */
        toManager(value) {
            this.$routeOpen({
                name: 'Manager',
                query: {
                    id: value
                }
            })
        },
        /**给index传三年评级 */
        threeStar() {
            this.$emit('star', this.curFundMsgL.threeFundStars, true)
        },
        isDuringDate(beginDateStr, endDateStr) {
            let curDate = new Date(),
                beginDate = new Date(beginDateStr),
                endDate = new Date(endDateStr)
            return curDate >= beginDate && curDate <= endDate ? true : false
        },
        //净值估算
        getLiveprice() {
            this.arr1 = {}
            this.had = this.selectFundToAnalyze.firsttypeChi === '股票型' || this.selectFundToAnalyze.firsttypeChi === '混合型' ? true : false
            if (this.had) {
                this.setIntervalPrice()
                this.timer = setInterval(() => {
                    let date = new Date() //9:30 - 11:30、13: 00 - 15:00
                    let year = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    let isDuringdate = this.isDuringDate(`${year} 9:30`, `${year} 11:30`) || this.isDuringDate(`${year} 13:00`, `${year} 15:00`)
                    isDuringdate ? this.setIntervalPrice() : ''
                }, 300000)
            }
        }, //净值估算
        setIntervalPrice() {
            getCurrentValuation({ fund_innercode: this.selectFundToAnalyze.innercode.toString() })
                .then(res => {
                    let unituv = {}
                    if (Object.keys(res).length == 0) {
                        unituv = { title: '净值估算', time: '--', num1: '', num2: '', num3: '' }
                    } else {
                        unituv = {
                            title: '净值估算',
                            time: `${res.time_now[0]} ${res.time_now[1]}`,
                            num1: res.UnitNV_now,
                            num2: res.UnitNV_change,
                            num3: res.track_return_now
                        }
                    }
                    this.arr1 = unituv
                })
                .catch(err => {})
        },
        //
        async getFundLabels() {
            try {
                let result = ''
                if (!this.isMonetary) {
                    result = await fundselectLabels({
                        innerCode: this.selectFundToAnalyze.innercode
                    })
                    this.labels = Object.keys(result).length >0 ? result : false
                    this.$refs.zjtag.handleResult(JSON.parse(JSON.stringify(result)))
                }
            } catch (err) {}
        },
        /**获得基金评级、净值 */
        async getfundNetValu() {
            // this.isLoadingl = true
            try {
                let result = ''
                if (!this.isMonetary) {
                    //非货币
                    result = await fundNetValue({
                        innerCode: this.selectFundToAnalyze.innercode
                    })
                    result.mfFundmanagernewVos.forEach(item => {
                        if (item.period3Stars) {
                            item.period3Stars = Number(item.period3Stars)
                        }
                    })
                    this.curFundMsgL = result.fundInformation
                    Object.assign(this.curFundMsgL, {
                        applyingType: result.applyingType,
                        chiOperateType: result.chiOperateType,
                        redeemType: result.redeemType,
                        endDate: result.endDate,
                        complexnv: result.complexnv ? result.complexnv.toFixed(4) : '',
                        unitnv: result.unitnv ? result.unitnv.toFixed(4) : '',
                        threeFundStars: result.threeFundStars,
                        fiveFundStars: result.fiveFundStars,
                        mfFundmanagernewVos: result.mfFundmanagernewVos,
                        firstClassType: result.firstClassType,
                        secondClassType: result.secondClassType
                    })
                    this.fundtype1 = result.firstClassType
                    this.fundtype2 = result.secondClassType

                    this.$emit('star', this.curFundMsgL.threeFundStars, true)
                    let intervalnumList =
                        this.selectFundToAnalyze.isNew === 0
                            ? [
                                  { key: '近1月', value: result.intervalReturn1 },
                                  { key: '近3月', value: result.intervalReturn3 },
                                  { key: '近6月', value: result.intervalReturn6 },
                                  { key: '近1年', value: result.intervalReturn12 },
                                  { key: '近3年', value: result.intervalReturn36 },
                                  { key: '成立以来', value: result.startIntervalReturn }
                              ]
                            : [
                                  { key: '近1月', value: result.intervalReturn1 },
                                  { key: '近3月', value: result.intervalReturn3 },
                                  { key: '成立以来', value: result.startIntervalReturn }
                              ]
                    this.intervalnumList = intervalnumList
                    this.accuunitnv = result.accuunitnv
                    this.unitnv = result.unitnv
                    this.dayOfGrowth = result.dayOfGrowth
                    this.endDate = result.endDate
                } else {
                    result = await nfundNetValue({
                        innerCode: this.selectFundToAnalyze.innercode
                    })
                    this.curFundMsgL = result
                    Object.assign(this.curFundMsgL, {
                        dailyProfit: result.dailyProfit.toFixed(4) || '',
                        latestWeeklyYield: toPercent(result.latestWeeklyYield, 4)
                    })
                }
                setTimeout(() => {
                    this.isLoadingl = false
                }, 150)
            } catch (err) {
                this.isLoadingl = false
            }
        },

        /**获得基金指标与排名 */
        async getFundIndAndRank() {
            // this.isLoadingr = true
            try {
                let result = ''
                if (this.isMonetary) {
                    result = await nFundIndAndRank({
                        innerCode: this.selectFundToAnalyze.innercode
                    })
                    this.today = `${result.endDate.year}/${result.endDate.monthValue}/${result.endDate.dayOfMonth}`
                } else {
                    result = await FundIndAndRank({
                        innerCode: this.selectFundToAnalyze.innercode
                    })
                    this.today = `${result.mfAnnualReturn.endDate.year}/${result.mfAnnualReturn.endDate.monthValue}/${result.mfAnnualReturn.endDate.dayOfMonth}`
                }
                this.curFundMsgR = result
                setTimeout(() => {
                    this.isLoadingr = false
                }, 150)
            } catch (err) {
                this.isLoadingr = false
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
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
    //金麒麟基金经理
    .gold-manager {
        display: inline-block;
        color: #4e7cee;
        background: rgba($color: #4e7cee, $alpha: 0.2);
        padding: 5px 8px;
        border-radius: 12px 2px 12px 2px;
        margin-left: 6px;
    }
    .toManager {
        margin-right: 2px;
        cursor: pointer;
        color: #4e7cee;
    }

    .tag-content {
        width: 100%;
        border: 1px solid #dddddd;
        padding: 17px 24px;
        margin-top: 7px;
        position: relative;
        font-size: 13px;

        .tags {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;

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
            //新基金右边
            .new-fund-right {
                display: grid;
                grid-template-columns: 100%;
                border-left: 4px solid #5f80aa;
                grid-template-rows: 16px 16px 16px 16px;
                padding-left: 24px;
                grid-row-gap: 15px;
            }

            .basic-msg-l {
                display: grid;
                grid-template-columns: 45% 55%;
                grid-row-gap: 15px;
                align-items: center;
                // border-right: 4px solid #5f80aa;
                padding-left: 24px;
            }
            .managerate {
                display: flex;
                justify-content: flex-start;
                align-items: center;
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
                    color: #50c75a;
                }
            }
        }
    }
    .the-raiseState {
        line-height: 36px;
        & > p:nth-child(1) {
            font-size: 12px;
        }
        & > p:nth-child(2) {
            font-size: 32px;
        }
        & > p:nth-child(3) {
            font-size: 16px;
        }
    }

    .col2 /deep/ .el-input__icon {
        line-height: 30px;
    }

    /deep/ .el-rate__icon {
        margin: 0;
    }

    /deep/ .el-autocomplete {
        width: 100%;
    }
    /deep/ .el-popper[x-placement^='bottom'] {
        left: 30px;
        width: 100%;
    }
}
</style>