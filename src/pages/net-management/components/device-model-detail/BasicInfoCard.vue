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
            <p>请上传一张透明背景图片</p>
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".png"
              :disabled="route.query.type === 'view'"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </el-card>
      </div>
      <div class="right">
        <SearchComp :formItemList="searchFields" ref="searchRef" />
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, reactive } from "vue";
import SearchComp from "@/components/SearchComp.vue";
import { ElCard, ElUpload, ElIcon, ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import { reject } from "lodash";

const route = useRoute();

const imageUrl = ref("");
const searchRef = ref();

const fieldsFn = route => {
  const { query, params } = route
  const arrList = [
    {
      type: "input",
      label: "序号",
      placeholder: "",
      field: "id",
      initValue: params.id,
      disabled: true,
    },
    {
      type: "input",
      label: "型号名称",
      placeholder: "请输入",
      field: "modelName",
      required: true,
      rules: [
        { required: true, message: '请输入型号名称', trigger: 'blur' },
        { required: true, message: '请输入型号名称', trigger: 'change' }
      ]
    },
    {
      type: "select",
      label: "品牌",
      placeholder: "请选择",
      field: "brand",
      optionList: [
        { label: "ODC", value: "1" },
        { label: "DTM", value: "2" },
      ],
      required: true,
      rules: [
        { required: true, message: '请选择品牌', trigger: 'blur' },
        { required: true, message: '请选择品牌', trigger: 'change' }
      ]
    },
    {
      type: "textarea",
      label: "型号描述",
      placeholder: "请输入描述信息",
      field: "describe",
      maxLength: 200,
      optionList: [
        { label: "ODC", value: "1" },
        { label: "DTM", value: "2" },
      ],
    },
    // {
    //   type: 'btnList',
    //   children: [
    //     { text: '查询', type: 'submit', onClick: values => {
    //       console.log(values)
    //       console.log('搜索数据')
    //     } },
    //     { text: '重置', type: 'reset', onClick: values => {
    //       console.log(values)
    //       console.log('重置搜索数据')
    //     } }
    //   ]
    // }
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
    searchRef.value.validFields().then(resolve).catch(reject)
  })
}

const searchFields = reactive(fieldsFn(route));

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw);
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/png") {
    ElMessage.error("Avatar picture must be PNG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  imageUrl.value = URL.createObjectURL(rawFile);
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