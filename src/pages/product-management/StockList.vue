<template>
  <div class="container">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="库存管理" name="first">
        <StockA :switchTab="handleSwitchTab" />
      </el-tab-pane>
      <el-tab-pane label="出入库记录" name="second">
        <StockB :searchData="searchData" :changeDataFn="changeDataFn" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ElTabs, ElTabPane } from 'element-plus'
import StockA from './components/stock-list/StockA.vue'
import StockB from './components/stock-list/StockB.vue'
import { ref } from 'vue'
const activeName = ref('first')
const searchData = ref({})

const handleSwitchTab = (tab, data) => {
  activeName.value = tab
  searchData.value = data
}

const changeDataFn = () => {
  searchData.value = {}
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;

  :deep(.class-pagination) {
    float: right;
  }

  :deep(.table-class) {
    margin-top: 16px;
    th.el-table__cell {
      background-color: #fafafa;
    }
    td.el-table__cell {
      .is-text {
        padding: 0;
      }
    }
  }
}
</style>