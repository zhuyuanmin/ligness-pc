<template>
  <el-config-provider :locale="zhCN">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCN from 'element-plus/lib/locale/lang/zh-cn'
</script>
<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
</style>
