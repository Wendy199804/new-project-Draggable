<template>
    <div class="wrap">
        <moduletitle title="历史星级">
            <template v-slot:svg>
                <span title="查看星级说明" @click="starIns" class="high">说明</span>
            </template>
        </moduletitle>
        <div style="padding: 16px">
            <el-table :data="tableData" style="width: 100%" v-loading="isLoading" empty-text="基金数据不足，暂时无法评级。">
                <el-table-column prop="year" label="智君星级" align="center" width="150"></el-table-column>
                <el-table-column v-for="item in 5" :key="item" :label="date[item-1]" align="center">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row[`star${item}`]" disabled disabled-void-color="#bfbfbf" :colors="colors[scope.$index]"></el-rate>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

import Zjrate from '@/components/localComponents/zjRate'
import { FundHistoryRank } from '@/api/analysis'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            isLoading: false, //加载动画
            result: null,

            today: '',
            date: ['- -', '- -', '- -', '- -', '- -'],
            tableData: [
                {
                    year: '三年',
                    star1: 0,
                    star2: 0,
                    star3: 0,
                    star4: 0,
                    star5: 0,
                    star6: 0
                },
                {
                    year: '五年',
                    star1: 0,
                    star2: 0,
                    star3: 0,
                    star4: 0,
                    star5: 0,
                    star6: 0
                }
            ],
            colors: [
                ['#FF6673', '#FF6673', '#FF6673'],
                ['#FF7952', '#FF7952', '#FF7952']
            ]
        }
    },
    components: {
        Zjrate
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        starIns(){
            this.$routeOpen({ name: 'HistoryStarinstructions' })
        },
        async getFundHistoryRank() {
            this.isLoading = true
            try {
                // this.getDate()
                const result = await FundHistoryRank({
                    startDate: this.today,
                    innerCode: this.selectFundToAnalyze.innercode
                })
                this.result = result
                if(result.fundRating3Topsis.length===0&&result.fundRating5Topsis.length===0){
                    this.tableData=[]
                }else{
                    this.handleResult()
                }
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            this.result.fundRating3Topsis.forEach((item, index) => {
                this.tableData[0][`star${index + 1}`] = item.stars
                this.date[index] = item.monthDate
            })
            this.result.fundRating5Topsis.forEach((item, index) => {
                this.tableData[1][`star${index + 1}`] = item.stars
                // this.date[index] = item.monthDate
            })
            this.$forceUpdate()
        },
        /**获得当天日期 */
        getDate() {
            let date = new Date()
            let year = date.getFullYear()
            let month = (date.getMonth() + 1).toString().padStart(2, '0')
            let day = date.getDate().toString().padStart(2, '0')
            this.today = `${year}-${month}-${day}`
        },
        render() {
            this.getFundHistoryRank()
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    background-color: #ffffff;
    margin-bottom: 16px;
    font-size: 14px;

    .table {
        padding: 0 24px 24px 24px;
        margin-top: 5px;
        position: relative;

        & > div:last-child {
            border-bottom: 1px solid #dddddd;
        }

        .table-row {
            width: 100%;
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-top: 1px solid #dddddd;
            border-left: 1px solid #dddddd;
            border-right: 1px solid #dddddd;

            & > div:nth-child(1) {
                width: 101px;
                height: 100%;
                flex-shrink: 0;
                border-right: 1px solid #dddddd;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            & > div:nth-child(2) {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                & > div {
                    width: calc((100%) / 6);
                    display: flex;
                    justify-content: center;
                }
            }
        }
    }

    .zjrate[data-v-1fcd5806] {
        margin-right: 0;
    }
    .high{
        color: #4E7CEE;
        font-size: 14px;
        cursor: pointer;
    }
}
</style>