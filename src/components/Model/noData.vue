<template>
  <div class="nodata" v-if="show" >
    {{text}}
  </div>
</template>

<script>
export default {
  name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        text:{
          type: String,
            default: '暂无数据'
        }
    },
}
</script>

<style lang="scss">
  .nodata{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    z-index: 1000; 
  }
</style>