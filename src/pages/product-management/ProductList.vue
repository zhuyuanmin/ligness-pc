<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/product-management/product-list'">
      <SearchComp :formItemList="searchFields" />

      <el-table :data="tableData" max-height="400" class="table-class">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="productNum" label="产品编号" />
        <el-table-column prop="shortName" label="简称" />
        <el-table-column prop="brandInfoName" label="品牌" />
        <el-table-column prop="totalNumber" label="消耗次数" />
        <el-table-column prop="natureTypeName" label="卖品/非卖品" />
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
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox } from 'element-plus'
import { ref, reactive, watch } from "vue";
import { useRouter } from 'vue-router'

const tableData = reactive([
  {
    name: '门店培训五次',
    productNum: 'P1538796514674085889',
    shortName: '门店培训五次',
    brandInfoName: "深圳市欧迪丝生物科技有限公司",
    totalNumber: '12',
    natureType: 1,
    natureTypeName: "非卖品"
  },
])

const searchFields = reactive([
  {
    type: "input",
    label: "产品名称",
    placeholder: '产品名称/产品编码/简称',
    field: "name",
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
      } },
      { text: "重置", type: "reset", onClick: () => {} },
      { text: "添加产品", style: 'primary', onClick: () => viewRow() },
    ],
  },
]);

const showModal = ref(false)
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

const viewRow = (row, type) => {
  console.log(row);
  if (row) {
    router.push(`/product-management/product-list/detail/${row.id}?type=${type}`)
  } else {
    router.push('/product-management/product-list/detail')
  }
}

const handleStoreStatus = state => {}

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
    :deep(td.el-table__cell) {
      .is-text {
        padding: 0;
      }
    }
  }
}
</style>