import request from './index'
import api from '@/config/api'

// 查询设备型号列表
export const getDeviceTypeList = async params => {
  return await request({
    url: api.deviceType.list,
    method: 'post',
    data: params
  })
}

// 新增设备型号
export const addDeviceType = async params => {
  return await request({
    url: api.deviceType.add,
    method: 'post',
    data: params
  })
}

// 编辑设备型号
export const editDeviceType = async params => {
  return await request({
    url: api.deviceType.edit,
    method: 'post',
    data: params
  })
}

// 删除设备型号
export const deleteDeviceType = async params => {
  return await request({
    url: api.deviceType.delete,
    method: 'post',
    data: params
  })
}

// 查看设备型号
export const viewDeviceType = async params => {
  return await request({
    url: api.deviceType.view,
    method: 'post',
    data: params
  })
}
