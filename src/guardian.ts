import router from './router'
import {useMenu} from '@/stores/menu'

// 全局前置守卫
router.beforeEach( (to, from, next) => {
  // const menuStore = useMenu()
  const token =localStorage.getItem('token')
  if (to.name !== 'login' && !token) next({ name: 'login' })
  else next()
})
