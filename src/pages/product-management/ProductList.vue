<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/product-management/product-list'">
      <SearchComp :formItemList="searchFields" />

      <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
        <el-table-column prop="productNo" label="序号" width="100" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="productNum" label="产品编号" />
        <el-table-column prop="productShortForm" label="简称" />
        <el-table-column prop="brandName" label="品牌" />
        <el-table-column prop="productInventory" label="消耗次数" />
        <!-- <el-table-column prop="natureTypeName" label="卖品/非卖品" /> -->
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button v-if="scope.row.status === 1" text type="danger" size="small" @click.prevent="handleStoreStatus(0)">下架</el-button>
            <el-button v-else text type="primary" size="small" @click.prevent="handleStoreStatus(1)">上架</el-button>
            <el-button text type="primary" size="small" @click.prevent="viewRow(scope.row, 'edit')">编辑</el-button>
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
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { getProductList, deleteProduct, editProduct } from './request/product'

const vLoading = ElLoading.directive

const tableData = ref([
  {
    productNo: '1321',
    productName: '门店培训五次',
    productNum: 'P1538796514674085889',
    productShortForm: '门店培训五次',
    brandName: "深圳市欧迪丝生物科技有限公司",
    productInventory: '12',
    productType: 1,
  },
])

const searchFields = reactive([
  {
    type: "input",
    label: "产品名称",
    placeholder: '产品名称/产品编码/简称',
    field: "productName",
  },
  {
    type: "select",
    label: "产品类型",
    field: "productCategory",
    optionList: [
      { label: "普通产品", value: "1" },
      { label: "服务耗材", value: "2" },
      { label: "院装产品", value: "3" },
      { label: "套盒产品", value: "4" },
    ],
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
      { text: "添加产品", style: 'primary', onClick: () => viewRow() },
    ],
  },
]);

const currentPage = ref(1)
const pageSize = ref(10)
const router = useRouter()
const total = ref(100)
const loading = ref(false)

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

const fetchListData = params => {
  loading.value = true
  getProductList(params).then(res => {
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
  if (currentRoute.value.fullPath === '/product-management/product-list') {
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
  console.log(row);
  if (row) {
    router.push(`/product-management/product-list/detail/${row.productNum}?type=${type}`)
  } else {
    router.push('/product-management/product-list/detail')
  }
}

const handleStoreStatus = state => {
  editProduct(state).then(() => {
    ElMessage.success('操作成功！')
    fetchListData({ currentPage: page, pageSize: pageSize.value })
  })
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
    deleteProduct(row.deviceNo).then(() => {
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