<template>
  <el-card class="content-card">
    <template #header>
      <div class="card-header">
        <span>基础信息</span>
      </div>
    </template>
    <div class="content-box">
      <div class="left">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>产品图</span>
            </div>
          </template>
          <div class="upload-box">
            <p>请上传图片</p>
            <el-upload
              class="avatar-uploader"
              :data="{ attachmentBizTypeEnum: 'DEVICE_TYPE_CATEGORY', attachmentBizId: (route.params || {}).id }"
              :action="apis.upload"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              accept="image/*"
              :disabled="route.query.type === 'view'"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </el-card>
      </div>
      <div class="right">
        <SearchComp :formItemList="searchFields" ref="searchRef" :key="dateNow" />
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import SearchComp from "@/components/SearchComp.vue";
import { ElCard, ElUpload, ElIcon, ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
import apis from "@/config/api";
import useBrandStore from '@/store/brandStore'

const brandStore = useBrandStore()

const route = useRoute();
const imageUrl = ref("");
const searchRef = ref();
const dateNow = ref(Date.now())
const attachmentBizId = ref('')

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

onMounted(() => {
  const fieldList = fieldsFn(route)
  const result = fieldList.find(v => v.field === 'brandId')
  if (brandStore.brandList.length > 0) {
    result.optionList = brandStore.brandList.map(v => ({
      label: v.brandName,
      value:v.brandId
    }))
    searchFields.value = fieldList
  } else {
    brandStore.fetchBrandList(list => {
      result.optionList = list.map(v => ({
        label: v.brandName,
        value:v.brandId
      }))
      searchFields.value = fieldList
    })
  }
})

watch(() => props.data, newVal => {
  imageUrl.value = newVal.imgPath
  const fieldList = searchFields.value
  fieldList.forEach(item => {
    item.initValue = newVal[item.field]
  })

  searchFields.value = fieldList
  dateNow.value = Date.now()
})

const fieldsFn = route => {
  const { query, params } = route
  const arrList = [
    {
      type: "input",
      label: "型号编码",
      placeholder: "",
      field: "deviceTypeId",
      initValue: params.id,
      disabled: true,
    },
    {
      type: "input",
      label: "型号名称",
      placeholder: "请输入",
      field: "deviceTypeName",
      required: true,
      rules: [
        { required: true, message: '请输入型号名称', trigger: ['blur', 'change'] },
      ]
    },
    {
      type: "select",
      label: "品牌",
      placeholder: "请选择",
      field: "brandId",
      optionList: [],
      required: true,
      rules: [
        { required: true, message: '请选择品牌', trigger: ['blur', 'change'] },
      ]
    },
    {
      type: "textarea",
      label: "型号描述",
      placeholder: "请输入描述信息",
      field: "deviceTypeRemark",
      maxLength: 200,
    },
  ];
  if (!query.type || query.type === 'add') {
    arrList.shift()
  }
  if (query.type === 'view') {
    arrList.forEach(v => v.disabled = true)
  }
  return arrList
};

const getSearchFormValue = () => {
  if (!searchRef.value) return
  return new Promise((resolve, reject) => {
    searchRef.value.validFields().then(values => {
      if (values.brandId) {
        const result = brandStore.brandList.find(v => v.brandId === values.brandId)
        if (result) {
          values.brandName = result.brandName
        }
      }
      resolve({ ...values, attachmentBizId: attachmentBizId.value })
    }).catch(reject)
  })
}

const searchFields = ref(fieldsFn(route));

const handleSuccess = (response, uploadFile) => {
  if (response.code !== 200) {
    ElMessage.error(response.msg)
  } else {
    imageUrl.value = URL.createObjectURL(uploadFile.raw);
    attachmentBizId.value = response.data.attachmentBizId
  }
};

const beforeUpload = (rawFile) => {
  if (!rawFile.type.startsWith('image/')) {
    ElMessage.error("请上传图片!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error("图片大小不能超过 5MB!");
    return false;
  }
  return true;
};

// 暴露给父级调用
defineExpose({ getSearchFormValue })
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
    display: flex;
    .left {
      width: 212px;
      p {
        margin-top: 0;
      }
      .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
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
        width: 178px;
        height: 178px;
        text-align: center;
      }
    }
    .right {
      flex: 1;
      padding-left: 24px;
    }
  }
}
</style>