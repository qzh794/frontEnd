<template>
	<el-dialog v-model="dialogFormVisible" title='清空列表' width="30%" center>
		<span>请慎重操作！您确定要真正清空列表吗？</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="clearList">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import {
		clearOperationLogList
	} from '@/api/log'
	import { ElMessage } from 'element-plus'

	const emit = defineEmits(['success'])

	const clearList = async () => {
		const res = await clearOperationLogList()
		if (res.status == 0) {
			ElMessage({
				message: '清空列表成功',
				type: 'success',
			})
			emit('success')
			dialogFormVisible.value = false
		} else {
			ElMessage.error('清空列表失败')
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

</script>

<style lang="scss" scoped>

</style>
