<template>
  <SearchComp :key="dateRef" :formItemList="searchFields" />

  <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
    <el-table-column type="index" label="序号" width="100" />
    <el-table-column prop="productName" label="产品名称" />
    <el-table-column prop="productNum" label="产品编号" />
    <el-table-column prop="batchNo" label="批次" />
    <el-table-column prop="brandName" label="所属品牌" />
    <el-table-column prop="batchInventory" label="产品数量" />
    <el-table-column prop="createTime" label="入库时间">
      <template #default="scope">
        <span>{{scope.row.createTime && dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="creator" label="操作人" />
    <el-table-column fixed="right" label="操作" width="80">
      <template #default="scope">
        <el-button text type="primary" size="small" @click.prevent="handleShowModal(scope.row)">查看</el-button>
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
    @size-change="size => handleSizeChange('first', size)"
    @current-change="page => handleCurrentChange('first', page)"
  />

  <el-dialog
    v-model="showModal"
    title="查看明细"
    width="55%"
    custom-class="modal-class-store2"
    @close="showModal = false"
    append-to-body
    draggable
  >
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in dialogFields" :key="item.field" class="class-col">
          <span class="grid-label">{{item.label}}：</span>
          <span class="grid-value">{{item.value}}</span>
        </el-col>
      </el-row>

      <el-table :data="tableData2" max-height="400" class="table-class">
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="boxNo" label="产品编号" />
        <el-table-column prop="productSign" label="产品二维码">
          <template #default="scope">
            <el-button text type="primary" @click="handViewQRCode(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="已用次数/可用次数">
          <template #default="scope">
            <span>{{scope.row.boxUsedTimes}}</span>/<span>{{scope.row.boxAvailableTimes}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="门店">
          <template #default="scope">
            {{scope.row.storeName}}
            <el-button v-if="scope.row.storeId" plain size="small" type="primary" @click="handBindStore(scope.row)">重新绑定</el-button>
            <el-button v-else text type="primary" @click="handBindStore(scope.row)">绑定门店</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="class-pagination"
        v-model:currentPage="currentPage2"
        v-model:page-size="pageSize2"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total2"
        small
        @size-change="size => handleSizeChange('second', size)"
        @current-change="page => handleCurrentChange('second', page)"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showModal = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

  <ModalSelect v-model:showModal="showStoreModal" :getStoreList="getStoreList" :value="selectValue" />
</template>
<script setup>
import SearchComp from "@/components/SearchComp.vue";
import { ElTable, ElTableColumn, ElButton, ElPagination, ElDialog, ElRow, ElCol, ElMessageBox, ElLoading } from 'element-plus'
import { ref, reactive, watch, h, onMounted } from 'vue'
import ModalSelect from '@/pages/net-management/components/device-list/ModalSelect.vue'
import QRCode from 'qrcode'
import { entryProductStoreRecord } from '../../request/product'
import dayjs from 'dayjs'

const vLoading = ElLoading.directive

const props = defineProps({
  searchData: {
    type: Object
  },
  changeDataFn: {
    type: Function
  },
})

const tableData = ref([])

const tableData2 = reactive([
  {
    boxNo: 'A7BA9D3C459F46278208E2A28F1C5144',
    boxUsedTimes: '0',
    boxAvailableTimes: '500',
    storeId: '11232',
    storeName: 'S24324'
  },
])

const dialogFields = reactive([
  { label: '产品名称', value: '', field: 'productName' },
  { label: '产品编码', value: '', field: 'productNum' },
  { label: '产品批次', value: '', field: 'batchNo' },
  { label: '品牌商', value: '', field: 'brandName' },
  { label: '入库时间', value: '', field: 'operateTime' },
  { label: '入库数量', value: '', field: 'batchInventory' },
  { label: '操作人', value: '', field: 'modifierName' },
])

const searchFields = reactive([
  {
    type: "input",
    label: "产品名称",
    placeholder: '请输入产品名称',
    field: "productName",
  },
  {
    type: "input",
    label: "产品编码",
    placeholder: '请输入产品编码',
    field: "productNum",
    initValue: '',
  },
  {
    type: "select",
    label: "品牌",
    field: "brandId",
    optionList: [
      { label: "莱特妮丝", value: "80" },
      { label: "ODC", value: "81" },
    ],
  },
  {
    type: "date-range",
    label: "入库时间",
    field: "operateTime",
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
        searchFields[1].initValue = ''
        dateRef.value = Date.now()
        props.changeDataFn()
        currentPage.value = 1
        fetchListData({ currentPage: 1, pageSize: pageSize.value })
      } },
    ],
  },
]);

const currentPage = ref(1)
const pageSize = ref(10)
const currentPage2 = ref(1)
const pageSize2 = ref(10)
const total = ref(100)
const total2 = ref(100)
const loading = ref(false)
const showModal = ref(false)
const showStoreModal = ref(false)
const selectValue = ref('')
const dateRef = ref(Date.now())

watch(() => props.searchData, () => {
  searchFields[1].initValue = props.searchData?.productNum
  dateRef.value = Date.now()
})

const fetchListData = params => {
  loading.value = true
  entryProductStoreRecord(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  fetchListData({})
})

const handleSizeChange = (type, size) => {
  console.log(size);
  if (type === 'first') {
    currentPage.value = 1
    pageSize.value = size
    fetchListData({ currentPage: 1, pageSize: size })
  } else {
    currentPage2.value = 1
    pageSize2.value = size
    fetchListData({ currentPage: 1, pageSize2: size })
  }
}
const handleCurrentChange = (type, page) => {
  console.log(page);
  if (type === 'first') {
    currentPage.value = page
    fetchListData({ currentPage: page, pageSize: pageSize.value })
  } else {
    currentPage2.value = page
    fetchListData({ currentPage: page, pageSize2: pageSize2.value })
  }
}

const handleShowModal = row => {
  showModal.value = true
  dialogFields.forEach(v => {
    v.value = row[v.field]
  })
}

const handViewQRCode = row => {
  QRCode
    .toDataURL(row.boxNo, { errorCorrectionLevel: 'H' })
    .then(url => {
      ElMessageBox({
        title: '查看二维码',
        message: h('img', {
          src: url,
          alt: '',
          srcset: '',
          width: '200'
        }, null),
        showCancelButton: false,
        showConfirmButton: false,
        draggable: true,
        customClass: 'class-message-box',
      }).then(() => {}, () => {})
    })
    .catch(err => {
      console.error(err)
    })
}

const handBindStore = row => {
  showStoreModal.value = true
  selectValue.value = row.storeId ? [{ label: row.storeName, value: row.storeId }] : ''
}

const getStoreList = values => {
  console.log(values)
}
</script>
<style lang="scss" scoped>
.modal-class-store2 {
  .class-pagination {
    position: absolute;
    bottom: 22px;
  }

  .class-col {
    margin-bottom: 16px;
    .grid-label {
      font-weight: bold;
    }
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
<style lang="scss">
.class-message-box {
  .el-message-box__container {
    text-align: center;
  }
}
</style>