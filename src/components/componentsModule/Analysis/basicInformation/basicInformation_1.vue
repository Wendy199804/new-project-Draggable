<template>
    <div class="basicInformation">
        <moduletitle title="基本信息"></moduletitle>
        <FundInfoTagPage ref="info"/>
    </div>
</template>

<script>

import FundInfoTagPage from '@/components/componentsModule/Analysis/basicInformation/basicTapPages/FundInfoTagPage'


export default {
    components: {
        FundInfoTagPage
    },
    methods:{
        render() {
            this.$refs.info.getfundNetValue()
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