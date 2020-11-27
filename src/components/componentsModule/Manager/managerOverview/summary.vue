<template>
    <div class="manager-summary">
        <moduletitle :title="'总体评价'" type="manager"></moduletitle>
        <div class="main">
            <!-- <div v-if="result.length == 1">
                <p v-html="result[0]"></p>
            </div> -->
            <div>
                <summaryModule
                    v-for="(item, index) in list"
                    :key="index"
                    :summaryTitle="item.title"
                    :bgcolor="item.bgcolor"
                    style="position: relative"
                >
                    <p v-html="resultlist[index]"></p>
                    <vLoading :show="item.isLoading" />
                    <vNodata :show="!item.isLoading && !resultlist[index]" />
                </summaryModule>
            </div>
            <!-- <vLoading :show="isLoading" /> -->
            <!-- <vNodata :show="!result&&!isLoading" /> -->
        </div>
    </div>
</template>

<script>

import summaryModule from '@/components/localComponents/summaryModule'
import { mapGetters } from 'vuex'
import { push_request } from '@/api/analysis'

export default {
    data() {
        return {
            result: '',
            isLoading: false,
            list: [
                {
                    title: '管理经验',
                    bgcolor: '#6F8EE6',
                    content: ''
                },
                {
                    title: '收益表现',
                    bgcolor: '#5ABEFF',
                    content: ''
                },
                {
                    title: '风控表现',
                    bgcolor: '#54D8C1',
                    content: ''
                },
                {
                    title: '投资偏好',
                    bgcolor: '#5F80AA',
                    content: ''
                }
            ],
            resultlist: [null, null, null, null]
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    components: {
        summaryModule
    },
    methods: {
        async getCurrencyData() {
            ;['fund_manager_profile', 'fund_manager_return', 'fund_manager_risk', 'fund_manager_prefer'].forEach((item, index) => {
                this.getdata(item, index + 1)
            })
        },
        async getdata(api, num) {
            this.list[num - 1].isLoading = true
            let params = {
                type: api,
                exec_type: 'sync',
                personal_id: this.managerInfo.id
            }
            params =
                api === 'fund_manager_return' || api === 'fund_manager_risk' ? Object.assign(params, { manager_type: this.managerInfo.type }) : params
            try {
                const result = await push_request(params)
                this.resultlist[num - 1] = result[0]
                this.list[num - 1].isLoading = false
                this.$forceUpdate()
            } catch {
                this.list[num - 1].isLoading = false
            }
        },
        render() {
            this.result = ''
            this.getCurrencyData()
        }
    }
}
</script>

<style lang="scss" scoped>
.manager-summary {
    background-color: #ffffff;
    margin-bottom: 16px;
    .main {
        padding: 20px 24px 24px 24px;
        position: relative;
        line-height: 24px;
        min-height: 80px;
        & > div {
            display: flex;
            justify-content: flex-start;
            & > div {
                width: 24%;
            }
            & > div:not(:last-child) {
                margin-right: 32px;
            }
        }
        .slotdiv {
            font-size: 14px;
            color: #333333;
            & > span {
                color: #fd484c;
            }
        }
        /deep/ .red {
            color: #fd484c;
        }
        /deep/ .green {
            color: #50c75a;
        }
    }
    /deep/ .loading-mask,
    /deep/ .nodata {
        height: calc(100% - 49px) !important;
        top: 49px;
    }
}
</style>