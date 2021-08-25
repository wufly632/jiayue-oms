import { loginApi, logoutApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  info: {}
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info
    window.localStorage.setItem('userInfo', JSON.stringify(info))
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { mobile, password } = userInfo
    return new Promise((resolve, reject) => {
      // 接口
      loginApi({ mobile: mobile.trim(), password: password }).then(res => {
        const { data } = res
        // commit('SET_TOKEN', data.token)
        commit('SET_TOKEN', data.accessToken)
        // commit('SET_ROLES', ['admin']) // TODO
        setToken(data.accessToken)
        // setToken(data.token)
        commit('SET_NAME', 'Jiayue')
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取角色信息
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     roleDetailApi().then(res => {
  //       const { data } = res

  //       if (!data) {
  //         reject('Verification failed, please Login again.')
  //       }

  //       const { roles, roleName } = data

  //       // 目前没有角色信息 TODO
  //       // if (!roles || roles.length <= 0) {
  //       //   reject('getInfo: roles must be a non-null array!')
  //       // }
  //       commit('SET_ROLES', roles || ['admin']) // 暂时没有角色 TODO 先放一个
  //       commit('SET_NAME', roleName)
  //       // 设置头像
  //       commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logoutApi(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }

  // dynamically modify permissions
  // async changeRoles({ commit, dispatch }, role) {
  //   const token = role + '-token'

  //   commit('SET_TOKEN', token)
  //   setToken(token)

  //   const { roles } = await dispatch('getInfo')

  //   resetRouter()

  //   // generate accessible routes map based on roles
  //   const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
  //   // dynamically add accessible routes
  //   router.addRoutes(accessRoutes)

  //   // reset visited views and cached views
  //   dispatch('tagsView/delAllViews', null, { root: true })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
