<template>
  <!-- 
    示例：
      <Zjrate :yaernum="3" :starlevel="'2'" :yearbg="'#FF6673'" :starbg="'#FFE0E2'" ref="zjrate"></Zjrate>
      <Zjrate :yaernum="5" :starlevel="'暂无评级'" ref="zjrate"></Zjrate>
  -->

  <div class="zjrate">
    <span :style="{background:myyearbg,color:myyearcolor }" v-if="!bg">{{yaernum}}年</span>
    <span :class="hasPadding?'hasPadding':'noPadding'" :style="{background:mystarbg}">
      <span v-if="!hasPadding">
        <el-rate
          v-model="mystarlevel"
          :allow-half="true"
          disabled 
          :colors="[myyearbg,myyearbg,myyearbg]"
          :disabled-void-color="unicon"
        ></el-rate>
      </span>
      <span v-if="hasPadding">{{defaultlevel}}</span>
    </span>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    /**
     * 年份
     */
    yaernum: {
      type: Number
    },
    /**
     * 星级
     */
    starlevel: {},
    bg: {}
  },
  data() {
    return {
      value: 0,
      hasPadding: false,
      unicon: '#bfbfbf',
      defaultlevel: '暂无星级',
      mystarbg: '',
      myyearcolor: '#fff'
    }
  },
  //   filters: {
  //   starlevel: function(value) {
  //       if (isNaN(value)) {
  //         this.hasPadding = true
  //         return this.starlevel
  //       } else {
  //         this.hasPadding = false
  //         this.value = Number(this.starlevel)
  //         return this.starlevel
  //       }
  //     }
  // },

  computed: {
    mystarlevel: {
      get() {
        if (isNaN(this.starlevel)) {
          this.hasPadding = true
          this.defaultlevel = this.starlevel
          return 0
        } else {
          this.hasPadding = false
          this.value = Number(this.starlevel)
          return Number(this.starlevel)
        }
      },
      set(newval) {}
    },
    myyearbg: {
      get() {
        if (isNaN(this.starlevel)) {
          return '#999'
        } else {
          if (this.yaernum === 5) {
            if (this.bg === 'transparent') {
              this.mystarbg = 'transparent'
            } else {
              this.mystarbg = 'rgba(241,111,92,0.2)'
            }
            return '#FF7952'
          } else if (this.yaernum === 3) {
            if (this.bg === 'transparent') {
              this.mystarbg = 'transparent'
            } else {
              this.mystarbg = 'rgba(248,80,50,0.2)'
            }
            return '#FF6673'
          }
        }
      },
      set(newval) {}
    }
  },

  // watch: {
  //   starlevel: function() {
  //     if (isNaN(this.starlevel)) {
  //       this.hasPadding = true
  //     } else {
  //       this.hasPadding = false
  //       this.value = Number(this.starlevel)
  //     }
  //   }
  // },
  methods: {
    // starLevel(val){
    //   if (isNaN(this.starlevel)) {
    //     this.hasPadding = true
    //   } else {
    //     this.hasPadding = false
    //     this.value = Number(this.starlevel)
    //   }
    // }
  },
  mounted() {
    // console.log(this.starlevel)
  }
}
</script>

<style lang="scss" scoped>
.zjrate {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 24px;
  box-sizing: border-box;
  height: 100%;

  & > span {
    height: 18px;
    font-size: 12px;
    display: inline-block;
    overflow: hidden;
  }
  & > span:nth-child(1) {
    // background-color: #999999;
    // color: #ffffff;
    float: left;
    padding: 3px;
    border-radius: 2px 0 0 2px;
    line-height: 15px;
  }
  & > span:nth-child(2) {
    background-color: #eaeaea;
    color: #9b9b9b;
    border-radius: 0 2px 2px 0;
    padding-right: 5px;
  }
  /deep/ .el-rate__icon {
    margin: 0;
    margin-top: 1px;
  }
  .hasPadding {
    padding: 3px;
  }
  .noPadding {
    padding: 0px;
  }
  /deep/ .el-rate {
    margin-top: -1px;
  }
}
</style>