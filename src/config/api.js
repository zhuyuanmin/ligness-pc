const baseUrl = "/ligness";

// 登录接口
const login = baseUrl + "/staff/login";
// 上传接口
const upload = baseUrl + "/attachment/upload";

// 物联网管理
// 1. 设备型号管理
const deviceType = {
  list: baseUrl + "/devicetype/selectByConditionPage", // 查询设备型号列表
  add: baseUrl + "/devicetype/insertSelective", // 新增设备型号
  edit: baseUrl + "/devicetype/updateByPrimaryKeySelective", // 编辑设备型号
  delete: baseUrl + "/devicetype/deleteByPrimaryKey", // 删除设备型号
  view: baseUrl + "/devicetype/selectByPrimaryKey", // 查看设备型号

  bindProductList: baseUrl + "/devicetypeproduct/selectByProductInfoPage", // 查询设备型号下的产品列表
  unBindProduct: baseUrl + "/devicetypeproduct/deleteByPrimaryKey", // 解绑设备型号下的产品
  bindProduct: baseUrl + "/devicetypeproduct/batchBind", // 设备型号批量绑定产品
};

// 2. 设备管理
const device = {
  list: baseUrl + "/device/selectByDeviceInfoPage", // 查询设备列表
  add: baseUrl + "/device/insertSelective", // 绑定（新增）设备
  edit: baseUrl + "/device/updateByPrimaryKeySelective", // 编辑设备
  delete: baseUrl + "/device/deleteByPrimaryKey", // 删除设备
  view: baseUrl + "/device/selectByPrimaryKey", // 查看设备
  usage: baseUrl + "/usagelog/selectByDeviceInfoPage", // 查询设备使用记录
  analysis: baseUrl + "/device/statistics", // 设备统计分析
};

// 产品管理
const product = {
  list: baseUrl + "/product/selectByProductInfoPage", // 查询产品列表和库存列表
  add: baseUrl + "/product/insertSelective ", // 添加产品
  edit: baseUrl + "/product/updateByPrimaryKeySelective", // 编辑产品（上下架/套盒绑定门店）
  delete: baseUrl + "/product/deleteByPrimaryKey", // 删除产品
  view: baseUrl + "/product/selectByPrimaryKey", // 查看产品

  entryStore: baseUrl + "/product/enterStorehouse", // 产品入库
  entryStoreRecord: baseUrl + "/batch/selectByProductInfoPage", // 入库记录
  batchBox: baseUrl + "/box/selectByConditionPage", // 查询批次下套盒列表
  updBatchBox: baseUrl + "/box/updateByPrimaryKeySelective", // 更新套盒信息
  consume: baseUrl + "/boxconsume/selectByProductInfoPage", // 套盒消耗列表
  consumeDetail: baseUrl + "/boxconsume/selectByProductInfo", // 查询套盒消耗明细
};

// 门店管理
const shop = {
  list: baseUrl + "/store/selectByConditionPage", // 查询门店列表
  add: baseUrl + "/store/insertSelective ", // 新增门店
  edit: baseUrl + "/store/updateByPrimaryKeySelective", // 编辑门店
  delete: baseUrl + "/store/deleteByPrimaryKey", // 删除门店
  view: baseUrl + "/store/selectByPrimaryKey", // 查询门店详情
};

// 员工管理
const staff = {
  list: baseUrl + "/staff/selectByConditionPage", // 查询员工列表
  add: baseUrl + "/staff/insertSelective", // 新增用户
  edit: baseUrl + "/staff/updateByPrimaryKeySelective", // 编辑用户(修改密码)
  delete: baseUrl + "/staff/deleteByPrimaryKey", // 删除用户
  view: baseUrl + "/staff/selectByPrimaryKey", // 查看员工
};

// 品牌管理
const brand = {
  list: baseUrl + "/brand/selectAll", // 查询品牌列表
  add: baseUrl + "/brand/insertSelective", // 新增品牌
  edit: baseUrl + "/brand/updateByPrimaryKeySelective", // 编辑品牌
  delete: baseUrl + "/brand/deleteByPrimaryKey", // 删除品牌
  view: baseUrl + "/brand/selectByPrimaryKey", // 查看品牌
};

export default {
  login,
  upload,
  deviceType,
  device,
  product,
  shop,
  staff,
  brand,
};
