<template>
    <div class="basicinfo">
        <moduletitle :title="'基本信息'"></moduletitle>
        <div class="taps">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基金信息" name="fund_info" :lazy="true">
                    <FundInfoTag ref="FundInfoTag"></FundInfoTag>
                </el-tab-pane>
                <el-tab-pane label="购买信息" name="fund_cost" :lazy="true">
                    <FundCostTag ref="FundCostTag"></FundCostTag>
                </el-tab-pane>
                <el-tab-pane label="基金经理" name="fund_manager" :lazy="true">
                    <FundManageTag ref="FundManageTag"></FundManageTag>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import FundInfoTag from '@/components/componentsModule/Analysis/basicInformation/basicTapPages/FundInfoTagPage'
import FundCostTag from '@/components/componentsModule/Analysis/basicInformation/basicTapPages/FundCostTagPage'
import FundManageTag from '@/components/componentsModule/Analysis/basicInformation/basicTapPages/FundManageTagPage'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            activeName: 'fund_info'
        }
    },
    components: {
        FundInfoTag,
        FundCostTag,
        FundManageTag
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze'])
    },
    methods: {
        handleClick(tab, event) {
            if (tab.index == 2 && this.selectFundToAnalyze.innercode !=='') {
                this.$nextTick(() => {
                    this.$refs.FundManageTag.getFundManagerList()
                })
            } else if (tab.index == 1 && this.selectFundToAnalyze.innercode !=='') {
                this.$nextTick(() => {
                    this.$refs.FundCostTag.getFundCustInfo()
                })
            }
        },
        render() {
            this.activeName = 'fund_info'
            this.$refs.FundInfoTag.getfundNetValue()
        }
    }
}
</script>

<style lang="scss" scoped>
.basicinfo {
    background-color: #ffffff;
    margin-bottom: 16px;
    .taps {
        /deep/ .el-tabs--card > .el-tabs__header {
            border-bottom: none;
            margin-top: 16px;
            margin-left: 24px;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
            & > div {
                width: 120px;
                height: 30px;
                text-align: center;
                font-size: 14px;
                line-height: 30px;
                border-bottom: 1px solid #e4e7ed;
                &:hover {
                    border-bottom: 1px solid #4E7CEE;
                }
            }
        }
        //   /deep/ .el-tabs__item{
        //       width: ;
        //   }

        /deep/ .el-tabs__item:hover {
            border: 1px solid #4E7CEE;
            color: #4E7CEE;
        }

        /deep/ .el-tabs__item.is-active {
            border: 1px solid #4E7CEE;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
            border-bottom-color: #4E7CEE;
            border-left-color: #4E7CEE;
            color: #4E7CEE;
        }

        // /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
        //     border-left: 1px solid #e4e7ed;
        // }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child.is-active {
            border-left: 1px solid #4E7CEE;
        }

        /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item:first-child:hover {
            border-left: 1px solid #4E7CEE;
        }
        /deep/ .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2),
        .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child {
            padding-left: 0;
        }
    }
}
</style>