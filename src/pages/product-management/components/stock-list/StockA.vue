<template>
  <SearchComp :formItemList="searchFields" />

  <el-table :data="tableData" max-height="400" class="table-class">
    <el-table-column type="index" label="序号" width="100" />
    <el-table-column prop="productName" label="产品名称" />
    <el-table-column prop="productNum" label="产品编号" />
    <el-table-column prop="totalNumber" label="消耗次数" />
    <el-table-column prop="stock" label="可用库存" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button text type="primary" size="small" @click.prevent="handleSwitchTab(scope.row)">出入库明细</el-button>
        <el-button text type="primary" size="small" @click.prevent="handleShowModal(scope.row)">入库</el-button>
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
import { ElTable, ElTableColumn, ElButton, ElPagination, ElDialog, ElInput } from 'element-plus'
import { ref, reactive } from 'vue'

const props = defineProps({
  switchTab: {
    type: Function
  }
})

const tableData = reactive([
  {
    productName: '门店培训五次',
    productNum: 'P1538796514674085889',
    totalNumber: '12',
    stock: 1,
  },
])

const checkAge = (rule, value, callback) => {
  if (value < 1) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}

const searchFields = reactive([
  {
    type: "input",
    label: "产品名称",
    placeholder: '请输入产品名称',
    field: "productName",
  },
  {
    type: "input",
    label: "产品编号",
    placeholder: '请输入产品编号',
    field: "productSerialNum",
  },
  {
    type: "btnList",
    children: [
      { text: "查询", type: "submit", onClick: values => {
        console.log(values)
      } },
      { text: "重置", type: "reset", onClick: () => {} },
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
      { required: true, message: '请输入入库数量', trigger: 'blur' },
      { validator: checkAge, message: '入库数量必须大于等于1', trigger: 'blur' },
      { required: true, message: '请输入入库数量', trigger: 'change' }
    ]
  },
]);

const currentPage = ref(1)
const pageSize = ref(10)
const showModal = ref(false)
const title = ref('')
const dialogRef = ref()

const handleSizeChange = size => {
  console.log(size);
  pageSize.value = size
}
const handleCurrentChange = page => {
  console.log(page);
  currentPage.value = page
}

const handleSwitchTab = row => {
  props.switchTab('second', row)
}

const handleShowModal = row => {
  showModal.value = true
  title.value = row.productName
}

const handleSubmit = () => {
  if (!dialogRef.value) return
  dialogRef.value.validFields().then(values => {
    console.log(values);
    showModal.value = false
  })
}
</script>
<style lang="scss" scoped></style>