import request from '@/utils'
import api from '@/config/api'

// 查询产品列表和库存列表
export const getProductList = async params => {
  return await request({
    url: api.product.list,
    method: 'post',
    data: params
  })
}

// 添加产品
export const addProduct = async params => {
  return await request({
    url: api.product.add,
    method: 'post',
    data: params
  })
}

// 编辑产品（上下架/套盒绑定门店）
export const editProduct = async params => {
  return await request({
    url: api.product.edit,
    method: 'post',
    data: params
  })
}

// 删除产品
export const deleteProduct = async params => {
  return await request({
    url: api.product.delete,
    method: 'post',
    data: params
  })
}

// 查看产品
export const viewProduct = async params => {
  return await request({
    url: api.product.view,
    method: 'post',
    data: params
  })
}

// 产品入库
export const entryProductStore = async params => {
  return await request({
    url: api.product.entryStore,
    method: 'post',
    data: params
  })
}

// 入库记录
export const entryProductStoreRecord = async params => {
  return await request({
    url: api.product.entryStoreRecord,
    method: 'post',
    data: params
  })
}

// 套盒消耗列表
export const consumeProduct = async params => {
  return await request({
    url: api.product.consume,
    method: 'post',
    data: params
  })
}
