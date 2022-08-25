<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/net-management/device-list'">
      <SearchComp :formItemList="searchFields" :data="valueObj" ref="searchRef" />
      <ModalSelect v-model:showModal="showModal" :getStoreList="getStoreList" :value="selectValue" />

      <el-table :data="tableData" max-height="400" class="table-class">
        <el-table-column prop="id" label="序号" width="100" />
        <el-table-column prop="name" label="设备型号" />
        <el-table-column prop="code" label="设备编号" />
        <el-table-column prop="brandName" label="品牌商" width="100" />
        <el-table-column prop="brandMerchantName" label="品牌" />
        <el-table-column prop="storeName" label="绑定门店" />
        <el-table-column prop="factoryName" label="厂家" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-button v-if="scope.row.status === 1" type="success" plain size="small">在线</el-button>
            <el-button v-else type="danger" plain size="small">离线</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="出厂时间" width="180" />
        <el-table-column prop="offLineTime" label="下线时间" width="180" />
        <el-table-column fixed="right" label="操作" width="200">
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
import ModalSelect from "./components/device-list/ModalSelect.vue";
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
    id: '464',
    name: '欧洲之星:生命能量抗衰雕塑大师plus',
    code: 'odc213668558077953',
    brandName: "深圳市欧迪丝生物科技有限公司",
    brandMerchantName: 'ODC',
    storeName: 'c88888',
    factoryName: "深圳市欧迪丝生物科技有限公司",
    status: 1,
    createTime: "2022-03-14T02:03:32.000+00:00",
    offLineTime: "2022-08-14T02:03:32.000+00:00",
  },
])

const searchFields = reactive([
  {
    type: "input",
    label: "设备编号",
    field: "code",
  },
  {
    type: "select",
    label: "设备型号",
    field: "modelId",
    optionList: [
      { label: "MEI XIU SI", value: "81" },
      { label: "欧洲之星", value: "80" },
    ],
  },
  {
    type: "select",
    label: "所属厂家",
    field: "factoryId",
    optionList: [
      { label: "莱特妮丝", value: "1" },
      { label: "ODC", value: "2" },
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
      } },
      { text: "重置", type: "reset", onClick: () => {} },
      { text: "绑定设备", style: 'primary', onClick: () => viewRow() },
    ],
  },
]);

const showModal = ref(false)
const searchRef = ref()
const valueObj = ref({})
const selectValue = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
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

const getStoreList = list => {
  const result = list.map(item => {
    const { storeId: value, storeName: label } = item
    return { label, value }
  })
  valueObj.value = { storeId: result }
}

const viewRow = (row, type) => {
  console.log(row);
  if (row) {
    router.push(`/net-management/device-list/detail/${row.id}?type=${type}`)
  } else {
    router.push('/net-management/device-list/detail')
  }
}

const deleteRow = row => {
  console.log(row);
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
  }
}
</style>