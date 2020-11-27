<template>
        <div class="gradientChart">
            <p>高</p>
            <div class="box" :style="{ '--bg': color, '--top': `${Gradientvalue * 0.8}%` }">
                <div class="inner"></div>
                <div class="circle">
                    <div class="dialog">{{ Gradientvalue_dialog }}%</div>
                </div>
            </div>
            <p>低</p>
        </div>
</template>

<script>
import Gradient from '@/utils/Gradient'
export default {
    props: {
        Gradientvalue: {},
        Gradientvalue_dialog: {}
    },
    data() {
        return {}
    },
    computed: {
        color() {
            const gradient = new Gradient(['rgba(255, 102, 115, 1)', 'rgba(255, 192, 105, 1)', 'rgba(80, 199, 90, 1)'])
            return gradient.getColor(this.Gradientvalue)
        }
    },
    mounted() {}
}
</script>

<style lang="scss">
.gradientChart {
    & > p {
        text-align: center;
        font-size: 12px;
        color: #666;
        padding: 3px 0;
    }
    .box {
        width: 54px;
        height: 256px;
        margin: 0 auto;
        border-radius: 50px;
        padding: 2px;
        background: linear-gradient(180deg, rgba(255, 102, 115, 1), rgba(255, 192, 105, 1), rgba(80, 199, 90, 1));
        position: relative;
        .circle {
            width: 50px;
            height: 50px;
            position: absolute;
            left: 2px;
            top: var(--top);
            border-radius: 50%;
            background: var(--bg);
            z-index: 10;
            .dialog {
                position: absolute;
                left: 65px;
                top: 50%;
                transform: translateY(-50%);
                padding: 7px 10px;
                border-radius: 4px;
                border: 2px solid var(--bg);
                &::before {
                    content: '';
                    display: block;
                    border-color: var(--bg);
                    border-width: 7px;
                    border-style: solid;
                    border-left: 7px solid transparent;
                    border-bottom: 6px solid transparent;
                    border-top: 6px solid transparent;
                    position: absolute;
                    bottom: 8px;
                    left: -16px;
                }
                &::after {
                    content: '';
                    display: block;
                    border-color: #fff;
                    border-width: 7px;
                    border-style: solid;
                    border-left: 3px solid transparent;
                    border-bottom: 5px solid transparent;
                    border-top: 5px solid transparent;
                    position: absolute;
                    bottom: 9px;
                    left: -10px;
                }
            }
        }
        .inner {
            width: 100%;
            height: 100%;
            border-radius: 50px;
            background: #ffffff;
            position: relative;
            // &::after {
            //     content: '';
            //     height: 2px;
            //     width: 100%;
            //     background: #333;
            //     position: absolute;
            //     left: 0;
            //     top: var(--innertop);
            //     z-index: 20;
            // }
            // &::before {
            //     content: '';
            //     height: 13px;
            //     width: 13px;
            //     border-radius: 50%;
            //     background: #333;
            //     position: absolute;
            //     left: 50%;
            //     transform: translateX(-50%) translateY(-50%);
            //     top: var(--innertop);
            //     z-index: 20;
            // }
        }
    }
}
</style>