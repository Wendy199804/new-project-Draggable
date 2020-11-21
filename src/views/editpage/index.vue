<template>
    <div class="wrap">
        <div>
            <div>产品概览 <span @click="addAll(myArray)" class="cursor-pointer">全部添加</span></div>
            <Draggable
                class="cards-group"
                v-model="myArray"
                :animation="200"
                :options="{
                    sort: false,
                    group: { name: 'group', pull: 'clone', put: false },
                }"
                ghostClass="ghost1"
                @end="end1"
            >
                <transition-group>
                    <div v-for="element in myArray" :key="element.id" class="draggable-item">
                        {{ element.name }}
                        <el-button circle @click="addItem(element)">+</el-button>
                    </div>
                </transition-group>
            </Draggable>
            <div>基金经理1 <span @click="addAll(manager1)" class="cursor-pointer">全部添加</span></div>
            <Draggable
                class="cards-group"
                v-model="manager1"
                :animation="200"
                :options="{
                    sort: false,
                    group: { name: 'group', pull: 'clone', put: false },
                }"
                ghostClass="ghost1"
                @end="end1"
            >
                <transition-group>
                    <div v-for="element in manager1" :key="element.id" class="draggable-item">
                        {{ element.name }}
                        <el-button circle @click="addItem(element)">+</el-button>
                    </div>
                </transition-group>
            </Draggable>
            <div>基金经理2 <span @click="addAll(manager2)" class="cursor-pointer">全部添加</span></div>
            <Draggable
                class="cards-group"
                v-model="manager2"
                :animation="200"
                :options="{
                    sort: false,
                    group: { name: 'group', pull: 'clone', put: false },
                }"
                ghostClass="ghost1"
                @end="end1"
            >
                <transition-group>
                    <div v-for="element in manager2" :key="element.id" class="draggable-item">
                        {{ element.name }}
                        <el-button circle @click="addItem(element)">+</el-button>
                    </div>
                </transition-group>
            </Draggable>
        </div>

        <!-- 右边
        handle=".handle"
        draggable=".item"
        filter=".forbid"
        :move="onMove"
        -->
        <div>
            <Draggable
                class="empty-group"
                id="printcontent"
                v-model="myArray2"
                :animation="200"
                :options="{
                    group: { name: 'group', fallbackTolerance: 0 },
                    scroll: true,
                    scrollSpeed: 2,
                }"
                ghostClass="ghost2"
                chosen-class="chosen"
                handle=".handle"
            >
                <transition-group id="printpdf">
                    <div v-for="(element, index) in myArray2" :key="element.id" :class="[element.delete ? 'to-right' : '', element.choosed ? 'border' : '', 'list-group-item', 'my-list-group-item', 'cursor-auto']" @click="chooseItem(element, index)">
                        <div v-show="element.choosed" class="edit">
                            <span @click.stop="unChoosed(element, index)">取消选中</span>
                            <span @click.stop="moveUp(element, index)">上移</span>
                            <span @click.stop="moveDown(element, index)">下移</span>
                            <span @click.stop="copyItem(element, index)">复制</span>
                            <span @click.stop="deleteItem(element, index)">删除</span>
                            <span @click.stop="addArticle(element, index)">添加文案</span>
                        </div>
                        <i v-show="element.choosed" class="el-icon-s-unfold handle move-icon"></i>
                        <i v-show="element.choosed" @click.stop="clickMove(element)" class="el-icon-s-unfold move-icon"></i>
                        {{ element.name }}
                        <!-- <el-button circle @click.stop="deleteItem(element, index)">×</el-button> -->
                        <div class="a-component">
                            <component v-show="!element.blob" :is="allComponents[element.component]" :id="`newImg${index}`" :ref="`newImg${index}`"></component>
                            <img :src="element.blob" style="width: 100%" />
                        </div>

                        <div v-show="element.articlelist && element.articlelist.length > 0" :style="{ border: element.choosed ? '1px dashed fuchsia' : 'none' }" @click.stop class="textarea-wrap">
                            <!-- <textarea>我是一个文本框。</textarea> -->
                            <div v-for="(item, index2) in element.articlelist" :key="index2">
                                <!-- 文案个数 -->
                                <div v-show="element.choosed && item.focus">文字颜色<el-color-picker v-model="item.color" @change="fontColorChange(index)" size="mini"></el-color-picker></div>
                                <div :contenteditable="element.choosed" @focus="articleFocus(item, index, index2, $event)" @blur="articleBlur(item, index, index2, $event)" :style="{ color: item.color }" class="custom-article">
                                    这是一个文案，点击可以编辑
                                </div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </Draggable>
            <!-- <el-button @click="doPrint">打印</el-button> -->
            <el-button @click="doToimg">第一步、转图片</el-button>
            <el-button @click="doPdf">第二步、导出PDF</el-button>
            <img :src="blob" style="width: 100%" />
            <iframePrint v-if="printHtml" :html="printHtml" />
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import allComponents from '@/components/dragItems/exportComponent'
// import item_6 from '@/components/dragItems/item_6'
import html2canvas from 'html2canvas'
import iframePrint from '@/components/iframe/createIframe'

export default {
    data() {
        return {
            allComponents: allComponents,
            myArray: [
                { id: 1, name: 'height: 400px;', delete: false, component: 'item_1' },
                { id: 2, name: '柱状图', delete: false, component: 'item_2' ,},
                { id: 3, name: 'c', delete: false, component: 'item_3' },
                { id: 4, name: 'd', delete: false, component: 'item_4' },
                { id: 5, name: '表格', delete: false, component: 'item_5', istable: true },
                { id: 6, name: '情景分析', delete: false, component: 'item_6' },
            ],
            manager1: [
                {
                    id: 1,
                    name: 'manager1 a1111111111111',
                    delete: false,
                    component: 'item_1',
                    manager_id: 1,
                },
                {
                    id: 2,
                    name: 'manager1 b',
                    delete: false,
                    component: 'item_2',
                    manager_id: 1,
                },
                {
                    id: 3,
                    name: 'manager1 c',
                    delete: false,
                    component: 'item_3',
                    manager_id: 1,
                },
                {
                    id: 4,
                    name: 'manager1 d',
                    delete: false,
                    component: 'item_4',
                    manager_id: 1,
                },
                {
                    id: 5,
                    name: 'manager1 e',
                    delete: false,
                    component: 'item_5',
                    manager_id: 1,
                },
                {
                    id: 6,
                    name: 'manager1 f',
                    delete: false,
                    component: 'item_6',
                    manager_id: 1,
                },
            ],
            manager2: [
                {
                    id: 1,
                    name: 'manager2 a',
                    delete: false,
                    component: 'item_1',
                    manager_id: 2,
                },
                {
                    id: 2,
                    name: 'manager2 b',
                    delete: false,
                    component: 'item_2',
                    manager_id: 2,
                },
                {
                    id: 3,
                    name: 'manager2 c',
                    delete: false,
                    component: 'item_3',
                    manager_id: 2,
                },
                {
                    id: 4,
                    name: 'manager2 d',
                    delete: false,
                    component: 'item_4',
                    manager_id: 2,
                },
                {
                    id: 5,
                    name: 'manager2 e',
                    delete: false,
                    component: 'item_5',
                    manager_id: 2,
                },
                {
                    id: 6,
                    name: 'manager2 f',
                    delete: false,
                    component: 'item_6',
                    manager_id: 2,
                },
            ],
            myArray2: [
                {
                    id: 7,
                    name: 'g',
                    delete: false,
                    component: 'item_1',
                    articleNum: 0,
                    articlelist: [],
                },
            ],
            options: {
                animation: 2,
            },
            blob: '',
            printHtml: '',
        }
    },
    components: {
        Draggable,
        iframePrint,
    },
    methods: {
        ///添加按钮  *****  add
        addItem(ele) {
            let choosed_index = this.myArray2.findIndex((item) => item.choosed)
            let obj = Object.assign({}, ele)
            obj.id = new Date().getTime() + 'id'
            obj.articleNum = 0
            obj.articlelist = []
            choosed_index === -1 ? this.myArray2.push(obj) : this.myArray2.splice(choosed_index + 1, 0, obj) // 添加到选中元素后面
            this.$nextTick(() => {
                let len = this.myArray2.length - 1
                this.$refs[`newImg${len}`][0].render()
            })
        },
        //拖拽结束  *****  add
        end1(ev) {
            if (ev.pullMode === 'clone') {
                let obj = Object.assign({}, this.myArray2[ev.newDraggableIndex])
                obj.id = new Date().getTime() + 'id'
                obj.articleNum = 0
                obj.articlelist = []
                this.myArray2[ev.newDraggableIndex] = Object.assign({}, obj)
            } else {
                console.log('not clone')
            }
        },
        //全部添加  *****  add
        addAll(arr) {
            let choosed_index = this.myArray2.findIndex((item) => item.choosed)
            arr = arr.map((item, index) => {
                item.id = new Date().getTime() + 'id' + index
                item.articleNum = 0
                item.articlelist = []
                return { ...item }
            })
            let newarr = JSON.parse(JSON.stringify(arr))
            this.myArray2 = choosed_index === -1 ? [...this.myArray2, ...arr] : [...this.myArray2.slice(0, choosed_index + 1), ...arr, ...this.myArray2.slice(choosed_index + 1)]
        },
        //删除
        deleteItem(ele, index) {
            let obj = Object.assign({}, ele)
            obj.delete = true
            obj.choosed = false
            this.$set(this.myArray2, index, obj)
            setTimeout(() => {
                this.myArray2.splice(index, 1)
            }, 200)
        },
        //选中（双击）
        chooseItem(ele, index) {
            if (!ele.choosed) {
                this.myArray2 = this.myArray2.map((item) => {
                    item.choosed = false
                    return item
                })
                let obj = Object.assign({}, ele)
                obj.choosed = true
                // this.$set(this.myArray2[index],'choosed',true)
                this.myArray2[index] = obj
            } else {
                let obj = Object.assign({}, ele)
                obj.choosed = false
                this.$set(this.myArray2, this.myArray2[index], obj)
                this.myArray2[index] = obj
            }
        },
        //选中状态才可以拖动
        onMove(ev) {
            return ev.relatedContext.element.choosed ? true : false
        },
        //上移一个
        moveUp(ele, index) {
            let obj = Object.assign({}, ele)
            obj.choosed = true
            this.myArray2.splice(index, 1)
            this.myArray2.splice(index - 1, 0, obj)
            this.$set(this.myArray2, this.myArray2[index - 1], obj)
        },
        //下移一个
        moveDown(ele, index) {
            let obj = Object.assign({}, ele)
            obj.choosed = true
            this.myArray2.splice(index, 1)
            this.myArray2.splice(index + 1, 0, obj)
            this.$set(this.myArray2, this.myArray2[index + 1], obj)
        },
        //复制一个到后面
        copyItem(ele, index) {
            let obj = Object.assign({}, ele)
            obj.id = new Date().getTime() + 'id'
            obj.articleNum = 0
            obj.articlelist = []
            obj.choosed = false
            this.myArray2.splice(index + 1, 0, obj)
            this.$set(this.myArray2, this.myArray2[index + 1], obj)
        },
        //添加文案
        addArticle(ele, index) {
            // console.log(ele)
            let obj = Object.assign({}, ele)
            obj.articleNum = ele.articleNum + 1
            obj.articlelist.push({ color: '#333', focus: false })
            obj.choosed = true
            this.$set(this.myArray2, index, obj)
        },
        //取消选中
        unChoosed(ele, index) {
            let obj = Object.assign({}, ele)
            obj.choosed = false
            this.$set(this.myArray2, index, obj)
        },
        //文案编辑聚焦 (原定：聚焦的时候才能改变颜色)
        articleFocus(ele, index, index2, ev) {
            let obj = Object.assign({}, this.myArray2[index])
            obj.articlelist = this.myArray2[index].articlelist.map((item, i) => {
                i === index2 ? (item.focus = 1) : (item.focus = 0)
                return { ...item }
            })
            this.$set(this.myArray2, index, obj)
        },
        //文案编辑失焦
        articleBlur(ele, index, index2, ev) {
            // let obj = Object.assign({}, this.myArray2[index])
            // obj.articlelist = this.myArray2[index].articlelist.map((item, i) => {
            //     item.focus = 0
            //     return { ...item }
            // })
            // this.$set(this.myArray2, index, obj)
        },
        //文字颜色变化
        fontColorChange(index) {
            let obj = Object.assign({}, this.myArray2[index])
            obj.articlelist = this.myArray2[index].articlelist.map((item, i) => {
                item.focus = 0
                return { ...item }
            })
            this.$set(this.myArray2, index, obj)
        },
        clickMove(ele) {
            console.log('click move', ele)
        },
        //打印（无样式）
        doPrint() {
            //判断iframe是否存在，不存在则创建iframe
            let iframe = document.getElementById('print-iframe')
            if (!iframe) {
                let el = document.getElementById('printcontent')
                iframe = document.createElement('IFRAME')
                let doc = null
                // iframe.setAttribute("src", "./print.html")
                iframe.setAttribute('id', 'print-iframe')
                iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
                document.body.appendChild(iframe)
                doc = iframe.contentWindow.document
                //这里可以自定义样式
                // doc.write('<html><head><link rel="stylesheet" type="text/css" href="./print.css"></head><body">'+'<div>' + el.innerHTML + '</div>'+'</body></html>')
                doc.write("<head><link rel='stylesheet' type='text/css' href='/print.css'></head>")
                doc.write('<div>' + el.innerHTML + '</div>')
                // let html = '<html><head><link rel="stylesheet" type="text/css" href="./print.css"></head><body">' + '<div>' + el.innerHTML + '</div>' + '</body></html>'
                // iframe.srcdoc = html
                // console.log(iframe, iframe.contentWindow, doc)

                doc.close()
                iframe.contentWindow.focus()
            }
            iframe.contentWindow.print()
            document.body.removeChild(iframe)
        },
        //逐个转图片
        doToimg() {
            this.myArray2.map((item, index) => {
                item.choosed = false
                if (!item.istable) {
                    this.$refs[`newImg${index}`][0].toimg() //在子组件里转
                    // this.getImg(`newImg${index}`, index) //在父组件转 
                }
            })
            
        },
        getImg(newImg, index) {
            let that = this
            event.preventDefault()
            let canvas2 = document.createElement('canvas')
            let _canvas = document.getElementById(newImg)
            let w = parseInt(window.getComputedStyle(_canvas).width)
            let h = parseInt(window.getComputedStyle(_canvas).height)
            //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
            canvas2.width = w
            canvas2.height = h
            canvas2.style.width = w - 1 + 'px'
            canvas2.style.height = h - 1 + 'px'
            //可以按照自己的需求，对context的参数修改,translate指的是偏移量
            //  let context = canvas.getContext("2d");
            //  context.translate(0,0);
            let context = canvas2.getContext('2d')
            context.scale(1, 1)
            html2canvas(_canvas, {
                canvas: canvas2,
            }).then((res) => {
                let blob = that.getBlob(res)
                let obj = this.myArray2[index]
                obj.blob = window.URL.createObjectURL(blob)
                this.$set(this.myArray2, index, obj)
                // console.log(res, blob)
            })
        },
        getBlob(canvas) {
            //获取blob对象
            let data = canvas.toDataURL('image/jpeg', 1)
            data = data.split(',')[1]
            data = window.atob(data)
            let ia = new Uint8Array(data.length)
            for (let i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i)
            }
            return new Blob([ia], {
                type: 'image/jpeg',
            })
        },
        //打印 （会切割组件）
        doPdf() {
            this.printHtml = document.getElementById('printcontent').innerHTML
            // this.printIframeshow = false
            setTimeout(() => {
                window.onafterprint = this.onafterprint()
            }, 100)
        },
        //监听打印窗口打开
        onafterprint() {
            this.printHtml = ''
            // console.log('after')
        },
    },
}
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    justify-content: center;
    // width: 95%;

    & > div:first-child {
        width: 300px;
        height: 700px;
        margin-right: 30px;
        flex-shrink: 0;
        overflow-y: auto;
    }
    & > div:nth-child(2) {
        width: 1024px;
        height: 840px;
        padding-top: 20px;
        flex-shrink: 0;
        overflow-y: auto;
    }
}
.draggable-item {
    height: 50px;
    // width: 500px;
    border: 1px solid #000000;
    margin-bottom: 5px;
    cursor: pointer;
}
.cards-group {
}
.empty-group {
    width: 100%;
    height: 87%;
    padding: 20px;
    border: 1px solid blueviolet;
    overflow-y: auto;

    & > span {
        display: block;
        // height: 300px;
        width: 100%;
        border: 1px solid red;
    }
}
.to-right {
    transform: translateX(100%);
    transition: all 0.3s;
}
.cursor-auto {
    cursor: auto;
}
.handle {
    cursor: move;
}
//选中边框
.border {
    border: 2px solid rgb(133, 174, 228);
}
//可拖动元素
// .list-group-item{
//     position: relative;
//     z-index: 100;
// }
// .move-icon{
//     position: relative;
//     z-index: 101
// }
//占坑元素
.ghost2 {
    background-color: #000;
    transform: translateX(20px);
    height: 0px;
    overflow: hidden;
    margin: 0;
    padding-top: 1px;
}
.ghost1 {
    background: #ffffff;
}
//拖动时 //选中时
.chosen {
    transform: translateX(20px);
    background-color: #999;
    padding: 0;
    // height: auto;
    // opacity: 0.5;
    // overflow: hidden;
}
//选中元素
.my-list-group-item {
    height: auto;
    position: relative;
    .edit {
        padding: 3px 10px;
        background-color: rgba($color: #9cccec, $alpha: 0.8);
        position: absolute;
        top: -15px;
        right: -15px;

        & > span {
            cursor: pointer;
            margin-right: 3px;
        }
    }
}
.textarea-wrap {
    height: auto;
    width: auto;
    padding: 5px;
    .custom-article {
        outline: none;
        border: 1px solid #dddddd;
        padding: 5px 10px;
        margin-bottom: 5px;
    }
}
.cursor-pointer {
    cursor: pointer;
}
>>> .component-wrap {
    width: 100%;
    color: rgb(148, 27, 27);
    // background-color: cadetblue;
}
>>> .a-component{
    margin: 16px 0;
}
@media print {
    // size: auto; /* auto is the initial value */
    // margin: 0mm; /* this affects the margin in the printer settings */
    // margin-top: 0mm; //去掉页眉
    // margin-bottom: 0mm; //去掉页脚
    //     body {
    //         font-size: 30px;
    //     }
    //     /deep/ .component-wrap {
    //         width: 100%;
    //         height: 400px;
    //         border: 1px solid red;
    //         color: rgb(148, 27, 27);
    //         background-color: cadetblue;
    //         -webkit-print-color-adjust: exact; //打印后背景色会失效
    //     }
}
</style>
