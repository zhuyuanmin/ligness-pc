<template>
  <div class="box-card">
    <div class="card-header">
      <span>{{mapName[route.query.type] || mapName.add}}设备型号</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <BasicInfoCard ref="basicRef" :data="deviceTypeData" />
    <UnlockedWayCard ref="unlockRef" :data="deviceTypeData" />
    <div class="btn-bottom-list" v-if="route.query.type !== 'view'">
      <el-button type="primary" @click.prevent="saveFormData()">保存</el-button>
      <el-button @click.prevent="router.back()">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { ElButton, ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BasicInfoCard from './components/device-model-detail/BasicInfoCard.vue'
import UnlockedWayCard from './components/device-model-detail/UnlockedWayCard.vue'
import { addDeviceType, editDeviceType, viewDeviceType } from './request/deviceType'

const router = useRouter()
const route = useRoute()
const basicRef = ref()
const unlockRef = ref()
const deviceTypeData = ref({})

const mapName = reactive({
  'add': '新增',
  'edit': '修改',
  'view': '查看',
})

onMounted(() => {
  if (route.params.id) {
    viewDeviceType({ deviceTypeId: route.params.id }).then(res => {
      console.log(res)
      deviceTypeData.value = res
    })
  }
})

const saveFormData = () => {
  // 保存数据
  if (!basicRef.value && !unlockRef.value) return
  basicRef.value.getSearchFormValue().then(values => {
    console.log('values', values)

    const switchValue = unlockRef.value.getSwitchValue()

    if (route.params.id) {
      editDeviceType({ ...values, id: route.params.id, status: switchValue ? 1 : 0 }).then(() => {
        ElMessage.success('修改成功！')
        router.back()
      })
    } else {
      addDeviceType({ ...values, status: switchValue ? 1 : 0 }).then(() => {
        ElMessage.success('新增成功！')
        router.back()
      })
    }
  }).catch(fields => {
    console.error('fields', fields)
  })
}

</script>
<style lang="scss" scoped>
.box-card {
  border: none;
  width: 100%;
}
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
</style>