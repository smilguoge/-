/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const managRouter = {
  path: '/manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'management',
  meta: {
    title: '内容管理',
    icon: 'mang'
  },
  children: [
    {
      path: 'taglist',
      component: () => import('@/views/management/taglist'),
      name: 'TagList',
      meta: { title: '标签列表', icon: 'tag', auth: true }
    },
    {
      path: 'about',
      component: () => import('@/views/management/about'),
      name: 'contentList',
      meta: { title: '关于我们', icon: 'about', auth: true }
    },
    {
      path: 'helpslist',
      component: () => import('@/views/management/helpslist'),
      name: 'helpList',
      meta: { title: '帮助列表', icon: 'helps', auth: true }
    }
  ]
}
export default managRouter
