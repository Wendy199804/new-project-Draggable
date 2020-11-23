<template>
    <div class="edit-container">
        <div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="功能模板" name="first">功能模板</el-tab-pane>
                <el-tab-pane label="工具" name="second">工具</el-tab-pane>
            </el-tabs>
        </div>
        <div>
            <div class="main-edit-container"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Dashboard',
    data() {
        return {
            activeName: 'first'
        }
    },
    computed: {
        ...mapGetters(['name'])
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event)
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-container {
    padding: 16px 0 16px 16px;
    background: #ebebeb;
    display: flex;
    justify-content: flex-start;
    & > div:first-child {
        width: 17.375rem;
        height: calc(100vh - 66px);
        flex-shrink: 0;
        background: #ffffff;
        border: 1px solid #aaaaaa;
    }
    & > div:nth-child(2) {
        width: calc(100vw - 17.375rem);
    }
    .main-edit-container {
        width: 49.5625rem;
        min-height: 1122px;
        background: #ffffff;
        box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
        width: 100% !important;
        border: none;
        & > div {
            width: 50%;
            text-align: center;
            font-weight: bold;
            background-color: #ebebeb;
            border-bottom: 1px solid #aaaaaa;
        }
        & > div:first-child {
            border-right: 1px solid #aaaaaa;
        }
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background-color: #ffffff;
        border-bottom: 1px solid #ffffff;
    }
}
</style>
