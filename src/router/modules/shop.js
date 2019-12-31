/**
 * 门店管理
 */
import Layout from '@/layout'

const shopRouter = {
  path: '/shop',
  component: Layout,
  name: 'shop',
  meta: { title: '门店管理', icon: 'shop' },
  children: [
    {
      path: '',
      name: 'shoplist',
      component: () => import('@/views/shop/shoplist'),
      meta: { title: '门店列表', icon: 'shoplist', auth: true }
    },
    {
      path: '/shop/stafflist',
      name: 'stafflist',
      hidden: true,
      component: () => import('@/views/shop/stafflist'),
      meta: { title: '员工列表', icon: 'staff', auth: true }
    }
  ]
}
export default shopRouter
