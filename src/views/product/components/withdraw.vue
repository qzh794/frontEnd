<template>
	<el-dialog v-model="dialogFormVisible" title='撤回申请' width="30%" center>
		<span >确定取消此产品的出库申请吗？</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="withdraw">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { onBeforeUnmount, ref } from 'vue'
	import {
		bus
	} from "@/utils/mitt"
	import {
		withdrawApplyProduct
	} from '@/api/product'
	import { ElMessage } from 'element-plus'

	const withdrawId = ref()

	bus.on('withdrawId', (id : number) => {
		withdrawId.value = id
	})
	const emit = defineEmits(['success'])

	const withdraw = async () => {
			const res = await withdrawApplyProduct(withdrawId.value)
			if (res.status == 0) {
				ElMessage({
					message: '撤回申请成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('撤回申请失败')
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
