<template>
  <div class="content-card">
    <div class="card-header">
      <span>{{mapName[route.query.type] || mapName.add}}门店</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <el-card>
      <template #header>
        <div><span>基础信息</span></div>
      </template>
      <SearchComp :formItemList="searchFields" ref="ruleFormRef" :key="dateKey" />
    </el-card>
    <el-card class="card-2">
      <template #header>
        <div><span>客户详情</span></div>
      </template>
      <div class="box">
        <div class="left">
          <p>请上传图片</p>
          <el-upload
            class="avatar-uploader"
            :data="{ attachmentBizTypeEnum: 'STORE_CATEGORY', attachmentBizId: (route.params || {}).id}"
            :action="api.upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept="image/*"
            :disabled="route.query.type === 'view'"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <div class="right">
          <SearchComp :formItemList="searchFields2" ref="ruleFormRef2" :key="dateKey2" />
        </div>
      </div>
    </el-card>
    <div class="btn-bottom-list" v-if="route.query.type !== 'view'">
      <el-button type="primary" @click.prevent="saveFormData()">保存</el-button>
      <el-button @click.prevent="router.back()">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { ElCard, ElButton, ElUpload, ElIcon, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import SearchComp from '@/components/SearchComp.vue'
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import jsonData from "china-area-data";
import { addShop, editShop, viewShop } from './request/shop'
import api from '@/config/api'

const pData = Object.keys(jsonData["86"]).map((key) => ({
  label: jsonData["86"][key],
  value: key,
}));

const router = useRouter()
const route = useRoute()
const ruleFormRef = ref()
const ruleFormRef2 = ref()
const imageUrl = ref("");
const dateKey = ref(Date.now());
const dateKey2 = ref(Date.now());
const fileResponse = ref({})

const mapName = reactive({
  'add': '新增',
  'edit': '修改',
  'view': '查看',
})

const mapTreeData = (listData, originData) => {
  return listData.map(v => {
    if (originData[v.value]) {
      const result = Object.keys(originData[v.value]).map(key => ({ label: originData[v.value][key], value: key }))
      v.children = result
      if (v.children && v.children.length > 0) {
        mapTreeData(v.children, originData)
      }
      return v
    }
  })
}

const result = mapTreeData(pData, jsonData)

const checkEmail = (rule, value, cb) => {
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (!value || regEmail.test(value)) {
    cb()
  } else {
    cb(new Error(rule.message))
  }
}

const checkPhone = (rule, value, cb) => {
  const regPhone = /^1[3-9]\d{9}$/
  if (regPhone.test(value)) {
    cb()
  } else {
    cb(new Error(rule.message))
  }
}

onMounted(() => {
  const { type } = route.query || {}
  const { id } = route.params || {}
  if (['edit', 'view'].includes(type)) {
    viewShop({ storeId: id }).then(res => {
      searchFields.forEach(v => {
        v.initValue = res[v.field]
      })
      searchFields2.forEach(v => {
        if (v.field === 'customArea') {
          v.initValue = JSON.parse(res[v.field])
        } else {
          v.initValue = res[v.field]
        }
      })
      // 更新
      dateKey.value = Date.now()
      dateKey2.value = Date.now()
      imageUrl.value = res.imgPath
    })
  }
})

const getFieldsList = route => {
  const { type } = route.query || {}

  let list = [
    {
      type: "input",
      label: "客户名称",
      field: "customName",
      placeholder: '请输入客户名称',
      required: true,
      disabled: type === 'view',
      rules: [
        { required: true, message: '请输入客户名称', trigger: ['blur', 'change'] },
      ],
    },
    {
      type: "input",
      label: "联系人",
      field: "storeContact",
      placeholder: '请输入联系人',
      required: true,
      disabled: type === 'view',
      rules: [
        { required: true, message: '请输入联系人', trigger: ['blur', 'change'] },
      ],
    },
    {
      type: "select",
      label: "性别",
      field: "customSex",
      required: true,
      disabled: type === 'view',
      rules: [
        { required: true, message: '请选择性别', trigger: ['blur', 'change'] },
      ],
      optionList: [
        { label: "男", value: 1 },
        { label: "女", value: 2 },
      ],
    },
    {
      type: "input",
      label: "联系人手机",
      field: "storeContactPhoneNum",
      placeholder: '请输入联系人手机',
      required: true,
      disabled: type === 'view',
      rules: [
        { required: true, message: '请输入联系人手机', trigger: ['blur', 'change'] },
        { validator: checkPhone.toString(), message: '手机号格式不正确', trigger: 'blur' }
      ],
    },
    {
      type: "input",
      label: "客户账号",
      field: "customAccount",
      placeholder: '请输入客户账号',
      required: true,
      disabled: ['edit', 'view'].includes(type),
      rules: [
        { required: true, message: '请输入客户账号', trigger: ['blur', 'change'] },
      ],
    },
    {
      type: "input",
      label: "登录密码",
      field: "customLoginPwd",
      required: true,
      disabled: type === 'view',
      placeholder: '请输入登录密码',
      rules: [
        { required: true, message: '请输入登录密码', trigger: ['blur', 'change'] },
      ],
    },
    {
      type: "input",
      label: "登录绑定手机",
      field: "customLoginPhoneNum",
      placeholder: '请输入登录绑定手机',
      required: true,
      disabled: ['edit', 'view'].includes(type),
      rules: [
        { required: true, message: '请输入登录绑定手机', trigger: ['blur', 'change'] },
        { validator: checkPhone.toString(), message: '手机号格式不正确', trigger: 'blur' }
      ],
    },
    {
      type: "input",
      label: "联系邮箱",
      field: "customEmail",
      disabled: type === 'view',
      placeholder: '请输入联系邮箱',
      rules: [
        { validator: checkEmail.toString(), message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
      ],
    },
    {
      type: "select",
      label: "证件类型",
      field: "customIdType",
      disabled: type === 'view',
      optionList: [
        { label: "身份证", value: "1" },
        { label: "营业执照", value: "2" },
      ],
    },
    {
      type: "input",
      label: "证件号码",
      field: "customIdNum",
      disabled: type === 'view',
      placeholder: '请输入证件号码',
    },
  ]

  if (['edit', 'view'].includes(type)) {
    list = list.filter(v => v.field !== 'customLoginPwd')
  }

  return list
}

const searchFields2 = reactive([
  {
    type: "cascade-select",
    label: "所在区域",
    field: "customArea",
    required: true,
    disabled: route.query.type === 'view',
    // initValue: ['330000', '330100', '330101'],
    rules: [
      { required: true, message: '请选择所在区域', trigger: ['blur', 'change'] },
    ],
    optionList: result,
  },
  {
    type: "input",
    label: "详细地址",
    field: "storeAddr",
    placeholder: '请输入详细地址',
    required: true,
    disabled: route.query.type === 'view',
    rules: [
      { required: true, message: '请输入详细地址', trigger: ['blur', 'change'] },
    ],
  },
  {
    type: "textarea",
    label: "详情介绍",
    field: "storeDetail",
    placeholder: '请输入介绍信息',
    maxLength: 200,
    disabled: route.query.type === 'view',
  },
])

const searchFields = reactive(getFieldsList(route))

const saveFormData = () => {
  // 保存数据
  if (!ruleFormRef.value) return
  if (!ruleFormRef2.value) return
  ruleFormRef.value.validFields().then(values => {
    ruleFormRef2.value.validFields().then(result => {
      const { customArea, ...rest } = result

      if (route.params?.id) {
        editShop({
          ...values,
          customArea: JSON.stringify(customArea),
          ...rest,
          storeId: route.params?.id,
        }).then(res => {
          ElMessage.success('保存成功！')
          fileResponse.value = {}
          router.back()
        })
      } else {
        addShop({
          ...values,
          customArea: JSON.stringify(customArea),
          ...rest,
          storeId: fileResponse.value.attachmentBizId || undefined
        }).then(res => {
          ElMessage.success('新增成功！')
          fileResponse.value = {}
          router.back()
        })
      }
    })
  })
}

const handleAvatarSuccess = (response, uploadFile) => {
  if (response.code !== 200) {
    ElMessage.error(response.msg)
  } else {
    imageUrl.value = URL.createObjectURL(uploadFile.raw);
    fileResponse.value = response.data
  }
};

const beforeAvatarUpload = (rawFile) => {
  if (!rawFile.type.startsWith('image/')) {
    ElMessage.error("请上传图片!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片大小不能超过 5MB!");
    return false;
  }
  imageUrl.value = URL.createObjectURL(rawFile);
  return true;
};
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 24px;
}
.btn-bottom-list {
  text-align: center;
  margin-top: 24px;
}

.card-2 {
  margin-top: 24px;
}

.box {
  display: flex;
  .left {
    margin-right: 48px;
    width: 100px;
    p {
      margin-top: 0;
    }
    .avatar-uploader .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }

    .avatar-uploader :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .avatar-uploader :deep(.el-upload:hover) {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      text-align: center;
    }
  }
  .right {
    flex: 1;
  }
}
</style>