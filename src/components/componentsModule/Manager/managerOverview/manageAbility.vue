<template>
    <div>
        <moduletitle v-show="!isprop" title="管理经验" type="manager">
            <div>
                <svg-icon icon-class="download" @click="handleDownload"></svg-icon>
                <svg-icon icon-class="reload" @click="render"></svg-icon>
            </div>
        </moduletitle>
        <div class="content" id="manageAbilityChart">
            <ManageAbility
                ref="ManageAbility"
                :name="managerInfo.name"
                :year="year"
                :size="size"
                :seriesData="seriesData"
                :seriesData2="seriesData2"
            />
            <vLoading :show="isLoading" />
            <vNodata :show="!seriesData.length && !isLoading" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ManageAbility from '@/components/localComponents/com_manageAbility'
import { push_request } from '@/api/analysis'

export default {
    props: {
        isprop: { type: Boolean, default: false }
    },
    components: { ManageAbility },
    data() {
        return {
            year: '',
            size: '',
            seriesData: [],
            seriesData2: [],
            isLoading: false
        }
    },
    computed: {
        ...mapGetters(['managerInfo'])
    },
    methods: {
        render() {
            this.getData()
        },
        getData() {
            this.isLoading = true
            push_request({
                type: 'get_manager_power',
                exec_type: 'sync',
                personal_id: this.managerInfo.id,
                manager_type: this.managerInfo.type
            }).then(res => {
                if (!res || JSON.stringify(res) == '{}') {
                    this.seriesData = []
                    this.seriesData2 = []
                    return
                }
                this.seriesData = res.count
                this.seriesData2 = res.count_size
                this.year = res.manager_year.split('_')[0]==0?'<1年':(res.manager_year==100?'>10年':`${res.manager_year.replace('_', '-')}年`) 
                this.size = res.manager_size.split('_')[0]==0?'<10亿':(res.manager_size==1000?'>300亿':`${res.manager_size.replace('_', '-')}亿`) 
                this.$refs.ManageAbility ? this.$refs.ManageAbility.render() : ''
                this.isLoading = false
            }).catch(()=>{this.isLoading=false})
        },
        
        handleDownload() {
            let list = [
                { id: 'manageAbilityChart', imgName: '管理能力' }
            ]
            this.$downloadImg(list)
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    padding: 16px;
    background: #ffffff;
    position: relative;
    height: calc(100% - 52px);
}
</style>