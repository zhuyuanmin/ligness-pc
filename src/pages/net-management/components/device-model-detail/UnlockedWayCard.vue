<template>
  <el-card class="content-card">
    <template #header>
      <div class="card-header">
        <span>仪器解锁</span>
      </div>
    </template>
    <div class="content-box">
      <div>
        <span>产品套盒解锁：</span>
        <el-switch
          v-model="switchValue"
          :disabled="route.query.type === 'view'"
        />
      </div>
      <el-table
        v-if="['edit', 'view'].includes(route.query.type)"
        :data="tableData"
        max-height="400"
        class="table-class"
        v-loading="listLoading"
      >
        <el-table-column prop="productId" label="产品编码" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column
          v-if="route.query.type === 'edit'"
          label="操作"
          width="200"
        >
          <template #header>
            <el-icon color="#409EFC" :size="20" @click="handleShowModal">
              <FolderAdd />
            </el-icon>
          </template>
          <template #default="scope">
            <el-button
              text
              type="danger"
              size="small"
              @click.prevent="deleteRow(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="class-pagination2"
        v-model:currentPage="currentPage2"
        v-model:page-size="pageSize2"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total2"
        @size-change="(size) => handleSizeChange('list', size)"
        @current-change="(page) => handleCurrentChange('list', page)"
      />
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
        <div class="search-input">
          <el-input
            v-model="inputValue"
            placeholder="请输入关键词回车搜索"
            clearable
            @keydown.enter="handleSearch"
          />
        </div>
        <el-table
          :data="tableData2"
          max-height="400"
          class="table-class"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          ref="myTable"
          :key="dateRef"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            type="index"
            label="序号"
            width="100"
          ></el-table-column>
          <el-table-column prop="productId" label="产品编码" width="200" />
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column
            prop="duration"
            label="时长（分钟）"
            width="200"
          >
            <template #default="scope">
              <el-input
                type="number"
                :value="scope.row.duration"
                @input="val => handleChange(val, scope.row)"
                @blur="handleBlur(scope.row)"
              ></el-input>
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
          small
          @size-change="(size) => handleSizeChange('modal', size)"
          @current-change="(page) => handleCurrentChange('modal', page)"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showModal = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleBindProduct"
            :loading="bindLoading"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import {
  ElCard,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElButton,
  ElIcon,
  ElDialog,
  ElInput,
  ElPagination,
  ElTag,
  ElMessageBox,
  ElLoading,
  ElMessage,
} from "element-plus";
import { ref, nextTick, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { FolderAdd } from "@element-plus/icons-vue";
import {
  getProductList,
  editProduct,
} from "@/pages/product-management/request/product";
import {
  deviceTypeProductList,
  unBindDeviceTypeProduct,
  deviceTypeBindProduct,
} from "../../request/deviceType";

const vLoading = ElLoading.directive;

const route = useRoute();
const switchValue = ref(true);
const showModal = ref(false);
const loading = ref(false);
const listLoading = ref(false);
const bindLoading = ref(false);
const inputValue = ref('')
const multipleSelection = ref([]);
const tableData = ref([]);
const tableData2 = ref([]);
const myTable = ref()
const dateRef = ref(Date.now())

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(50);
const currentPage2 = ref(1);
const pageSize2 = ref(10);
const total2 = ref(50);
// 记录原始值
let originList = ''

const handleSearch = () => {
  fetchProductList2({ keyword: inputValue.value })
}

const fetchProductList = (params) => {
  listLoading.value = true;
  deviceTypeProductList(params)
    .then((res) => {
      const { totalCount, pageList } = res || {};
      tableData.value = pageList;
      total2.value = totalCount;
    })
    .finally(() => {
      listLoading.value = false;
    });
};

const fetchProductList2 = (params, cb) => {
  loading.value = true;
  getProductList(params)
    .then((res) => {
      const { totalCount, pageList } = res || {};
      tableData2.value = pageList;
      originList = JSON.stringify(pageList)
      cb && cb(pageList);
      total.value = totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  if (route.params.id) {
    fetchProductList({ deviceTypeId: route.params.id });
  }
});

const handleBlur = row => {
  const jsonList = JSON.parse(originList)
  const result = jsonList.find(v => v.productId === row.productId)
  if (result.duration !== row.duration) {
    editProduct(row).then(() => {
      ElMessage.success('操作成功！')
      fetchProductList2({});
    })
  }
};

const handleChange = (val, row) => {
  row.duration = Number(val)
  dateRef.value = Date.now()
};

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};

const handleShowModal = () => {
  showModal.value = true;
  fetchProductList2({}, (dataList) => {
    const idList = dataList.map((item) =>
      item.deviceTypeProducts.map((v) => v.deviceTypeId)
    );
    const indexList = idList
      .map((ids, i) => {
        if (ids.includes(route.params.id)) {
          return i;
        }
      })
      .filter((v) => v !== undefined);
    nextTick(() => {
      indexList.forEach(i => {
        // myTable.value.clearSelection()
        myTable.value.toggleRowSelection(dataList[i], true);
      })
    });
  });
};

const handleSizeChange = (type, size) => {
  if (type === "modal") {
    currentPage.value = 1;
    pageSize.value = size;
    fetchProductList2({ currentPage: 1, pageSize: size });
  } else {
    currentPage2.value = 1;
    pageSize2.value = size;
    fetchProductList({
      currentPage: 1,
      pageSize: size,
      deviceTypeId: route.params.id,
    });
  }
};
const handleCurrentChange = (type, page) => {
  if (type === "modal") {
    currentPage.value = page;
    fetchProductList2({ currentPage: page, pageSize: pageSize.value });
  } else {
    currentPage2.value = page;
    fetchProductList({
      currentPage: page,
      pageSize: pageSize.value,
      deviceTypeId: route.params.id,
    });
  }
};

const handleBindProduct = () => {
  bindLoading.value = true;
  const list = multipleSelection.value.map((item) => {
    item.deviceTypeId = route.params.id;
    return item;
  });
  // 绑定产品
  deviceTypeBindProduct(list)
    .then(() => {
      ElMessage.success('操作成功！')
      showModal.value = false;
      if (route.params.id) {
        fetchProductList({ deviceTypeId: route.params.id });
      }
    })
    .finally(() => {
      bindLoading.value = false;
    });
};

const getSwitchValue = () => switchValue.value;

const deleteRow = (row) => {
  ElMessageBox.confirm("确定解绑该产品吗？", "提示", {
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    draggable: true,
    type: "warning",
  }).then(
    () => {
      // 解绑操作
      unBindDeviceTypeProduct({
        deviceTypeProductId: row.deviceTypeProductId,
      }).then(() => {
        ElMessage.success('操作成功！')
        if (route.params.id) {
          fetchProductList({ deviceTypeId: route.params.id });
        }
      });
    },
    () => {}
  );
};

defineExpose({ getSwitchValue });
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
    overflow: hidden;
    .table-class {
      margin-top: 16px;

      :deep(th.el-table__cell) {
        background-color: #fafafa;
      }
    }

    .class-pagination2 {
      float: right;
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
