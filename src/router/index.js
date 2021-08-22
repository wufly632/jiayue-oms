import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is true)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes 恒定路由
 * 没有权限要求的页面，所有角色都可进入
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  }
]

/**
 * asyncRoutes 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  


  {
    path: '/style',
    component: Layout,
    redirect: '/style/index',
    // alwaysShow: true,
    name: 'Style',
    meta: {
      title: '风格管理',
      icon: 'nested',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/style/index'),
        name: 'indexStyle',
        hidden: true,
        meta: {
          title: '风格列表',
          roles: ['admin', 'editor'],
          activeMenu: '/style'
        }
      }
    ]
  },

  {
    path: '/category',
    component: Layout,
    redirect: '/category/index',
    // alwaysShow: true,
    name: 'Category',
    meta: {
      title: '类目管理',
      icon: 'tree-table',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/category/index'),
        name: 'indexCategory',
        hidden: true,
        meta: {
          title: '类目列表',
          roles: ['admin', 'editor'],
          activeMenu: '/category'
        }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    // alwaysShow: true,
    name: 'Product',
    meta: {
      title: '产品管理',
      icon: 'form',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/product/index'),
        name: 'indexProduct',
        hidden: true,
        meta: {
          title: '产品列表',
          roles: ['admin', 'editor'],
          activeMenu: '/product'
        }
      },
      {
        path: 'create',
        component: () => import('@/views/product/detail'),
        name: 'createProduct',
        hidden: true,
        meta: {
          title: '创建产品',
          roles: ['admin', 'editor'],
          activeMenu: '/product/index'
        }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/product/detail'),
        name: 'detailProduct',
        hidden: true,
        meta: {
          title: '产品详情',
          roles: ['admin', 'editor'],
          activeMenu: '/product/index'
        }
      }
    ]
  },


  {
    path: '/mobile',
    component: Layout,
    redirect: '/mobile/index',
    // alwaysShow: true,
    name: 'Mobile',
    meta: {
      title: 'M站管理',
      icon: 'form',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'case',
        component: () => import('@/views/mobile/case'),
        name: 'caseMobile',
        meta: {
          title: '精品案例',
          roles: ['admin', 'editor'],
        }
      },
      {
        path: 'address',
        component: () => import('@/views/mobile/address'),
        name: 'addressMobile',
        meta: {
          title: '地址管理',
          roles: ['admin', 'editor'],
        }
      },
      {
        path: 'aboutus',
        component: () => import('@/views/mobile/aboutus'),
        name: 'aboutusMobile',
        meta: {
          title: '关于我们',
          roles: ['admin', 'editor'],
        }
      },
      {
        path: 'contactus',
        component: () => import('@/views/mobile/contactus'),
        name: 'contactusMobile',
        meta: {
          title: '联系我们',
          roles: ['admin', 'editor'],
        }
      },
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
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
