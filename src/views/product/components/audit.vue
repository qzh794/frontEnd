<template>
	<el-dialog v-model="dialogFormVisible" title='审核产品' width="30%" center>
		<div class="describe">确定审核此产品的出库吗？</div>
		<el-radio-group v-model="formData.product_out_status" class="ml-4">
			<el-radio label="同意" size="large">同意</el-radio>
			<el-radio label="否决" size="large">否决</el-radio>
		</el-radio-group>
		<el-input type="textarea" placeholder="请输入审核备注" v-model="formData.audit_memo" />
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="audit">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { onBeforeUnmount, ref, reactive } from 'vue'
	import {
		bus
	} from "@/utils/mitt"
	import {
		auditProduct
	} from '@/api/product'
	import { ElMessage } from 'element-plus'
	import { tracking } from '@/utils/operation'

	bus.on('productAudit', (row : any) => {
		formData.id = row.id
		formData.product_out_id = row.product_out_id
		formData.product_name = row.product_name
		formData.product_out_status = row.product_out_status
		formData.audit_memo = row.audit_memo
		formData.product_out_price = row.product_out_price
		formData.product_out_apply_person = row.product_out_apply_person
		formData.product_in_warehouse_number = row.product_in_warehouse_number
		formData.product_single_price = row.product_single_price
		formData.product_out_number = row.product_out_number
	})

	const formData = reactive({
		id: 0,
		product_name:'',
		product_out_id: 0,
		product_out_status: '',
		audit_memo: '',
		product_out_price: 0,
		product_out_audit_person: localStorage.getItem('name'),
		product_out_apply_person: '',
		product_in_warehouse_number: 0,
		product_single_price: 0,
		product_out_number: ''
	})

	const emit = defineEmits(['success'])

	const audit = async () => {
		const res = await auditProduct(formData)
		if (res.status == 0) {
			ElMessage({
				message: '审核产品成功',
				type: 'success',
			})
			emit('success')
			await tracking('产品', localStorage.getItem('name') as unknown as string, formData.product_name, '高级',formData.product_out_status)
			dialogFormVisible.value = false
		} else {
			ElMessage.error('审核产品失败')
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
	.describe {
		margin-bottom: 8px;
	}
</style>
