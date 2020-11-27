<template>
    <div class="card">
        <moduletitle title="基本信息" type="manager"/>
        <div class="card-body">
            <div v-if="headerInfo" class="hidden">
                <div class="left avatar">
                    <img :src="headerInfo.avatar" alt="">
                </div>
                <div class="left information">
                    <p class="font16 bold hover-highlight">
                        <router-link :to="{name: 'Manager', query: {id: managerInfo.id}}" target="_blank">
                            {{managerInfo.name}}
                        </router-link>
                    </p>
                    <div class="star hidden">
                        <span class="left color-gray">智君星级</span>
                        <Zjrate class="left" :yaernum="3" :starlevel="headerInfo.star3 || '暂无星级'"></Zjrate>
                        <Zjrate class="left" :yaernum="5" :starlevel="headerInfo.star5 || '暂无星级'"></Zjrate>
                    </div>

                    <div v-if="result" class="grid-wrap">
                        <div v-for="(item,index) in data" :key="index" class="grid-cell">
                            <span class="color-gray">{{item.label}}：</span>
                            <span v-if="item.isPct">{{result[item.value] | toPercent}}</span>
                            <span v-else>{{result[item.value] || '- -'}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <vLoading :show="isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Zjrate from '@/components/localComponents/zjRate'
import { getManagerBasic, getManagerInfo } from '@/api/manager'
import { unitConverter, toPercent } from '@/utils/analyze'

export default {
    components: { Zjrate },
    data() {
        return {
            data: [
                {
                    label: '现任公司',
                    value: 'company'
                },
                {
                    label: '从业年限',
                    value: 'experienceTime'
                },
                {
                    label: '在管规模',
                    value: 'size'
                },
                {
                    label: '剔除货币规模',
                    value: 'sizeNoMf'
                },
                {
                    label: '在管产品',
                    value: 'fundsUnderManagement'
                },
                {
                    label: '累计管理产品',
                    value: 'fundsInTotal'
                },
                {
                    label: '学历',
                    value: 'chiEducation'
                },
                {
                    label: '代表产品',
                    value: 'representFund'
                },
                {
                    label: '代表基金年化回报',
                    value: 'careerAnnualReturn',
                    isPct: true
                },
                {
                    label: '同期大盘年化回报',
                    value: 'baseAnnualReturn',
                    isPct: true
                },
                {
                    label: '个人经历',
                    value: 'background'
                }
            ],

            isLoading: false,
            headerInfo: null,
            result: null
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    filters: {
        toPercent(num) {
            return toPercent(num)
        }
    },
    methods: {
        render() {
            this.getManagerHeader()
            this.getManagerBasic()
        },
        async getManagerHeader() {
            const res = await getManagerInfo({
                personalCode: this.managerInfo.id,
                managerType: this.managerInfo.type
            })
            this.headerInfo = {
                avatar: `data:image/png;base64,${res.personalData}`,
                star3: res.current3yearRating,
                star5: res.current5yearRating
            }
        },
        async getManagerBasic() {
            this.isLoading = true
            try {
                const result = await getManagerBasic({ personalCode: this.managerInfo.id })
                result.size = unitConverter(result.size)
                result.sizeNoMf = unitConverter(result.sizeNoMf)
                result.gender = result.gender == 1 ? '男' : '女'
                this.result = result
                this.isLoading = false
            } catch (err) {
                this.isLoading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar{
    width: 100px;
    border: 1px solid #ddd;
    margin-right: 16px;
    > img{
        width: 100%;
        vertical-align: bottom;
    }
}
.information{
    width: calc(100% - 116px);
}

.star{
    margin: 12px 0 4px 0;
    > span {
        margin-right: 8px;
    }
}

.color-gray{
    color: #666;
}
.ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.grid-wrap {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: repeat(5, 26px) auto;
    align-items: center;
    font-size: 13px;
}
.grid-cell{
    &:last-child {
        grid-column-start: 1;
        grid-column-end: 3;
        display: grid;
        grid-template-columns: 72px auto;
        margin-top: 4px;
        & > span:first-child{
            padding-top: 8px;
        }
        & > span:last-child{
            border: 1px solid #ddd;
            padding: 4px 12px 4px 8px;
            line-height: 20px;
            max-height: 150px;
            overflow-y: scroll;
        }
    }
    &:not(:last-child){
        @extend .ellipsis;
    }
}
</style>