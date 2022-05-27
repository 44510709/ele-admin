//菜单路由
import request from '@/utils/request'

//获取路由菜单
export function getMenus(query) {
  return request({
    url: '/api-user/menus/current',
    method: 'get',
    params: query
  })
}