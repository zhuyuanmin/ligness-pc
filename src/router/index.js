import { createRouter, createWebHistory } from 'vue-router'

export const menuRoute = [
  {
    path: '/net-management',
    name: '物联网管理',
    icon: 'net-manage-icon',
    redirect: '/net-management/device-model-list',
    children: [
      {
        path: '/net-management/device-model-list',
        name: '设备型号管理',
        component: () => import('@/pages/net-management/DeviceModelList.vue'),
        children: [
          {
            path: '/net-management/device-model-list/detail/:id?',
            name: '设备型号详情',
            hidden: true,
            component: () => import('@/pages/net-management/DeviceModelDetail.vue')
          },
        ]
      },
      {
        path: '/net-management/device-list',
        name: '设备列表',
        component: () => import('@/pages/net-management/DeviceList.vue'),
        children: [
          {
            path: '/net-management/device-list/detail/:id?',
            name: '设备详情',
            hidden: true,
            component: () => import('@/pages/net-management/DeviceListDetail.vue')
          },
        ]
      },
      {
        path: '/net-management/device-use-record',
        name: '设备使用记录',
        component: () => import('@/pages/net-management/DeviceUseRecord.vue')
      },
    ]
  },
  {
    path: '/product-management',
    name: '产品管理',
    icon: 'product-manage-icon',
    redirect: '/product-management/product-list',
    children: [
      {
        path: '/product-management/product-list',
        name: '产品列表',
        component: () => import('@/pages/product-management/ProductList.vue'),
        children: [
          {
            path: '/product-management/product-list/detail/:id?',
            name: '产品详情',
            hidden: true,
            component: () => import('@/pages/product-management/ProductListDetail.vue')
          },
        ]
      },
      {
        path: '/product-management/stock-list',
        name: '库存管理',
        component: () => import('@/pages/product-management/StockList.vue')
      },
      {
        path: '/product-management/stock-use-record',
        name: '消耗明细',
        component: () => import('@/pages/product-management/StockUseRecord.vue'),
        children: [
          {
            path: '/product-management/stock-use-record/detail/:id',
            name: '消耗明细详情',
            hidden: true,
            component: () => import('@/pages/product-management/StockUseRecordDetail.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/customer-management',
    name: '客户管理',
    icon: 'customer-manage-icon',
    redirect: '/customer-management/shop-list',
    children: [
      {
        path: '/customer-management/shop-list',
        name: '门店列表',
        component: () => import('@/pages/customer-management/ShopList.vue'),
        children: [
          {
            path: '/customer-management/shop-list/detail/:id?',
            name: '门店详情',
            hidden: true,
            component: () => import('@/pages/customer-management/ShopListDetail.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/employee-management',
    name: '员工管理',
    icon: 'employee-manage-icon',
    redirect: '/employee-management/member-list',
    children: [
      {
        path: '/employee-management/member-list',
        name: '员工列表',
        component: () => import('@/pages/employee-management/MemberList.vue')
      },
    ]
  },
  {
    path: '/brand-management',
    name: '品牌管理',
    icon: 'brand-manage-icon',
    component: () => import('@/pages/brand-management/BrandManagement.vue'),
    children: [
      {
        path: '/brand-management/detail/:id?',
        name: '品牌详情',
        hidden: true,
        component: () => import('@/pages/brand-management/BrandManagementDetail.vue')
      },
    ]
  },
  {
    path: '/statistic-analysis',
    name: '统计分析',
    icon: 'statistic-analysis-icon',
    redirect: '/statistic-analysis/device-analysis',
    children: [
      {
        path: '/statistic-analysis/device-analysis',
        name: '设备分析',
        component: () => import('@/pages/statistic-analysis/DeviceAnalysis.vue')
      },
    ]
  },
]

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/pages/Login.vue') },
    { path: '/', component: () => import('@/pages/Home.vue'), redirect: '/net-management', children: menuRoute },
    { path: '/:pathMatch(.*)*', component: () => import('@/pages/404NotFound.vue') },
  ]
})
