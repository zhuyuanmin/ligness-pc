<template>
  <template v-for="(menu, index) in menuRoute">
    <el-sub-menu :key="menu.name" v-if="menu.children" :index="menu.path">
      <template #title>
        <el-icon v-if="menu.icon"><SvgIcon :iconClass="menu.icon" /></el-icon>
        <span>{{ menu.name }}</span>
      </template>
      <MenuItem :menuRoute="menu.children" />
    </el-sub-menu>
    <el-menu-item :key="index" v-else :index="menu.path">
      <el-icon v-if="menu.icon"><SvgIcon :iconClass="menu.icon" /></el-icon>
      <template #title>{{ menu.name }}</template>
    </el-menu-item>
  </template>
</template>>
<script setup>
import { ElMenu, ElSubMenu, ElMenuItem, ElIcon } from 'element-plus'
import MenuItem from '@/components/MenuItem.vue'
import SvgIcon from '@/components/SvgIcon.vue'
defineProps({
  menuRoute: {
    type: Array,
    default: [],
    require: true
  },
})
</script>