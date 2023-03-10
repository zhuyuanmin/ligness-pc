<template>
  <div class="container">
    <div v-if="tableData.length > 0" id="main"></div>
    <el-table
      :data="tableData"
      show-summary
      :summary-method="getSummaryFn"
      max-height="460"
      class="table-class"
      v-loading="loading"
    >
      <el-table-column prop="deviceTypeName" label="设备型号" />
      <el-table-column prop="onLineDeviceCount" label="在线设备" />
      <el-table-column prop="offLineDeviceCount" label="离线设备" />
      <el-table-column prop="exDeviceCount" label="异常设备" />
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
import { ref, onMounted, nextTick } from "vue";
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
    nextTick(() => {
      const myChart = echarts.init(document.getElementById('main'));
      const deviceName = list.map(v => v.deviceTypeName)
      const onLine = list.map(v => v.onLineDeviceCount)
      const offLine = list.map(v => v.offLineDeviceCount)
      const exLine = list.map(v => v.exDeviceCount)

      myChart.setOption({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['在线设备', '离线设备', '异常设备']
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
            data: deviceName,
            axisLabel: {
              rotate: 45
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '设备数（个）',
            minInterval: 1,
          }
        ],
        series: [
          {
            name: '在线设备',
            type: 'bar',
            stack: 'online',
            barWidth: 30,
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: '#5CBA33'
            },
            data: onLine
          },
          {
            name: '离线设备',
            type: 'bar',
            stack: 'offline',
            barWidth: 30,
            itemStyle: {
              color: '#F36161'
            },
            emphasis: {
              focus: 'series'
            },
            data: offLine
          },
          {
            name: '异常设备',
            type: 'bar',
            stack: 'fail',
            barWidth: 30,
            itemStyle: {
              color: '#85888E'
            },
            emphasis: {
              focus: 'series'
            },
            data: exLine
          },
        ],
        dataZoom: [
          {
            type: 'inside'
          }
        ]
      });
    })
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