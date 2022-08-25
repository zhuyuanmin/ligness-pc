<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/net-management/device-model-list'">
      <el-button type="primary" @click="viewRow()">新增</el-button>
      <el-table :data="tableData" max-height="400" class="table-class">
        <el-table-column prop="id" label="序号" width="100" />
        <el-table-column prop="modelName" label="型号名称" />
        <el-table-column prop="factoryName" label="生产厂家" />
        <el-table-column prop="brandName" label="所属品牌商" />
        <el-table-column prop="sum" label="设备数量" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
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
        :total="100"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
    <template v-else><router-view /></template>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElTableColumn, ElButton, ElPagination, ElMessageBox } from 'element-plus'

const tableData = reactive([
  {
    brandName: "深圳市欧迪丝生物科技有限公司",
    createTime: "2022-03-14T02:03:32.000+00:00",
    factoryName: "深圳市欧迪丝生物科技有限公司",
    id: 81,
    modelName: "MEI XIU SI",
    sum: 0,
  },
])

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
    router.push(`/net-management/device-model-list/detail/${row.id}?type=${type}`)
  } else {
    router.push('/net-management/device-model-list/detail')
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
      console.log(value);
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