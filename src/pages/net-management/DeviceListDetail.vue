<template>
  <div class="content-card">
    <div class="card-header">
      <span>{{ mapName[route.query.type] || mapName.add }}设备</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <el-card class="my-card">
      <el-form
        :inline="true"
        ref="ruleFormRef"
        :model="formValues"
        class="demo-form-inline"
        label-width="auto"
        label-suffix="："
        :rules="rules"
      >
        <!-- <el-form-item
          v-if="['edit', 'view'].includes(route.query.type)"
          label="序号"
          >{{ route.params.id }}</el-form-item
        > -->
        <el-form-item label="设备编号" required prop="deviceNo">
          <el-input
            v-model="formValues.deviceNo"
            class="my-input"
            :maxlength="200"
            placeholder="请输入设备编号"
            :disabled="['edit', 'view'].includes(route.query.type)"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="['edit', 'view'].includes(route.query.type)"
          label="当前状态"
        >
          <el-button
            v-if="formValues.deviceStatus === 1"
            type="success"
            plain
            size="small"
            >在线</el-button
          >
          <el-button v-else type="danger" plain size="small">离线</el-button>
        </el-form-item>
        <el-form-item
          v-if="['edit', 'view'].includes(route.query.type)"
          label="激活状态"
        >
          <el-button
            v-if="formValues.activeStatus === 1"
            type="success"
            plain
            size="small"
            >已激活</el-button
          >
          <el-button v-else type="danger" plain size="small">未激活</el-button>
        </el-form-item>
        <el-form-item label="设备型号" required prop="deviceTypeId">
          <el-select
            v-model="formValues.deviceTypeId"
            :disabled="['edit', 'view'].includes(route.query.type)"
            clearable
          >
            <el-option
              v-for="v in optionList"
              :label="v.label"
              :value="v.value"
              :key="v.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="['edit', 'view'].includes(route.query.type)"
          label="绑定门店"
        >
          <el-select
            :model-value="
              (formValues.storeId || []).map((v) => v.value).join(';')
            "
            :class="route.query.type === 'edit' ? 'my-select' : ''"
            @click="route.query.type === 'edit' ? showStoreModal() : () => {}"
            disabled="disabled"
          >
            <el-option
              v-for="v in formValues.storeId"
              :label="v.label"
              :value="v.value"
              :key="v.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备说明" style="width: 100%">
          <el-input
            type="textarea"
            :disabled="route.query.type === 'view'"
            show-word-limit
            :maxlength="500"
            :autosize="{ minRows: 3, maxRows: 5 }"
            v-model="formValues.deviceExplain"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
      </el-form>
      <template v-if="!!formValues.deviceTypeId">
        <el-divider />
        <el-form
          :inline="true"
          class="demo-form-inline"
          label-width="auto"
          label-suffix="："
        >
          <el-form-item label="所属品牌">{{ brandName }}</el-form-item>
          <el-form-item label="出厂时间">{{formValues.createTime && dayjs(formValues.createTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
          <el-form-item label="激活时间">{{formValues.unlockTime && dayjs(formValues.unlockTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
          <el-form-item label="下线时间">{{formValues.updateTime && dayjs(formValues.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
        </el-form>
      </template>
    </el-card>
    <div class="btn-bottom-list" v-if="route.query.type !== 'view'">
      <el-button type="primary" @click.prevent="saveFormData()">保存</el-button>
      <el-button @click.prevent="router.back()">返回</el-button>
    </div>
    <ModalSelect
      v-model:showModal="showModal"
      :getStoreList="getStoreList"
      :value="formValues.storeId || []"
    />
  </div>
</template>
<script setup>
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElDivider,
  ElMessage,
} from "element-plus";
import ModalSelect from "./components/device-list/ModalSelect.vue";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addDevice, editDevice, viewDevice } from "./request/device";
import dayjs from 'dayjs'
import useDeviceTypeStore from '@/store/deviceTypeStore'

const deviceTypeStore = useDeviceTypeStore()

const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const ruleFormRef = ref();
const formValues = ref({});
const mapName = reactive({
  add: "新增",
  edit: "修改",
  view: "查看",
});
const brandName = ref('');
const rules = reactive({
  deviceNo: [
    { required: true, message: "请输入设备编号", trigger: ["blur", "change"] },
  ],
  deviceTypeId: [
    { required: true, message: "请选择设备型号", trigger: ["blur", "change"] },
  ],
});

onMounted(() => {
  if (route.params.id) {
    viewDevice({ deviceId: route.params.id }).then((res) => {
      const { storeId, customName, ...rest } = res
      formValues.value = { ...rest, storeId: [{ label: customName, value: storeId }] };
    });
  }
})

watch(() => formValues.value.deviceTypeId, newVal => {
  const result = deviceTypeStore.deviceTypeList.find(v => v.deviceTypeId === newVal)
  brandName.value = (result || {}).brandName
})

const optionList = computed(() => {
  if (deviceTypeStore.deviceTypeList.length > 0) {
    return deviceTypeStore.deviceTypeList.map(v => ({
      label: v.deviceTypeName,
      value:v.deviceTypeId
    }))
  }
  return []
})

const showStoreModal = () => {
  showModal.value = true;
};

const getStoreList = (list) => {
  const result = list.map((item) => {
    const { storeId: value, storeName: label } = item;
    return { label, value };
  });
  formValues.value = { ...formValues.value, storeId: result };
};

const saveFormData = () => {
  // 保存数据
  if (!ruleFormRef.value) return;
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      const { storeId } = formValues.value

      if (route.params.id) {
        editDevice({ ...formValues.value, deviceId: route.params.id, storeId: storeId[0].value }).then(() => {
          ElMessage.success("修改成功！");
          router.back();
        });
      } else {
        addDevice({ ...formValues.value }).then(() => {
          ElMessage.success("新增成功！");
          router.back();
        });
      }
    }
  });
};
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
