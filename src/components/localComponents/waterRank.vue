<template>
    <div class="water-rank">
        <div v-show="value != 0" class="water">
            <div :class="value >= 4 ? 'bg4' : 'bg'"></div>
            <div :class="value >= 3 ? 'bg3' : 'bg'"></div>
            <div :class="value >= 2 ? 'bg2' : 'bg'"></div>
            <div :class="value >= 1 ? 'bg1' : 'bg'"></div>
        </div>
        <p style="line-height: 12px;">{{ rank }}</p>
    </div>
</template>

<script>
import { getRank } from '@/utils/analyze.js'

export default {
    props: {
        value: {}
    },
    computed: {
        rank() {
            return getRank(this.value)
        }
    }
}
</script>


<style lang="scss" scoped>
.water-rank {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .water {
        width: 48px;
        height: 48px;
        border: 1px solid #ddd;
        border-bottom: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        & > div {
            height: 25%;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
    }
    .bg1 {
        background-color: #e3ebfd;
    }
    .bg2 {
        background-color: #cddbff;
    }
    .bg3 {
        background-color: #b2c8ff;
    }
    .bg4 {
        background-color: #98b6ff;
    }
    .bg {
        background-color: transparent;
    }
    & > p {
        text-align: center;
        font-size: 12px;
        margin-top: 8px;
    }
}
</style>