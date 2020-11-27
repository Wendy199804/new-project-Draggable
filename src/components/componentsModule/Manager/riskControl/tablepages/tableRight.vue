<template>
  <div>
    <el-table :data="list1" style="width: 100%;margin-bottom:10px" height="200">
      <el-table-column prop="percent" label="收益率区间" align="center"></el-table-column>
      <el-table-column label="数量" align="center">
        <el-table-column prop="mnum" :label="managerInfo.name" align="center"></el-table-column>
        <el-table-column prop="bnum" :label="bname" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="占比(%)" align="center">
        <el-table-column prop="mper" :label="managerInfo.name" align="center"></el-table-column>
        <el-table-column prop="bper" :label="bname" align="center"></el-table-column>
      </el-table-column>
    </el-table>
     <el-table :data="list2" style="width: 100%" height="170">
      <el-table-column prop="title" label="收益率区间" align="center"></el-table-column>
      <el-table-column label="数量" align="center">
        <el-table-column prop="num1" :label="managerInfo.name" align="center"></el-table-column>
        <el-table-column prop="num2" :label="bname" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="占比(%)" align="center">
        <el-table-column prop="p1" :label="managerInfo.name" align="center"></el-table-column>
        <el-table-column prop="p2" :label="bname" align="center"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    list1: {
      type: Array,
      default: () => []
    },
    list2: {
      type: Array,
      default: () => []
    },
    bname:{
      type:String
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['managerInfo'])
  }
}
</script>

<style lang="scss">
</style>