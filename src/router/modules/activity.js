import Layout from '@/layout'

const activityRouter = {
  path: '/activity',
  component: Layout,
  redirect: 'noRedirect',
  name: 'activity',
  meta: {
    title: '活动管理',
    icon: 'admin'
  },
  children: [
    // {
    //   path: 'list',
    //   component: () => import('@/views/admin/list'),
    //   name: 'AdminList',
    //   meta: { title: '管理员列表', icon: 'form', auth: true }
    // },
    {
      path: 'list',
      component: () => import('@/views/activity/list'),
      name: 'activityList',
      meta: { title: '活动管理', icon: 'form', auth: true }
    }
  ]
}
export default activityRouter
