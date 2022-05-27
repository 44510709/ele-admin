import request from '@/utils/request'

//登陆
export function login(data) {
  return request({
    url: '/api-auth/oauth/user/token',
    method: 'post',
    data
  })
}

//获取用户信息
export function getInfo() {
  return request({
    url: '/api-auth/oauth/current/user',
    method: 'get'
  })
}

//查询当前用户菜单
export function getMenus() {
  return request({
    url: '/api-user/menus/current',
    method: 'get'
  })
}




//移除token
export function logout() {
  return request({
    url: '/api-auth/oauth/remove/token',
    method: 'post'
  })
}
