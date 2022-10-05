import { defineStore } from 'pinia'
import { getDeviceTypeList } from '@/pages/net-management/request/deviceType'

export default defineStore('deviceTypeModel', {
  state: () => ({
    deviceTypeList: []
  }),
  actions: {
    updateDeviceTypeList(list) {
      this.deviceTypeList = list
    },
    fetchDeviceTypeList(cb) {
      getDeviceTypeList({}).then(res => {
        this.deviceTypeList = res?.pageList || []
        cb && cb(this.deviceTypeList)
      })
    }
  },
})
