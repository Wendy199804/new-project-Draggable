<template>
    <div class="basicInformation">
        <moduletitle title="购买规则"></moduletitle>
        <FundCostTagPage ref="FundCostTagPage"/>
    </div>
</template>

<script>

import FundCostTagPage from '@/components/componentsModule/Analysis/basicInformation/basicTapPages/FundCostTagPage'

export default {
    components: {
        FundCostTagPage
    },
    methods:{
        render() {
            this.$refs.FundCostTagPage.getFundCustInfo()
        },
    }
}
</script>

<style lang="scss" scoped>
    .basicInformation{
        background-color: #ffffff;
        padding-bottom: 1px;
        margin-bottom: 16px;
    }
</style>