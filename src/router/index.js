import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import tableRouter from './modules/table'

/**
*注意：子菜单仅在路由子项时出现。长度>=1
*详情见：https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*
*hidden：true如果设置为true，项目将不会显示在侧栏中（默认为false）
*alwaysShow:true如果设置为true，将始终显示根菜单
*如果未设置alwaysShow，则当项目有多个子路线时，
*它将变成嵌套模式，否则不显示根菜单
*redirect：如果设置为noRedirect，noRedirect将不会在面包屑中重定向
*name：'router-name'该名称由<keep alive>使用（必须设置！！！）
*meta：{
  roles：['admin'，'editor']控制页面角色（可以设置多个角色）
  title：“标题”侧边栏和面包屑中显示的名称（推荐设置）
  icon：“svg名称”/“el-icon-x”侧边栏中显示的图标
  breadcrumb:false如果设置为false，项目将隐藏在breadcrumb中（默认为true）
  activeMenu:“/example/list”如果设置路径，侧边栏将突出显示您设置的路径
}
*/


/**
*constantRoutes
*没有权限要求的基页
*所有角色都可以访问
*/
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/permission',//权限管理
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, //将始终显示根菜单
    name: 'Permission',
    meta: {
      title: '权限测试页',
      icon: 'password',
      roles: ['admin', 'editor'] // 您可以在根导航中设置角色
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '页面权限',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '指令权限'
          // 如果不设置角色，则表示：此页面不需要权限
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色管理',
          roles: ['admin']
        }
      }
    ]
  },
  tableRouter,//Table
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '路由嵌套',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '外链', icon: 'link' }
      }
    ]
  },
  
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
