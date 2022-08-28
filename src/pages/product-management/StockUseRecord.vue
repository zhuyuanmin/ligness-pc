<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/product-management/stock-use-record'">
      <SearchComp :formItemList="searchFields" :data="valueObj" ref="searchRef" />
      <ModalSelect v-model:showModal="showModal" :getStoreList="getStoreList" :value="selectValue" />

      <el-table :data="tableData" max-height="400" class="table-class">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="productSerialNum" label="商品编码" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="productModel" label="产品编码" />
        <el-table-column prop="productBrandName" label="品牌" />
        <el-table-column prop="productBatch" label="批次" />
        <el-table-column prop="depleteDate" label="消耗时间" />
        <!-- <el-table-column prop="totalNumber" label="使用次数" /> -->
        <el-table-column prop="lastNum" label="剩余次数" />
        <el-table-column prop="depleteStoreName" label="消耗门店" />
        <el-table-column prop="deviceCode" label="设备编号" />
        <el-table-column prop="modifierName" label="操作人" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button text type="primary" size="small" @click.prevent="viewRow(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="class-pagination"
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="100"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <template v-else><router-view /></template>
  </div>
</template>
<script setup>
import SearchComp from "@/components/SearchComp.vue";
import ModalSelect from "../net-management/components/device-list/ModalSelect.vue";
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox } from 'element-plus'
import { ref, reactive, watch } from "vue";
import { useRouter } from 'vue-router'

const showModalFn = () => {
  if (!searchRef.value) return
  searchRef.value.validFields().then(res => {
    showModal.value = true
    selectValue.value = res['storeId']
  })
}

const tableData = reactive([
  {
    productSerialNum: '1AA9918823854A69AAFD1D4498B61DE2',
    productName: "D系列氢润妍体亮肤按摩霜",
    productModel: "P14684158926720901131638932605318",
    productBrandName: "ODC",
    productBatch: "B1639535834806",
    depleteDate: "2022-08-28 02:35:51",
    lastNum: "4",
    depleteStoreName: "c06998",
    deviceCode: "odc195335374831617",
    modifierName: "成小梅",
  },
])

const searchFields = reactive([
  {
    type: "input",
    label: "产品名称",
    placeholder: '请输入产品名称',
    field: "productName",
  },
  {
    type: "input",
    label: "产品编码",
    placeholder: '请输入产品编码',
    field: "productModel",
  },
  {
    type: "select",
    label: "所属品牌",
    field: "productBrandId",
    optionList: [
      { label: "ODC", value: "1" },
      { label: "莱特妮丝", value: "2" },
    ],
  },
  {
    type: "date-range",
    label: "消耗时间",
    field: "consumeTime",
  },
  {
    type: "input",
    label: "设备编号",
    placeholder: '请输入设备编号',
    field: "deviceCode",
  },
  {
    type: "select-custom",
    label: "消耗门店",
    field: "storeId",
    placeholder: '请选择',
    onClick: showModalFn
  },
  {
    type: "btnList",
    children: [
      { text: "查询", type: "submit", onClick: values => {
        console.log(values)
      } },
      { text: "重置", type: "reset", onClick: () => {} },
    ],
  },
]);

const currentPage = ref(1)
const pageSize = ref(10)
const showModal = ref(false)
const valueObj = ref({})
const selectValue = ref('')
const searchRef = ref()
const router = useRouter()

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

watch(() => router.currentRoute.value, () => {
  const curRoute = router.currentRoute.value
  currentRoute.value = curRoute
})

const handleSizeChange = size => {
  console.log(size);
  pageSize.value = size
}
const handleCurrentChange = page => {
  console.log(page);
  currentPage.value = page
}

const viewRow = (row, type) => {
  if (row) {
    router.push(`/product-management/product-list/detail/${row.id}`)
  }
}

const getStoreList = list => {
  const result = list.map(item => {
    const { storeId: value, storeName: label } = item
    return { label, value }
  })
  valueObj.value = { storeId: result }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;

  .class-pagination {
    float: right;
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