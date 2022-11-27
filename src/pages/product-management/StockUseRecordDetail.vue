<template>
  <div class="content-card">
    <div class="card-header">
      <span>消耗明细详情</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <el-card class="my-card">
      <div class="box">
        <div class="left"><img :src="detailData.imgPath" alt="" srcset="" /></div>
        <div class="right">
          <table>
            <tr>
              <td class="props">商品编码：</td>
              <td>{{detailData.boxNo}}</td>
              <td class="props">产品编码：</td>
              <td>{{detailData.productNum}}</td>
            </tr>
            <tr>
              <td class="props">产品名称：</td>
              <td>{{detailData.productName}}</td>
              <td class="props">产品品牌：</td>
              <td>{{detailData.brandName}}</td>
            </tr>
            <tr>
              <td class="props">批次：</td>
              <td>{{detailData.batchNo}}</td>
              <td class="props">数字签名：</td>
              <td>{{enCode}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-card>
    <el-card>
      <template #header>
        <div><span>消耗情况</span></div>
      </template>
      <el-table :data="tableData" max-height="400" class="table-class">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="createTime" label="消耗时间">
          <template #default="scope">
            <span>{{scope.row.createTime && dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceNo" label="操作设备" />
        <el-table-column prop="updator" label="操作人" />
        <el-table-column prop="customName" label="操作门店" />
        <el-table-column prop="consumeRemainTimes" label="剩余次数" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ElButton, ElCard, ElTable, ElTableColumn } from "element-plus";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { consumeProductDetail } from './request/product'

const router = useRouter()
const route = useRoute()
const detailData = ref({})

const tableData = ref([]);

onMounted(() => {
  if (route.params.id) {
    consumeProductDetail({ batchId: route.params.id }).then(res => {
      detailData.value = res
      tableData.value = res.boxConsumes
    })
  }
})

const enCode = computed(() => {
  const { duration, boxNo, boxAvailableTimes } = detailData.value
  return window.btoa(`${duration || ''}@${boxNo || ''}@${boxAvailableTimes || ''}`)
})

</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 24px;
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
.my-card {
  margin-bottom: 24px;
}
.box {
  display: flex;
  .left {
    width: 300px;
    img {
      width: 100%;
    }
  }
  .right {
    flex: 1;
    margin-left: 24px;
    table {
      width: 100%;
      border-top: 1px solid #ebeef4;
      border-bottom: 1px solid #ebeef4;
      border-right: 1px solid #ebeef4;
      border-spacing: 0;
      tr {
        height: 38px;
        td {
          line-height: 38px;
          font-size: 14px;
          font-weight: normal;
          color: #909399;
          border-left: 1px solid #ebeef4;
          text-indent: 10px;
        }
        td.props {
          text-align: right;
          background-color: #fafafa;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:not(:last-child) {
          td {
            border-bottom: 1px solid #ebeef4;
          }
        }
      }
    }
  }
}
</style>