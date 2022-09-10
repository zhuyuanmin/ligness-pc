import { defineStore } from 'pinia'

export default defineStore('userModel', {
  state: () => ({
    userInfo: {
      staffNo: '',
      staffAccount: '',
      staffName: '吴总',
      staffPermRole: '',
      staffLoginPhoneNum: '',
      staffStatus: '',
      staffPwd: '',
      staffEmail: '',
      staffSex: '',
      staffImg: '',
    }
  }),
  actions: {
    updateUserInfo(userInfo) {
      this.userInfo = userInfo
    },
  },
})
