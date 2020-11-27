<template>
    <div class="card">
        <moduletitle title="基本信息" type="manager"/>

        <div class="card-body">
            <div class="grid-wrap">
                <div v-for="(item,index) in data" :key="index" class="grid-cell">
                    <div>{{item.label}}</div>
                    <div>{{result[item.value] || '- -'}}</div>
                </div>
            </div>
            <vLoading :show="isLoading" />
        </div>
    </div>
</template>

<script>
import { getManagerBasic } from '@/api/manager'
import { unitConverter } from '@/utils/analyze'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            data: [
                {
                    label: '姓名',
                    value: 'chineseName'
                },
                {
                    label: '性别',
                    value: 'gender'
                },
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
                    label: '人物介绍',
                    value: 'background'
                }
            ],
            isLoading: false,
            result: ''
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.getManagerBasic()
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
.grid-wrap {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 36px 36px 36px 36px 36px auto;
    & > div:last-child {
        grid-column-start: 1;
        grid-column-end: 3;
        border-bottom: 1px solid #ddd;
        grid-template-columns: 12.5% 87.5%;
    }
    & > div:nth-child(even),
    & > div:last-child {
        border-right: 1px solid #ddd;
    }
}
.grid-cell {
    display: grid;
    grid-template-columns: 25% 75%;
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;

    & > div {
        padding: 0 16px;
        line-height: 36px;
    }
    & > div:first-child {
        border-right: 1px solid #ddd;
        background-color: #f5f5f5;
        color: #666;
    }

    &:last-child > div:last-child{
        line-height: 30px;
        padding: 8px 16px;
    }
}
</style>