<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/customer-management/shop-list'">
      <SearchComp :formItemList="searchFields" />

      <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
        <el-table-column type="index" label="编号" width="100" />
        <el-table-column prop="customAccount" label="账号" />
        <el-table-column prop="customName" label="门店名称" />
        <el-table-column prop="customArea" label="所在地区">
          <template #default="scope">
            <span>{{computeAreaName(scope.row.customArea)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeContact" label="联系人" />
        <el-table-column prop="customLoginPhoneNum" label="登录手机号" />
        <el-table-column prop="createTime" label="更新时间">
          <template #default="scope">
            <span>{{dayjs(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeStatus" label="启用状态">
          <template #default="scope">
            <el-switch :model-value="scope.row.storeStatus === 1" @change="handleUpdateShopInfo(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              text
              type="primary"
              size="small"
              @click.prevent="viewRow(scope.row, 'edit')"
              >编辑</el-button
            >
            <el-button
              text
              type="primary"
              size="small"
              @click.prevent="viewRow(scope.row, 'view')"
              >查看</el-button
            >
            <el-button
              text
              type="danger"
              size="small"
            >
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleModifyPassword(scope.row)">修改密码</el-dropdown-item>
                    <!-- <el-dropdown-item @click="handleUnBindPhone(scope.row)">解绑登录手机号</el-dropdown-item> -->
                    <el-dropdown-item @click="handleModifyPhone(scope.row)">修改登录手机号</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button>
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
        width="40%"
        custom-class="modal-class-store"
        @close="showModal = false"
        append-to-body
        destroy-on-close
        draggable
      >
        <div class="content">

          <el-form-item :class="title === '修改密码' ? 'label-80' : 'label-120'" label="账号："><span>{{account}}</span></el-form-item>
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
    <template v-else><router-view /></template>
  </div>
</template>
<script setup>
import SearchComp from "@/components/SearchComp.vue";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElPagination,
  ElMessageBox,
  ElSwitch,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElDialog,
  ElFormItem,
  ElLoading,
  ElMessage
} from "element-plus";
import { ArrowDown } from '@element-plus/icons-vue';
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getShopList, editShop } from './request/shop'
import dayjs from 'dayjs'
import jsonData from "china-area-data";

const vLoading = ElLoading.directive

const tableData = ref([]);

const checkPhone = (rule, value, cb) => {
  const regPhone = /^1[3-9]\d{9}$/
  if (regPhone.test(value)) {
    cb()
  } else {
    cb(new Error(rule.message))
  }
}

const searchFields = reactive([
  {
    type: "input",
    label: "门店名称",
    placeholder: "请输入门店名称",
    field: "customName",
  },
  {
    type: "input",
    label: "联系人",
    placeholder: "请输入联系人",
    field: "storeContact",
  },
  {
    type: "input",
    label: "账号/手机号",
    placeholder: "请输入账号/手机号",
    field: "customAccount",
  },
  {
    type: "btnList",
    children: [
      {
        text: "查询",
        type: "submit",
        onClick: (values) => {
          console.log(values);
          currentPage.value = 1
          fetchListData({ ...values, currentPage: 1, pageSize: pageSize.value })
        },
      },
      { text: "重置", type: "reset", onClick: () => {
        currentPage.value = 1
        fetchListData({ currentPage: 1, pageSize: pageSize.value })
      } },
      { text: "新增", style: "primary", onClick: () => viewRow() },
    ],
  },
]);

const dialogFieldsList = [
  {
    type: "password",
    label: "新密码",
    field: "customLoginPwd",
    placeholder: '请输入新密码',
    required: true,
    rules: [
      { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
    ]
  },
  {
    type: "input",
    label: "新登录手机号",
    field: "customLoginPhoneNum",
    placeholder: '请输入新登录手机号',
    required: true,
    rules: [
      { required: true, message: '请输入新登录手机号', trigger: ['blur', 'change'] },
      { validator: checkPhone.toString(), message: '手机号格式不正确', trigger: 'blur' }
    ]
  },
]

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const loading = ref(false);
const router = useRouter();
const showModal = ref(false)
const title = ref('')
const dialogRef = ref()
const account = ref('')
const dialogFields = ref([])
const currentRow = ref({})

const curRoute = router.currentRoute.value;
const currentRoute = ref(curRoute);

const fetchListData = params => {
  loading.value = true
  getShopList(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
  }).finally(() => {
    loading.value = false
  })
}

const handleUpdateShopInfo = params => {
  editShop(
    params.storeId ? {
      storeId: params.storeId ,
      storeStatus: params.storeStatus === 0 ? 1 : 0,
      refreshFlag: false
    } : {
      ...params,
      storeId: currentRow.value.storeId,
      refreshFlag: !!params.customLoginPwd
    }
  ).then(res => {
    ElMessage.success('操作成功！')
    currentPage.value = 1
    fetchListData({ currentPage: 1, pageSize: pageSize.value })
  })
}

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal

  if (newVal.fullPath === '/customer-management/shop-list') {
    fetchListData({})
  }
})

onMounted(() => {
  if (currentRoute.value.fullPath === '/customer-management/shop-list') {
    fetchListData({})
  }
})

const computeAreaName = area => {
  const list = JSON.parse(area)
  const province = jsonData['86'][list[0]]
  const city = jsonData[list[0]][list[1]]
  const district = jsonData[list[1]][list[2]]

  return `${province} ${city} ${district}`
}

const handleSizeChange = (size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchListData({ currentPage: 1, pageSize: size })
};

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchListData({ currentPage: page, pageSize: pageSize.value })
};

const viewRow = (row, type) => {
  console.log(row);
  if (row) {
    router.push(`/customer-management/shop-list/detail/${row.storeId}?type=${type}`);
  } else {
    router.push("/customer-management/shop-list/detail");
  }
};

const handleSubmit = () => {
  if (!dialogRef.value) return
  dialogRef.value.validFields().then(values => {
    console.log(values);
    showModal.value = false

    handleUpdateShopInfo(values)
  })
}

const handleModifyPassword = row => {
  currentRow.value = row
  showModal.value = true
  title.value = '修改密码'
  account.value = row.customAccount
  dialogFields.value = dialogFieldsList.slice(0, 1)
};

const handleUnBindPhone = row => {
  console.log(row);
  ElMessageBox.confirm(
    '解绑后将无法使用手机号登录，确认解绑？',
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
};

const handleModifyPhone = row => {
  currentRow.value = row
  showModal.value = true
  title.value = '修改登录手机号'
  account.value = row.customAccount
  dialogFields.value = dialogFieldsList.slice(1, 2)
};
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

  .el-dropdown-link {
    font-size: 12px;
  }
}

.modal-class-store {
  .label-80 {
    :deep(.el-form-item__label) {
      width: 80px;
    }
  }
  .label-120 {
    :deep(.el-form-item__label) {
      width: 120px;
    }
  }
}
</style>