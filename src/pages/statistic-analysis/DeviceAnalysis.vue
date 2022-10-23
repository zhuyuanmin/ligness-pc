<template>
  <div class="container">
    <el-table
      :data="tableData"
      show-summary
      :summary-method="getSummaryFn"
      max-height="400"
      class="table-class"
      v-loading="loading"
    >
      <el-table-column prop="deviceTypeId" label="设备编号" />
      <el-table-column prop="deviceTypeName" label="设备型号" />
      <el-table-column prop="onLineDeviceCount" label="在线设备" />
      <el-table-column prop="offLineDeviceCount" label="离线设备" />
      <el-table-column prop="total" label="设备总数" width="150">
        <template #default="scope">
          <span>{{ scope.row.deviceCount }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ElTable, ElTableColumn, ElLoading } from "element-plus";
import { ref, onMounted } from "vue";
import { getDeviceAnalysis } from './request/analysis'

const vLoading = ElLoading.directive

const loading = ref(false)

const tableData = ref([]);

const getSummaryFn = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    let values = []
    if (index === columns.length - 1) {
      values = data.map((item) => Number(item.deviceCount))
    } else {
      values = data.map((item) => Number(item[column.property]))
    }

    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

const fetchListData = params => {
  loading.value = true
  getDeviceAnalysis(params).then(res => {
    tableData.value = res || []
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  fetchListData({})
})
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;

  .table-class {
    margin-top: 16px;
    :deep(th.el-table__cell) {
      background-color: #fafafa;
    }
    :deep(td.el-table__cell) {
      .is-text {
        padding: 0;
      }
    }
  }
}
</style>