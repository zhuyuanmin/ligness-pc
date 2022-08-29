<template>
  <div class="container">
    <el-table
      :data="tableData"
      show-summary
      :summary-method="getSummaryFn"
      max-height="400"
      class="table-class"
    >
      <el-table-column prop="deviceName" label="设备型号" />
      <el-table-column prop="online" label="在线设备" />
      <el-table-column prop="offline" label="离线设备" />
      <el-table-column prop="fault" label="异常设备" />
      <el-table-column prop="total" label="设备总数" width="150">
        <template #default="scope">
          <span>{{ scope.row.deviceNum }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ElTable, ElTableColumn } from "element-plus";
import { reactive, ref } from "vue";

const tableData = reactive([
  {
    deviceName: "欧洲之星:时尚塑形大师",
    deviceCode: "68",
    deviceNum: 101,
    online: 0,
    offline: 101,
    fault: 0,
  },
  {
    deviceName: "欧洲之星:生命能量抗衰雕塑大师",
    deviceCode: "69",
    deviceNum: 52,
    online: 1,
    offline: 51,
    fault: 0,
  },
  {
    deviceName: "欧洲之星:生命能量抗衰雕塑大师plus",
    deviceCode: "80",
    deviceNum: 29,
    online: 1,
    offline: 28,
    fault: 0,
  },
  {
    deviceName: "MEI XIU SI",
    deviceCode: "81",
    deviceNum: 0,
    online: 0,
    offline: 0,
    fault: 0,
  },
]);

const getSummaryFn = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    let values = []
    if (index === 4) {
      values = data.map((item) => Number(item.deviceNum))
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
      sums[index] = 'N/A'
    }
  })

  return sums
};
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