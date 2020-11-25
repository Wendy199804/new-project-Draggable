/**回到顶部组件 （用法见样例页） */
<template>
    <div>
        <div v-show="iftop" class="totop" @click="toTop">
            <i class="el-icon-caret-top"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'totop',
    props: { iftop: { type: Boolean },pageYOffset:{} },
    methods: {
        toTop() {
            this.$emit('toTop')
        }
    }
}
</script>

<style lang="scss" scoped>
.totop {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.32);
    position: fixed;
    bottom: 80px;
    right: 40px;
    cursor: pointer;
    &:hover {
        background-color: #ececec;
    }
    & > i {
        color: #4e7cee;
        font-size: 25px;
    }
}
</style>