
<template>
    <div class="styleAndAbility">
        <moduletitle title="旗下基金风格" type="manager">
            
        </moduletitle>
        <div class="content" id="styleandAbilityChart">
            <StyleandAbility ref="StyleandAbility" />
        </div>
    </div>
</template>

<script>
import StyleandAbility from '@/components/componentsModule/Manager/managedFunds/styleDistribution'

export default {
    components: { StyleandAbility },
    methods: {
        render() {
            this.$refs.StyleandAbility.render()
        },
        
        handleDownload(){
            let list = [
                { id: 'styleandAbilityChart', imgName: '旗下基金风格' }
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.styleAndAbility {
    .content {
        height: calc(100% - 52px);
        padding: 16px;
        background: #ffffff;
        position: relative;
    }
    .right-table {
        width: 304px;
        margin-top: 25px;
        /deep/ .el-table {
            border-left: none !important;
            border-right: none !important;
            &::before {
                height: 0;
            }
            .header th {
                font-weight: bold !important;
                background: none !important;
            }
            tr:last-child td {
                border-bottom: 0;
            }
            td {
                color: #333 !important;
            }
        }
    }
}
</style>