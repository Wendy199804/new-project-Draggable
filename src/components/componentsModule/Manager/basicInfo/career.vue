<template>
    <div class="card">
        <moduletitle :title="'职业生涯'" type="manager"></moduletitle>
        
        <div class="card-body">
            <el-table :data="tableData" v-loading="isLoading">
                <el-table-column label="任职开始时间" prop="start" align="center"></el-table-column>
                <el-table-column label="任职结束时间" prop="end" align="center"></el-table-column>
                <el-table-column label="管理基金数" prop="number" align="center"></el-table-column>
                <el-table-column label="任职基金公司" prop="company" align="center"></el-table-column>
                <el-table-column label="基金公司规模" prop="size" align="center"></el-table-column>
                <el-table-column label="基金公司排名" prop="rank" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProfessionalHistory } from '@/api/manager'

export default {
    data() {
        return {
            isLoading: false,
            tableData: []
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.getTableData()
        },
        async getTableData() {
            this.isLoading = true
            const res = await getProfessionalHistory({
                personalCode: this.managerInfo.id
            })
            this.isLoading = false
            this.tableData = res.map(item => {
                return {
                    start: item.appointmentStartTime,
                    end: item.appointmentEndTime || '至今',
                    number: item.num,
                    company: item.company,
                    size: item.size.toFixed(2) + '亿',
                    rank: item.rank
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>