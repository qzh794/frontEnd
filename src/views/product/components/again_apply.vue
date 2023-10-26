<template>
	<el-dialog v-model="dialogFormVisible" title='再次申请出库' width="30%" center>
		<span >请确认，此操作将再次申请产品出库</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="applyProduct">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { onBeforeUnmount, ref ,reactive} from 'vue'
	import {
		bus
	} from "@/utils/mitt"
	import {
		applyOutProduct
	} from '@/api/product'
	import { ElMessage } from 'element-plus'

	bus.on('againId', (row : any) => {
		formData.id = row.id
		formData.product_in_warehouse_number = row.product_in_warehouse_number
		formData.product_name = row.product_name
		formData.product_single_price = row.product_single_price
		formData.product_out_apply_person = row.product_out_apply_person
		formData.product_out_number = row.product_out_number
	})

	interface FormData {
		id: number | null,
		product_name: string,
		product_out_id : number|null,
		product_in_warehouse_number : number|null,
		product_single_price:number|null,
		product_out_number : number|null,
		product_out_apply_person : string,
		apply_memo : string,
	}

	const formData : FormData = reactive({
		id: null,
		product_name:'',
		product_out_id: null,
		product_in_warehouse_number:null,
		product_single_price:null,
		product_out_number: null,
		product_out_apply_person: '',
		apply_memo: ''
	})
	const emit = defineEmits(['success'])

	const applyProduct = async () => {
			const res = await applyOutProduct(formData)
			if (res.status == 0) {
				ElMessage({
					message: '产品申请出库成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('产品申请出库失败')
				dialogFormVisible.value = false
			}
	}

	// 弹窗开关
	const dialogFormVisible = ref(false)

	// 打开编辑管理员的弹窗
	const open = () => {
		dialogFormVisible.value = true
	}

	defineExpose({
		open
	})

	onBeforeUnmount(() => {
		bus.all.clear()
	})
</script>

<style lang="scss" scoped>

</style>
