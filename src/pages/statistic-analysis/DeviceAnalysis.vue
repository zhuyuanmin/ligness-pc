<template>
  <div class="container">
    <div id="main"></div>
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
import * as echarts from 'echarts';
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

const fetchListData = (params, cb) => {
  loading.value = true
  getDeviceAnalysis(params).then(res => {
    tableData.value = res || []
    cb && cb(res || [])
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  fetchListData({}, list => {
    const myChart = echarts.init(document.getElementById('main'));
    console.log(list);
    const deviceName = list.map(v => v.deviceTypeName)
    const onLine = list.map(v => v.onLineDeviceCount)
    const offLine = list.map(v => v.offLineDeviceCount)

    myChart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: deviceName
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '在线设备',
          type: 'bar',
          stack: 'count',
          barWidth: 30,
          emphasis: {
            focus: 'series'
          },
          data: onLine
        },
        {
          name: '离线设备',
          type: 'bar',
          stack: 'count',
          barWidth: 30,
          emphasis: {
            focus: 'series'
          },
          data: offLine
        },
      ]
    });
  })

})
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;
  #main {
    width: 600px;
    height: 350px;
    margin: 0 auto;
  }

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