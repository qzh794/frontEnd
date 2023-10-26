import {
	defineStore
} from 'pinia'
import {
	getUserInfo
} from '@/api/userinfor'
import {ref} from "vue";
export const useUserInfo = defineStore('userinfo',()=> {
	const imageUrl = ref<string>()

	const userInfo = async (id:number) =>{
		const res = await getUserInfo(id) as any
		imageUrl.value = res.imageUrl
	}

	return {
		imageUrl,userInfo
	}
},{
	persist:true
})
