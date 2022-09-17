<template>
  <div class="container">
    <SearchComp :formItemList="searchFields" />

    <el-table :data="tableData" max-height="400" class="table-class" v-loading="loading">
      <el-table-column prop="staffNo" label="编号" width="100" />
      <el-table-column prop="staffAccount" label="账号" />
      <el-table-column prop="staffName" label="姓名" />
      <el-table-column prop="staffPermRole" label="权限角色">
        <template #default="scope">
          <span v-if="scope.row.accountType === 1">系统管理员</span>
          <span v-else>普通账号</span>
        </template>
      </el-table-column>
      <el-table-column prop="staffLoginPhoneNum" label="登录手机号" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="staffStatus" label="启用状态">
        <template #default="scope">
          <el-switch :model-value="scope.row.staffStatus === 1" @change="handleUpdateStaffInfo(scope.row)"/>
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
            type="danger"
            size="small"
            @click.prevent="deleteRow(scope.row)"
            >删除</el-button
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
    <el-dialog
      v-model="showUserInfoModal"
      :title="title2"
      width="50%"
      custom-class="modal-class-store"
      @close="showUserInfoModal = false"
      append-to-body
      destroy-on-close
      draggable
    >
      <div class="content">
        <SearchComp :formItemList="dialogFields2" ref="dialogRef2" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUserInfoModal = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitInfo()">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
  ElMessage,
} from "element-plus";
import { ArrowDown } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getStaffList, deleteStaff, editStaff, addStaff } from './request/staff'

const vLoading = ElLoading.directive
const route = useRoute();

const tableData = reactive([
  {
    staffNo: 293,
    staffAccount: "ltns001",
    staffName: "chen",
    staffPermRole: 0,
    staffStatus: 1,
    staffLoginPhoneNum: "15803594395",
    createTime: '2022-08-12 21:02:42',
  },
]);

const checkEmail = (rule, value, cb) => {
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (!value || regEmail.test(value)) {
    cb()
  } else {
    cb(new Error(rule.message))
  }
}

const searchFields = reactive([
  {
    type: "input",
    label: "用户信息",
    placeholder: "用户名/手机号/姓名",
    field: "userInfo",
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
      { text: "新增用户", style: "primary", onClick: () => viewRow() },
    ],
  },
]);

const dialogFieldsList = [
  {
    type: "password",
    label: "新密码",
    field: "staffPwd",
    placeholder: '请输入新密码',
    required: true,
    rules: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { required: true, message: '请输入新密码', trigger: 'change' }
    ]
  },
  {
    type: "input",
    label: "新登录手机号",
    field: "staffLoginPhoneNum",
    placeholder: '请输入新登录手机号',
    required: true,
    rules: [
      { required: true, message: '请输入新登录手机号', trigger: 'blur' },
      { required: true, message: '请输入新登录手机号', trigger: 'change' }
    ]
  },
]

const dialogFields2List = [
  {
    type: "input",
    label: "账号",
    field: "staffAccount",
    placeholder: '请输入账号',
    required: true,
    rules: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { required: true, message: '请输入账号', trigger: 'change' }
    ]
  },
  {
    type: "input",
    label: "姓名",
    field: "staffName",
    placeholder: '请输入姓名',
    required: true,
    rules: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { required: true, message: '请输入姓名', trigger: 'change' }
    ]
  },
  {
    type: "input",
    label: "登录手机号",
    field: "staffLoginPhoneNum",
    placeholder: '请输入登录手机号',
    required: true,
    rules: [
      { required: true, message: '请输入登录手机号', trigger: 'blur' },
      { required: true, message: '请输入登录手机号', trigger: 'change' }
    ]
  },
  {
    type: "password",
    label: "密码",
    field: "staffPwd",
    placeholder: '请输入密码',
    required: true,
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { required: true, message: '请输入密码', trigger: 'change' }
    ]
  },
  // {
  //   type: "password",
  //   label: "确认密码",
  //   field: "confirmPassword",
  //   placeholder: '请输入确认密码',
  //   required: true,
  //   rules: [
  //     { required: true, message: '请输入确认密码', trigger: 'blur' },
  //     { required: true, message: '请输入确认密码', trigger: 'change' }
  //   ]
  // },
  {
    type: "input",
    label: "邮箱",
    field: "staffEmail",
    placeholder: '请输入邮箱',
    rules: [
      { validator: checkEmail, message: '请输入正确的邮箱格式', trigger: 'blur' },
      { validator: checkEmail, message: '请输入正确的邮箱格式', trigger: 'change' }
    ],
  },
  {
    type: "select",
    label: "性别",
    field: "staffSex",
    required: true,
    rules: [
      { required: true, message: '请选择性别', trigger: 'blur' },
      { required: true, message: '请选择性别', trigger: 'change' }
    ],
    optionList: [
      { label: "男", value: "1" },
      { label: "女", value: "2" },
    ],
  },
  {
    type: "file",
    label: "头像",
    field: "staffImg",
    initValue: [{
      name: 'food.jpeg',
      url: 'https://picsum.photos/200',
    }],
    limit: 1,
    action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
  },
  {
    type: "radio",
    label: "权限角色",
    field: "staffPermRole",
    initValue: '1',
    optionList: [
      { label: "普通账号", value: "1" },
      { label: "系统管理员", value: "2" },
    ],
  },
]

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100)
const loading = ref(false)
const showModal = ref(false)
const showUserInfoModal = ref(false)
const title = ref('')
const dialogRef = ref()
const title2 = ref('')
const dialogRef2 = ref()
const account = ref('')
const dialogFields = ref([])
const dialogFields2 = ref([])

const handleSizeChange = (size) => {
  currentPage.value = 1
  pageSize.value = size
  fetchListData({ currentPage: 1, pageSize: size })
};
const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchListData({ currentPage: page, pageSize: pageSize.value })
};

const fetchListData = params => {
  loading.value = true
  getStaffList(params).then(res => {
    const { currentPage, pageSize, pageCount, totalCount, pageList } = res || {}
    tableData.value = pageList
    total.value = totalCount
  }).finally(() => {
    loading.value = false
  })
}

const handleUpdateStaffInfo = params => {
  if (title2.value === '编辑用户') {
    editStaff(params).then(res => {
      ElMessage.success('操作成功！')
      currentPage.value = 1
      fetchListData({ currentPage: 1, pageSize: pageSize.value })
    })
  } else {
    addStaff(params).then(res => {
      ElMessage.success('操作成功！')
      currentPage.value = 1
      fetchListData({ currentPage: 1, pageSize: pageSize.value })
    })
  }
}

onMounted(() => {
  fetchListData({})
})

const viewRow = (row, type) => {
  title2.value = row ? '编辑用户' : '新增用户'
  const listArr = JSON.parse(JSON.stringify(dialogFields2List))
  if (row) {
    const list = listArr.slice(0, 2).concat(listArr.slice(5))
    list.forEach((v, i) => {
      if (i === 0) {
        list[i].disabled = true
      }
      if (row[v.field]) {
        list[i].initValue = row[v.field]
      }
    })
    dialogFields2.value = list
  } else {
    dialogFields2.value = listArr
  }
  showUserInfoModal.value = true
};

const deleteRow = row => {
  console.log(row);
  ElMessageBox.confirm(
    '删除后将无法登录系统，确认删除？',
    '提示',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      draggable: true,
      type: 'warning',
    }
  ).then(() => {
    // 删除操作
    deleteStaff(row).then(res => {
      ElMessage.success('操作成功！')
      currentPage.value = 1
      fetchListData({ currentPage: 1, pageSize: pageSize.value })
    })
  }, () => {})
};

const handleSubmit = () => {
  if (!dialogRef.value) return
  dialogRef.value.validFields().then(values => {
    console.log(values);
    showModal.value = false
    handleUpdateStaffInfo(values)
  })
}

const handleSubmitInfo = () => {
  if (!dialogRef2.value) return
  dialogRef2.value.validFields().then(values => {
    console.log(values);
    showUserInfoModal.value = false
    handleUpdateStaffInfo(values)
  })
}

const handleModifyPassword = row => {
  console.log(row);
  showModal.value = true
  title.value = '修改密码'
  account.value = row.staffAccount
  dialogFields.value = dialogFieldsList.slice(0, 1)
};

const handleModifyPhone = row => {
  console.log(row);
  showModal.value = true
  title.value = '修改登录手机号'
  account.value = row.staffAccount
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