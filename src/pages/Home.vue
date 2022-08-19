<template>
  <div class="container">
    <MenuBar />
  </div>
</template>
<script setup>
import MenuBar from '@/components/MenuBar.vue'
// import counterStore from "@/store/counter2"
// const counter = counterStore()
// setTimeout(() => {
//   counter.count++
//   // 带自动补全 ✨
//   counter.$patch({ count: counter.count + 1 })
//   // 或使用 action 代替
//   counter.increment()
// }, 1000)
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
}
</style>