<template>
    <div>
        <!-- <moduletitle title="基金公司" type="manager">
            <div>
                <svg-icon icon-class="excel" @click="handleExcel"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle> -->
        <!-- <div class="content"> -->
            <!-- <div v-loading.lock="isLoading" class="info">
                <p>{{ companyInfo.companyName }}</p>
                <p>
                    <span>成立时间：{{ companyInfo.companyDate }}</span
                    ><span>旗下基金数：{{ companyInfo.fundNumber }}</span
                    ><span>旗下基金经理数：{{ companyInfo.managerNumber }}</span>
                </p>
            </div> -->
            <SizeChange ref="SizeChange" :isprop="true" />
        <!-- </div> -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SizeChange from '@/components/componentsModule/Analysis/fundCompany/sizeChange'
import { getFundCompanyInfo } from '@/api/analysis'

export default {
    components: { SizeChange },
    data() {
        return {
            isLoading: false,
            companyInfo: {}
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        handleExcel() {},
        getCompanyInfo() {
            this.isLoading = true
            getFundCompanyInfo({ innerCode: this.selectFundToAnalyze.innercode })
                .then(res => {
                    console.log(res)
                    this.companyInfo = res
                    this.isLoading = false
                })
                .catch(() => {
                    this.isLoading = false
                })
        },
        render() {
            // this.getCompanyInfo()
            this.$refs.SizeChange.render()
        }
    }
}
</script>

<style lang="scss" scoped>
.info {
    min-height: 60px;
    padding: 16px 30px 0 43px;
    line-height: 30px;
    &>p:nth-child(2){
        span{
            margin-right: 30px;
        }
    }
}
/deep/ .double {
    & > div:first-child {
        border-right: 1px solid #dddddd !important;
        margin-right: 12px;
    }
}
</style>