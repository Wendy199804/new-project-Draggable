<template>
    <!-- 
    示例：
      <Zjtag :color="'red'">抗风险</Zjtag>
      <Zjtag :color="'blue'">创新高</Zjtag>
    -->

    <div class="zjTag-wrap">
        <!-- <span :class="color">
            <slot></slot>
        </span>-->
        <div class="zjTag" style="float: left">
            <span v-for="(item, index) in listtop" :key="index" :class="item.color" style="cursor: pointer" @click="clickTag(item)">{{
                item.tags.label
            }}</span>
        </div>
        <span v-show="listbtom.length > 0" class="more" @click="mouseover = !mouseover">
            <span v-text="mouseover ? '收起' : '更多'"></span>
            <i :class="mouseover ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </span>
        <div class="zjTag othertags" :style="{ display: mouseover ? 'block' : 'none' }">
            <span v-for="(item, index) in listbtom" :key="item.color + index" style="margin-right: 0; padding: 0">
                <span v-for="tag in item.tags" :key="tag.label" :class="[item.color]" style="cursor: pointer" @click="clickTag(item, tag)">{{ tag.label }}</span>
            </span>
            <!-- <div class="pop"></div> -->
        </div>
    </div>
</template>

<script>
/**
 * 类名必须是在style中定义过的
 */
export default {
    props: {
        color: {
            type: String
        },
        result: {},
        fundtype1: {},
        fundtype2: {}
    },
    data() {
        return {
            listtop: [], //默认展示的标签
            listbtom: [], //显示不完的标签
            show_num: 15,
            mouseover: false,
        }
    },
    methods: {
        clickTag(item, tag) {
            let name = ' '
            let fundtype2 = this.fundtype2.filter((item, index) => {
                return !(item === 'alpha型' || item === 'beta型')
            })
            name = item.tags instanceof Array ? item.tags[0].label : (item.tags.label === '新基金' ? '存续时间<6个月':item.tags.label) 
            this.$router.push({ name: 'FundRanking', query: { tag: name, type: item.type, fundtype1: this.fundtype1, fundtype2: fundtype2 } })
        },
        mouseLeave() {
            setTimeout(() => {
                this.mouseover = false
            }, 700)
        },
        flatten(arr) {
            return [].concat(...arr.map(x => (Array.isArray(x) ? flatten(x) : x)))
        },
        handleResult(list) {
            let listtop = [],listbtom = []
            let toptypes = ['收益', '风险', '主题', '行业', '风格', '运营']
            let bottomtypes = ['收益', '风险', '主题', '行业', '风格']
            let arr = Object.keys(list).map((item, index) => {
                let color = '',type = '',queue = '',queue2 = ''
                switch (item) {
                    case '主题':
                        color = 'blue'
                        type = '主题'
                        queue = 3 // 第二行展示顺序
                        queue2 = 3 // 第一行展示顺序
                        break
                    case '行业':
                        color = 'cyan'
                        type = '行业'
                        queue = 4
                        queue2 = 4
                        break
                    case '风格':
                        color = 'perple'
                        type = '风格'
                        queue = 5
                        queue2 = 5
                        break
                    case '收益':
                        color = 'red'
                        type = '收益'
                        queue = 1
                        queue2 = 1
                        break
                    case '风险':
                        color = 'green'
                        type = '风险'
                        queue = 2
                        queue2 = 2
                        break
                    case '能力':
                        color = 'pink'
                        type = '能力'
                        queue = 6
                        queue2 = 6
                        break
                    case '运营':
                        color = 'orange'
                        type = '运营'
                        queue2 = 0
                        break
                    default:
                        color = 'orange'
                        queue = 8
                }
                if(toptypes.includes(item)){
                    let tags = {}
                    tags = list[item].some(item=>{return item.value === 1}) ? list[item].filter(item=>{return item.value === 1})[0] : list[item][0] //没有value为0的就取第一个
                    listtop.push({ type: item, color: color, queue2: queue2, tags: tags})
                }
                if(bottomtypes.includes(item)){
                    let tagsbottom = {}
                    tagsbottom = list[item].some(item=>{return item.value === 1}) ? list[item].filter(item=>{return item.value === 0}) : list[item].slice(1)
                    listbtom.push({ type: item, color: color, queue: queue, tags: tagsbottom})
                }
                let first_manager_index = list[item].findIndex(item=>{return item.label === '金麒麟基金经理'})
                if(item === '能力'&&first_manager_index>=0){ //有金麒麟
                    listtop.push({ type: item, color: color, queue2: queue2, tags: list[item][first_manager_index]})
                    listbtom.push({ type: item, color: color, queue: queue, tags: list[item].filter((item,index)=>{return index!==first_manager_index})})
                }else if(item === '能力'&&first_manager_index<0){
                    listbtom.push({ type: item, color: color, queue: queue, tags: list[item]})
                }
            })
            
            listbtom = listbtom.filter(item => {return item.tags.length > 0})
            listtop.sort((a, b) => {return a.queue2 - b.queue2})
            listbtom.sort((a, b) => {return a.queue - b.queue})
            this.listtop = listtop
            this.listbtom = listbtom
        }
    }
}
</script>

<style lang="scss" scoped>
.zjTag-wrap {
    position: relative;
    $red: #fd484c;
    $blue: #4e7cee;
    $perple: #a677d9;
    $cyan: #13c2c2;
    $pink: #ff7597;
    $green: #50c75a;
    $orange: #d65b2a;
    .zjTag {
        // width: calc(100% - 70px);//!
        height: 25px;
        // overflow: hidden;//!
        span {
            padding: 3px 5px;
            border-radius: 2px;
            font-size: 13px;
            margin-right: 8px;
            display: inline-block;
            margin-bottom: 8px;
        }
    }
    .more {
        padding: 2px 5px;
        display: inline-block;
        line-height: 15px;
        cursor: pointer;
        border: 1px solid #4e7cee;
        border-radius: 4px;
        color: #4e7cee;
    }
    .othertags {
        width: 100%;
        margin-top: 5px;
    }
    .red {
        background-color: rgba($color: $red, $alpha: 0.2);
        color: $red;
    }
    .blue {
        background-color: rgba($color: $blue, $alpha: 0.2);
        color: $blue;
    }
    .perple {
        background-color: rgba($color: $perple, $alpha: 0.2);
        color: $perple;
    }
    .cyan {
        background-color: rgba($color: $cyan, $alpha: 0.2);
        color: $cyan;
    }
    .pink {
        background-color: rgba($color: $pink, $alpha: 0.2);
        color: $pink;
    }
    .green {
        background-color: rgba($color: $green, $alpha: 0.2);
        color: $green;
    }
    .orange {
        background-color: rgba($color: $orange, $alpha: 0.2);
        color: $orange;
    }
}
</style>