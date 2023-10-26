<template>
	<el-dialog v-model="dialogFormVisible" :title='title' width="600px" align-center draggable>
		<div class="dialog-content">
			<el-form ref="ruleFormRef" :model="formDataInfo" :rules="rules" label-width="100px">
				<el-form-item label="账号" prop="account">
					<el-input v-model="formDataInfo.account" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="formDataInfo.password" />
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="formDataInfo.name" />
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="formDataInfo.sex" placeholder="请选择性别">
						<el-option label="男" value="男" />
						<el-option label="女" value="女" />
					</el-select>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="formDataInfo.email" />
				</el-form-item>
				<el-form-item label="部门" prop="department">
					<el-select v-model="formDataInfo.department" placeholder="请选择部门">
						<el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="addAdmin">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
	import { reactive, ref,onBeforeUnmount } from 'vue'
	import {
		bus
	} from "@/utils/mitt"
	import { createAdmin } from '@/api/userinfor'
	import {getDepartment } from '@/api/setting'
	import { ElMessage } from 'element-plus'
	const title = ref()

	bus.on('createId', (id : number) => {
		if (id == 1) {
			title.value = '新建产品管理员'
		}
		if (id == 2) {
			title.value = '新建用户管理员'
		}
		if (id == 3) {
			title.value = '新建消息管理员'
		}
	})
	// 部门数据
	const departmentData = ref<string[]>([])
	const getDepartmentData = async() => {
		departmentData.value = await getDepartment() as any
	}
	getDepartmentData()
	interface FormData {
		account: number|null,
		password : string,
		name : string,
		sex : string,
		email : string,
		department : string
	}

	const formDataInfo : FormData = reactive({
		account: null,
		password: '',
		name: '',
		sex: '',
		email: '',
		department: '',
		identity: '产品管理员'
	})

	const rules = reactive({
		account: [
			{ required: true, message: '请输入管理员的注册账号', trigger: 'blur' },
		],
		password: [
			{ required: true, message: '请输入管理员的注册密码', trigger: 'blur' },
		],
		name: [
			{ required: true, message: '请输入管理员的名字', trigger: 'blur' },
		],
		sex: [
			{ required: true, message: '请输入管理员的性别', trigger: 'blur' },
		],
		email: [
			{ required: true, message: '请输入管理员的邮箱', trigger: 'blur' },
		],
		department: [
			{ required: true, message: '请输入管理员的部门', trigger: 'blur' },
		],
	})
	// const emit = defineEmits(['success'])
	// 创建管理员
	const addAdmin = async () => {
		const res = await createAdmin(formDataInfo)
		if (res.status == 0) {
			ElMessage({
				message: '创建管理员成功',
				type: 'success',
			})
			// emit('success')
			bus.emit('adminDialogOff',1)
			dialogFormVisible.value = false
		} else {
			ElMessage.error('创建管理员失败')
			dialogFormVisible.value = false
		}
	}
	// 弹窗开关
	const dialogFormVisible = ref(false)

	// 打开创建管理员的弹窗
	const open = () => {
		dialogFormVisible.value = true
	}

	defineExpose({
		open
	})

	onBeforeUnmount(()=>{
		bus.all.clear()
	})
</script>

<style lang="scss" scoped>
	.dialog-content {
		display: flex;
		padding: 20px 30px;
	}

	:deep(.el-form-item) {
		margin: 30px;
	}
</style>
