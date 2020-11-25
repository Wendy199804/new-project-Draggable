<template>
    <div class="search-g">
        <div v-if="!(ismanager || isfund)" class="l-select">
            <el-select
                v-model="selectValue"
                slot="prepend"
                placeholder="请选择"
                @change="changeSelect"
                :popper-append-to-body="false"
            >
                <el-option v-for="item in l_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div :class="['m-search', has_search_icon ? 'if-search-icon' : '']" id="m_search" @click.stop>
            <div class="search-icon"><slot></slot></div>
            <el-select
                v-model="inputValue"
                filterable
                remote
                reserve-keyword
                :placeholder="thisplaceholder"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="selectItem"
                :popper-append-to-body="false"
                popper-class="popper-class"
            >
                <el-option-group v-if="resultlist[0].options.length > 0 " label="基金">
                    <el-option v-for="(item, index) in resultlist[0].options" :key="item.label" :label="item.label" :value="item">
                        <span class="secucode">{{ item.secuCode }}</span>
                        <el-tooltip
                            v-if="!isfund"
                            effect="light"
                            :content="item.chiNameAbbr"
                            placement="top"
                            :disabled="item.chiNameAbbr.length > 18 ? false : true"
                        >
                            <span class="chiNameAbbr" style="width: 210px">{{ item.chiNameAbbr }}</span>
                        </el-tooltip>
                        <el-tooltip
                            v-if="isfund"
                            effect="light"
                            :content="item.chiNameAbbr"
                            placement="left"
                            :disabled="item.chiNameAbbr.replace(/[^\x00-\xff]/g, 'AA').length > 30 ? false : true"
                        >
                            <span class="chiNameAbbr" style="width: 200px">{{ item.chiNameAbbr }}</span>
                        </el-tooltip>
                        <span v-if="!isfund" class="collect" @click.stop>
                            <svg-icon
                                :icon-class="item.hasCollect ? 'collected1' : 'collected0'"
                                @click="collecteFund(item.innerCode, item.hasCollect, index)"
                            ></svg-icon>
                        </span>
                        <span class="firstClassType" :style="{ 'margin-right': isfund ? '0px' : '20px' }">{{ item.firstClassType }}</span>
                    </el-option>
                </el-option-group>
                <el-option-group v-if="resultlist[1].options.length > 0" label="经理">
                    <el-option v-for="(item, index) in resultlist[1].options" :key="item.label" :label="item.label" :value="item">
                        <span style="float: left; color: #8492a6; font-size: 13px">{{ item.chineseName }}</span>
                        <span v-if="!isfund" class="collect" @click.stop>
                            <svg-icon
                                :icon-class="item.managerHasCollect ? 'collected1' : 'collected0'"
                                @click="collecteManager(item.personalCode, item.managerHasCollect, index)"
                            ></svg-icon>
                        </span>
                        <span style="float: right" :style="{ 'margin-right': isfund ? '0px' : '20px' }">{{ item.companySimple }}</span>
                    </el-option>
                </el-option-group>
            </el-select>
        </div>
        <div v-if="!(isfund || ismanager)" class="r-button" @click="jumpTo">
            <el-button type="info">
                <i class="el-icon-search"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { searchFund, FavFund, cancelFavFund } from '@/api/analysis'
import { collectManager, cancelCollectManager } from '@/api/workbench'

export default {
    props: {
        l_options: {
            type: Array,
            default: () => []
        },
        isfund: {
            //基金比较
            type: Boolean,
            default: false
        },
        ismanager: {
            //仅搜索基金经理
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请输入基金代码、名称、简拼或基金经理姓名进行搜索' //输入框placeholder
        },
        index: {
            type: Number,
            default: -1
        },
        has_search_icon: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // ], //左边下拉菜单选项
            selectValue: '2', //左边下拉菜单v-model
            inputValue: '', //输入框v-model
            thisplaceholder: '', //输入框placeholder
            resultlist: [
                {
                    label: '基金',
                    options: []
                },
                {
                    label: '经理',
                    options: []
                }
            ],
            loading: false
        }
    },
    created() {
        // this.l_options.length > 0 ? (this.selectValue = this.l_options[1].value) : ''
        this.thisplaceholder = this.placeholder
        this.resultlist = [
            { label: '基金', options: [] },
            { label: '经理', options: [] }
        ]
    },
    mounted() {
        //el-select ios兼容
        let input = document.getElementById('m_search').children[1].children[0].children[0]
        input.removeAttribute('readOnly')
        input.onblur = function () {
            let _this = this
            setTimeout(() => {
                _this.removeAttribute('readOnly')
            }, 200)
        }
        // 下面这种方法会改变页面上所有的el-select
        // Array.from(document.getElementsByClassName('el-select')).forEach(item => {
        //     console.log(item.children[0].children[0])
        //     item.children[0].children[0].removeAttribute('readOnly')
        //     item.children[0].children[0].onblur = function() {
        //         let _this = this
        //         setTimeout(() => {
        //             _this.removeAttribute('readOnly')
        //         }, 200)
        //     }
        // })
    },
    methods: {
        changeSelect(val) {
            this.thisplaceholder =
                val === '2'
                    ? '请输入基金代码、名称、简拼或基金经理姓名进行搜索'
                    : val === '1'
                    ? '请输入基金经理姓名进行搜索'
                    : '请输入基金代码、名称或简拼进行搜索'
            this.resultlist = [
                { label: '基金', options: [] },
                { label: '经理', options: [] }
            ]
        },
        //输入内容执行
        async remoteMethod(query) {
            if (query !== '') {
                this.loading = true
                try {
                    const result = await searchFund({
                        selectFundName: query,
                        type: this.isfund ? 0 : this.ismanager ? 1 : this.selectValue
                    })
                    this.result = result
                    this.handleResult(result)
                    this.loading = false
                } catch {
                    this.loading = false
                }
            } else {
                this.loading = false
                this.resultlist = [
                    { label: '基金', options: [] },
                    { label: '经理', options: [] }
                ]
                return
            }
            
        },

        handleResult(result) {
            if (result) {
                this.resultlist[0].options = result.fundInformationTypeVos == null ? [] : result.fundInformationTypeVos
                this.resultlist[1].options = result.fundManagerInformation == null ? [] : result.fundManagerInformation
            }
        },
        //选中值
        selectItem(value) {
            if (this.isfund || this.ismanager) {
                this.$emit('selectedFund', value, this.index)
            } else {
                if (value.innerCode) {
                    this.$routeOpen({ name: 'Analysis', query: { innercode: value.innerCode } })
                } else if (value.personalCode) {
                    this.$routeOpen({ name: 'Manager', query: { id: value.personalCode } })
                }
            }
            this.resultlist[0].options = []
            this.resultlist[1].options = []
        },
        //按钮搜索
        jumpTo() {
            this.$router.push({ name: 'FundFilter' })
        },
        // 基金收藏
        async collecteFund(innercode, hascollect, index) {
            if (hascollect) {
                const cancelresult = await cancelFavFund({ innerCodes: [innercode] })
                cancelresult ? (this.result.fundInformationTypeVos[index].hasCollect = false) : ''
            } else {
                const addresult = await FavFund({ innerCodes: [innercode] })
                addresult ? (this.result.fundInformationTypeVos[index].hasCollect = true) : ''
            }
        },
        //基金经理收藏
        async collecteManager(code, hascollect, index) {
            if (hascollect) {
                const cancelresult = await cancelCollectManager({ personalCodes: [code] })
                cancelresult ? (this.result.fundManagerInformation[index].managerHasCollect = false) : ''
            } else {
                const addresult = await collectManager({ personalCodes: [code] })
                addresult ? (this.result.fundManagerInformation[index].managerHasCollect = true) : ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.search-g {
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /deep/ .el-scrollbar__wrap {
        overflow-x: scroll !important;
    }
    .l-select {
        /deep/ .el-select {
            width: 70px;
        }
        /deep/ .el-input--suffix .el-input__inner {
            height: 30px;
        }
        /deep/ .el-icon-arrow-up:before,
        .el-icon-arrow-up:after {
            position: absolute;
            top: 50%;
            right: 5px;
            transform: translateY(-50%);
        }
    }
    .if-search-icon {
        /deep/ .el-input--suffix .el-input__inner {
            padding-left: 20px !important;
        }
    }
    .m-search {
        position: relative;
        .search-icon {
            position: absolute;
            font-size: 14px;
            color: #999;
            z-index: 3000;
            top: 50%;
            transform: translateY(-50%);
            left: 5px;
        }
        /deep/ .el-select {
            width: 360px;
        }
        /deep/ .el-input--suffix .el-input__inner {
            padding-left: 15px;
            height: 30px !important;
            padding-right: 0;
        }

        /deep/ .el-select-dropdown__item {
            cursor: pointer;
            .chiNameAbbr {
                // width: 210px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                float: left;
                color: #8492a6;
                font-size: 13px;
                margin-left: 15px;
                cursor: pointer;
            }
        }
        /**搜索下拉菜单 */
        /deep/ .popper-class {
            li {
                position: relative;
            }
            .secucode {
                float: left;
            }
            .firstClassType {
                float: right;
            }
            .collect {
                position: absolute;
                top: 0;
                right: 18px;
            }
        }
    }
    .r-button {
        /deep/ .el-icon-search {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
        /deep/ .el-button--info {
            position: relative;
            height: 30px;
            width: 25px;
        }
        /deep/ .el-button {
            border-radius: 0 4px 4px 0;
        }
    }
    /deep/ .el-select-dropdown__item.selected {
        color: #606266;
        font-weight: 400;
    }
}
</style>