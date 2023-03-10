<template>
  <SearchComp :formItemList="searchFields" />

  <el-table
    :data="tableData"
    max-height="460"
    class="table-class"
    v-loading="loading"
  >
    <el-table-column type="index" label="序号" width="100" />
    <el-table-column prop="productName" label="产品名称" />
    <el-table-column prop="productNum" label="产品编号" />
    <el-table-column prop="productConsumeTimes" label="消耗次数" />
    <el-table-column prop="productInventory" label="可用库存" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button
          text
          type="primary"
          size="small"
          @click.prevent="handleSwitchTab(scope.row)"
          >出入库明细</el-button
        >
        <el-button
          text
          type="primary"
          size="small"
          @click.prevent="handleShowModal(scope.row)"
          >入库</el-button
        >
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

  <el-dialog
    v-model="showModal"
    :title="title"
    width="50%"
    custom-class="modal-class-store"
    @close="showModal = false"
    append-to-body
    draggable
  >
    <div class="content">
      <SearchComp :formItemList="dialogFields" ref="dialogRef" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import SearchComp from "@/components/SearchComp.vue";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElDialog,
  ElInput,
  ElLoading,
  ElMessage,
} from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { getProductList, entryProductStore } from "../../request/product";

const vLoading = ElLoading.directive;

const props = defineProps({
  switchTab: {
    type: Function,
  },
});

const tableData = ref([]);

const checkAge = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const searchFields = reactive([
  {
    type: "input",
    label: "产品名称",
    placeholder: "请输入产品名称",
    field: "productName",
  },
  {
    type: "input",
    label: "产品编号",
    placeholder: "请输入产品编号",
    field: "productNum",
  },
  {
    type: "btnList",
    children: [
      {
        text: "查询",
        type: "submit",
        onClick: (values) => {
          currentPage.value = 1;
          fetchListData({
            ...values,
            currentPage: 1,
            pageSize: pageSize.value,
          });
        },
      },
      {
        text: "重置",
        type: "reset",
        onClick: () => {
          currentPage.value = 1;
          fetchListData({ currentPage: 1, pageSize: pageSize.value });
        },
      },
    ],
  },
]);
const dialogFields = reactive([
  {
    type: "number",
    label: "入库数量",
    field: "storeNum",
    required: true,
    rules: [
      {
        required: true,
        message: "请输入入库数量",
        trigger: ["blur", "change"],
      },
      {
        validator: checkAge,
        message: "入库数量必须大于等于1",
        trigger: "blur",
      },
    ],
  },
]);

const currentPage = ref(1);
const pageSize = ref(10);
const showModal = ref(false);
const title = ref("");
const dialogRef = ref();
const loading = ref(false);
const total = ref(100);
const currentRow = ref({});

const handleSizeChange = (size) => {
  currentPage.value = 1;
  pageSize.value = size;
  fetchListData({ currentPage: 1, pageSize: size });
};
const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchListData({ currentPage: page, pageSize: pageSize.value });
};

const fetchListData = (params) => {
  loading.value = true;
  getProductList(params)
    .then((res) => {
      const { currentPage, pageSize, pageCount, totalCount, pageList } =
        res || {};
      tableData.value = pageList;
      total.value = totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  fetchListData({});
});

const handleSwitchTab = (row) => {
  props.switchTab("second", row);
};

const handleShowModal = (row) => {
  showModal.value = true;
  title.value = row.productName;
  currentRow.value = row;
};

const handleSubmit = () => {
  if (!dialogRef.value) return;
  dialogRef.value.validFields().then((values) => {
    showModal.value = false;
    entryProductStore({
      productId: currentRow.value.productId,
      batchInventory: values.storeNum,
      productConsumeTimes: currentRow.value.productConsumeTimes,
    }).then(() => {
      ElMessage.success("操作成功！");
      currentRow.value = {};
      fetchListData({ currentPage: currentPage.value, pageSize: pageSize.value });
    });
  });
};
</script>
<style lang="scss" scoped></style>
