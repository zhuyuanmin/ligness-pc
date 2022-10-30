<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/net-management/device-model-list'">
      <SearchComp :formItemList="searchFields" />

      <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="deviceTypeName" label="型号名称" />
        <!-- <el-table-column prop="factoryName" label="生产厂家" /> -->
        <el-table-column prop="brandName" label="品牌商" />
        <el-table-column prop="deviceCount" label="设备数量" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            <span>{{dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
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
import SearchComp from "@/components/SearchComp.vue"
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getDeviceTypeList, deleteDeviceType } from './request/deviceType'
import dayjs from 'dayjs'
import useDeviceTypeStore from '@/store/deviceTypeStore'

const deviceTypeStore = useDeviceTypeStore()

const vLoading = ElLoading.directive

const tableData = ref([])

const searchFields = reactive([
  {
    type: "input",
    label: "型号名称",
    field: "deviceTypeName",
    placeholder: '请输入型号名称',
  },
  {
    type: "btnList",
    children: [
      { text: "查询", type: "submit", onClick: values => {
        currentPage.value = 1
        fetchListData({ ...values, currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "重置", type: "reset", onClick: () => {
        currentPage.value = 1
        fetchListData({ currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "新增", style: 'primary', onClick: () => viewRow() },
    ],
  },
]);

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const router = useRouter()
const loading = ref(false)

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal
  if (newVal.fullPath === '/net-management/device-model-list') {
    fetchListData({})
  }
})

const fetchListData = params => {
  loading.value = true
  getDeviceTypeList(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
    deviceTypeStore.updateDeviceTypeList(pageList || [])
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  if (currentRoute.value.fullPath === '/net-management/device-model-list') {
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
    router.push(`/net-management/device-model-list/detail/${row.deviceTypeId}?type=${type}`)
  } else {
    router.push('/net-management/device-model-list/detail')
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
    ElMessageBox.prompt(
      '请输入密码',
      '',
      {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        draggable: true,
        type: 'info',
      }
    ).then(({ value }) =>  {
      if (value === '@ligness@#?!8888') {
        deleteDeviceType({ deviceTypeId: row.deviceTypeId }).then(() => {
          ElMessage.success('操作成功！')
          currentPage.value = 1
          fetchListData({ currentPage: 1, pageSize: pageSize.value })
        })
      } else {
        ElMessage.error('密码错误！')
      }
    }, () => {})
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