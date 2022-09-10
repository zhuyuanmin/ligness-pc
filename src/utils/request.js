import request from './index'
import api from '@/config/api'

// 登录接口
export const login = async params => {
  return await request({
    url: api.login,
    method: 'post',
    data: params
  })
}

// 上传接口
export const upload = async params => {
  return await request({
    url: api.upload,
    method: 'post',
    data: params
  })
}
