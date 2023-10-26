<template>
	<!-- 修改密码 -->
	<el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
		<el-form class="login-form" :label-position="labelPosition" :rules="rules">
			<el-form-item label="请输入您的旧密码" prop="oldPassword">
				<el-input v-model="passwordData.oldPassword" placeholder="请输入您的旧密码" show-password />
			</el-form-item>
			<el-form-item label="请输入您的新密码" prop="newPassword">
				<el-input v-model="passwordData.newPassword" placeholder="请输入您的新密码" show-password />
			</el-form-item>
		</el-form>
		<!-- 底部内容 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="state.changePasswordDialog = false">取消</el-button>
				<el-button type="primary" @click="changeUserPassword">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { reactive, ref } from 'vue'
	import { changePassword } from '@/api/userinfor.js'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'
  import type { FormProps } from 'element-plus'
	const router = useRouter()
	// 表单对齐方式
	const labelPosition = ref<FormProps['labelPosition']>('top')
	// 表单对象接口
	// 密码是有字母跟数字 所有是string
	interface PasswordData {
		oldPassword : string;
		newPassword : string;
	}
	// 表单对象
	const passwordData : PasswordData = reactive({
		oldPassword: '',
		newPassword: '',
	})
	// 表单规则
	const rules = reactive({
		oldPassword: [
			{ required: true, message: '请输入您的旧密码', trigger: 'blur' },
		],
		newPassword: [
			{ required: true, message: '请输入您的新密码', trigger: 'blur' },
		],
	})
	// 控制弹窗 默认关闭
	const state = reactive({
		changePasswordDialog: false,
	})


	// 修改密码 id 跟 两个 password
	const changeUserPassword = async () => {
		if (passwordData.oldPassword && passwordData.newPassword) {
			// localStorage/sessionStorage.getItem获取我们存储在浏览器的数据
			// 调用接口
			const res = await changePassword(sessionStorage.getItem('id') as unknown as number , passwordData.oldPassword, passwordData.newPassword)
			if (res.status == 0) {
				ElMessage({
					message: '修改成功',
					type: 'success',
				})
				state.changePasswordDialog = false
				await router.push('/login')
			} else {
				ElMessage.error('修改密码失败，请重新输入！')
			}
		} else {
			ElMessage.error('请检查输入的数据！')
		}
	}
	// 打开修改密码的弹窗
	const open = () => {
		state.changePasswordDialog = true
	}

	defineExpose({
		open
	})

	// onBeforeUnmount(()=>{
	// 	bus.all.clear()
	// })
</script>

<style lang="scss" scoped>
</style>
