<template>
  <div class="content-card">
    <div class="card-header">
      <span>{{mapName[route.query.type] || mapName.add}}品牌</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <el-card>
      <div class="box">
        <div class="left">
          <p>请上传图片</p>
          <el-upload
            class="avatar-uploader"
            :data="{
              attachmentBizTypeEnum: 'BRAND_CATEGORY',
              attachmentBizId: (route.params || {}).id,
            }"
            :headers="{
              endType: 0,
              ligness_token: tokenRef || ''
            }"
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
          <SearchComp :formItemList="searchFields" ref="ruleFormRef" :key="dateKey" />
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
import { ElCard, ElButton, ElUpload, ElIcon, ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import SearchComp from "@/components/SearchComp.vue";
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addBrand, editBrand, viewBrand } from './request/brand'
import api from '@/config/api'

// DEVICE_TYPE_CATEGORY(0L, "设备型号类型"),
// PRODUCT_CATEGORY(1L, "产品类型"),
// STORE_CATEGORY(2L, "客户门店类型"),
// STAFF_CATEGORY(3L, "员工类型"),
// BRAND_CATEGORY(4L, "品牌类型");

const router = useRouter();
const route = useRoute();
const ruleFormRef = ref();
const imageUrl = ref("");
const tokenRef = ref("");
const dateKey = ref(Date.now())
const fileResponse = ref({})

const mapName = reactive({
  add: "新增",
  edit: "修改",
  view: "查看",
});

const searchFields = reactive([
  {
    type: "input",
    label: "品牌名称",
    field: "brandName",
    placeholder: "请输入品牌名称",
    required: true,
    rules: [
      { required: true, message: "请输入品牌名称", trigger: ['blur', 'change'] },
    ],
  },
  {
    type: "select",
    label: "所属类型",
    field: "brandType",
    required: true,
    rules: [
      { required: true, message: "请选择所属类型", trigger: ['blur', 'change'] },
    ],
    optionList: [
      { label: "高端养护", value: "1" },
      { label: "青年养护", value: "2" },
    ],
  },
  {
    type: "input",
    label: "品牌负责人",
    field: "brandLeader",
    placeholder: "请输入品牌负责人",
  },
  {
    type: "textarea",
    label: "品牌描述",
    maxLength: 500,
    field: "brandRemark",
    placeholder: "请输入描述信息",
  },
]);

onMounted(() => {
  const { type } = route.query || {}
  const { id } = route.params || {}
  const userInfo = window.localStorage.getItem('userInfo')
  const { token } = userInfo ? JSON.parse(userInfo) : {}
  tokenRef.value = token

  if (['edit', 'view'].includes(type)) {
    viewBrand({ brandId: id }).then(res => {
      searchFields.forEach(v => {
        v.initValue = res[v.field]
      })
      // 更新
      dateKey.value = Date.now()
      imageUrl.value = res.imgPath
    })
  }
})

const saveFormData = () => {
  // 保存数据
  if (!ruleFormRef.value) return
  ruleFormRef.value.validFields().then(values => {
    if (route.params?.id) {
      editBrand({ ...values, brandId: route.params?.id }).then(res => {
        ElMessage.success('保存成功！')
        fileResponse.value = {}
        router.back()
      })
    } else {
      addBrand({ ...values, brandId: fileResponse.value.attachmentBizId || undefined }).then(res => {
        ElMessage.success('新增成功！')
        fileResponse.value = {}
        router.back()
      })
    }
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

.box {
  display: flex;
  .left {
    margin-right: 48px;
    width: 180px;
    p {
      margin-top: 0;
    }
    .avatar-uploader .avatar {
      width: 180px;
      height: 180px;
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
      width: 180px;
      height: 180px;
      text-align: center;
    }
  }
  .right {
    flex: 1;
    padding-top: 38px;
  }
}
</style>