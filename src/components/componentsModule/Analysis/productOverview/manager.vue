<template>
    <div class="wrap">
        <moduletitle
            title="基金经理"
            :tablist="tablist"
            :isright="true"
            :curtab="person"
            :secondary="true"
            @clickTab="clickTab"
        >
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="refreshChart"></svg-icon>
            </div>
        </moduletitle>
        <div class="content">
            <div>
                <div class="manager-info" v-loading.lock="loading_info">
                    <div>
                        <el-image :src="`data:image/png;base64,${person.personalData}`">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline" style="font-size: 20px;color:#bfbfbf"></i>
                            </div>
                        </el-image>
                        <!-- <img v-if="person.personalData"  /> -->
                    </div>
                    <div class="manager-info-right">
                        <p>
                            <span class="toManager font16" @click="toManager">{{ person.name }}</span>
                            <el-rate
                                v-if="person.star"
                                v-model="person.star"
                                disabled
                                disabled-void-color="#bfbfbf"
                                :colors="['#FF6673', '#FF6673', '#FF6673']"
                            ></el-rate>
                        </p>
                        <p>
                            <span>任职开始时间：{{ person.begin }}</span>
                            <span>任职时长：{{ person.during }}天</span>
                            <span>任期回报：{{ person.return }}</span>
                        </p>
                    </div>
                </div>
                <div id="manjlzs" class="chart-wrap">
                    <p class="bold">基金经理指数
                        <el-popover
                            v-if="managerAnnotation('基金经理指数')[0]"
                            ref="popover"
                            placement="right"
                            width="300"
                            trigger="hover"
                            propper-class="propper-box"
                            :content="managerAnnotation('基金经理指数')[0]"
                        >
                            <span slot="reference">
                                <svg-icon icon-class="mark" class="annotation" />
                            </span>
                        </el-popover>
                    </p>
                    <div class="relative">
                        <vHalfChart
                            ref="chart"
                            type="line"
                            grid="grid_l"
                            :legend="legend"
                            :xData="xData"
                            :seriesData="seriesData"
                            :isPct="true"
                            formatterType="lineSort"
                        />
                        <vLoading :show="isLoading" />
                        <vNodata :show="!result && !isLoading" text="该基金经理暂无基金经理指数" />
                    </div>
                </div>
            </div>
            <ManageAbility v-if="isprop" :isprop="true" ref="ManageAbility" class="relative rightmanager" id="manglnl" />
            <!-- <div class="relative" v-if="isprop" id="manglnl">
                <ManageAbility
                    ref="ManageAbility"
                    :managerInfo="managerInfo"
                    :year="year"
                    :Gradientvalue="Gradientvalue"
                    :Gradientvalue_dialog="Gradientvalue_dialog"
                    :seriesData="seriesData"
                />
                <vLoading :show="ability_isLoading" />
                <vNodata :show="!ability_result && !ability_isLoading" />
            </div> -->
        </div>
    </div>
</template>

<script>

import managerAnnotation from '@/utils/managerAnnotation'
import { FundManagerList, push_request } from '@/api/analysis'
import { getManagerType } from '@/api/manager'
import { gettheManagerType } from '@/utils/analyze'
import { mapGetters } from 'vuex'
import ManageAbility from '@/components/componentsModule/Manager/managerOverview/manageAbility'

export default {
    props: {
        isprop: { type: Boolean, default: false }
    },
    components: {
        ManageAbility
    },
    data() {
        return {
            person: {},
            personlist: [],
            tablist: [
                // {name:'杨浩',id:1},{name:'李佳存',id:2}
            ],
            xData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            seriesData: [
                [150, 232, 201, 154, 190, 330, 410],
                [320, 332, 301, 334, 390, 330, 320]
            ],
            legend: ['邮件营销', '联盟广告'],
            isLoading: false,
            result: false,
            start_date: '',
            end_date: '',
            //
            year: '',
            Gradientvalue: 0,
            Gradientvalue_dialog: 0,
            seriesData: [],
            isLoading: false,
            ability_isLoading: false,
            ability_result: false,
            loading_info:false
        }
    },
    computed: {
        ...mapGetters(['selectFundToAnalyze', 'managerInfo']),
        manager_type() {
            if (this.selectFundToAnalyze.firsttypeChi === '股票型' || this.selectFundToAnalyze.firsttypeChi === '混合型') {
                return 1
            } else if (this.selectFundToAnalyze.firsttypeChi === '债券型') {
                return 2
            } else if (this.selectFundToAnalyze.firsttypeChi === '指数型') {
                return 3
            } else {
                return 0
            }
        }
    },
    methods: {
        async render() {
            await this.getNowmanagers()
            this.renderManager()
        },
        async updateStore(data) {
            await this.$store.dispatch('Manager/setManagerInfo', data)
        },
        async renderManager() {
            await this.getTime()
            if (this.isprop) {
                this.$refs.ManageAbility.isLoading = true
                await this.updateStore({ id: this.person.id, name: this.person.name })
                this.$refs.ManageAbility.render()
            }
        },
        managerAnnotation(label) {
            return managerAnnotation(label)
        },
        clickTab(index) {
            this.person = this.personlist[index]
            this.renderManager()
        },
        draw(refName) {
            this.$nextTick(() => {
                if (!this.$refs[refName]) return
                this.$refs[refName].drawChart()
            })
        },
        //获取现任基金经理
        async getNowmanagers() {
            this.isLoading = true
            this.loading_info = true
            const result = await FundManagerList({ innerCode: this.selectFundToAnalyze.innercode })
            this.tablist = []
            let nowmanagers = result.map((item, index) => {
                let re = item.performance ? `${(item.performance * 100).toFixed(2)}%` : '--'
                this.tablist.push({ name: item.name, id: item.personalCode })
                return {
                    name: item.name,
                    star: item.period3Stars,
                    begin: item.accessionDate || '--',
                    during: item.managementTime || '--',
                    return: re,
                    personalData: item.personalData || '--',
                    id: item.personalCode
                }
            })
            this.personlist = nowmanagers
            this.person = nowmanagers[0]
            this.loading_info = false
        },
        getTime() {
            this.isLoading = true
            push_request({
                type: 'manager_index_curve_time_period',
                personal_id: this.person.id,
                manager_type: this.manager_type
            }).then(res => {
                if (!res || JSON.stringify(res) == '{}') {
                    this.isLoading = false
                    return
                }
                this.start_date = res.start_date[5].substr(0, 10)
                this.end_date = res.end_date[5].substr(0, 10)
                this.getChartData()
            })
        },
        //获取基金经理指数 manage type ?
        async getChartData() {
            try {
                const result = await push_request({
                    type: 'manager_index_curve',
                    exec_type: 'sync',
                    personal_id: this.person.id,
                    manager_type: this.manager_type,
                    index_code: '000300',
                    begin: this.start_date,
                    end: this.end_date
                })
                this.result = JSON.stringify(result) == '{}' ? false : true
                this.legend = [this.person.name, '沪深300']
                this.xData = result.TradingDay.map(item => item.split(' ')[0])
                this.seriesData = [result.manager_index, result.base]
                this.draw('chart')
                this.isLoading = false
            } catch {
                this.isLoading = false
            }
        },
        handleDownload() {
            let list = [{ id: 'manjlzs', imgName: '基金经理指数' }]
            this.isprop && list.push({ id: 'manglnl', imgName: '基金经理管理能力' })
            this.$downloadImg(list)
        },
        refreshChart() {
            this.render()
        },
        /**跳转到基金经理 */
        toManager() {
            this.$routeOpen({ name: 'Manager', query: { id: this.person.id } })
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    background-color: #ffffff;
    & > .content {
        padding: 16px 0;
        position: relative;
        .manager-info {
            display: flex;
            justify-content: flex-start;
            padding: 0 16px;
            & > div:first-child {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 16px;
                border: 1px solid #dddddd;
                flex-shrink: 0;
                text-align: center;
                line-height: 64px;
                img {
                    width: 100%;
                }
            }
            .manager-info-right {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                & > p:last-child {
                    width: 90%;
                    display: flex;
                    justify-content: space-between;
                }
                & > p:first-child {
                    display: flex;
                    justify-content: flex-start;
                    line-height: 19px;
                    margin-bottom: 5px;
                }
                .toManager {
                    margin-right: 2px;
                    cursor: pointer;
                    color: #4e7cee;
                }
            }
        }
    }
    .chart-wrap {
        position: relative;
        & > p {
            margin: 10px 0 4px 16px;
        }
    }
    .rightmanager {
        /deep/ .manageAbility-content {
            margin: -16px;
        }
    }

    /deep/ .el-rate__icon {
        margin-right: 0;
    }
    /deep/ .chart {
        width: 100%;
        height: 300px;
    }
}
</style>