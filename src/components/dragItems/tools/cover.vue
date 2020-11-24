<template>
    <div>
        封面
        <div class="wrap">
            <div class="img">图片</div>
            <p class="line"></p>
            <h1 @click.stop :contenteditable="my_choosed">这是一个可修改的报告名称</h1>
            <h2 @click.stop :contenteditable="my_choosed">——————这是基金名称</h2>
            <h4 @click.stop :contenteditable="my_choosed">报告日期：2020-01-01</h4>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        choosed:{}
    },
    data() {
        return {
            my_choosed:false
        }
    },
    watch: {
        choosed(val){
            this.my_choosed = val
            console.log('watch',val);
        }
    },
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