import { asyncRoutes, constantRoutes } from '@/router'
import { getMenus } from '@/api/menu'
import layout from '@/layout/index'
import { logger } from 'runjs/lib/common'
/** 
 * 使用meta。角色来确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 向后端请求路由数据生成路由 或者 进行路由对比
      getMenus().then((res) => {
        const menusData = res.data;
        //获取tree结构路由数据  改为路由
        let menus = convertRouter(menusData)
        menus.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', menus)
        resolve(menus)
      });

      // // 通过角色对比路由
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

//获取tree结构路由数据  改为路由
function convertRouter(asyncRoutes) {
  let finallyRoutes = []
  for(let i = 0; i<asyncRoutes.length;i++){
    const temp = asyncRoutes[i]
    const router = {
      meta:{title:''}
    }
    const meta = {}
    meta['title'] = temp.name
    meta['name'] =  temp.name
    router['component'] = layout
    router['name'] = temp.path
    router['path'] = temp.path
    router.meta.title = temp.name
    if(temp.subMenus!=null){
      router.children = []  
      temp.subMenus.forEach((item,index)=>{
        // console.log(item.path.split('/')[1],'0000000000');
        router.children.push({
          path:item.path,
          name:item.name,
          component: (resolve) => require([`@/views${router['path']}${item.path}`], resolve),
          meta:{
            title:item.name
          }
        })
      })
    }
    finallyRoutes.push(router)
  
  }
  return finallyRoutes
}






export default {
  namespaced: true,
  state,
  mutations,
  actions
}
