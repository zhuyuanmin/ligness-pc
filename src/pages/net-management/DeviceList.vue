<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/net-management/device-list'">
      <SearchComp :formItemList="searchFields" :data="valueObj" ref="searchRef" />
      <ModalSelect v-model:showModal="showModal" :getStoreList="getStoreList" :value="selectValue" />

      <el-table :data="tableData" max-height="460" class="table-class" v-loading="loading">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="deviceTypeName" label="设备型号" />
        <el-table-column prop="deviceNo" label="设备编号" />
        <el-table-column prop="brandName" label="品牌商" width="100" />
        <!-- <el-table-column prop="brandMerchantName" label="品牌" /> -->
        <el-table-column prop="customName" label="绑定门店" />
        <!-- <el-table-column prop="factoryName" label="厂家" /> -->
        <el-table-column prop="deviceStatus" label="状态">
          <template #default="scope">
            <el-button v-if="scope.row.deviceStatus === 1" type="success" plain size="small">在线</el-button>
            <el-button v-else-if="scope.row.deviceStatus === 0" type="danger" plain size="small">离线</el-button>
            <el-button v-else type="info" plain size="small">异常</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="出厂时间" width="180">
          <template #default="scope">
            <span>{{scope.row.createTime && dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="下线时间" width="180">
          <template #default="scope">
            <span>{{scope.row.updateTime && dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button text type="primary" size="small" @click.prevent="viewRow(scope.row, 'edit')">编辑</el-button>
            <el-button text type="primary" size="small" @click.prevent="viewRow(scope.row, 'view')">查看</el-button>
            <el-button text type="danger" size="small" @click.prevent="deleteRow(scope.row)">删除</el-button>
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
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { getDeviceList, deleteDevice } from './request/device'
import useDeviceTypeStore from '@/store/deviceTypeStore'

const deviceTypeStore = useDeviceTypeStore()

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
    label: "设备编号",
    field: "deviceNo",
  },
  {
    type: "select",
    label: "设备型号",
    field: "deviceTypeId",
    optionList: [],
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
        currentPage.value = 1
        fetchListData({ ...values, storeId: values.storeId?.[0]?.value, currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "重置", type: "reset", onClick: () => {
        currentPage.value = 1
        fetchListData({ currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "绑定设备", style: 'primary', onClick: () => viewRow() },
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
const total = ref(50)
const router = useRouter()

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

const fetchListData = params => {
  loading.value = true
  getDeviceList(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
  }).finally(() => {
    loading.value = false
  })
}

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal

  if (newVal.fullPath === '/net-management/device-list') {
    fetchListData({})

    const result = searchFields.find(v => v.field === 'deviceTypeId')
    if (deviceTypeStore.deviceTypeList.length > 0) {
      result.optionList = deviceTypeStore.deviceTypeList.map(v => ({
        label: v.deviceTypeName,
        value:v.deviceTypeId
      }))
    }
  }
})

onMounted(() => {
  if (currentRoute.value.fullPath === '/net-management/device-list') {
    fetchListData({})

    const result = searchFields.find(v => v.field === 'deviceTypeId')
    if (deviceTypeStore.deviceTypeList.length > 0) {
      result.optionList = deviceTypeStore.deviceTypeList.map(v => ({
        label: v.deviceTypeName,
        value:v.deviceTypeId
      }))
    } else {
      deviceTypeStore.fetchDeviceTypeList(list => {
        result.optionList = list.map(v => ({
          label: v.deviceTypeName,
          value:v.deviceTypeId
        }))
      })
    }
  } else {
    deviceTypeStore.fetchDeviceTypeList()
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

const getStoreList = list => {
  const result = list.map(item => {
    const { storeId: value, storeName: label } = item
    return { label, value }
  })
  valueObj.value = { storeId: result }
}

const viewRow = (row, type) => {
  if (row) {
    router.push(`/net-management/device-list/detail/${row.deviceId}?type=${type}`)
  } else {
    router.push('/net-management/device-list/detail')
  }
}

const deleteRow = row => {
  ElMessageBox.confirm(
    '此操作将永久删除该项，是否继续？',
    '提示',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      draggable: true,
      type: 'warning',
    }
  ).then(() => {
    // 删除操作
    deleteDevice({deviceId: row.deviceId}).then(() => {
      ElMessage.success('操作成功！')
      currentPage.value = 1
      fetchListData({ currentPage: 1, pageSize: pageSize.value })
    })
  }, () => {})
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