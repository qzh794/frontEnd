import {
	defineStore
} from 'pinia'
import {
	getReadListAndStatus,
	getDepartmentMsgList
} from '@/api/dep_msg'
import {ref} from "vue";

// 使用了setup写法
export const useMsg = defineStore('messageinfor', ()=>{
	const read_list = ref<number[]>([])
	const msg_list =ref<any[]>([])

	const returnReadList = async(id:number)=>{
		read_list.value = []
		msg_list.value = []

		const res = await getReadListAndStatus(id) as any
		let department:string|null = localStorage.getItem('department')
		read_list.value = JSON.parse(res[0].read_list)! as number[]
		msg_list.value = await getDepartmentMsgList(department as string) as any
	}

	return {
		read_list,
		msg_list,
    returnReadList
	}
},{
	persist: true,
})
