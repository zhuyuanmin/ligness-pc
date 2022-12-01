<template>
  <div class="container">
    <template v-if="currentRoute.fullPath === '/brand-management'">
      <SearchComp :formItemList="searchFields" />

      <ul class="brand-list">
        <template v-if="brandList.length > 0">
          <li class="card" v-for="item in brandList" :key="item.id">
            <el-card>
              <div class="top"><img :src="item.imgPath" alt="图片" srcset=""></div>
              <p>{{item.brandName}}</p>
              <el-divider />
              <div class="btn-list">
                <el-button text type="primary" size="small" @click.prevent="viewRow(item, 'edit')">编辑</el-button>
                <el-button text type="danger" size="small" @click.prevent="deleteRow(item)">删除</el-button>
              </div>
            </el-card>
          </li>
        </template>
        <template v-else>
          <div class="empty-data">暂无数据</div>
        </template>
      </ul>
    </template>
    <template v-else><router-view /></template>
  </div>
</template>
<script setup>
import SearchComp from "@/components/SearchComp.vue";
import { ElCard, ElDivider, ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { getBrandList, deleteBrand } from './request/brand'
import useBrandStore from '@/store/brandStore'

const brandStore = useBrandStore()

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
        fetchListData({ ...values })
      } },
      { text: "重置", type: "reset", onClick: () => {
        fetchListData({})
      } },
      { text: "新增品牌", style: 'primary', onClick: () => viewRow() },
    ],
  },
]);

const brandList = ref([])

const router = useRouter()

const curRoute = router.currentRoute.value
const currentRoute = ref(curRoute)

const fetchListData = params => {
  getBrandList(params).then(res => {
    brandList.value = res
    brandStore.updateBrandList(res || [])
  })
}

onMounted(() => {
  if (currentRoute.value.fullPath === '/brand-management') {
    fetchListData({})
  }
})

watch(() => router.currentRoute.value, (newVal) => {
  currentRoute.value = newVal

  if (newVal.fullPath === '/brand-management') {
    fetchListData({})
  }
})

const viewRow = (row, type) => {
  if (row) {
    router.push(`/brand-management/detail/${row.brandId}?type=${type}`)
  } else {
    router.push('/brand-management/detail')
  }
}

const deleteRow = row => {
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
    deleteBrand({ brandId: row.brandId }).then(res => {
      ElMessage.success('操作成功！')
      fetchListData({})
    })
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

  .empty-data {
    color: #909399;
    font-size: 14px;
    text-align: center;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #E7EBF2;
  }

  .brand-list {
    padding: 0;
    margin: 0;
    margin-top: 24px;
    overflow: hidden;
    .card {
      max-width: 350px;
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