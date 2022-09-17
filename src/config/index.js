import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/',
  timeout: 10000,
})

service.interceptors.request.use(
  function (config) {
    return config
  },
  error => {
    ElMessageBox.confirm(
      error.message,
      '提示',
      {
        showCancelButton: false,
        showConfirmButton: false,
        draggable: true,
        type: 'error',
      }
    )
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  function (config) {
    if (config.data.code !== 200) {
      ElMessage.error(config.data.msg)
      return Promise.reject(error)
    }
    return config
  },
  error => {
    ElMessageBox.confirm(
      error.response ? error.response.status === 404 ? '接口不存在！' : error.response.statusText : '响应超时！',
      '提示',
      {
        showCancelButton: false,
        showConfirmButton: false,
        draggable: true,
        type: 'error',
      }
    )
    return Promise.reject(error)
  }
)

export default service
