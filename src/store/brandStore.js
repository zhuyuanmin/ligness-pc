import { defineStore } from 'pinia'
import { getBrandList } from '@/pages/brand-management/request/brand'

export default defineStore('brandModel', {
  state: () => ({
    brandList: []
  }),
  actions: {
    updateBrandList(list) {
      this.brandList = list
    },
    fetchBrandList(cb) {
      getBrandList({}).then(list => {
        this.brandList = list
        cb && cb(list)
      })
    }
  },
})
