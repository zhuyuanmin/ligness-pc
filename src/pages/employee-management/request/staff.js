import request from './index'
import api from '@/config/api'

// 查询员工列表
export const getStaffList = async params => {
  return await request({
    url: api.staff.list,
    method: 'post',
    data: params
  })
}

// 新增用户
export const addStaff = async params => {
  return await request({
    url: api.staff.add,
    method: 'post',
    data: params
  })
}

// 编辑用户(修改密码)
export const editStaff = async params => {
  return await request({
    url: api.staff.edit,
    method: 'post',
    data: params
  })
}

// 删除用户
export const deleteStaff = async params => {
  return await request({
    url: api.staff.delete,
    method: 'post',
    data: params
  })
}

// 查看员工
export const viewStaff = async params => {
  return await request({
    url: api.staff.view,
    method: 'post',
    data: params
  })
}
