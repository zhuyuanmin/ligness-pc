import request from '@/utils'
import api from '@/config/api'

// 查询设备列表
export const getDeviceList = async params => {
  return await request({
    url: api.device.list,
    method: 'post',
    data: params
  })
}

// 绑定（新增）设备
export const addDevice = async params => {
  return await request({
    url: api.device.add,
    method: 'post',
    data: params
  })
}

// 编辑设备
export const editDevice = async params => {
  return await request({
    url: api.device.edit,
    method: 'post',
    data: params
  })
}

// 删除设备
export const deleteDevice = async params => {
  return await request({
    url: api.device.delete,
    method: 'post',
    data: params
  })
}

// 查看设备
export const viewDevice = async params => {
  return await request({
    url: api.device.view,
    method: 'post',
    data: params
  })
}

// 查询设备使用记录
export const usageDevice = async params => {
  return await request({
    url: api.device.usage,
    method: 'post',
    data: params
  })
}
