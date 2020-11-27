<template>
    <div class="history">
        <moduletitle title="历史星级" type="manager"></moduletitle>
        <div class="content">
            <el-table :data="tableData" style="width: 100%" v-loading="isLoading" empty-text="基金经理数据不足，暂时无法评级。">
                <el-table-column prop="year" label="智君星级" align="center"></el-table-column>
                <el-table-column v-for="(item, index) in date" :key="index" :label="`${date[index]}`" :prop="`star${index}`" align="center">
                    <template slot-scope="scope">
                        <el-rate v-model="scope.row[`star${index}`]" disabled disabled-void-color="#bfbfbf" :colors="colors[scope.$index]"></el-rate>
                    </template>
                </el-table-column>
            </el-table>

            <!-- <vNodata :show="!tableData.length" text="基金经理数据不足，暂时无法评级。" />
            <vLoading :show="isLoading" /> -->
        </div>
    </div>
</template>

<script>
import Zjrate from '@/components/localComponents/zjRate'
import { mapGetters } from 'vuex'
import { getManagerstars } from '@/api/manager'

export default {
    data() {
        return {
            isLoading: false,
            result: null,

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
            date: ['- -', '- -', '- -', '- -', '- -', '- -'],
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
        ...mapGetters(['managerInfo'])
    },
    methods: {
        async getManagerstars() {
            this.isLoading = true
            try {
                const res = await getManagerstars({
                    managerType: this.managerInfo.type,
                    personalCode: this.managerInfo.id
                })
                this.isLoading = false
                if (!res.historyManager3List.length && !res.historyManager5List.length) {
                    this.tableData = []
                } else {
                    this.result = res
                    this.handleResult()
                }
            } catch {
                this.isLoading = false
            }
        },
        handleResult() {
            this.result.historyManager3List.forEach((item, index) => {
                this.tableData[0][`star${index}`] = item.stars
                this.date[index] = item.monthDate.split(' ')[0]
            })
            this.result.historyManager5List.forEach((item, index) => {
                this.tableData[1][`star${index}`] = item.stars
                this.date[index] = item.monthDate.split(' ')[0]
            })
        },
        render() {
            this.getManagerstars()
        }
    }
}
</script>

<style lang="scss" scoped>
.history {
    margin-bottom: 16px;
    background-color: #ffffff;

    .content {
        padding: 16px;
        position: relative;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #ffffff;
    }
}
</style>
