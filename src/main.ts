import {
	createApp
} from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
// 导入pinia
import pinia from './stores'
// 导入element plus icon
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入element plus国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg图标
import 'virtual:svg-icons-register'
// 引入全局样式
import '@/assets/css/common.scss'

// 创建实例
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue) as any) {
	app.component(key, component)
}
app.use(ElementPlus, {
	locale: zhCn,
})

app.use(router).use(pinia).mount('#app')
