import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io-site/guide/essentials/router-and-nav.html
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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
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
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
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
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/table',
    component: Layout,
    // redirect: '@/views/permission/dtuInfo',
    name: 'Table',
    meta: {
      title: '表格示例',
      icon: 'table',
      roles: ['admin'] // 您可以在root导航中设置角色
    },
    children: [
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'role',
        meta: {
          title: '角色表格',
          roles: ['admin']
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '没有配权限'
          // 如果不设置角色，则表示:此页面不需要权限
        }
      }
    ]
  },
  {
    path: '/dtu',
    component: Layout,
    name: 'Dtu',
    meta: {
      title: '设备参数',
      icon: 'dtu',
      roles: ['admin']
    },
    children: [
      {
        path: 'dtuInfo',
        component: () => import('@/views/dtu/dtuInfo'),
        name: 'table',
        meta: { title: 'dtu设备' },
        roles: ['admin']
      },
      {
        path: 'checkingRules',
        component: () => import('@/views/dtu/checkingRules'),
        name: 'checkingRules',
        meta: { title: '指令校验规则' },
        roles: ['admin']
      },
      {
        path: 'relay',
        component: () => import('@/views/dtu/relay'),
        name: 'relay',
        meta: { title: '继电器设备' },
        roles: ['admin']
      },
      {
        path: 'CommandStatus',
        component: () => import('@/views/dtu/commandStatus'),
        name: 'CommandStatus',
        meta: { title: '命令状态' },
        roles: ['admin']
      },
      {
        path: 'sensor',
        component: () => import('@/views/dtu/sensor'),
        name: 'sensor',
        meta: { title: '感应器' },
        roles: ['admin']
      }, {
        path: 'instructionDefinition',
        component: () => import('@/views/dtu/instructionDefinition'),
        name: 'instructionDefinition',
        meta: { title: '继电器定义指令' },
        roles: ['admin', 'instructionDefinition']
      }, {
        path: 'sensorData',
        component: () => import('@/views/dtu/sensorData'),
        name: 'sensorData',
        meta: { title: '传感器数据' },
        roles: ['admin', 'sensorData']
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
