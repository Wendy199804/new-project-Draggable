<template>
  <!--  
    示例
    <Zjtabletitle>赎回费率</Zjtabletitle>
  -->
  <div>
    <span class="title">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
div {
  margin: 5px 0;
  padding-left: 10px;
  .title {
    font-size: 14px;
    color: #333333;
    position: relative;
    &::before {
      content: '';
      width: 4px;
      height: 14px;
      background: rgba(46, 80, 130, 1);
      position: absolute;
      top: 1px;
      left: -10px;
    }
  }
}
</style>