<template>
    <div>
         <el-autocomplete
            popper-class="search-result"
            class="search_m"
            v-model="inputValue"
            :fetch-suggestions="querySearch"
            :placeholder="thisplaceholder"
            :trigger-on-focus="false"
            :popper-append-to-body="false"
            @select="handleSelect"
        >
            <template slot-scope="{ item }">
                <div class="slot-wrap" @click.native="this.isClick = false" style>
                    <span style="width: 100px; display: inline-block">姓名</span>
                    <span style="width: 150px; display: inline-block; padding-left: 20px; text-align: right">所在公司</span>
                </div>
                <div style="text-align: left">
                    <span style="width: 100px; display: inline-block; text-align: left">{{ item.chineseName }}</span>
                    <span style="width: 150px; display: inline-block; padding-left: 20px; text-align: right">{{
                        item.companySimple
                    }}</span>
                </div>
                <div class="nodata" v-show="!hasData">无数据</div>
            </template>
        </el-autocomplete>
    </div>
</template>

<script>
import { searchFund } from '@/api/analysis'

export default {
    props:{
        index:{
            type:Number,
            default:-1,
        }
    },
    data() {
        return {
            inputValue:"",
            thisplaceholder:'请输入基金经理姓名进行搜索',
            loading: false,
            timeout:null,
            hasData:true
        }
    },
    mounted() {
        let input = document.getElementById('m_search').children[1].children[0].children[0]
        input.removeAttribute('readOnly')
        input.onblur = function () {
            let _this = this
            setTimeout(() => {
                _this.removeAttribute('readOnly')
            }, 200)
        }
    },
    methods: {
        async querySearch(managerName,cb){
             let cbarr = []
            const result = await searchFund({
                selectFundName: managerName,
                type: 1
            })
            if (result.fundManagerInformation.length > 0) {
                cbarr = result.fundManagerInformation
                this.hasData = true
            } else {
                cbarr = [{ value: '' }]
                this.hasData = false
            }
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(cbarr);
            }, 1000 * Math.random());
            this.loading = false
        },
        handleSelect(value){
            this.$emit("selectFund",value,this.index)
        }
    },
}
</script>

<style lang="scss" scoped>
    .search_m{
        .el-autocomplete.search_m{
            width: 100%;
            height: 28px;
        }
        /deep/.el-input__inner{
            width: 100%;
            // height: 100%;
        }
        /deep/.el-input{
            .el-input__inner{
                cursor: pointer;
            }
            height: 100%;
        }
    }
    .name{
        display: inline-block;
        width: 100px;
    }
    .company{
        display: inline-block;
        vertical-align: middle;
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        color: #666;
        text-overflow: ellipsis;
    }
    /deep/.search-result {
        ul {
            padding-top: 25px;
            padding-bottom: 15px;
        }
        .slot-wrap {
            position: absolute;
            top: 0;
            left: 0;
            background: #fff;
            color: #666;
            font-weight: 700;
            width: 100%;
            // display: flex;
            // justify-content: space-between;
            box-sizing: border-box;
            z-index: 200;
            cursor: default;
            pointer-events: none;
            padding-right: 20px;
            padding-left: 20px;
            border-bottom: 1px solid #dddddd;
        }
    }
</style>