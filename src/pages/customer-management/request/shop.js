import request from './index'
import api from '@/config/api'

// 查询门店列表
export const getShopList = async params => {
  return await request({
    url: api.shop.list,
    method: 'post',
    data: params
  })
}

// 新增门店
export const addShop = async params => {
  return await request({
    url: api.shop.add,
    method: 'post',
    data: params
  })
}

// 编辑门店
export const editShop = async params => {
  return await request({
    url: api.shop.edit,
    method: 'post',
    data: params
  })
}

// 删除门店
export const deleteShop = async params => {
  return await request({
    url: api.shop.delete,
    method: 'post',
    data: params
  })
}

// 查看门店
export const viewShop = async params => {
  return await request({
    url: api.shop.view,
    method: 'post',
    data: params
  })
}
