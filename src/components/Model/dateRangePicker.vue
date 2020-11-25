<template>
    <!-- 
    传入 config: ['year_start', 'three_months_before', 'six_months_before']
    代表不包括“今年以来” “最近三月” “最近六月”
    -->
    <span style="display:inline-block">
        <el-select v-model="value" placeholder="请选择" size="mini" @change="handleChangeRange">
            <el-option
                v-for="(item, index) in rangeOptions"
                :key="index "
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>

        <span v-if="value == 'custom'">
            <el-date-picker
                v-if="type === 'year'"
                v-model="defined_value"
                type="daterange"
                size="mini"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                @change="handleSelectDefinedDate"
            ></el-date-picker>
            <!-- <span v-if="type === 'year'" class="date-picker">
                <el-date-picker
                    size="mini"
                    class="picker1 left"
                    v-model="defined_value[0]"
                    value-format="yyyy-MM-dd"
                    placeholder="开始日期"
                    :clearable="false"
                    @change="handleSelectDefinedDate"
                ></el-date-picker>
                <span class="left">至</span>
                <el-date-picker
                    size="mini"
                    class="picker2 left"
                    v-model="defined_value[1]"
                    prefix-icon="el-icon"
                    value-format="yyyy-MM-dd"
                    placeholder="结束日期"
                    :clearable="false"
                    @change="handleSelectDefinedDate"
                ></el-date-picker>
            </span> -->

            <span v-else>
                <el-select
                    v-model="defined_value[0]"
                    size="mini"
                    placeholder="开始日期"
                    @change="handleChangeDefinedDate(0)"
                >
                    <el-option
                        v-for="(item, index) in dateOptions"
                        :key="index"
                        :label="item"
                        :value="item"
                    ></el-option>
                </el-select>至
                <el-select
                    v-model="defined_value[1]"
                    size="mini"
                    placeholder="结束日期"
                    @change="handleChangeDefinedDate(1)"
                >
                    <el-option
                        v-for="(item, index) in dateOptions"
                        :key="index"
                        :label="item"
                        :value="item"
                    ></el-option>
                </el-select>
            </span>
        </span>

        <el-date-picker
            v-else
            v-model="dates_value"
            disabled
            type="daterange"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
    </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        // 用于 基金评测 or 基金比较 or 基金经理评测 or 组合分析
        use: {
            type: String,
            default: 'analysis'
        },
        // 时段类型 quarter: 近几季度; period: 近几期; year: 近几年
        type: {
            type: String,
            default: 'quarter'
        },
        // 取值方式 '':默认; '2':方式2
        database: {
            type: String,
            default: ''
        },
        // 从全部中去掉的选项 value list
        config: {
            type: Array
        },
        showOneMonth: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            rangeOptions: [],
            value: '',

            dates_value: '',
            dateOptions: [],
            // defined_value: [],
            condefined_value: [], //

            yearOptions: [
                { label: '成立以来', value: 'since_founded', chi: '' },
                { label: '今年以来', value: 'year_start', chi: '' },
                { label: '最近3月', value: 'three_months', chi: '3月' },
                { label: '最近6月', value: 'six_months', chi: '6月' },
                { label: '最近1年', value: 'one_year', chi: '1年' },
                { label: '最近2年', value: 'two_years', chi: '2年', analysisNot: true, managerNot: true, compareNot: true },
                { label: '最近3年', value: 'three_years', chi: '3年' },
                { label: '最近5年', value: 'five_years', chi: '5年' },
                { label: '自定义', value: 'custom', chi: '所选时段' }
            ],
            quarterOptions: [
                { label: '成立以来', value: '-1' },
                { label: '近4季度', value: '4' },
                { label: '近8季度', value: '8' },
                { label: '近12季度', value: '12' },
                { label: '近20季度', value: '20' },
                { label: '自定义', value: 'custom' }
            ],
            periodOptions: [
                { label: '成立以来', value: '-1' },
                { label: '近2年', value: '4' },
                { label: '近3年', value: '6' },
                { label: '近5年', value: '10' },
                { label: '自定义', value: 'custom' }
            ],
        }
    },
    computed: {
        ...mapGetters([
            'analyzeFundDateList',
            'analyzeFundDateList2',
            'analyzeFundDateRange',

            'compareFundsDateList',
            'compareFundsDateRange',

            'managerDateList',
            'managerDateList2',
            'managerDateRange',

            'portfolioDateList',
            'portfolioDateList2',
            'portfolioDateRange'
        ]),
        dateList() {
            if (this.use == 'manager') return this[`managerDateList${this.database}`]
            if (this.use == 'portfolio') return this[`portfolioDateList${this.database}`]
            if (this.use == 'compare') return this.compareFundsDateList
            return this[`analyzeFundDateList${this.database}`]
        },
        dateRange() {
            if (this.use == 'manager') return this.managerDateRange
            if (this.use == 'portfolio') return this.portfolioDateRange
            if (this.use == 'compare') return this.compareFundsDateRange
            return this.analyzeFundDateRange
        },
        start_date() {
            return this.value == 'custom' ? this.defined_value[0] : this.dates_value ? this.dates_value[0] : ''
        },
        end_date() {
            return this.value == 'custom' ? this.defined_value[1] : this.dates_value ? this.dates_value[1] : ''
        },
        range_chi() {
            if (!this.rangeOptions.length) return ''
            return this.rangeOptions.find(item => item.value == this.value).chi
        },
        defined_value: {
            get() {
                return this.condefined_value
            },
            set(val, oldval) {
                this.condefined_value = val ? val : []
            }
        },
        excludeConfig() {
            if (this.config && this.config.length) return this.config
            if (this.type == 'year') return []
            return ['-1', 'custom']
        }
    },
    methods: {
        /**
         * 组件初始化 用于基金评测或基金比较
         */
        init(value) {
            let options = this[this.type + 'Options'].filter(item => !item[this.use + 'Not'])
            // 基金比较 成立以来->共同时段
            this.use == 'compare' && (options[0].label = '共同时段')
            // 排除部分选项
            options = options.filter(item => this.excludeConfig.indexOf(item.value) < 0)
            // 特殊需求：非货基-业绩走势-时段 添加近1月
            if (this.use == 'analysis' && this.showOneMonth) {
                options.splice(2, 0, { label: '最近1月', value: 'one_month' })
            }
            this.rangeOptions = options
            this.getDateOptions()
            // 默认选中
            let dftIndex = this.type == 'year' ? 0 : this.excludeConfig.indexOf('custom') > -1 ? this.rangeOptions.length - 1 : this.rangeOptions.length - 2
            this.handleChangeRange(value || this.rangeOptions[dftIndex].value)
        },
        getDateOptions() {
            let list = this.dateList
            if (this.type == 'period') {
                list = list.filter(date => /^[0-9]{4}-06-30$/.test(date) || /^[0-9]{4}-12-31$/.test(date))
            }
            this.dateOptions = list
        },
        /**
         * 选择区间类型
         */
        handleChangeRange(value) {
            this.value = value
            if (this.value == 'custom') {
                this.defined_value = this.dates_value
                return
            }
            if (this.type == 'year') {
                if (!this.dateRange[this.value]) {
                    this.dates_value = []
                    return
                }
                this.dates_value = this.dateRange[this.value]
            } else {
                if (!this.dateOptions.length) {
                    this.dates_value = []
                    return
                }
                let start = this.value < 0 ? this.dateOptions[this.dateOptions.length - 1] : this.dateOptions[+this.value - 1] || this.dateOptions[this.dateOptions.length - 1]
                let end = this.dateOptions[0]
                this.dates_value = [start, end]
            }
            this.$emit('change', value)
        },

        /**
         * 选择自定义区间日期（季频或期频）this.type: quarter/period
         */
        handleChangeDefinedDate(n) {
            // 判断两个日期是否逻辑冲突
        },
        /**
         * 选择自定义区间日期（日频）this.type: year
         */
        handleSelectDefinedDate(value) {
            if (!value) return
            this.$emit('change')
        }
    },
    mounted() {}
}
</script>

<style lang="scss" scoped>
.date-picker{
    display: inline-block;
    width: 220px;
    height: 24px;
    line-height: 24px;
    vertical-align: middle;
    border: 1px solid #bbb;
    overflow: hidden;
    /deep/ .el-input--mini.el-input--suffix{
        height: 22px;
        line-height: 22px !important;
    }
    /deep/ .el-input__icon.el-icon-date{
        font-size: 14px;
        line-height: 22px;
    }
    /deep/ .el-input__inner{
        height: 23px !important;
        padding-right: 0;
        border: 0;
        font-size: 11px !important;
    }
    .picker1{
        width: 105px;
    }
    .picker2{
        width: 84px;
        /deep/ .el-input__inner{
            padding-left: 8px;
        }
    }
}
</style>
