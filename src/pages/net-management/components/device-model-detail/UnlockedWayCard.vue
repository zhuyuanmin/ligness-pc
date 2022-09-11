<template>
  <el-card class="content-card">
    <template #header>
      <div class="card-header">
        <span>仪器解锁</span>
      </div>
    </template>
    <div class="content-box">
      <div>
        <span>产品套盒解锁：</span><el-switch v-model="switchValue" :disabled="route.query.type === 'view'"/>
      </div>
      <el-table v-if="['edit', 'view'].includes(route.query.type)" :data="tableData" max-height="400" class="table-class">
        <el-table-column prop="productId" label="产品ID" width="200" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column v-if="route.query.type === 'edit'" label="操作" width="200">
          <template #header>
            <el-icon color="#409EFC" :size="20" @click="showModal = true"><FolderAdd /></el-icon>
          </template>
          <template #default="scope">
            <el-button text type="danger" size="small" @click.prevent="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="showModal"
      title="选择产品"
      width="50%"
      :before-close="handleClose"
      custom-class="modal-class"
      append-to-body
      draggable
    >
      <div class="content">
        <div class="search-input"><el-input v-model="inputValue" placeholder="请输入关键词回车搜索" clearable /></div>
        <div class="select-list-block">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            class="tag-class"
            closable
          >
            {{ tag.name }}
          </el-tag>
        </div>
        <el-table :data="tableData2" max-height="400" class="table-class" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="productId" label="产品ID" width="200" />
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="theoryDuration" label="时长（分钟）" width="200">
            <template #default="scope">
              <el-input type="number" :value="scope.row" @change="handleChange()"></el-input>
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
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="showModal = false">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ElCard, ElSwitch, ElTable, ElTableColumn, ElButton, ElIcon, ElDialog, ElInput, ElPagination, ElTag, ElMessageBox } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FolderAdd } from '@element-plus/icons-vue'
import { getProductList } from '@/pages/product-management/request/product'

const route = useRoute();
const switchValue = ref(true);
const showModal = ref(false);
const multipleSelection = ref([])
const tableData = ref([
  { productId: 13, productName: "B系列氢润女性胸部凝胶" },
  { productId: 14, productName: "B系列氢润女性胸部凝胶" },
  { productId: 15, productName: "B系列氢润女性胸部凝胶" },
  { productId: 16, productName: "B系列氢润女性胸部凝胶" },
  { productId: 17, productName: "B系列氢润女性胸部凝胶" },
  { productId: 18, productName: "B系列氢润女性胸部凝胶" },
  { productId: 19, productName: "B系列氢润女性胸部凝胶" },
  { productId: 20, productName: "B系列氢润女性胸部凝胶" },
]);
const tableData2 = reactive([
  { productId: 13, productName: "B系列氢润女性胸部凝胶" },
  { productId: 14, productName: "B系列氢润女性胸部凝胶" },
  { productId: 15, productName: "B系列氢润女性胸部凝胶" },
  { productId: 16, productName: "B系列氢润女性胸部凝胶" },
  { productId: 17, productName: "B系列氢润女性胸部凝胶" },
  { productId: 18, productName: "B系列氢润女性胸部凝胶" },
  { productId: 19, productName: "B系列氢润女性胸部凝胶" },
  { productId: 20, productName: "B系列氢润女性胸部凝胶" },
]);

const tags = tableData.value.map(v => ({ name: v.productName }))

const currentPage = ref(1)
const pageSize = ref(10)

const fetchProductList = params => {
  getProductList(params).then(res => {
    tableData.value = res
  })
}

onMounted(() => {
  if (route.params.id) {
    fetchProductList({})
  }
})

const handleChange = () => {}
const handleSelectionChange = val => {
  multipleSelection.value = val
}

const handleSizeChange = size => {
  console.log(size);
  pageSize.value = size
}
const handleCurrentChange = page => {
  console.log(page);
  currentPage.value = page
}

const getSwitchValue = () => switchValue.value

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

defineExpose({ getSwitchValue })
</script>
<style lang="scss" scoped>
.content-card {
  margin-top: 24px;
  :deep(.el-card__header) {
    padding: 16px;
    border-bottom: 1px solid #e0e2ea;
  }
  :deep(.el-card__body) {
    padding: 16px;
  }
  .content-box {
    .table-class {
      margin-top: 16px;
      :deep(th.el-table__cell) {
        background-color: #fafafa;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.modal-class {
  .search-input {
    position: absolute;
    top: 16px;
    right: 50px;
  }
  .class-pagination {
    position: absolute;
    bottom: 22px;
  }

  .table-class {
    margin-top: 16px;
    :deep(.el-table__header th.el-table__cell) {
      background-color: #fafafa;
    }
  }
  .tag-class {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>