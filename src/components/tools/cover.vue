<template>
    <div>
        封面
        <div class="wrap">
            <div class="img">图片</div>
            <p class="line"></p>
            <h1 contenteditable="true">这是一个可修改的报告名称</h1>
            <h2 contenteditable="true">——————这是基金名称</h2>
            <h4 contenteditable="true">报告日期：2020-01-01</h4>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        render(){
            
        }
    },
}
</script>

<style lang="scss" scoped>
.wrap {
    height: 1122px;
    padding: 24px;
    .img {
        width: 340px;
        height: 90px;
        margin: 36px;
    }
    .line {
        width: 745px;
        height: 4px;
        background: #333333;
        margin-bottom: 60px;
    }
}
</style>