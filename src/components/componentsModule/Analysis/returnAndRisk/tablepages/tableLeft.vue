<template>
    <div>
        <el-table
            :data="list"
            :span-method="objectSpanMethod"
            border
            height="380"
            style="width: 100%;"
            :key="key"
        >
            <el-table-column prop="year" label="年份" width="80" align="center" fixed :resizable="false"></el-table-column>
            <el-table-column
                prop="name"
                label="简称"
                width="100"
                :show-overflow-tooltip="true"
                align="center"
                fixed
                :resizable="false"
            ></el-table-column>
            <el-table-column v-if="thead[0]" :label="thead[0]" align="center"  :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m01">- -</div>
                    <div v-else>{{scope.row.m01}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[1]" :label="thead[1]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m02">- -</div>
                    <div v-else>{{scope.row.m02}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[2]" :label="thead[2]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m03">- -</div>
                    <div v-else>{{scope.row.m03}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[3]" :label="thead[3]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m04">- -</div>
                    <div v-else>{{scope.row.m04}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[4]" :label="thead[4]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m05">- -</div>
                    <div v-else>{{scope.row.m05}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[5]" :label="thead[5]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m06">- -</div>
                    <div v-else>{{scope.row.m06}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[6]" :label="thead[6]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m07">- -</div>
                    <div v-else>{{scope.row.m07}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[7]" :label="thead[7]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m08">- -</div>
                    <div v-else>{{scope.row.m08}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[8]" :label="thead[8]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m09">- -</div>
                    <div v-else>{{scope.row.m09}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[9]" :label="thead[9]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m10">- -</div>
                    <div v-else>{{scope.row.m10}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[10]" :label="thead[10]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m11">- -</div>
                    <div v-else>{{scope.row.m11}}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="thead[11]" :label="thead[11]" align="center" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="!scope.row.m12">- -</div>
                    <div v-else>{{scope.row.m12}}</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        thead: {
            type: Array,
            default: () => []
        },
    },
    watch:{
      thead(){
          this.key += 1 
      }
    },
    data() {
        return {
            key:0
        }
    },
    filters: {
        tofixed(num) {
            if (typeof num !== 'number') {
                num = Number(num)
            }
            return num.toFixed(2)
        }
    },
    methods: {
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ffffff;
}
</style>