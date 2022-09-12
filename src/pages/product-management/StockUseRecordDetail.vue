<template>
  <div class="content-card">
    <div class="card-header">
      <span>消耗明细详情</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <el-card class="my-card">
      <div class="box">
        <div class="left"><img src="https://picsum.photos/300/200" alt="" srcset="" /></div>
        <div class="right">
          <table>
            <tr>
              <td class="props">商品编码：</td>
              <td>{{'1AA9918823854A69AAFD1D4498B61DE2'}}</td>
              <td class="props">产品编码：</td>
              <td>{{'P14684158926720901131638932605318'}}</td>
            </tr>
            <tr>
              <td class="props">产品名称：</td>
              <td>{{'D系列氢润妍体亮肤按摩霜'}}</td>
              <td class="props">产品品牌：</td>
              <td>{{'ODC'}}</td>
            </tr>
            <tr>
              <td class="props">批次：</td>
              <td>{{'B1639535834806'}}</td>
              <td class="props">数字签名：</td>
              <td>{{'01TnpnME@&az!}'}}</td>
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
        <el-table-column prop="createTime" label="消耗时间" />
        <el-table-column prop="deviceNo" label="操作设备" />
        <el-table-column prop="updater" label="操作人" />
        <el-table-column prop="storeName" label="操作门店" />
        <el-table-column prop="consumeRemainTimes" label="剩余次数" />
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { ElButton, ElCard, ElTable, ElTableColumn } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { viewProduct, consumeProduct } from './request/product'

const router = useRouter()
const route = useRoute()

const tableData = reactive([
  {
    createTime: "2022-08-28 02:35:51",
    consumeRemainTimes: "4",
    storeName: "c06998",
    deviceNo: "odc195335374831617",
    updater: "成小梅",
  },
]);

onMounted(() => {
  if (route.params.id) {
    viewProduct(route.params.id).then(res => {
      console.log(res)
    })

    consumeProduct(route.params.id).then(res => {
      console.log(res)
    })
  }
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