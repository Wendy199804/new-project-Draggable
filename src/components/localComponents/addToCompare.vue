<template>
    <div class="add-to-compare">
        <div class="circle" @click="ifShowlist">VS</div>
        <div class="funds-num">{{fundlist.length}}</div>
        <div v-show="visible" class="add-list">
            <div class="funds-">
                <div
                    class="funditem"
                    v-for="(item,index) in selectFundsToCompare"
                    :key="item.innercode"
                >
                    <div v-if="item.innercode">
                        <i class="el-icon-error" @click="delComFund(index)"></i>
                        <span style="vertical-align: middle">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="btn">
                <div @click="clearCompare">清空</div>
                <div @click="tocompare">对比</div>
            </div>
        </div>
        <div v-show="visible" class="triangle"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            visible: false
        }
    },
    computed: {
        ...mapGetters(['selectFundsToCompare']),
        fundlist() {
            return this.unique(this.selectFundsToCompare, 'innercode')
        }
    },
    methods: {
        clearCompare() {
            this.visible = false
            this.updateStore([])
            this.$emit('ifvsShow') 
        },
        ifShowlist() {
            this.visible = !this.visible
        },
        unique(arr, val) {
            const res = new Map()
            return arr.filter(item => item[val] !== undefined)
        },
        //更新store
        async updateStore(value) {
            await this.$store.dispatch('FundsCompare/setSelectFundsToCompare', value)
        },
        delComFund(index) {
            let arr = [...this.selectFundsToCompare]
            arr.splice(index, 1)
            this.updateStore(arr) 
        },
        tocompare() {
            if (this.fundlist.length < 2) {
                this.$message({
                    message: '请至少选择2只基金',
                    type: 'warning'
                })
            } else {
                this.$router.push({
                    name: 'fundscompare',
                    params: { isStart: true } // 直接显示结果
                })
            }
        }
    }
}
</script>

<style lang="scss">
.add-to-compare {
    position: relative;
    z-index: 51;
    .funds-num {
        background: #fd484c;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        font-size: 10px;
        text-align: center;
        line-height: 17px;
        color: #fff;
        position: absolute;
        left: 0;
        top: 0;
    }

    .circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba($color: #333, $alpha: 0.3);
        text-align: center;
        line-height: 50px;
        background: #ffffff;
        font-size: 18px;
        color: rgba(102, 102, 102, 1);
        cursor: pointer;
    }
    .add-list {
        width: 230px;
        padding: 20px 20px 50px 20px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        background: #ffffff;
        position: absolute;
        left: -240px;
        top: 50%;
        transform: translateY(-50%);
        box-shadow: 0 0 10px rgba($color: #333, $alpha: 0.5);
        z-index: 51;
        .funds- {
            font-size: 13px;
            color: #666666;
            .el-icon-error {
                font-size: 15px;
                color: #bbb;
                margin-right: 5px;
                vertical-align: middle;
                cursor: pointer;
                &:hover {
                    color: #666;
                }
            }
            .funditem {
                padding: 5px 0;
            }
        }

        .btn {
            height: 30px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #dddddd;
            position: absolute;
            bottom: 0;
            left: 0;
            & > div {
                line-height: 30px;
                text-align: center;
                font-size: 12px;
                width: 50%;
                cursor: pointer;
            }
            & > div:first-child {
                border-right: 1px solid #dddddd;
                color: #999;
            }
            & > div:last-child {
                color: #4e7cee;
            }
        }
    }
    .triangle {
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid transparent;
        border-left: 10px solid #fff;

        // box-shadow: -5px -5px 0 5px rgba($color: #333, $alpha: 0.5);
        // box-shadow:3px 0 8px -4px #000;
        // box-shadow: 5px 5px 5px -5px  rgba($color: #333, $alpha: 0.5);
        position: absolute;
        left: -15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 51;
    }
}
</style>