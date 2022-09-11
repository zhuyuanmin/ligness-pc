import request from '@/utils'
import api from '@/config/api'

// 设备统计分析
export const getDeviceAnalysis = async params => {
  return await request({
    url: api.device.analysis,
    method: 'post',
    data: params
  })
}
