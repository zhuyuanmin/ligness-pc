<template>
  <el-form
    :inline="true"
    ref="ruleFormRef"
    :model="formValues"
    class="demo-form-inline"
    label-width="auto"
    label-suffix="："
    :rules="rules"
  >
    <el-form-item
      v-for="(item, index) in props.formItemList"
      :key="item.field || index"
      :label="item.label"
      :required="item.required"
      :style="['textarea', 'file'].includes(item.type) ? { width: '100%' } : ''"
      :class="['file'].includes(item.type) ? 'my-file' : ''"
      :prop="item.field"
    >
      <template v-if="item.type === 'btnList'">
        <el-button
          v-for="(v, i) in item.children"
          :key="i"
          :type="v.type === 'submit' ? 'primary' : v.style || ''"
          @click="v.type === 'reset' ? resetFormData(v) : v.onClick(formValues)"
        >
          {{ v.text }}
        </el-button>
      </template>
      <template v-else-if="item.type === 'select'">
        <el-select
          v-model="formValues[item.field]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          clearable
        >
          <el-option
            v-for="v in item.optionList"
            :label="v.label"
            :value="v.value"
            :key="v.value"
          />
        </el-select>
      </template>
      <template v-else-if="item.type === 'textarea'">
        <el-input
          type="textarea"
          show-word-limit
          :maxlength="item.maxLength"
          :autosize="{ minRows: 3, maxRows: 5 }"
          v-model="formValues[item.field]"
          :placeholder="item.placeholder || '请输入'"
          :disabled="item.disabled"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'select-custom'">
        <el-select
          :model-value="
            (formValues[item.field] || []).map((v) => v.value).join(';')
          "
          class="my-select"
          :placeholder="item.placeholder"
          @click="item.onClick"
          disabled="disabled"
        >
          <el-option
            v-for="v in formValues[item.field]"
            :label="v.label"
            :value="v.value"
            :key="v.value"
          />
        </el-select>
      </template>
      <template v-else-if="item.type === 'number'">
        <el-input-number
          v-model="formValues[item.field]"
          controls-position="right"
          :min="0"
          :max="item.maxLength"
          :placeholder="item.placeholder || '请输入'"
          :disabled="item.disabled"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'file'">
        <el-upload
          v-model:file-list="formValues[item.field]"
          :action="item.action"
          list-type="picture-card"
          :on-remove="handleRemove"
          :limit="item.limit"
          :on-preview="handleReview"
          :class="formValues[item.field].length === 1 ? 'hide-plus' : ''"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </template>
      <template v-else-if="item.type === 'date'">
        <el-date-picker
          v-model="formValues[item.field]"
          type="date"
          placeholder="item.placeholder || '请选择'"
          :disabled-date="disabledDate"
          format="YYYY/MM/DD"
          :disabled="item.disabled"
        />
      </template>
      <template v-else-if="item.type === 'date-range'">
        <el-date-picker
          v-model="formValues[item.field]"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :disabled-date="disabledDate"
          format="YYYY/MM/DD"
          :disabled="item.disabled"
        />
      </template>
      <template v-else-if="item.type === 'password'">
        <el-input
          v-model="formValues[item.field]"
          type="password"
          :maxlength="item.maxLength"
          :placeholder="item.placeholder || '请输入'"
          :disabled="item.disabled"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'cascade-select'">
        <el-cascader
          :placeholder="item.placeholder || '请选择'"
          v-model="formValues[item.field]"
          :options="item.optionList"
          :disabled="item.disabled"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'radio'">
        <el-radio-group v-model="formValues[item.field]">
          <el-radio
            v-for="v in item.optionList"
            :label="v.value"
            size="large"
            :key="v.value"
          >
            {{v.label}}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else>
        <el-input
          v-model="formValues[item.field]"
          :maxlength="item.maxLength"
          :placeholder="item.placeholder || '请输入'"
          :disabled="item.disabled"
          clearable
        />
      </template>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElButton,
  ElUpload,
  ElIcon,
  ElDatePicker,
  ElCascader,
  ElRadioGroup,
  ElRadio
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps({
  formItemList: {
    type: Array,
    default: [],
  },
  data: {
    type: Object,
    default: {},
  },
});

const ruleFormRef = ref();

const validFields = () => {
  if (!ruleFormRef.value) return;
  return new Promise((resolve, reject) => {
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        resolve(formValues);
      } else {
        reject(fields);
      }
    });
  });
};

const dataRef = props.formItemList
  .filter((v) => v.field)
  .reduce((obj, cur) => {
    obj[cur.field] = cur.initValue ?? "";
    return obj;
  }, {});

const rulesRef = props.formItemList
  .filter((v) => v.field)
  .reduce((obj, cur) => {
    obj[cur.field] = cur.rules || [];
    return obj;
  }, {});

const rules = reactive({ ...rulesRef });

const formValues = reactive({ ...dataRef });

const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const disabledDate = time => {
  return time.getTime() > Date.now()
}

const handleReview = uploadFile => {
  const { url } = uploadFile;
  window.open(url)
};

watch(
  () => props.data,
  () => {
    Object.keys(props.data).forEach((key) => {
      formValues[key] = props.data[key];
    });
  }
);

const resetFormData = (v) => {
  Object.keys(formValues).forEach((key) => {
    formValues[key] = dataRef[key];
  });
  v.onClick(dataRef);
};

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
defineExpose({ validFields });
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
  .my-file {
    :deep(.el-form-item__content) {
      max-width: 100% !important;
      .hide-plus {
        .el-upload--picture-card {
          display: none;
        }
      }
    }
  }
}
</style>