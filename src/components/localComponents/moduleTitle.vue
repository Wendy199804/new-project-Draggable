<template>
    <!-- class:.show :显示   .networth :净值   .benchmark :基准    .timeframe :时段 *详情见Analysis/productOverview/trajectory.vue -->
    <div class="title" :style="{borderColor: hasborder ? '#666' : 'transparent'}">
        <div class="title-span">
            {{ title }}
            <el-popover
                v-if="annotation(title)[0]"
                ref="popover"
                placement="right"
                width="300"
                trigger="hover"
                propper-class="propper-box"
                :content="annotation(title)[0]"
            >
                <span slot="reference">
                    <svg-icon icon-class="mark" class="annotation" />
                </span>
            </el-popover>
            <slot name="svg" class="annotation"></slot>
        </div>
        <div :class="['tabs', isright ? 'is-right' : 'is-left']">
            <div class="tab-left" :style="{marginLeft:title?'15px':'0'}">
                <div
                    v-for="(item, index) in tablist"
                    :key="item.id"
                    @click="changeTab(index)"
                    :class="[secondary ? 'second-tab' : 'first-tab', {'is-active': item.id === curtab.id}]"
                >{{ item.name }}</div>
            </div>
            <div class="select-box">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import analisisAnnotation from '@/utils/analisisAnnotation'
import managerAnnotation from '@/utils/managerAnnotation'

export default {
    props: {
        title: {
            type: String
        },
        othertitle: {
            type: String
        },
        type: {
            type: String,
            default: 'analyze'
        },
        frequencyOptions: {},
        showOptions: {},
        networthOptions: {},
        benchmarkOptions: {},
        timeframeOptions: {},
        download: { default: false },

        tablist: { type: Array, default: () => [] }, //tab数组
        curtab: { type: Object, default: () => {} }, //当前tab
        secondary: {}, //是否为二级标题
        isright: {
            type: Boolean,
            default: false
        }, //tab是否靠右
        hasborder:{
            type: Boolean,
            default: true
        } //是否有下边框
    },
    data() {
        return {}
    },
    methods: {
        annotation(label) {
            if (this.othertitle) {
                return this.type === 'analyze' ? analisisAnnotation(this.othertitle) : managerAnnotation(this.othertitle)
            } else {
                return this.type === 'analyze' ? analisisAnnotation(label) : managerAnnotation(label)
            }
        },
        changeTab(index) {
            this.$emit('clickTab', index)
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    width: 100%;
    height: 52px;
    padding: 0 16px;
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    background-color: #ffffff;
    border-bottom: 1px solid ;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title-span {
        flex-shrink: 0;
        position: relative;
    }
    .tabs{
        width: 100%;
        display: flex;
        &.is-left{
            justify-content: space-between;
        }
        &.is-right{
            justify-content: flex-end;
        }
    }
    .tab-left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        & > div {
            font-weight: 400;
            cursor: pointer;
        }
        .first-tab{
            font-size: 16px;
            background: #F2F4F7;
            color: #666;
            line-height: 32px;
            padding: 0 15px;
            margin-bottom: -18px;
            &.is-active{
                background: #666;
                color: #fff;
            }
        }
        .second-tab{
            font-size: 12px;
            border: 1px solid;
            color: #666;
            border-color: #aaa;
            padding: 4px 10px 5px 10px;
            &:first-child{
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
            }
            &:last-child{
                border-right: 1px solid;
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
            }
            border-right: 0;
            &:last-child, &.is-active{
                border-right: 1px solid;
            }
            &.is-active{
                color: #4E7CEE;
                border-color: #4E7CEE;
                background: rgba(78, 124, 238, 0.1);
                & + div{
                    border-left: 0;
                }
            }
        }
    }

    .select-box {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: wrap;
        font-size: 12px;
        color: #999;
        font-weight: normal;
        & > div {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 16px;
            & > span {
                padding-top: 2px;
                margin-right: 5px;
            }
            & >span.mr{
                padding-top: 0;
            }
        }

        .frequency,
        .show {
            /deep/ .el-select {
                width: 82px;
            }
        }
        .networth {
            /deep/ .el-cascader {
                width: 120px;
                margin-bottom: 2px;
            }
        }

        .benchmark,
        .timeframe {
            /deep/ .el-select {
                width: 110px;
            }
        }
    }
    /deep/ .el-input__inner {
        height: 24px;
        font-size: 12px;
    }
    /deep/ .el-icon-arrow-up:before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
    }
    /deep/ .el-range-editor.el-input__inner {
        width: 220px;
        height: 24px;
        padding-right: 0;
    }
    /deep/ .el-date-editor .el-range-separator {
        width: 12%;
        font-weight: 400;
        line-height: 24px;
    }

    // /deep/ .el-input--mini.el-input--suffix {
    //     line-height: 23px;
    // }
    .timeframe {
        /deep/ .el-range-editor--mini .el-range__icon {
            line-height: 23px;
        }
    }
    .date-point-picker{
        margin-right: -5px;
        /deep/ .el-input__inner{
            width: 110px
        }
    }

    .mr {
        /deep/ .el-input__inner {
            vertical-align: middle;
        }
    }
    .jiezhidate {
        /deep/ .el-input__icon {
            line-height: 24px;
        }
    }
    /deep/ .annotation {
        font-size: 14px !important;
        margin-left: 0 !important;
    }
    .svg-icon {
        font-size: 24px;
        margin-left: 8px;
        cursor: pointer;
    }
}
</style>