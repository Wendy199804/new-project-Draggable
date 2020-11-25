<template>
    <div class="wrap">
        <div class="risk-con">
            <div v-for="item in list" :key="item.value + 'a'" :style="{ backgroundColor: rank == item.value ? item.bg : '' }">
                <div v-if="rank == item.value" :class="['dialog', item.loc]" :style="{ borderColor: item.bg, '--bg': item.bg }">
                    <span>{{ item.dec }}</span>
                </div>
            </div>
        </div>
        <div class="dec">
            <span>低</span>
            <span>中等</span>
            <span>高</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        rank: {},
        type: {} // earn 、 risk
    },
    data() {
        return {}
    },
    computed: {
        list() {
            return this.type === 'earn'
                ? [
                      { value: 5, dec: '低', bg: '#50C75ABF', loc: 'left' },
                      { value: 4, dec: '较低', bg: '#50C75A7F', loc: 'left' },
                      { value: 3, dec: '中等', bg: '#FFC069', loc: 'center' },
                      { value: 2, dec: '较高', bg: '#FF9595', loc: 'right' },
                      { value: 1, dec: '高', bg: '#FF6673', loc: 'right' }
                  ]
                : [
                      { value: 1, dec: '低', bg: '#FF6673', loc: 'left' },
                      { value: 2, dec: '较低', bg: '#FF9595', loc: 'left' },
                      { value: 3, dec: '中等', bg: '#FFC069', loc: 'center' },
                      { value: 4, dec: '较高', bg: '#50C75A7F', loc: 'right' },
                      { value: 5, dec: '高', bg: '#50C75ABF', loc: 'right' }
                  ]
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
    margin-top: 48px;
    margin-bottom: 15px;
}
.right {
    right: 50%;
    &::before {
        content: '';
        display: block;
        border-color: var(--bg);
        border-width: 10px;
        border-style: solid;
        border-left: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-top: 10px solid transparent;
        position: absolute;
        bottom: -11px;
        right: -2px;
    }
    &::after {
        content: '';
        display: block;
        border-color: #ffffff;
        border-width: 8px;
        border-style: solid;
        border-left: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-top: 8px solid transparent;
        position: absolute;
        bottom: -7px;
        right: 0;
    }
}

.left {
    left: 50%;
    &::before {
        content: '';
        display: block;
        border-color: var(--bg);
        border-width: 10px;
        border-style: solid;
        border-right: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-top: 10px solid transparent;
        position: absolute;
        bottom: -11px;
        left: -2px;
    }
    &::after {
        content: '';
        display: block;
        border-color: #ffffff;
        border-width: 8px;
        border-style: solid;
        border-right: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-top: 8px solid transparent;
        position: absolute;
        bottom: -7px;
        left: 0;
    }
}
.center {
    left: 50%;
    transform: translateX(-50%);
    &::before {
        content: '';
        display: block;
        border-color: #FFC069;
        border-width: 10px;
        border-style: solid;
        border-left: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid transparent;
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
    }
    &::after {
        content: '';
        display: block;
        border-left: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #ffffff;
        position: absolute;
        bottom: -14px;
        left: 50%;
        transform: translateX(-50%);
    }
}
.dialog {
    width: auto;
    height: 35px;
    padding: 0 15px;
    background-color: #ffffff;
    border: 2px solid;
    border-radius: 5px;
    text-align: center;
    line-height: 35px;
    white-space: nowrap;
    margin-bottom: 13px;
    position: absolute;
    top: -45px;
}
.risk-con {
    width: 100%;
    height: 23px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    background-color: #dddddd;
    border-radius: 50px;
    & > div {
        width: 20%;
        height: 100%;
        border-right: 1px solid #ffffff;
        position: relative;
    }
    & > div:first-child {
        border-radius: 50px 0 0 50px;
    }
    & > div:last-child {
        border-right: none;
        border-radius: 0 50px 50px 0;
    }
}
.dec {
    width: 190px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    margin-top: 10px;
}
</style>