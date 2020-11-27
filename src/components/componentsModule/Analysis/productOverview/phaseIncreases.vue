<template>
    <div class="phase-increases">
        <moduletitle title="阶段涨幅">
            
        </moduletitle>
        <div class="content" v-show="result">
            <div v-for="(item, index) in thead" :key="index + 'a'" style="background-color: #f5f5f5">
                <div class="inlinediv">{{ item }}</div>
            </div>
            <div v-for="(item, index) in arr1" :key="index + 'b'">
                <div v-if="index === 0" class="inlinediv text-left">{{ item }}</div>
                <div v-else :class="[item > 0 ? 'color-red' : item < 0 ? 'color-green' : '', 'inlinediv']">{{ item | toPercent }}</div>
            </div>
            <div v-for="(item, index) in arr2" :key="index + 'c'">
                <div v-if="index === 0" class="inlinediv text-left">{{ item }}</div>
                <div v-else :class="[item > 0 ? 'color-red' : item < 0 ? 'color-green' : '', 'inlinediv']">{{ item | toPercent }}</div>
            </div>
            <div v-for="(item, index) in arr3" :key="index + 'd'">
                <div v-if="index === 0" class="inlinediv text-left">{{ item }}</div>
                <div v-else :class="[item > 0 ? 'color-red' : item < 0 ? 'color-green' : '', 'inlinediv']">{{ item | toPercent }}</div>
            </div>
            <div v-for="(item, index) in arr4" :key="index + 'e'">
                <div v-if="index === 0" class="inlinediv text-left">同类排名</div>
                <div v-else class="inlinediv">{{ item }}</div>
            </div>
            <div v-for="(item, index) in arr5" :key="index + 'f'">
                <div v-if="index === 0" class="inlinediv text-left">四分位排名</div>
                <div v-else class="inlinediv">
                    <Waterrank :value="item" />
                </div>
            </div>
        </div>

        <div style="position: relative; height: 300px; width: 100%;top:0" v-show="!result">
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
            thead: ['', '近1周', '近1月', '近3月', '近6月', '今年以来', '近1年', '近3年'],
            arr1: [],
            arr2: [],
            arr3: [],
            arr4: [],
            arr5: [],
            result: false,
            isLoading: false
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
        toTableData() {},
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
                name = '阶段涨幅'
            this.$downloadExcel(table_data, props, keys, name)
        },
        getData() {
            this.isLoading = true
            this.result = false
            push_request({
                type: 'cal_first_page_rev_stat',
                exec_type: 'sync',
                index_code: this.base_index_code,
                fund_innercode: this.selectFundToAnalyze.innercode.toString()
            })
                .then(res => {
                    if (JSON.stringify(res) == '{}' || JSON.stringify(res) == '[]') {
                        this.result = false
                        this.isLoading = false
                    } else {
                        this.result = true
                        let arr1 = [],
                            arr2 = [],
                            arr3 = [],
                            arr4 = [],
                            arr5 = []
                        Object.keys(res)
                            .splice(0, Object.keys(res).length - 1)
                            .map((item, index) => {
                                arr1[index] = res[item][0]
                                arr2[index] = res[item][1]
                                arr3[index] = res[item][2]
                                arr4[index] = res[item][3] || '- -'
                                arr5[index] = res[item][4]
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
        }
    }
}
</script>

<style lang="scss">
.phase-increases {
    background-color: #ffffff;
    color: #666;
    .color-red {
        color: #f04134;
    }
    .color-green {
        color: #50c75a;
    }
    .color-black {
        color: #666;
    }
    .content {
        margin: 16px;
        display: grid;
        position: relative;
        grid-template-columns: 17.5% repeat(7, 11.7857%);
        grid-template-rows: 40px 40px 40px 40px 40px 100px;
        border-right: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        font-size: 13px;
        font-weight: 400;

        & > div {
            border-top: 1px solid #ddd;
            box-sizing: border-box;
        }
        &
            > div:not(:first-child):not(:nth-child(2)):not(:nth-child(3)):not(:nth-child(4)):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(5)):not(:nth-child(6)):not(:nth-child(7)):not(:nth-child(8)) {
            border-top: 1px solid #ebeef5;
        }
    }
    .inlinediv {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        &.text-left {
            justify-content: flex-start;
            padding-left: 10px;
            width: 112px;
        }
    }
    ._content {
        width: 100%;
        margin: 20px;
    }
}
</style>