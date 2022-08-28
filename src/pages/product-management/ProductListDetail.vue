<template>
  <div class="content-card">
    <div class="card-header">
      <span>{{mapName[route.query.type] || mapName.add}}产品</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <searchComp :formItemList="searchFields" ref="ruleFormRef" />
    <div class="btn-bottom-list" v-if="route.query.type !== 'view'">
      <el-button type="primary" @click.prevent="saveFormData()">保存并上架</el-button>
      <el-button @click.prevent="router.back()">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import searchComp from '@/components/searchComp.vue'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const ruleFormRef = ref()

const mapName = reactive({
  'add': '添加',
  'edit': '修改',
})

const searchFields = reactive([
  {
    type: "select",
    label: "产品性质",
    field: "productType",
    required: true,
    rules: [
      { required: true, message: '请选择产品性质', trigger: 'blur' },
      { required: true, message: '请选择产品性质', trigger: 'change' }
    ],
    optionList: [
      { label: "卖品", value: "1" },
      { label: "非卖品", value: "2" },
    ],
  },
  {
    type: "select",
    label: "产品类型",
    field: "productCategory",
    required: true,
    rules: [
      { required: true, message: '请选择产品类型', trigger: 'blur' },
      { required: true, message: '请选择产品类型', trigger: 'change' }
    ],
    optionList: [
      { label: "普通产品", value: "1" },
      { label: "服务耗材", value: "2" },
      { label: "院装产品", value: "3" },
      { label: "套盒产品", value: "4" },
    ],
  },
  {
    type: "number",
    label: "可消耗次数",
    field: "productNum",
    initValue: 0,
  },
  {
    type: "input",
    label: "产品名称",
    field: "name",
    required: true,
    rules: [
      { required: true, message: '请输入产品名称', trigger: 'blur' },
      { required: true, message: '请输入产品名称', trigger: 'change' }
    ],
  },
  {
    type: "input",
    label: "简称",
    field: "shortName",
  },
  {
    type: "input",
    label: "产品编码",
    field: "code",
  },
  {
    type: "select",
    label: "品牌",
    field: "brand",
    required: true,
    rules: [
      { required: true, message: '请选择品牌', trigger: 'blur' },
      { required: true, message: '请选择品牌', trigger: 'change' }
    ],
    optionList: [
      { label: "莱特妮丝", value: "80" },
      { label: "ODC", value: "81" },
    ],
  },
  {
    type: "file",
    label: "图片",
    initValue: [{
      name: 'food.jpeg',
      url: 'https://picsum.photos/200',
    }],
    limit: 1,
    action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
    field: "productImg",
  },
])

const saveFormData = () => {
  // 保存数据
  if (!ruleFormRef.value) return
  ruleFormRef.value.validFields().then(values => {
    console.log(values)
  })
}
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 24px;
}
.demo-form-inline {
  :deep(.el-form-item) {
    width: 30%;
    .el-form-item__content {
      max-width: 190px;
    }
  }
}
.btn-bottom-list {
  text-align: center;
  margin-top: 24px;
}
</style>