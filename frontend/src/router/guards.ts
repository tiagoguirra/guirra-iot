import store from '../store'

export const ifNotAuthenticated = (to: any, from: any, next: any) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

export const ifAuthenticated = (to: any, from: any, next: any) => {
  console.log({ to, from })
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}
