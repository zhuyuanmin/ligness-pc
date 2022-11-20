<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/product-management/stock-use-record'">
      <SearchComp :formItemList="searchFields" :data="valueObj" ref="searchRef" />
      <ModalSelect v-model:showModal="showModal" :getStoreList="getStoreList" :value="selectValue" />

      <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="boxNo" label="商品编码" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="productNum" label="产品编码" />
        <el-table-column prop="brandName" label="品牌" />
        <el-table-column prop="batchNo" label="批次" />
        <el-table-column prop="createTime" label="消耗时间" />
        <!-- <el-table-column prop="totalNumber" label="使用次数" /> -->
        <el-table-column prop="consumeRemainTimes" label="剩余次数" />
        <el-table-column prop="storeName" label="消耗门店" />
        <el-table-column prop="deviceNo" label="设备编号" />
        <el-table-column prop="updater" label="操作人" />
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
        :total="total"
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
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { consumeProduct } from './request/product'

const vLoading = ElLoading.directive

const showModalFn = () => {
  if (!searchRef.value) return
  searchRef.value.validFields().then(res => {
    showModal.value = true
    selectValue.value = res['storeId']
  })
}

const tableData = ref([])

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
    field: "productNum",
  },
  {
    type: "select",
    label: "所属品牌",
    field: "brandId",
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
    field: "deviceId",
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
        currentPage.value = 1
        const { consumeTime, ...rest } = values
        let obj = {}
        if (consumeTime) {
          obj = {
            startTime: dayjs(consumeTime[0]).valueOf(),
            endTime: dayjs(consumeTime[1]).valueOf()
          }
        }

        fetchListData({ ...rest, ...obj, storeId: values.storeId?.[0]?.value, currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "重置", type: "reset", onClick: () => {
        currentPage.value = 1
        fetchListData({ currentPage: 1, pageSize: pageSize.value })
      } },
    ],
  },
]);

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const showModal = ref(false)
const loading = ref(false)
const valueObj = ref({})
const selectValue = ref('')
const searchRef = ref()
const router = useRouter()

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

const fetchListData = params => {
  loading.value = true
  consumeProduct(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
  }).finally(() => {
    loading.value = false
  })
}

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal
})

onMounted(() => {
  if (currentRoute.value.fullPath === '/product-management/stock-use-record') {
    fetchListData({})
  }
})

const handleSizeChange = size => {
  currentPage.value = 1
  pageSize.value = size
  fetchListData({ currentPage: 1, pageSize: size })
}
const handleCurrentChange = page => {
  currentPage.value = page
  fetchListData({ currentPage: page, pageSize: pageSize.value })
}

const viewRow = (row, type) => {
  if (row) {
    router.push(`/product-management/stock-use-record/detail/${row.batchId}`)
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