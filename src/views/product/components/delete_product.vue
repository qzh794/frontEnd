<template>
	<el-dialog v-model="dialogFormVisible" title='删除产品' width="30%" center>
		<span >请慎重操作，删除后将失去此产品的记录</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="remove">
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
	} from "@/utils/mitt.js"
	import {
		deleteProduct
	} from '@/api/product'
	import { ElMessage } from 'element-plus'

	const productId = ref()

	bus.on('deleteProductId', (id : number) => {
		productId.value = id
	})
	const emit = defineEmits(['success'])

	const remove = async () => {
			const res = await deleteProduct(productId.value)
			if (res.status == 0) {
				ElMessage({
					message: '删除产品成功',
					type: 'success',
				})
				emit('success')
				dialogFormVisible.value = false
			} else {
				ElMessage.error('删除产品失败')
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
