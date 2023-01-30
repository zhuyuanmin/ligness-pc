<template>
  <ul class="ul-class">
    <li v-for="item in codeList" :key="item.boxNo">
      <img :src="item.url" alt="" srcset="">
      <!-- <p>{{ item.boxNo }}</p> -->
    </li>
  </ul>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import QRCode from "qrcode"
import { useRouter } from 'vue-router'

const router = useRouter()

const codeList = ref([])

const list = window.sessionStorage.getItem('list')
if (list) {
  const newList = JSON.parse(list)
  const pAll = newList.map(v => {
    return new Promise(resolve => {
      const enCode = window.btoa(`${v.duration || ''}@${v.boxNo}@${v.boxAvailableTimes || ''}`)
      QRCode.toDataURL(enCode, {
        width: 200,
        height: 200,
        margin: 1,
        errorCorrectionLevel: "H"
      })
        .then(url => resolve({ url, boxNo: v.boxNo }))
        .catch((err) => {
          console.error(err);
        });
      })
    })
  Promise.allSettled(pAll).then(resList => {
    const result = resList.filter(v => v.status === "fulfilled").map(v => v.value)
    codeList.value = result
    window.sessionStorage.removeItem('list')

    nextTick(() => {
      window.print();
      window.close();
    })
  })
} else {
  router.replace('/404')
}
</script>
<style lang="scss" scoped>
.ul-class {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  li {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    p {
      font-size: 12px;
      margin: 0;
      transform: translateY(-14px);
    }
  }
}
</style>