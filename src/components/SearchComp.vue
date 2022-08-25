<template>
  <el-form :inline="true" ref="ruleFormRef" :model="formValues" class="demo-form-inline" label-width="auto" label-suffix="：" :rules="rules">
    <el-form-item
      v-for="(item, index) in props.formItemList"
      :key="item.field || index"
      :label="item.label"
      :required="item.required"
      :style="item.type === 'textarea' ? { width: '100%' } : ''"
      :prop="item.field"
    >
      <template v-if="item.type === 'btnList'">
        <el-button
          v-for="(v, i) in item.children"
          :key="i"
          :type="v.type === 'submit' ? 'primary' : (v.style || '')"
          @click="v.type === 'reset' ? resetFormData(v) : v.onClick(formValues)"
        >
          {{ v.text }}
        </el-button>
      </template>
      <template v-else-if="item.type === 'select'">
        <el-select v-model="formValues[item.field]" :placeholder="item.placeholder" :disabled="item.disabled" clearable>
          <el-option v-for="v in item.optionList" :label="v.label" :value="v.value" :key="v.value" />
        </el-select>
      </template>
      <template v-else-if="item.type === 'textarea'">
        <el-input type="textarea" show-word-limit :maxlength="item.maxLength" :autosize="{ minRows: 3, maxRows: 5 }" v-model="formValues[item.field]" :placeholder="item.placeholder || '请输入'" :disabled="item.disabled" clearable />
      </template>
      <template v-else-if="item.type === 'select-custom'">
        <el-select :model-value="(formValues[item.field] || []).map(v => v.value).join(';')" class="my-select" :placeholder="item.placeholder" @click="item.onClick" disabled="disabled">
          <el-option v-for="v in formValues[item.field]" :label="v.label" :value="v.value" :key="v.value" />
        </el-select>
      </template>
      <template v-else>
        <el-input v-model="formValues[item.field]" :maxlength="item.maxLength" :placeholder="item.placeholder || '请输入'" :disabled="item.disabled" clearable />
      </template>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'

const props = defineProps({
  formItemList: {
    type: Array,
    default: []
  },
  data: {
    type: Object,
    default: {}
  },
})

const ruleFormRef = ref()

const validFields = () => {
  if (!ruleFormRef.value) return
  return new Promise((resolve, reject) => {
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        resolve(formValues)
      } else {
        reject(fields)
      }
    })
  })
}

const dataRef = props
  .formItemList
  .filter(v => v.field)
  .reduce((obj, cur) => {
    obj[cur.field] = cur.initValue || ''
    return obj
  }, {})

const rulesRef = props
  .formItemList
  .filter(v => v.field)
  .reduce((obj, cur) => {
    obj[cur.field] = cur.rules || []
    return obj
  }, {})

const rules = reactive({ ...rulesRef })

const formValues = reactive({ ...dataRef })

watch(() => props.data, () => {
  Object.keys(props.data).forEach(key => {
    formValues[key] = props.data[key]
  })
})

const resetFormData = v => {
  Object.keys(formValues).forEach(key => {
    formValues[key] = dataRef[key]
  })
  v.onClick(dataRef);
}

// {
//   type: 'input | textarea | select | btnList',
//   label: '产品分类',
//   placeholder: '请输入',
//   field: 'product',
//   initValue: '1',
//   disabled: true,
//   required: true,
//   rules: [ {} ],
//   optionList: [ { label: '', value: '' }, { label: '', value: '' } ],
//   children: [ { text: '查询', type: 'submit', onClick: () => {} }, { text: '重置', onClick: () => {} } ]
// }

// 暴露给父级调用
defineExpose({ validFields })
</script>

<style lang="scss" scoped>
.demo-form-inline {
  :deep(.el-form-item) {
    margin-right: 20px;
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