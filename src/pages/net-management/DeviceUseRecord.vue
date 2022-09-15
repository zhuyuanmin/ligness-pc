<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/net-management/device-use-record'">
      <SearchComp :formItemList="searchFields" :data="valueObj" ref="searchRef" />
      <ModalSelect v-model:showModal="showModal" :getStoreList="getStoreList" :value="selectValue" />

      <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
        <el-table-column prop="deviceOrderNo" label="序号" width="100" />
        <el-table-column prop="deviceTypeName" label="设备型号" />
        <el-table-column prop="deviceNo" label="设备编号" />
        <el-table-column prop="storeName" label="绑定门店" />
        <el-table-column prop="unlockTime" label="解锁时间" />
        <el-table-column prop="durationTime" label="使用时长/解锁时长(分钟)">
          <template #default="scope">
            <span>{{scope.row.duration}}</span>/<span>{{scope.row.theoryDuration}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unlockType" label="解锁方式" width="150">
          <template #default>
            <el-button plain size="small" type="primary">产品套盒解锁</el-button>
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
import ModalSelect from "./components/device-list/ModalSelect.vue";
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessage, ElLoading } from 'element-plus'
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { usageDevice } from './request/device'

const vLoading = ElLoading.directive

const showModalFn = () => {
  if (!searchRef.value) return
  searchRef.value.validFields().then(res => {
    showModal.value = true
    selectValue.value = res['storeId']
  })
}

const tableData = reactive([
  {
    deviceOrderNo: '464',
    deviceTypeName: '欧洲之星:生命能量抗衰雕塑大师',
    deviceNo: 'odc213668558077953',
    storeName: "s00442",
    unlockTime: "2022-03-14 02:03:32",
    closeLockTime: "2022-03-14 02:03:32",
    unlockType: 1,
    duration: 45,
    theoryDuration: 45,
  },
])

const searchFields = reactive([
  {
    type: "input",
    label: "设备编号",
    field: "deviceNo",
  },
  {
    type: "select",
    label: "设备型号",
    field: "deviceTypeId",
    optionList: [
      { label: "MEI XIU SI", value: "81" },
      { label: "欧洲之星", value: "80" },
    ],
  },
  {
    type: "select-custom",
    label: "绑定门店",
    field: "storeId",
    placeholder: '请选择',
    onClick: showModalFn
  },
  {
    type: "btnList",
    children: [
      { text: "查询", type: "submit", onClick: values => {
        console.log(values)
        currentPage.value = 1
        fetchListData({ ...values, currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "重置", type: "reset", onClick: () => {
        currentPage.value = 1
        fetchListData({ currentPage: 1, pageSize: pageSize.value })
      } },
    ],
  },
]);

const showModal = ref(false)
const loading = ref(false)
const searchRef = ref()
const valueObj = ref({})
const selectValue = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const router = useRouter()

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

const fetchListData = params => {
  loading.value = true
  usageDevice(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  if (currentRoute.value.fullPath === '/net-management/device-use-record') {
    fetchListData({})
  }
})

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal
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
  }
}
</style>