<template>
    <div class="fund-manager">
        <div class="manager-left box">
            <div class="manager-header">
                <Zjtitle>现任基金经理简介</Zjtitle>
                <div>
                    <span
                        v-for="(item,index) in resultNowList"
                        :key="index"
                        @click="jump(index)"
                        :class="curitem === index ? 'curitem':''"
                    >{{item.name}}</span>
                </div>
            </div>
            <div class="manager-content" v-if="resultNowList.length ===0">无数据</div>
            <div class="manager-content" ref="contentWrap" v-if="resultNowList.length !==0">
                <el-scrollbar style="height:100%" @scroll="handleScroll" ref="content">
                    <div
                        class="manager-item"
                        v-for="(item,index) in resultNowList"
                        :key="index"
                        :ref="`item${index}`"
                    >
                        <div class="manager-item-photo">
                            <div>
                                <img :src="`data:image/png;base64,${item.personalData}`" alt />
                            </div>
                        </div>
                        <div>
                            <div style="font-size:16px;font-weight:600;">{{item.name}}</div>
                            <div>
                                <el-form
                                    :label-position="labelPosition"
                                    label-width="80px"
                                    :model="formLabelAlign"
                                >
                                    <el-form-item label="智君星级">
                                        <div class="manager-rate">
                                            <Zjrate
                                                v-if="item.period3Stars"
                                                :yaernum="3"
                                                :starlevel="item.period3Stars"
                                            ></Zjrate>
                                            <span v-else>暂无星级</span>
                                            <Zjrate
                                                v-if="item.period5Stars"
                                                :yaernum="5"
                                                :starlevel="item.period5Stars"
                                            ></Zjrate>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="任职回报">
                                        <span
                                            style="color:#FF6673"
                                        >{{item.performance | ftoPercent}}</span>
                                    </el-form-item>
                                    <el-form-item label="任职时间">
                                        <span>{{item.accessionDate}} 至今</span>
                                    </el-form-item>
                                    <el-form-item label="个人经历">
                                        <p>{{item.background}}</p>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>

        <div class="manager-right box">
            <div class="manager-header">
                <Zjtitle>历任基金经理</Zjtitle>
            </div>
            <div class="manager-content" v-if="resultBeforeList.length ===0">无数据</div>
            <div class="manager-content" v-if="resultBeforeList.length !==0">
                <el-scrollbar style="height:100%">
                    <el-timeline>
                        <el-timeline-item
                            placement="top"
                            v-for="(item,index) in resultBeforeList"
                            :key="index"
                            :color="'#2E5082'"
                            :size="'large'"
                            :timestamp="item.time"
                        >
                            <el-card>
                                <h4>{{item.name}}</h4>
                                <p class="manage-content-p">
                                    <span>任职天数：</span>
                                    <span>{{item.timeinterval}}</span>
                                </p>
                                <p class="manage-content-p">
                                    <span>任职回报：</span>
                                    <span
                                        v-for="(item_percent,index_percent) in item.performance"
                                        :key="index_percent"
                                        :class="item_percent>0 ? 'color-red':'color-green'"
                                    >
                                        {{item_percent | ftoPercent}}
                                        <span
                                            v-if="item.performance.length>1 && (index_percent!==item.performance.length-1)"
                                            style="color:#333"
                                        >|</span>
                                    </span>
                                </p>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </el-scrollbar>
            </div>
        </div>

        <vLoading :show="isLoading" />
    </div>
</template>

<script>
import Zjtitle from '@/components/localComponents/zjTableTitle'
import Zjrate from '@/components/localComponents/zjRate'
import { mapGetters } from 'vuex'
import { FundManagerList } from '@/api/analysis'
import { toPercent } from '@/utils/analyze'

export default {
    data() {
        return {
            resultBeforeList: [],
            resultNowList: [],

            labelPosition: 'right',
            formLabelAlign: {
                name: '',
                region: '',
                type: ''
            },
            scrollTop: '',
            curitemHeight: '',
            curitem: 0,

            isLoading: false,
            resultList: {}
        }
    },
    components: {
        Zjtitle,
        Zjrate
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    filters: {
        ftoPercent(num) {
            return toPercent(num)
        }
    },
    methods: {
        /**获得当天日期 */
        getDate() {
            let date = new Date()
            let year = date.getFullYear()
            let month = (date.getMonth() + 1).toString().padStart(2, '0')
            let day = date
                .getDate()
                .toString()
                .padStart(2, '0')
            return `${year}-${month}-${day}`
        },
        /**基金经理排序 */
        reduceList(data) {
            let newarr = []
            let resultarr = [] //结果
            let arr = data
            for (let len = arr.length, i = len - 1; i >= 0; i--) {
                arr[i].begintime = new Date(arr[i].begintime.split('-').join('/')).getTime()
                arr[i].endtime = new Date(arr[i].endtime.split('-').join('/')).getTime()
                newarr.push(arr[i].begintime)
                newarr.push(arr[i].endtime)
            }
            let newarr2 = [...new Set(newarr)]
            let newarr3 = newarr2.sort() //时间段数组

            for (let j = 0; j < newarr3.length; j++) {
                resultarr[j] = {
                    name: [],
                    begintime: '',
                    endtime: '',
                    timeinterval: '',
                    performance: []
                }
            }
            arr.forEach(itemarr => {
                newarr3.forEach((itemtime, index, arrtime) => {
                    if (index <= arrtime.length - 2) {
                        if (itemarr.begintime <= itemtime && itemarr.endtime >= arrtime[index + 1]) {
                            resultarr[index].name.push(itemarr.name)
                            resultarr[index].begintime = itemtime
                            resultarr[index].endtime = arrtime[index + 1]
                            resultarr[index].timeinterval = arrtime[index + 1] - itemtime
                            resultarr[index].performance.push(itemarr.performance)
                        }
                    }
                })
            })
            resultarr.splice(resultarr.length - 1, 1)
            resultarr.forEach((item, index, arr) => {
                let begin = new Date(item.begintime)
                let end = new Date(item.endtime)
                item.timeinterval = `${item.timeinterval / 86400000}天`
                item.time = `${begin.getFullYear()}-${begin.getMonth() + 1}-${begin.getDate()} 至 ${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
                item.name = item.name.join(' | ')
                if (index == arr.length - 1) {
                    item.time = `${begin.getFullYear()}-${begin.getMonth() + 1}-${begin.getDate()} 至今`
                }
            })
            this.resultBeforeList = resultarr.reverse().filter(item =>{
                return item.timeinterval != '0天'
            })
        },
        async getFundManagerList() {
            this.isLoading = true
            try {
                const result = await FundManagerList({ innerCode: this.selectFundToAnalyze.innercode })

                result.fundManagerListNow.forEach(item => {
                    item.period3Stars = Number(item.period3Stars)
                    item.period5Stars = Number(item.period5Stars)
                })
                result.fundmanagerBeforeVos.forEach((item, index) => {
                    item.begintime = item.accessionDate.split(' ')[0]
                    if (!item.dimissionDate) {
                        item.endtime = this.getDate()
                    } else {
                        item.endtime = item.dimissionDate.split(' ')[0]
                    }
                })
                this.resultNowList = result.fundManagerListNow
                // if (this.resultNowList.length !== 0) {
                //   this.$refs.content.$refs['wrap'].addEventListener('scroll', this.handleScroll)
                // }
                this.reduceList(result.fundmanagerBeforeVos)
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        /**监听基金经理滚动 */
        handleScroll(el) {
            let scrolltop = this.$refs.content.$refs['wrap'].scrollTop
            let showHeight = this.$refs.contentWrap.offsetHeight
            let borderHeight = scrolltop + showHeight / 2 // 零界值 = 滚动高度 + 1/2屏高
            this.scrollTop = scrolltop

            for (let i = 0, len = 3; i < len; i++) {
                if (borderHeight >= this.$refs[`item${i}`].offsetTop) {
                    this.curitem = i
                }
            }
        },
        /**点击基金经理滚动定位 */
        jump(index) {
            this.curitem = index
            this.curitemHeight = this.$refs[`item${index}`][0].offsetTop
            this.$refs.content.$refs['wrap'].scrollTop = this.curitemHeight
        }
    },
    created() {
        if (this.selectFundToAnalyze.innercode !== '') {
            // this.getFundManagerList()
        }
    },
    mounted() {
        if (this.resultNowList.length !== 0) {
            this.$refs.content.$refs['wrap'].addEventListener('scroll', this.handleScroll)
        }
    },
    // destroyed() {
    //     if (this.resultNowList.length !== 0) {
    //         this.$refs.content.$refs['wrap'].removeEventListener('scroll', true)
    //     }
    // }
}
</script>

<style lang="scss" scoped>
.fund-manager {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding: 17px 24px 24px 24px;

    .box {
        border: 1px solid rgba(221, 221, 221, 1);
    }

    .manager-left {
        width: 55%;
        margin-right: 26px;
    }
    .manager-right {
        width: 50%;
    }
    .manager-header {
        height: 40px;
        background: rgba(245, 245, 245, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px;
        box-sizing: border-box;
        & > div > span {
            cursor: pointer;
        }
        .curitem {
            background-color: rgba(#4e7cee, $alpha: 0.2);
            // display: inline-block;
            border-radius: 4px;
            color: #4e7cee;
            padding: 3px 5px;
        }
        & > div:nth-child(2) {
            & > span {
                margin-left: 7px;
            }
        }
    }

    .manager-content {
        padding: 16px;
        height: 378px;
        // overflow-y: auto;
        /*隐藏滚动条*/
        // &::-webkit-scrollbar {
        //   width: 0px;
        //   height: 0px;
        // }
        // &::-o-scrollbar {
        //   -moz-appearance: none !important;
        //   background: rgba(0, 255, 0, 0) !important;
        // }
        h4 {
            color: #333;
            font-size: 14px;
            margin: 0;
        }
        .manage-content-p {
            font-size: 13px;
            margin-top: 5px;

            & > span:first-child {
                color: #666;
            }
            & > span:last-child {
                color: #333;
            }
        }
        .color-red {
            color: #ff6673 !important;
        }

        .color-green {
            color: #50c75a !important;
        }
    }

    .manager-item {
        display: grid;
        grid-template-columns: 100px auto;
        // grid-template-rows: 100px 100px 100px;
        grid-column-gap: 16px;
        // border: 1px solid black;

        &:not(:last-child) {
            margin-bottom: 40px;
        }

        .manager-item-photo {
            width: 100%;
            height: 120px;
            & > div {
                width: 100%;
                height: 100%;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }

        .manager-rate {
            height: 26px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            /deep/ .zjrate {
                & > span {
                    background: transparent !important;
                }
                & > span:first-child {
                    color: #333 !important;
                }
            }
        }
    }

    /deep/ .el-timeline-item__tail {
        border-left: 2px solid #2e5082;
    }
    /deep/ .el-timeline-item__node {
        position: relative;
        z-index: 19;
        &::before {
            content: '';
            display: block;
            border-radius: 50%;
            width: 9px;
            height: 9px;
            background-color: #ffffff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            // z-index: 20;
        }
    }
    /deep/ .el-timeline-item__wrapper {
        top: -17px;
    }
    /deep/ .el-form-item__label {
        text-align: left;
    }

    /deep/ .el-form-item__label,
    /deep/ .el-form-item__content {
        line-height: 26px;
    }

    /deep/ .zjrate[data-v-22ec647a] {
        margin-top: 3px;
        margin-left: -3px;
    }
    /deep/ .el-form-item {
        margin-bottom: 0px;
        label {
            font-weight: 400;
        }
    }
    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    /deep/ .el-scrollbar__wrap {
        /**平滑滚动 */
        scroll-behavior: smooth;
    }
}
</style>