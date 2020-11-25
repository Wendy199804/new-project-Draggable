<template>
    <span>
        <el-select v-if="interval > 0" v-model="date_value"
            size="mini"
            placeholder="选择日期"
            @change="handleChangePoint">
            <el-option v-for="(item, index) in dateOptions"
                :key="index"
                :label="item"
                :value="item">
            </el-option>
        </el-select>

        <el-date-picker v-else v-model="date_value"
            size="mini"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :clearable="false"
            @change="handleChangePoint">
        </el-date-picker>
    </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        // 用于 基金评测 or 基金经理评测 or 组合分析
        use: {
            type: String,
            default: 'analysis'
        },
        // 披露日期 3:季报; 6:半年报; 12:年报; 0:自由选择
        interval: {
            type: Number,
            default: 3
        },
        // 取值方式 '':默认; '2':方式2
        database: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dateOptions: [],
            date_value: ''
        }
    },
    computed: {
        ...mapGetters([
            'analyzeFundDateList',
            'analyzeFundDateList2',

            'compareFundsDateList',

            'managerDateList',
            'managerDateList2',

            'portfolioDateList',
            'portfolioDateList2'
        ]),
        dateList() {
            if (this.use == 'manager') return this[`managerDateList${this.database}`]
            if (this.use == 'portfolio') return this[`portfolioDateList${this.database}`]
            if (this.use == 'compare') return this.compareFundsDateList
            return this[`analyzeFundDateList${this.database}`]
        }
    },
    methods: {
        init(value) {
            let list = this.dateList
            if (this.interval == 6) {
                list = list.filter(date => /^[0-9]{4}-06-30$/.test(date) || /^[0-9]{4}-12-31$/.test(date))
            }
            if (this.interval == 12) {
                list = list.filter(date => /^[0-9]{4}-12-31$/.test(date))
            }
            this.dateOptions = list
            if (!list.length) {
                this.date_value = ''
                return
            }
            this.handleChangePoint(value || list[0])
        },
        /**
         * 选择截止时间
         */
        handleChangePoint(value) {
            this.date_value = value
            this.$emit('change')
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
