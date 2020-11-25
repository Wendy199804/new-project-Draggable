<!-- 因子暴露组件 -->
<template>
    <div style="width: 50px;">
        <p class="p">{{topText}}</p>
        <div class="border">
            <div class="content">
                <div class="range"
                    :style="`height: ${(high - low) / (max - min) * 100}%;
                            bottom: ${(low - min) / (max - min) * 100}%;`"
                ></div>
                <div class="current"
                    :style="`bottom: ${(current - min) / (max - min) * 100}%;`"
                ></div>
                <div class="average"
                    :style="`bottom: ${(average - min) / (max - min) * 100}%;`"
                ></div>
            </div>
        </div>
        <p class="p">{{bottomText}}</p>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data() {
        return {}
    },
    computed: {
        max() { return this.item.max },
        min() { return this.item.min },
        high() { return this.item.high },
        low() { return this.item.low },
        current() { return this.item.current },
        average() { return this.item.average },
        topText() { return this.item.topText || '高' },
        bottomText() { return this.item.bottomText || '低' }
    }
}
</script>

<style lang="scss" scoped>
$bg-l: #E5ECFF;
$bg-m: #8FAEFE;
$bg-s: #333;
$width-l: 50px;
$height-l: 240px;
$width-s: 13px;

.p{
    color: #666;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
}
.border{
    width: $width-l;
    height: $height-l;
    border: 1px solid #ddd;
    border-radius: $width-l;
    background: #fff;
    .content{
        height: $height-l - $width-l;
        margin-top: $width-l / 2;
        position: relative;
    }
}

.range, .current, .average{
    position: absolute;
    width: 100%;
}
.range::before,
.range::after,
.current::after,
.average::after{
    content: '';
    display: block;
    border-radius: 50%;
}
.range{
    background: $bg-l;
    &::before, &::after{
        position: absolute;
        width: $width-l - 2px;
        height: $width-l - 2px;
        background: $bg-l;
    }
    &::before{
        top: -$width-l / 2;
    }
    &::after{
        bottom: -$width-l / 2;
    }
}
.current{
    height: 0;
    &::after{
        width: $width-l - 2px;
        height: $width-l - 2px;
        background: $bg-m;
        margin-top: -$width-l / 2;
    }
}
.average{
    height: 1px;
    margin-top: -0.5px;
    background: $bg-s;
    &::after{
        width: $width-s;
        height: $width-s;
        background: $bg-s;
        margin-left: ($width-l - $width-s) / 2 - 1px;
        margin-top: -$width-s / 2 + 1px;
    }
}
</style>