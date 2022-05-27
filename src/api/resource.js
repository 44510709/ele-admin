//资源管理
import request from '@/utils/request'

/**
 *  资源管理页面
 * 列表
 * @param {String} name  组织名称
 */
export const getMenus = () => { //列表
    return request({
        url: `/api-user/menus/current`,
        method: 'get'
    })
}

/**
 *  资源管理页面
 * 根据id获取菜单
 * @param {String} id
 */
export const updateMenu = (params) => {
    return request({
        url: `/api-user/menus/getOne/${params}`,
        method: 'get'
    })
}


//添加菜单 或者 更新菜单
export function saveOrUpdateMenus(data) {
    return request({
        url: '/api-user/menus/saveOrUpdate',
        method: 'POST',
        data
    })
}

