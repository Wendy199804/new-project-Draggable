<template>
    <div v-if="use === 'analyze'" class="wrap" :style="{ borderColor: bgcolor }">
        <div class="title" :style="{ background: bgcolor }">
            <span v-for="(item, index) in summaryTitle" :key="index">{{ item }}</span>
        </div>
        <div class="summary-contain summary-contain-analyze"><slot></slot></div>
    </div>
    <div v-else class="wrap2">
        <div class="title" :style="{ background: bgcolor }">
            <span v-for="(item, index) in summaryTitle" :key="index">{{ item }}</span>
        </div>
        <div class="summary-contain"><slot></slot></div>
    </div>
</template>

<script>
export default {
    props: {
        summaryTitle: {
            type: String
        },
        bgcolor: {
            type: String
        },
        use: {
            type: String,
            default: 'analyze'
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    font-weight: 600;
}
.wrap {
    border-bottom: 1px solid #dddddd;
    background-color: #ffffff;
    margin: 16px 0;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    overflow: hidden;
    & > div:nth-child(1) {
        margin-right: 12px;
        width: 100%;
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
        color: #ffffff;
        font-size: 20px;
        flex-shrink: 0;
        align-content: space-around;
        & > span {
            letter-spacing: 3px;
        }
    }
    .summary-contain {
        padding: 19px 24px;
        font-size: 16px;
        line-height: 28px;
        & > p {
            text-indent: 35px;
        }
    }
    .summary-contain-analyze {
        min-height: 250px;
        max-height: 350px;
        overflow-y: auto;
    }
    & > div:nth-child(2) {
        // display: flex;
        // justify-content: flex-start;
        // align-items: flex-start;
        // font-size: 14px;
    }
}
.wrap2 {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #dddddd;
    & > div:nth-child(1) {
        display: flex;
        flex-wrap: wrap;
        width: 48px;
        height: 48px;
        font-size: 14px;
        margin-right: 12px;
        flex-shrink: 0;
        color: #ffffff;
        padding: 4px;
        border-radius: 4px;
        span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50%;
            height: 50%;
        }
    }
    & > div:nth-child(2) {
        width: 100%;
    }
}
::-webkit-scrollbar {
    width: 5px; //纵向滚动条宽度
}
::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background: rgba($color: #999, $alpha: 0.3);
}
::-webkit-scrollbar-track {
    // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 50px;
    background: transparent;
}
</style>