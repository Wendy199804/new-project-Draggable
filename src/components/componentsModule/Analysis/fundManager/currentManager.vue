<template>
    <div class="card">
        <moduletitle title="现任基金经理"></moduletitle>

        <div class="card-body relative no-padding-t no-padding-b">
            <SingleManager
                class="single-manager"
                v-for="(manager, index) in managerList"
                :key="index"
                :ref="`manager${index}`"
                :manager="manager"
            />
            <vLoading :show="isLoading" />
            <vNodata :show="!managerList.length && !isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FundManagerList } from '@/api/analysis'
import SingleManager from './singleManager'

export default {
    components: { SingleManager },
    data() {
        return {
            isLoading: false,
            managerList: []
        }
    },
    computed: {
        ...mapGetters([
            'selectFundToAnalyze'
        ])
    },
    methods: {
        render() {
            this.getManagerData()
        },
        async getManagerData() {
            this.isLoading = true
            const res = await FundManagerList({
                innerCode: this.selectFundToAnalyze.innercode
            })
            this.managerList = res
            this.isLoading = false
            this.$nextTick(() => {
                this.managerList.forEach((manager, index) => {
                    this.$refs[`manager${index}`][0].render()
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.card-body{
    min-height: 100px;
}
.single-manager{
    border-top: 1px solid #ddd;
    padding: 16px 0;
    &:first-child{
        border-top: 0;
    }
}
</style>