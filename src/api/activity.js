import request from '@/utils/request'

export function getactivityList(query) {
  return request({
    url: '/api/activity/list',
    method: 'get',
    params: query
  })
}
export function getAdminList(query) {
  return request({
    url: '/api/admin/list',
    method: 'get',
    params: query
  })
}
export function postactivity(data) {
  return request({
    url: '/api/activity/save',
    method: 'post',
    data
  })
}

export function getRegion() {
  return request({
    url: '/api/region/select_list',
    method: 'get',
    params: {
      type: 'district'
    }
  })
}
export function deleteactivity(data) {
  return request({
    url: '/api/activity/delete',
    method: 'delete',
    data
  })
}
// 获取订单列表
export function getOrderList(query) {
  return request({
    url: '/api/activity/order/list',
    method: 'get',
    params: query
  })
}
// 编辑订单信息
export function postactivityOrder(data) {
  return request({
    url: '/api/activity/order/save',
    method: 'post',
    data
  })
}
// 获取订单交易类型
export function getPaytype() {
  return request({
    url: '/api/parameter/item',
    method: 'get',
    params: {
      pid: 'PAY_TYPE'
    }
  })
}
// 删除订单
export function deleteOrder(data) {
  return request({
    url: '/api/activity/order/delete',
    method: 'delete',
    data
  })
}
// 管理员列表
export function getAdminerList(query) {
  return request({
    url: '/api/activity/admin/list',
    method: 'get',
    params: query
  })
}

// 管理员新增
export function Adminadd(data) {
  return request({
    url: '/api/activity/admin/add_user',
    method: 'post',
    data
  })
}
// 修改管理员状态
export function AdminSave(data) {
  return request({
    url: '/api/activity/admin/save',
    method: 'post',
    data
  })
}
// 删除管理员记录
export function deleteadminer(data) {
  return request({
    url: '/api/activity/admin/delete',
    method: 'delete',
    data
  })
}
// 客户签到列表
export function getOrderListSign(query) {
  return request({
    url: '/api/activity/sign/list',
    method: 'get',
    params: query
  })
}
// 回访列表
export function getOrderListReview(query) {
  return request({
    url: '/api/activity/review/list',
    method: 'get',
    params: query
  })
}
// 获取活动品牌列表
export function getBrandList(query) {
  return request({
    url: '/api/activity/activitybrand/list',
    method: 'get',
    params: query
  })
}
// 添加活动品牌
export function Brandadd(data) {
  return request({
    url: '/api/activity/activitybrand/add',
    method: 'post',
    data
  })
}
// 编辑活动品牌
export function Brandsave(data) {
  return request({
    url: '/api/activity/activitybrand/save',
    method: 'post',
    data
  })
}
// 删除活动品牌
export function deleteActivebrand(data) {
  return request({
    url: '/api/activity/activitybrand/delete',
    method: 'delete',
    data
  })
}
// 获取活动需求列表
export function getDemandList(query) {
  return request({
    url: '/api/activity/demand/list',
    method: 'get',
    params: query
  })
}

// 添加活动需求
export function Demandadd(data) {
  return request({
    url: '/api/activity/demand/add',
    method: 'post',
    data
  })
}
// 删除活动需求
export function deleteDemand(data) {
  return request({
    url: '/api/activity/demand/delete',
    method: 'delete',
    data
  })
}

// 盖章列表 
export function getStampList(query) {
  return request({
    url: '/api/activity/stamp/list',
    method: 'get',
    params: query
  })
}
// 客户列表 
export function getCustomerList(query) {
  return request({
    url: '/api/activity/customer/list',
    method: 'get',
    params: query
  })
}
// 编辑客户
export function Customersave(data) {
  return request({
    url: '/api/activity/customer/save',
    method: 'post',
    data
  })
}
// 编辑盖章信息
export function Stampsave(data) {
  return request({
    url: '/api/activity/stamp/save',
    method: 'post',
    data
  })
}
// 获取客户
export function getCusttype() {
  return request({
    url: '/api/parameter/item',
    method: 'get',
    params: {
      pid: ' SOURCE'
    }
  })
}
// 删除客户记录
export function deleteCustomer(data) {
  return request({
    url: '/api/activity/customer/delete',
    method: 'delete',
    data
  })
}
// 删除盖章
export function deleteStamp(data) {
  return request({
    url: '/api/activity/stamp/delete',
    method: 'delete',
    data
  })
}
// 门店列表
export function getShopid(query) {
  return request({
    url: '/api/store/list',
    method: 'get',
    params: query
  })
}
// 管理员编辑
export function Adminsave(data) {
  return request({
    url: '/api/activity/admin/save_user',
    method: 'post',
    data
  })
}
// 管理员新增
export function Orderadd(data) {
  return request({
    url: '/api/activity/order/add',
    method: 'post',
    data
  })
}