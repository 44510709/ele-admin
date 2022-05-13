/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/index-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'el-icon-film'
  },
  children: [
    {
      path: 'table',
      name: 'Table',
      component: () => import('@/views/table/index'),
      meta: { title: '表单',icon: 'el-icon-film'}
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: '拖拽表单' ,icon: 'el-icon-film'}
    },
    
  ]
}
export default tableRouter
