<template>
    <div class="roll-yield">
        <moduletitle title="" :tablist="tablist" :curtab="curtab" @clickTab="clickTab">
            <div v-show="curtab.id === 2">
                <span>频率</span>
                <div class="secondary-title">
                    <div
                        class="item"
                        v-for="item in freqOptions"
                        :key="item.label"
                        :style="{
                            background: item.value === freqValue ? 'rgba(78, 124, 238, 0.1)' : 'transparent',
                            color: item.value === freqValue ? '#4E7CEE' : '#666',
                            borderColor: item.value === freqValue ? '#4E7CEE' : '#aaa'
                        }"
                        @click="clickSecondTab(item.value)"
                    >
                        {{ item.label }}
                    </div>
                </div>
            </div>
            
        </moduletitle>
        <div class="content" v-show="result">
            <div v-for="(item, index) in thead" :key="index + 'a'" style="background-color: #f5f5f5">
                <div class="inlinediv">{{ item }}</div>
            </div>
            <div v-for="(item, index) in arr1" :key="index + 'b'">
                <div v-if="index === 0" class="inlinediv">{{ item }}</div>
                <div v-else :class="[item > 0 ? 'color-red' : item < 0 ? 'color-green' : '', 'inlinediv']">{{ item | toPercent }}</div>
            </div>
            <div v-for="(item, index) in arr2" :key="index + 'c'">
                <div v-if="index === 0" class="inlinediv">{{ item }}</div>
                <div v-else :class="[item > 0 ? 'color-red' : item < 0 ? 'color-green' : '', 'inlinediv']">{{ item | toPercent }}</div>
            </div>
            <div v-for="(item, index) in arr3" :key="index + 'd'">
                <div v-if="index === 0" class="inlinediv">{{ item }}</div>
                <div v-else :class="[item > 0 ? 'color-red' : item < 0 ? 'color-green' : '', 'inlinediv']">{{ item | toPercent }}</div>
            </div>
            <div v-for="(item, index) in arr4" :key="index + 'e'">
                <div v-if="index === 0" class="inlinediv">同类排名</div>
                <div v-else class="inlinediv">{{ item }}</div>
            </div>
            <div v-for="(item, index) in arr5" :key="index + 'f'">
                <div v-if="index === 0" class="inlinediv">四分位排名</div>
                <div v-else class="inlinediv">
                    <Waterrank :value="item === '- -' ? 0 : item" />
                </div>
            </div>
        </div>
        <div style="position: relative; height: 300px; width: 100%" v-show="!result">
            <vNodata v-if="!isLoading&&!result" :show="!isLoading&&!result" />
            <vLoading v-if="isLoading" :show="isLoading" />
        </div>
    </div>
</template>

<script>

import Waterrank from '@/components/localComponents/waterRank'
import { toPercent, getRank } from '@/utils/analyze'
import { push_request } from '@/api/analysis'
import { mapGetters } from 'vuex'
import base from '@/mixins/base_index'

export default {
    mixins: [base],
    components: {
        Waterrank
    },
    data() {
        return {
            curtab: {
                id: 1
            },
            tablist: [
                { name: '区间收益', id: 1 },
                { name: '滚动收益', id: 2 }
            ],
            thead: ['', '近1周', '近1月', '近3月', '近6月', '今年以来', '近1年', '近3年', '近5年'],
            arr1: [],
            arr2: [],
            arr3: [],
            arr4: [],
            arr5: [],
            result: false,
            isLoading: false,
            freqValue: 'quarter', //'monthly' 'quarter' 'annual',
            freqOptions: [
                { label: '月', value: 'monthly' },
                { label: '季', value: 'quarter' },
                { label: '年', value: 'annual' }
            ],
            dates: []
        }
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        render() {
            this.getData()
        },
        getData() {
            this.isLoading = true
            this.result=false
            let param =
                this.curtab.id === 1
                    ? {
                          type: 'cal_first_page_rev_stat',
                          exec_type: 'sync',
                          index_code: this.base_index_code,
                          fund_innercode: this.selectFundToAnalyze.innercode.toString()
                      }
                    : {
                          type: 'get_rolling_returns',
                          exec_type: 'sync',
                          fund_innercode: this.selectFundToAnalyze.innercode.toString(),
                          index_code: this.base_index_code,
                          freq: this.freqValue
                      }
            push_request(param)
                .then(res => {
                    let resultdata = res
                    if (resultdata.length == 0 || JSON.stringify(resultdata) === '{}') {
                        this.result = false
                        this.isLoading = false
                    } else {
                        this.result = true
                        let arr1 = [],
                            arr2 = [],
                            arr3 = [],
                            arr4 = [],
                            arr5 = []
                        let result_arr = []
                        if (this.curtab.id === 2) {
                            //滚动收益
                            let dates = Object.keys(resultdata).filter(item => {
                                return item !== 'fund_type' && item !== 'sort'
                            })
                            dates.sort().reverse()
                            if (dates.length < 8) {
                                //如果数据不足8个
                                let emptyarr = this.fillArr(dates[0], false) //计算得到完整的时间 - 无单位
                                let a = [].concat(emptyarr) // 拷贝
                                a.splice(0, 8 - dates.length).map(item => {
                                    //给没有数据的时间段增加空数据
                                    resultdata[item] = Array(5).fill('')
                                })
                                dates = emptyarr
                            } else {
                                this.dates = [...dates].map((item, index) => {
                                    return this.freqValue === 'monthly'
                                        ? `${item.split('-')[0].substr(2, 2)}年${Number(item.split('-')[1])}月`
                                        : this.freqValue === 'quarter'
                                        ? `${item.split('-')[0].substr(2, 2)}年第${Number(item.split('-')[1])}季度`
                                        : `${item.split('-')[0]}年`
                                })
                            }
                            dates.unshift('fund_type')
                            result_arr = dates
                            this.thead = [...[''], ...this.dates] // 表头
                        } else {
                            //区间收益
                            result_arr = Object.keys(resultdata)
                        }

                        result_arr.map((item, index) => {
                            arr1[index] = resultdata[item][0] || '- -'
                            arr2[index] = resultdata[item][1] || '- -'
                            arr3[index] = resultdata[item][2] || '- -'
                            arr4[index] = resultdata[item][3] || '- -'
                            arr5[index] = resultdata[item][4] || '- -'
                        })
                        arr3[0] = this.base_index_name
                        this.arr1 = arr1
                        this.arr2 = arr2
                        this.arr3 = arr3
                        this.arr4 = arr4
                        this.arr5 = arr5
                        this.isLoading = false
                    }
                })
                .catch(err => {
                    this.isLoading = false
                })
        },
        /**
         * 下载表格
         */ 
        handleExcel() {
            let arrs = {
                    arr1: this.arr1,
                    arr2: this.arr2,
                    arr3: this.arr3,
                    arr4: this.arr4,
                    arr5: [...this.arr5].map((item, index) => {
                        return index == 0 ? item : getRank(item)
                    })
                },
                tableData = [1, 2, 3, 4, 5].map((item, index) => {
                    return {
                        title: arrs[`arr${item}`][0],
                        week: arrs[`arr${item}`][1],
                        one_mon: arrs[`arr${item}`][2],
                        three_mon: arrs[`arr${item}`][3],
                        xis_mon: arrs[`arr${item}`][4],
                        this_year: arrs[`arr${item}`][5],
                        one_year: arrs[`arr${item}`][6],
                        three_year: arrs[`arr${item}`][7],
                        five_year: arrs[`arr${item}`][8]
                    }
                }),
                table_data = tableData,
                props = this.thead.map(item => {
                    return {
                        name: item,
                        style: item == '' ? 'left' : 'right'
                    }
                }),
                keys = ['title', 'week', 'one_mon', 'three_mon', 'xis_mon', 'this_year', 'one_year', 'three_year', 'five_year'],
                name = this.curtab.id == 1 ? '区间收益' : '滚动收益'
            this.$downloadExcel(table_data, props, keys, name)
        },
        /**
         * 刷新
         */
        refreshChart() {
            this.render()
        },
        //切换一级标题
        clickTab(index) {
            this.curtab = this.tablist[index]
            this.isLoading = true
            this.render()
            if (this.curtab.id === 2) {
                this.thead = [...[''], ...this.dates]
            } else {
                this.thead = ['', '近1周', '近1月', '近3月', '近6月', '今年以来', '近1年', '近3年', '近5年']
            }
        },
        //切换二级标题
        clickSecondTab(value) {
            this.freqValue = value
            this.render()
        },
        //补齐8个数据
        fillArr(date, haswrap) {
            let arr = []
            let arr2 = []
            if (this.freqValue === 'monthly') {
                //月
                let month = Number(date.split('-')[1]) + 1
                let year = date.split('-')[0]
                for (let i = 0; i < 8; i++) {
                    month = month - 1
                    if (month == 0) {
                        month = 12
                        year = year - 1
                    }
                    arr[i] = `${year.toString().substr(2, 2)}年${month}月`
                    arr2[i] = `${year}-${month.toString().padStart(2, '0')}`
                }
            } else if (this.freqValue === 'quarter') {
                //季
                let ji = Number(date.split('-')[1]) + 1
                let year = date.split('-')[0]
                for (let i = 0; i < 8; i++) {
                    ji = ji - 1
                    if (ji == 0) {
                        ji = 4
                        year = year - 1
                    }
                    arr[i] = `${year.toString().substr(2, 2)}年第${ji}季度`
                    arr2[i] = `${year}-${ji}`
                }
            } else if (this.freqValue === 'annual') {
                //年
                let year = Number(date) + 1
                for (let i = 0; i < 8; i++) {
                    year = year - 1
                    arr[i] = `${year}年`
                    arr2[i] = `${year}`
                }
            }
            this.dates = arr
            return haswrap ? arr : arr2
        }
    }
}
</script>
<style lang="scss">
.roll-yield {
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
        margin: 16px;
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
    .secondary-title {
        display: flex;
        justify-content: flex-start;
        .item {
            border: 1px solid;
            font-size: 12px;
            padding: 5px 10px 4px 10px;
            border-right: none;
            cursor: pointer;
        }
        & > div:first-child {
            border-radius: 4px 0 0 4px;
        }
        & > div:last-child {
            border-radius: 0 4px 4px 0;
            border-right: 1px solid;
        }
    }
}
</style>