<template>
    <div class="card">
        <div class="double divided">
            <FundSize ref="leftPart" />
            <FundDistribution ref="rightPart" />
        </div>
    </div>
</template>

<script>
import FundSize from './sizeAndDistribution_l'
import FundDistribution from './sizeAndDistribution_r'

export default {
    components: { 
        FundSize,
        FundDistribution
    },
    data() {
        return {}
    },
    methods: {
        render() {
            this.$nextTick(() => {
                this.$refs.leftPart.render()
                this.$refs.rightPart.render()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.card{
    background: none !important;
    /deep/ .content{
        padding: 16px 0;
    }
}
</style>