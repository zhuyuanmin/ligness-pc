<template>
  <div class="box-card">
    <div class="card-header">
      <span>{{mapName[route.query.type] || mapName.add}}设备型号 {{route.params.id}}</span>
      <el-button class="button" @click="router.back()">返回</el-button>
    </div>
    <BasicInfoCard ref="basicRef" />
    <UnlockedWayCard />
    <div class="btn-bottom-list" v-if="route.query.type !== 'view'">
      <el-button type="primary" @click.prevent="saveFormData()">保存</el-button>
      <el-button @click.prevent="router.back()">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { ElCard, ElButton } from 'element-plus'
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BasicInfoCard from './components/device-model-detail/BasicInfoCard.vue'
import UnlockedWayCard from './components/device-model-detail/UnlockedWayCard.vue'
const router = useRouter()
const route = useRoute()
const basicRef = ref()

const mapName = reactive({
  'add': '新增',
  'edit': '修改',
  'view': '查看',
})

const saveFormData = () => {
  // 保存数据
  if (!basicRef.value) return
  basicRef.value.getSearchFormValue().then(values => {
    console.log('values', values)
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