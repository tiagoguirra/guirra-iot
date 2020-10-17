import store from '../store'

export const ifNotAuthenticated = (to: any, from: any, next: any) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

export const ifAuthenticated = (to: any, from: any, next: any) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}
