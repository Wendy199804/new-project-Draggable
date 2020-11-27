<template>
    <div class="new-summary">
        <Summary ref="Summary" :proplist="proplist"/>
    </div>
</template>

<script>
import Summary from '@/components/componentsModule/Analysis/productOverview/summary'
export default {
    components:{
        Summary
    },
    data() {
        return {
            proplist:[
                {
                    title: '投资能力',
                    bgcolor: '#6F8EE6',
                    content: ''
                },
                {
                    title: '投资偏好',
                    bgcolor: '#6F8EE6',
                    content: ''
                },
                {
                    title: '综合实力',
                    bgcolor: '#5F80AA',
                    content: ''
                },
                {
                    title: '投研能力',
                    bgcolor: '#5F80AA',
                    content: ''
                }
            ]
        }
    },
    methods: {
        render(){
            this.$refs.Summary.render()
        }
    },
}
</script>

<style lang="scss" scoped>
</style>