<template>
    <div class="tabs">
        <div v-for="(tab, index) in tabs" :key="index"
            :class="['tab', activeIndex == index ? 'is-active' : '']"
            @click="clickTab(index)">
            {{tab.name}}
        </div>
    </div>
</template>

<script>
export default {
    /**
     * @props
     * tabs: []
     * activeIndex: 0
     */
    props: ['tabs', 'activeIndex'],
    data() {
        return {
            
        }
    },
    methods: {
        clickTab(index) {
            this.$emit('clickTab', index)
        }
    }
};
</script>

<style lang="scss" scoped>
.tabs{
    display: flex;
    font-size: 12px;
    .tab{
        padding: 0 26px;
        text-align: center;
        height: 28px;
        line-height: 27px;
        border: 1px solid #ddd;
        border-right: 1px solid transparent;
        cursor: pointer;
        &:first-child{
            border-radius: 2px 0 0 2px;
        }
        &:last-child {
            border-radius: 0 2px 2px 0;
            border-right: 1px solid #ddd;
        }
    }
    .is-active{
        color: #4E7CEE;
        border: 1px solid #4E7CEE;
        &:last-child{
            border-right: 1px solid #4E7CEE;
        }
        & + div{
            border-left: 1px solid transparent;
        }
    }
}
</style>
