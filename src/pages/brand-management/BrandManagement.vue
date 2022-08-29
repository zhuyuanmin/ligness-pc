<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/brand-management'">
      <SearchComp :formItemList="searchFields" />

      <ul class="brand-list">
        <li class="card" v-for="item in brandList" :key="item.id">
          <el-card>
            <div class="top"><img :src="item.logo" alt="" srcset=""></div>
            <p>{{item.name}}</p>
            <el-divider />
            <div class="btn-list">
              <el-button text type="primary" size="small" @click.prevent="viewRow(item, 'edit')">编辑</el-button>
              <el-button text type="danger" size="small" @click.prevent="deleteRow(item)">删除</el-button>
            </div>
          </el-card>
        </li>
      </ul>
    </template>
    <template v-else><router-view /></template>
  </div>
</template>
<script setup>
import SearchComp from "@/components/SearchComp.vue";
import { ElCard, ElDivider, ElButton, ElMessageBox } from 'element-plus'
import { ref, reactive, watch } from "vue";
import { useRouter } from 'vue-router'

const searchFields = reactive([
  {
    type: "input",
    label: "品牌名称",
    placeholder: '请输入品牌名称',
    field: "brandName",
  },
  {
    type: "btnList",
    children: [
      { text: "查询", type: "submit", onClick: values => {
        console.log(values)
      } },
      { text: "重置", type: "reset", onClick: () => {} },
      { text: "新增品牌", style: 'primary', onClick: () => viewRow() },
    ],
  },
]);

const brandList = reactive([
  { id: 2, logo: 'https://sinpm.oss-cn-beijing.aliyuncs.com/images/2021/12/06/16388042811804309.jpg', name: 'ODC' },
  { id: 3, logo: 'https://sinpm.oss-cn-beijing.aliyuncs.com/images/2021/12/09/16390367140031159.jpg', name: '欧迪丝' },
  { id: 15, logo: 'https://sinpm.oss-cn-beijing.aliyuncs.com/images/2022/07/01/16566443192109353.jpg', name: '莱特妮丝' },
])

const router = useRouter()

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal
})

const viewRow = (row, type) => {
  console.log(row);
  if (row) {
    router.push(`/brand-management/detail/${row.id}?type=${type}`)
  } else {
    router.push('/brand-management/detail')
  }
}

const deleteRow = row => {
  console.log(row);
  ElMessageBox.confirm(
    '此操作将永久删除该项，是否继续？',
    '提示',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      draggable: true,
      type: 'warning',
    }
  ).then(() => {
    // 删除操作
  }, () => {})
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #fff;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;

  .brand-list {
    padding: 0;
    margin: 0;
    margin-top: 24px;
    overflow: hidden;
    .card {
      width: 350px;
      list-style: none;
      margin-right: 24px;
      margin-bottom: 24px;
      float: left;
      .top {
        img {
          max-width: 100%;
        }
      }
      .btn-list {
        text-align: right;
        button {
          margin: 0;
        }
      }
    }
  }
}
</style>