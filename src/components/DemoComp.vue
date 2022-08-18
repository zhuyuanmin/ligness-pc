<template>
  <el-carousel
    :interval="5000"
    arrow="always"
    :height="height"
  >
    <el-carousel-item v-for="(item, index) in list[store.state.activeKey]" :key="index">
      <h3 class="img-height"><img :src="item" alt="" /></h3>
    </el-carousel-item>
  </el-carousel>
  <slot :height="height"></slot>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";
import { ElCarousel, ElCarouselItem } from "element-plus";

const height = ref("");
const store = useStore();

const props = defineProps({
  data: {
    type: Object,
  },
})

const emit = defineEmits(["activeEmit"])

const activeHandle = index => {
  emit("activeEmit", index);
}

onMounted(() => {
  setTimeout(() => {
    computeImgHeight();
  }, 500);
});

watch(() => store.state.activeKey, () => {
  setTimeout(() => {
    computeImgHeight();
  }, 500);
})

onUnmounted(() => {
  window.removeEventListener("resize", computeImgHeight);
});
</script>
<style lang="scss">
.el-carousel__item .img-height {
  color: #475669;
  opacity: 0.75;
  margin: 0;
  img {
    width: 100%;
  }
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>