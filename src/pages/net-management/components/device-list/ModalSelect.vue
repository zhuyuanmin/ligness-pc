<template>
  <el-dialog
    v-model="showModal"
    title="选择门店"
    width="50%"
    custom-class="modal-class-store"
    @close="emits('update:showModal', false)"
    append-to-body
    draggable
  >
    <div class="content">
      <el-table
        :data="tableData"
        max-height="400"
        class="table-class"
        ref="myTable"
        @select="handleSelect"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="storeId" label="产品编码" />
        <el-table-column prop="storeName" label="门店名称" />
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
        <el-button @click="emits('update:showModal', false)">取消</el-button>
        <el-button type="primary" @click="handleSelectList()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ElTable, ElTableColumn, ElButton, ElDialog, ElPagination } from "element-plus";
import { ref, reactive, watch, nextTick } from 'vue'

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  getStoreList: {
    type: Function,
  },
  value: {
    type: [String, Array],
    default: ''
  }
})

const myTable = ref()
const emits = defineEmits(['update:showModal'])

const tableData = reactive([
  { storeId: '213423', storeName: 'S3245234' },
  { storeId: '213453', storeName: 'S7995234' }
])
const currentPage = ref(1)
const pageSize = ref(10)
let dataList = []

const handleSelect = (section, row) => {
  if (!myTable.value) return
  if (section.length > 1) {
    myTable.value.clearSelection()
    myTable.value.toggleRowSelection(row, true)
    dataList = []
    dataList.push(row)
  } else if (!section.length) {
    dataList = []
  } else {
    dataList.push(row)
  }
}

watch(() => props.showModal, () => {
  nextTick(() => {
    if (props.value) {
      const result = tableData.find(v => v.storeId === props.value[0].value)
      if (result && myTable.value) {
        myTable.value.clearSelection()
        myTable.value.toggleRowSelection(result, true)
        dataList = []
        dataList.push(result)
      }
    } else {
      if (myTable.value) {
        myTable.value.clearSelection()
        dataList = []
      }
    }
  })
})

const handleSelectList = () => {
  emits('update:showModal', false)
  props.getStoreList(dataList)
}
const handleCurrentChange = page => {}
const handleSizeChange = size => {}

</script>
<style lang="scss" scoped>
.modal-class-store {
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
    :deep(.el-table__header th.el-table-column--selection .cell) {
      display: none;
    }
  }
}
</style>