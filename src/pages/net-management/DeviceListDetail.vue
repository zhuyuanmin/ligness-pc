<template>
  <div class="content-card">
    <div class="card-header">
      <span>{{mapName[route.query.type] || mapName.add}}设备</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <el-card class="my-card">
      <el-form :inline="true" ref="ruleFormRef" :model="formValues" class="demo-form-inline" label-width="auto" label-suffix="：" :rules="rules">
        <el-form-item v-if="['edit', 'view'].includes(route.query.type)" label="序号">{{route.params.id}}</el-form-item>
        <el-form-item label="设备编号" required prop="deviceCode">
          <el-input v-model="formValues.deviceCode" class="my-input" :maxlength="200" placeholder="请输入设备编号" :disabled="['edit', 'view'].includes(route.query.type)" clearable />
        </el-form-item>
        <el-form-item v-if="['edit', 'view'].includes(route.query.type)" label="当前状态">
          <el-button v-if="formValues.status === 1" type="success" plain size="small">在线</el-button>
          <el-button v-else type="danger" plain size="small">离线</el-button>
        </el-form-item>
        <el-form-item v-if="['edit', 'view'].includes(route.query.type)" label="激活状态">
          <el-button v-if="formValues.activeStatus === 1" type="success" plain size="small">已激活</el-button>
          <el-button v-else type="danger" plain size="small">未激活</el-button>
        </el-form-item>
        <el-form-item label="设备型号" required prop="deviceModel">
          <el-select v-model="formValues.deviceModel" :disabled="['edit', 'view'].includes(route.query.type)" clearable>
            <el-option v-for="v in optionList" :label="v.label" :value="v.value" :key="v.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="['edit', 'view'].includes(route.query.type)" label="绑定门店">
          <el-select :model-value="(formValues.storeId || []).map(v => v.value).join(';')" :class="route.query.type === 'edit' ? 'my-select' : ''" @click="route.query.type === 'edit' ? showStoreModal() : () => {}" disabled="disabled">
            <el-option v-for="v in formValues.storeId" :label="v.label" :value="v.value" :key="v.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备说明" style="width: 100%">
          <el-input type="textarea" :disabled="route.query.type === 'view'" show-word-limit :maxlength="500" :autosize="{ minRows: 3, maxRows: 5 }" v-model="formValues.deviceDescribe" placeholder="请输入" clearable />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-form :inline="true" class="demo-form-inline" label-width="auto" label-suffix="：">
        <el-form-item label="生产厂家">{{'深圳市欧迪丝生物科技有限公司'}}</el-form-item>
        <el-form-item label="归属品牌商">{{'深圳市欧迪丝生物科技有限公司'}}</el-form-item>
        <el-form-item label="所属品牌">{{''}}</el-form-item>
        <el-form-item label="出厂时间">{{'2022-08-06 16:33:23'}}</el-form-item>
        <el-form-item label="激活时间">{{'2022-08-08 14:21:15'}}</el-form-item>
        <el-form-item label="下线时间">{{'-'}}</el-form-item>
      </el-form>
    </el-card>
    <div class="btn-bottom-list" v-if="route.query.type !== 'view'">
      <el-button type="primary" @click.prevent="saveFormData()">保存</el-button>
      <el-button @click.prevent="router.back()">返回</el-button>
    </div>
    <ModalSelect v-model:showModal="showModal" :getStoreList="getStoreList" :value="(formValues.storeId || []).map(v => v.value).join(';')" />
  </div>
</template>
<script setup>
import { ElCard, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElDivider } from 'element-plus'
import ModalSelect from './components/device-list/ModalSelect.vue'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const ruleFormRef = ref()
const formValues = reactive({
  status: 1,
  activeStatus: 0,
  deviceCode: '',
  deviceModel: '',
  storeId: '',
  deviceDescribe: ''
})
const optionList = reactive([
  { label: 'MEI XIU SI', value: '1' },
  { label: '欧洲之星:生命能量抗衰雕塑大师plus', value: '2' },
  { label: '欧洲之星:生命能量抗衰雕塑大师', value: '3' },
  { label: '欧洲之星:时尚塑形大师', value: '4' },
])
const mapName = reactive({
  'add': '新增',
  'edit': '修改',
  'view': '查看',
})
const rules = reactive({
  deviceCode: [
    { required: true, message: '请输入设备编号', trigger: 'blur' },
    { required: true, message: '请输入设备编号', trigger: 'change' }
  ],
  deviceModel: [
    { required: true, message: '请选择设备型号', trigger: 'blur' },
    { required: true, message: '请选择设备型号', trigger: 'change' }
  ],
})

const showStoreModal = () => {
  showModal.value = true
}

const getStoreList = list => {
  const result = list.map(item => {
    const { storeId: value, storeName: label } = item
    return { label, value }
  })
  formValues.storeId = result
}

const saveFormData = () => {
  // 保存数据
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log(formValues)
    }
  })
}
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}
.btn-bottom-list {
  text-align: center;
  margin-top: 24px;
}

.my-card {
  margin-top: 24px;
}

.demo-form-inline {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  :deep(.el-form-item) {
    width: 50%;
    margin-right: 0;
    .my-input {
      max-width: 190px;
    }
    .my-select {
      input {
        cursor: pointer;
      }
      .is-disabled .el-input__wrapper {
        background-color: #fff;
      }
    }
  }
}
</style>