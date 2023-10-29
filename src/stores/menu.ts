import {
  defineStore
} from 'pinia'
import router from '@/router'
import {ref} from "vue";
import {returnMenuList} from "@/api/login";

// 使用了setup写法
export const useMenu = defineStore('menuInfo', () => {
  const menuData = ref<any[]>([])

  const setRouter = async () => {
    menuData.value = []
    // 解析路由
    const menu = await returnMenuList(localStorage.getItem('id') as unknown as number)
    function CompilerMenu(arr: Array<any>) {
      if (!arr.length) {
        return
      }
      arr.forEach((item) => {
        let rts = {
          name: item.name,
          path: item.path,
          meta:item.meta,
          component: item.component
        }
        if (item.children && item.children.length) {
          CompilerMenu(item.children)
        }
        if (!item.children) {
          let paths = loadComponent(item.component);
          rts.component = paths;
          menuData.value.push((rts))
          router.addRoute('menu',rts)
        }

        function loadComponent(url: string) {
          let Module = import.meta.glob("@/views/**/*.vue");
          return Module[`/src/views/${url}.vue`]
        }
      })
    }

    CompilerMenu(menu as any)
    // console.log(router.getRoutes())
  }
  return {
    menuData,
    setRouter
  }
}, {
  persist: true,
})
