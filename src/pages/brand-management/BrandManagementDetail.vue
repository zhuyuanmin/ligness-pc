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
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
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
          <SearchComp :formItemList="searchFields" ref="ruleFormRef" />
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
import { ElCard, ElButton, ElUpload, ElIcon } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import SearchComp from "@/components/SearchComp.vue";
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const ruleFormRef = ref();
const imageUrl = ref("");

const mapName = reactive({
  add: "新增",
  edit: "修改",
  view: "查看",
});

const searchFields = reactive([
  {
    type: "input",
    label: "品牌名称",
    field: "name",
    placeholder: "请输入品牌名称",
    required: true,
    rules: [
      { required: true, message: "请输入品牌名称", trigger: "blur" },
      { required: true, message: "请输入品牌名称", trigger: "change" },
    ],
  },
  {
    type: "select",
    label: "所属类型",
    field: "type",
    required: true,
    rules: [
      { required: true, message: "请选择所属类型", trigger: "blur" },
      { required: true, message: "请选择所属类型", trigger: "change" },
    ],
    optionList: [
      { label: "高端养护", value: "1" },
      { label: "青年养护", value: "2" },
    ],
  },
  {
    type: "input",
    label: "品牌负责人",
    field: "contact",
    placeholder: "请输入品牌负责人",
  },
  {
    type: "textarea",
    label: "品牌描述",
    field: "describe",
    placeholder: "请输入描述信息",
  },
]);

const saveFormData = () => {
  // 保存数据
  if (!ruleFormRef.value) return
  ruleFormRef.value.validFields().then(values => {
    console.log(values)
  })
}

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