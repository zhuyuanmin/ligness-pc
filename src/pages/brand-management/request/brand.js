import request from './index'
import api from '@/config/api'

// 查询品牌列表
export const getBrandList = async params => {
  return await request({
    url: api.brand.list,
    method: 'post',
    data: params
  })
}

// 新增品牌
export const addBrand = async params => {
  return await request({
    url: api.brand.add,
    method: 'post',
    data: params
  })
}

// 编辑品牌
export const editBrand = async params => {
  return await request({
    url: api.brand.edit,
    method: 'post',
    data: params
  })
}

// 删除品牌
export const deleteBrand = async params => {
  return await request({
    url: api.brand.delete,
    method: 'post',
    data: params
  })
}

// 查看品牌
export const viewBrand = async params => {
  return await request({
    url: api.brand.view,
    method: 'post',
    data: params
  })
}
