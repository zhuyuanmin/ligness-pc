<template>
  <div class="class-menu">
    <el-menu
      active-text-color="#3894FF"
      background-color="#545c64"
      text-color="#fff"
      :default-active="currentRoute.fullPath"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      router
    >
      <MenuItem :menuRoute="menuRoute" />
    </el-menu>
    <div class="right-content">
      <div class="nav-bar">
        <div class="left">
          <el-icon :size="25" color="#666" class="class-expand">
            <template v-if="isCollapse"><Expand @click="isCollapse = !isCollapse" /></template>
            <template v-else><Fold @click="isCollapse = !isCollapse" /></template>
          </el-icon>
          <el-breadcrumb separator=">">
            <template v-for="item in breadcrumbList">
              <el-breadcrumb-item :key="item.path" v-if="item.path !== currentRoute.fullPath" :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
              <el-breadcrumb-item :key="item.name" v-else>{{item.name}}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <div class="right">
          <img :src="BoyImg" alt="" srcset="">
          <el-dropdown>
            <span class="el-dropdown-link">
              吴总
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import BoyImg from '@/assets/boy.png'
import GirlImg from '@/assets/girl.png'
import { menuRoute } from '@/router'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Expand, Fold, ArrowDown } from '@element-plus/icons-vue'
import MenuItem from '@/components/MenuItem.vue'
import {
  ElRadioGroup,
  ElRadioButton,
  ElMenu,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus'

const router = useRouter()
const isCollapse = ref(false)
const curRoute = router.currentRoute.value
const listBreadcrumb = curRoute.matched.filter(v => v.path !== '/')
const breadcrumbList = ref(listBreadcrumb)
const currentRoute = ref(curRoute)

const handleLogout = () => {
  // 清理 token 信息
  router.replace('/login')
}

watch(() => router.currentRoute.value, () => {
  const curRoute = router.currentRoute.value
  const listBreadcrumb = curRoute.matched.filter(v => v.path !== '/')
  breadcrumbList.value = listBreadcrumb
  currentRoute.value = curRoute
})
</script>

<style lang="scss" scoped>
.class-menu {
  display: flex;
  .right-content {
    flex: 1;
    height: 100vh;
    min-width: calc(100% - 250px);
    max-width: calc(100% - 64px);
    .content {
      background-color: #EFF0F1;
      padding: 16px;
      box-sizing: border-box;
      height: calc(100% - 56px);
    }
  }
  .nav-bar {
    display: flex;
    justify-content: space-between;
    height: 55px;
    border-bottom: 1px solid #f9f9ff;
    display: flex;
    .left {
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      margin-right: 16px;
      align-items: center;
      img {
        width: 20px;
        margin-right: 4px;
      }
      :deep(.el-dropdown-link) {
        display: flex;
        align-items: center;
      }
    }
    .class-expand {
      margin-left: 10px;
      margin-right: 30px;
    }
  }
}
.el-menu-vertical-demo {
  height: 100vh;
  overflow-y: auto;
  :deep(.el-menu-item, .el-sub-menu) {
    font-size: 14px;
    span, .el-menu-item-group__title {
      font-size: 14px;
    }
    .el-icon {
      font-size: 16px;
      margin-right: 8px;
      transform: translateY(-3px);
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
}
</style>
