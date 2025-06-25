import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../view/Layout/index.vue'
import Login from '../view/Login/index.vue'
import Register from '../view/Register/index.vue'
import ClubRegistration from '../view/Club/ClubRegistration/index.vue'
import clubRegistrationApproval from '@renderer/view/Club/ClubRegistration/club-registration-approval.vue'
import CreateClub from '../view/Club/CreateClub/index.vue'
import ActivityRegistration from '../view/Activity/ActivityRegistration/index.vue'
// import ActivityPayment from '../view/Activity/ActivityPayment/index.vue'
import CreateActivity from '../view/Activity/CreateActivity/index.vue'
import ClubApproval from '../view/Club/ClubApproval/index.vue'
import NotFound from '../view/Error/NotFound/index.vue'
import Forbidden from '../view/Error/Forbidden/index.vue'
import ClubMember from '../view/Club/ClubMember/index.vue'
import ActivityRegistrationApproval from '../view/Activity/ActivityRegistrationApproval/index.vue'
import ActivityCheckin from '../view/Activity/ActivityCheckin/index.vue'
import ActivityPayment from '../view/Activity/ActivityPayment/index.vue'
const routes = [
  {
    path: '/',
    redirect: '/login',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Layout,
    meta: {
      title: '仪表盘',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'club-registration',
        name: 'club-registration',
        component: ClubRegistration,
        meta: {
          title: '社团报名',
          icon: 'club',
          roles: ['member', 'president']
        }
      },
      {
        path: 'create-club',
        name: 'create-club',
        component: CreateClub,
        meta: {
          title: '创建社团',
          icon: 'create',
          roles: ['president', 'member']
        }
      },
      {
        path: 'club-approval',
        name: 'club-approval',
        component: ClubApproval,
        meta: {
          title: '创建社团审批',
          icon: 'approval',
          roles: ['admin']
        }
      },
      {
        path: 'club-registration-approval',
        name: 'club-registration-approval',
        component: clubRegistrationApproval,
        meta: {
          title: '社团报名审核',
          icon: 'create',
          roles: ['president']
        }
      },
      {
        path: 'club-member',
        name: 'club-member',
        component: ClubMember,
        meta: {
          title: '社团成员管理',
          icon: 'create',
          roles: ['president', 'admin']
        }
      },
      {
        path: 'activity-registration',
        name: 'activity-registration',
        component: ActivityRegistration,
        meta: {
          title: '活动报名',
          icon: 'activity',
          requiresAuth: true,
          roles: ['member', 'president']
        }
      },
      {
        path: 'activity-checkin',
        name: 'activity-checkin',
        component: ActivityCheckin,
        meta: {
          title: '活动签到',
          icon: 'checkin',
          roles: ['member', 'president']
        }
      },
      {
        path: 'activity-payment',
        name: 'activity-payment',
        component: ActivityPayment,
        meta: {
          title: '活动缴费',
          icon: 'checkin',
          roles: ['member', 'president']
        }
      },
      {
        path: 'activity-registration-approval',
        name: 'activity-registration-approval',
        component: ActivityRegistrationApproval,
        meta: {
          title: '活动报名审批',
          icon: 'approval',
          roles: ['president']
        }
      },
      {
        path: 'create-activity',
        name: 'create-activity',
        component: CreateActivity,
        meta: {
          title: '创建活动',
          icon: 'create-activity',
          roles: ['president']
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      hidden: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      hidden: true
    }
  },
  {
    path: '/403',
    name: 'forbidden',
    component: Forbidden,
    meta: {
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const userRole = localStorage.getItem('user_role') || '' // 如果为 null，提供默认值
  const allowedRoles = to.meta.roles as string[] | undefined // 当前路由所需权限

  if (!allowedRoles || allowedRoles.includes(userRole)) {
    // 没有设置 roles 或 当前用户在允许列表中
    next()
  } else {
    // 不在权限内，跳转 403 页面
    next('/403')
  }
})

export default router
